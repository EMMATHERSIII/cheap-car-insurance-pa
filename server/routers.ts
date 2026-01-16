import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createLead,
  getLeadById,
  updateLeadStatus,
  insertContactMessage,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getRecentBlogPosts,
  createBlogPost,
  getAllBlogPosts,
  createExpressLead,
  getAllExpressLeads,
  updateExpressLeadStatus,
} from "./db";
import { adminRouter } from "./admin-routers";
import { notifyOwner } from "./_core/notification";
export const appRouter = router({
  leads: router({
    submitExpress: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          phone: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const ipAddress = ctx.req.ip || (ctx.req.headers["x-forwarded-for"] as string) || "";
        const userAgent = ctx.req.headers["user-agent"] || "";
        const referrer = ctx.req.headers["referer"] || "";
        const expressLeadId = await createExpressLead({
          email: input.email,
          phone: input.phone,
          ipAddress,
          userAgent,
          referrer,
          status: "new",
        });
        if (expressLeadId) {
          notifyOwner({
            title: "⚡ Express Lead Received!",
            content: `Quick quote request! Email: ${input.email}, Phone: ${input.phone}. They want to be contacted ASAP!`
          }).catch((err: any) => console.error("Failed to notify owner:", err));
          return { success: true, id: expressLeadId };
        }
        return { success: false };
      }),
    submit: publicProcedure
      .input(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string().email(),
          phone: z.string(),
          zipCode: z.string(),
          age: z.number(),
          gender: z.string(),
          maritalStatus: z.string(),
          vehicleYear: z.string(),
          vehicleMake: z.string(),
          vehicleModel: z.string(),
          coverageType: z.string(),
          hasAccidents: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const ipAddress = ctx.req.ip || (ctx.req.headers["x-forwarded-for"] as string) || "";
        const userAgent = ctx.req.headers["user-agent"] || "";
        const referrer = ctx.req.headers["referer"] || "";
        const leadId = await createLead({
          ...input,
          ipAddress,
          userAgent,
          referrer,
          status: "new",
        });
        if (leadId) {
          notifyOwner({
            title: "🚗 New Lead Received!",
            content: `New insurance quote request from ${input.firstName} ${input.lastName} (${input.email}). Check the dashboard for details!`
          }).catch((err: any) => console.error("Failed to notify owner:", err));
          return { success: true, id: leadId };
        }
        return { success: false };
      }),
    admin: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getAllExpressLeads();
      }),
    }),
  }),
  blog: router({
    count: publicProcedure.query(async () => {
      const posts = await getPublishedBlogPosts();
      return posts.length;
    }),
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
    }),
  }),
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string().email(),
          subject: z.string(),
          message: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const messageId = await insertContactMessage(input);
        return { success: true, id: messageId };
      }),
  }),
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
