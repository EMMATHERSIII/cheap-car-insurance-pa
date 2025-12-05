import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { ENV } from "./_core/env";
import { z } from "zod";
import {
  insertContactMessage,
  createLead,
  getLeadById,
  updateLeadStatus,
  createExpressLead,
  getExpressLeadById,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getRecentBlogPosts,
  createBlogPost,
  updateBlogPost,
  getAllBlogPosts,
} from "./db";
import { validateLeadForCompliance, distributeLeadToNetworks } from "./webhook";
import { sendContactFormNotification, sendLeadNotificationToOwner, sendLeadConfirmationEmail } from "./email";
import { notifyOwner } from "./_core/notification";
import { assignVariant } from "./abtest";
import {
  getActiveAbTestVariants,
  getAllAbTestVariants,
  createAbTestVariant,
  updateAbTestVariant,
  deleteAbTestVariant,
  trackAbTestEvent,
  getAbTestAnalytics,
} from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Invalid email address"),
          phone: z.string().optional(),
          subject: z.string().optional(),
          message: z.string().min(10, "Message must be at least 10 characters"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const ipAddress = (ctx.req.headers["x-forwarded-for"] as string) || ctx.req.ip || "";
        const userAgent = ctx.req.headers["user-agent"] || "";

        await insertContactMessage({
          ...input,
          ipAddress,
          userAgent,
        });

        // Send email notification
        await sendContactFormNotification({
          name: input.name,
          email: input.email,
          phone: input.phone,
          message: input.message,
          submittedAt: new Date(),
        });

        return { success: true };
      }),
  }),

  leads: router({
    submitExpress: publicProcedure
      .input(
        z.object({
          email: z.string().email().max(320),
          phone: z.string().min(10).max(20),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Extract IP and user agent from request
        const ipAddress = ctx.req.ip || (ctx.req.headers["x-forwarded-for"] as string) || "";
        const userAgent = ctx.req.headers["user-agent"] || "";
        const referrer = ctx.req.headers["referer"] || "";

        // Create express lead in database
        const expressLeadId = await createExpressLead({
          email: input.email,
          phone: input.phone,
          ipAddress,
          userAgent,
          referrer,
          status: "new",
        });

        // Get the full express lead object
        const expressLead = await getExpressLeadById(expressLeadId);
        
        if (expressLead) {
          // Send notification to owner
          notifyOwner({
            title: "⚡ Express Lead Received!",
            content: `Quick quote request! Email: ${input.email}, Phone: ${input.phone}. They want to be contacted ASAP!`
          }).catch((err: any) => console.error("Failed to notify owner:", err));
        }

        return {
          success: true,
          expressLeadId,
        };
      }),

    submit: publicProcedure
      .input(
        z.object({
          age: z.number().min(16).max(100),
          state: z.string().length(2),
          zipCode: z.string().min(5).max(10),
          vehicleType: z.string().min(1).max(100),
          vehicleYear: z.number().min(1900).max(new Date().getFullYear() + 1),
          hasRecentAccidents: z.enum(["yes", "no"]),
          currentInsurer: z.string().min(1).max(200),
          coverageType: z.string().min(1).max(100),
          ownershipStatus: z.enum(["financed", "owned", "leased"]),
          firstName: z.string().min(1).max(100),
          lastName: z.string().min(1).max(100),
          email: z.string().email().max(320),
          phone: z.string().min(10).max(20),
          // Optional tracking data
          utmSource: z.string().optional(),
          utmMedium: z.string().optional(),
          utmCampaign: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Extract IP and user agent from request
        const ipAddress = ctx.req.ip || ctx.req.headers["x-forwarded-for"] as string || "";
        const userAgent = ctx.req.headers["user-agent"] || "";
        const referrer = ctx.req.headers["referer"] || "";

        // Basic fraud detection
        const suspiciousPatterns = [
          /test@test\.com/i,
          /fake@fake\.com/i,
          /example@example\.com/i,
          /123@123\.com/i,
        ];
        
        const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(input.email));
        
        if (isSuspicious) {
          console.warn(`Suspicious lead detected: ${input.email}`);
          // Still create the lead but mark it for review
        }

        // Create lead in database
        const leadId = await createLead({
          ...input,
          ipAddress,
          userAgent,
          referrer,
          status: "new",
        });

        // Get the full lead object for validation and distribution
        const lead = await getLeadById(leadId);
        
        if (lead) {
          // Send notification to owner
          notifyOwner({
            title: "🎉 New Lead Received!",
            content: `${input.firstName} ${input.lastName} from ${input.zipCode} just submitted a quote request. Email: ${input.email}, Phone: ${input.phone}`
          }).catch(err => console.error("Failed to notify owner:", err));

          // Send email notification to owner
          sendLeadNotificationToOwner(lead).catch(err => 
            console.error("Failed to send email to owner:", err)
          );

          // Send confirmation email to customer
          sendLeadConfirmationEmail(lead).catch(err => 
            console.error("Failed to send confirmation email:", err)
          );
          
          // Validate lead for compliance
          const validation = validateLeadForCompliance(lead);
          
          if (validation.valid && !isSuspicious) {
            // Send to CPA networks asynchronously (don't wait for response)
            distributeLeadToNetworks(lead)
              .then(() => {
                updateLeadStatus(leadId, "sent");
              })
              .catch((error) => {
                console.error("Failed to distribute lead:", error);
                updateLeadStatus(leadId, "failed");
              });
          } else {
            console.log(`Lead ${leadId} validation failed:`, validation.errors);
          }
        }

        return {
          success: true,
          leadId,
          redirectUrl: ENV.cpaRedirectUrl || null,
        };
      }),
  }),

  blog: router({
    list: publicProcedure.query(async () => {
      return await getPublishedBlogPosts();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getBlogPostBySlug(input.slug);
      }),
    recent: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await getRecentBlogPosts(input?.limit);
      }),
    related: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const allPosts = await getPublishedBlogPosts();
        const { getRelatedArticles } = await import("../shared/blog-links");
        return getRelatedArticles(input.slug, allPosts);
      }),
    admin: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getAllBlogPosts();
      }),
      create: protectedProcedure
        .input(
          z.object({
            title: z.string(),
            slug: z.string(),
            excerpt: z.string().optional(),
            content: z.string(),
            coverImage: z.string().optional(),
            category: z.string().optional(),
            tags: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
            status: z.enum(["draft", "published"]),
            publishedAt: z.date().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          if (ctx.user.role !== "admin") {
            throw new TRPCError({ code: "FORBIDDEN" });
          }
          const postId = await createBlogPost({
            ...input,
            authorId: ctx.user.id,
          });
          return { id: postId };
        }),
      update: protectedProcedure
        .input(
          z.object({
            id: z.number(),
            title: z.string().optional(),
            slug: z.string().optional(),
            excerpt: z.string().optional(),
            content: z.string().optional(),
            coverImage: z.string().optional(),
            category: z.string().optional(),
            tags: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
            status: z.enum(["draft", "published"]).optional(),
            publishedAt: z.date().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          if (ctx.user.role !== "admin") {
            throw new TRPCError({ code: "FORBIDDEN" });
          }
          const { id, ...updates } = input;
          await updateBlogPost(id, updates);
          return { success: true };
        }),
    }),
  }),

  abtest: router({
    // Get variant assignment for a session
    getVariant: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const variant = await assignVariant(input.sessionId);
        return variant;
      }),

    // Track view event
    trackView: publicProcedure
      .input(
        z.object({
          variantId: z.number(),
          sessionId: z.string(),
          ipAddress: z.string().optional(),
          userAgent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await trackAbTestEvent({
          variantId: input.variantId,
          eventType: "view",
          sessionId: input.sessionId,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
        return { success: true };
      }),

    // Track conversion event
    trackConversion: publicProcedure
      .input(
        z.object({
          variantId: z.number(),
          sessionId: z.string(),
          leadId: z.number(),
          ipAddress: z.string().optional(),
          userAgent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await trackAbTestEvent({
          variantId: input.variantId,
          eventType: "conversion",
          sessionId: input.sessionId,
          leadId: input.leadId,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
        return { success: true };
      }),

    // Admin: Get all variants
    getAllVariants: protectedProcedure.query(async () => {
      return await getAllAbTestVariants();
    }),

    // Admin: Get analytics
    getAnalytics: protectedProcedure.query(async () => {
      return await getAbTestAnalytics();
    }),

    // Admin: Create variant
    createVariant: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          headline: z.string(),
          subheadline: z.string().optional(),
          ctaText: z.string(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const id = await createAbTestVariant({
          ...input,
          isActive: "yes",
          isDefault: "no",
        });
        return { id };
      }),

    // Admin: Update variant
    updateVariant: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          headline: z.string().optional(),
          subheadline: z.string().optional(),
          ctaText: z.string().optional(),
          description: z.string().optional(),
          isActive: z.enum(["yes", "no"]).optional(),
          isDefault: z.enum(["yes", "no"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateAbTestVariant(id, data);
        return { success: true };
      }),

    // Admin: Delete variant
    deleteVariant: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteAbTestVariant(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
