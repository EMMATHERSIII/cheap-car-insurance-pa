import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getDashboardStats,
  getAllLeads,
  getAllExpressLeads,
  getContactMessages,
  updateLeadStatus,
  updateExpressLeadStatus,
  deleteLeads,
  deleteExpressLeads,
  assignLeadToUser,
  exportLeads,
  exportExpressLeads,
  addLeadNote,
  getLeadNotes,
  logAdminActivity,
  getAdminActivityLogs,
} from "./admin-db";

/**
 * Admin router - all routes require admin role
 */
export const adminRouter = router({
  // Dashboard
  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await getDashboardStats();
    }),
  }),

  // Leads Management
  leads: router({
    list: protectedProcedure
      .input(
        z.object({
          page: z.number().optional(),
          limit: z.number().optional(),
          status: z.string().optional(),
          priority: z.string().optional(),
          search: z.string().optional(),
          sortBy: z.string().optional(),
          sortOrder: z.enum(["asc", "desc"]).optional(),
          includeDeleted: z.boolean().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          month: z.number().optional(),
          year: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getAllLeads(input);
      }),

    bulkUpdateStatus: protectedProcedure
      .input(
        z.object({
          ids: z.array(z.number()),
          status: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await logAdminActivity(
          ctx.user.id,
          "bulk_update_status",
          { ids: input.ids, status: input.status }
        );

        return await updateLeadStatus(input.ids, input.status);
      }),

    bulkDelete: protectedProcedure
      .input(z.object({ ids: z.array(z.number()) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await logAdminActivity(
          ctx.user.id,
          "bulk_delete",
          { ids: input.ids }
        );

        return await deleteLeads(input.ids);
      }),

    bulkAssign: protectedProcedure
      .input(
        z.object({
          ids: z.array(z.number()),
          userId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await logAdminActivity(
          ctx.user.id,
          "bulk_assign",
          { ids: input.ids, userId: input.userId }
        );

        return await assignLeadToUser(input.ids, input.userId);
      }),

    export: protectedProcedure
      .input(
        z.object({
          format: z.enum(["csv", "json"]).optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await logAdminActivity(
          ctx.user.id,
          "export_leads",
          { format: input.format || "csv" }
        );

        return await exportLeads(input.format || "csv");
      }),

    notes: router({
      create: protectedProcedure
        .input(
          z.object({
            leadId: z.number(),
            note: z.string(),
          })
        )
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
            throw new TRPCError({ code: "FORBIDDEN" });
          }

          return await addLeadNote(input.leadId, input.note, ctx.user.id);
        }),

      list: protectedProcedure
        .input(z.object({ leadId: z.number() }))
        .query(async ({ ctx, input }) => {
          if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
            throw new TRPCError({ code: "FORBIDDEN" });
          }

          return await getLeadNotes(input.leadId);
        }),
    }),
  }),

  // Express Leads Management
  expressLeads: router({
    list: protectedProcedure
      .input(
        z.object({
          page: z.number().optional(),
          limit: z.number().optional(),
          status: z.string().optional(),
          search: z.string().optional(),
          sortBy: z.string().optional(),
          sortOrder: z.enum(["asc", "desc"]).optional(),
          includeDeleted: z.boolean().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getAllExpressLeads(input);
      }),

    bulkUpdateStatus: protectedProcedure
      .input(
        z.object({
          ids: z.array(z.number()),
          status: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await logAdminActivity(
          ctx.user.id,
          "bulk_update_express_status",
          { ids: input.ids, status: input.status }
        );

        return await updateExpressLeadStatus(input.ids, input.status);
      }),

    bulkDelete: protectedProcedure
      .input(z.object({ ids: z.array(z.number()) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await logAdminActivity(
          ctx.user.id,
          "bulk_delete_express",
          { ids: input.ids }
        );

        return await deleteExpressLeads(input.ids);
      }),

    export: protectedProcedure
      .input(
        z.object({
          format: z.enum(["csv", "json"]).optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await logAdminActivity(
          ctx.user.id,
          "export_express_leads",
          { format: input.format || "csv" }
        );

        return await exportExpressLeads(input.format || "csv");
      }),
  }),

  // Contact Messages
  contactMessages: router({
    list: protectedProcedure
      .input(
        z.object({
          page: z.number().optional(),
          limit: z.number().optional(),
          search: z.string().optional(),
          sortOrder: z.enum(["asc", "desc"]).optional(),
          includeDeleted: z.boolean().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getContactMessages(input);
      }),
  }),

  // Activity Logs
  activityLogs: router({
    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getAdminActivityLogs(input.limit);
      }),
  }),
});
