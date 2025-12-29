import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getDashboardStats,
  getAllLeads,
  getAllExpressLeads,
  getAllContactMessages,
  bulkUpdateLeadStatus,
  bulkUpdateExpressLeadStatus,
  bulkDeleteLeads,
  bulkDeleteExpressLeads,
  bulkAssignLeads,
  bulkAssignExpressLeads,
  createLeadNote,
  getLeadNotes,
  getExpressLeadNotes,
  logAdminActivity,
  getAdminActivityLogs,
  getAllEmailTemplates,
  getEmailTemplateByName,
  createEmailTemplate,
  updateEmailTemplate,
  getAllSettings,
  getSettingByKey,
  upsertSetting,
  listWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
} from "./admin-db";
import { getLeadById, getExpressLeadById } from "./db";

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

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getLeadById(input.id);
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

        await logAdminActivity({
          userId: ctx.user.id,
          action: "bulk_update_status",
          entityType: "leads",
          details: JSON.stringify({ ids: input.ids, status: input.status }),
          ipAddress: ctx.req.ip || "",
          userAgent: ctx.req.headers["user-agent"] || "",
        });

        return await bulkUpdateLeadStatus(input.ids, input.status);
      }),

    bulkDelete: protectedProcedure
      .input(z.object({ ids: z.array(z.number()) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await logAdminActivity({
          userId: ctx.user.id,
          action: "bulk_delete",
          entityType: "leads",
          details: JSON.stringify({ ids: input.ids }),
          ipAddress: ctx.req.ip || "",
          userAgent: ctx.req.headers["user-agent"] || "",
        });

        return await bulkDeleteLeads(input.ids);
      }),

    export: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          priority: z.string().optional(),
          search: z.string().optional(),
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

        const result = await getAllLeads({ ...input, limit: 10000 });

        await logAdminActivity({
          userId: ctx.user.id,
          action: "export",
          entityType: "leads",
          details: JSON.stringify({ count: result.data.length }),
          ipAddress: ctx.req.ip || "",
          userAgent: ctx.req.headers["user-agent"] || "",
        });

        return result.data;
      }),

    notes: router({
      create: protectedProcedure
        .input(
          z.object({
            leadId: z.number(),
            noteType: z.enum(["call", "email", "sms", "meeting", "general"]),
            content: z.string(),
            isImportant: z.enum(["yes", "no"]).optional(),
          })
        )
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
            throw new TRPCError({ code: "FORBIDDEN" });
          }

          return await createLeadNote({
            ...input,
            userId: ctx.user.id,
          });
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
        return await getAllExpressLeads(input);
      }),

    export: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          priority: z.string().optional(),
          search: z.string().optional(),
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

        const result = await getAllExpressLeads({ ...input, limit: 10000 });

        await logAdminActivity({
          userId: ctx.user.id,
          action: "export",
          entityType: "express_leads",
          details: JSON.stringify({ count: result.data.length }),
          ipAddress: ctx.req.ip || "",
          userAgent: ctx.req.headers["user-agent"] || "",
        });

        return result.data;
      }),
  }),

  // Webhooks
  webhooks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await listWebhooks();
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        url: z.string().url(),
        method: z.string().optional(),
        entityType: z.string().optional(),
        isActive: z.enum(["yes", "no"]).optional(),
        headers: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await createWebhook(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.any(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await updateWebhook(input.id, input.data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await deleteWebhook(input.id);
      }),
  }),

  // Settings
  settings: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await getAllSettings();
    }),
    upsert: protectedProcedure
      .input(z.object({
        key: z.string(),
        value: z.string(),
        description: z.string().optional(),
        category: z.string(),
        dataType: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await upsertSetting(input);
      }),
  }),
});
