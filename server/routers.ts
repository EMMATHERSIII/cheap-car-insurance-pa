import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createLead, getLeadById, updateLeadStatus } from "./db";
import { validateLeadForCompliance, distributeLeadToNetworks } from "./webhook";

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

  leads: router({
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
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
