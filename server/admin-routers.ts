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
  createImportJob,
  updateImportJob,
  getImportJobById,
  getAllImportJobs,
} from "./admin-db";
import * as XLSX from "xlsx";
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

    bulkAssign: protectedProcedure
      .input(
        z.object({
          ids: z.array(z.number()),
          userId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await logAdminActivity({
          userId: ctx.user.id,
          action: "bulk_assign",
          entityType: "leads",
          details: JSON.stringify({ ids: input.ids, assignedTo: input.userId }),
          ipAddress: ctx.req.ip || "",
          userAgent: ctx.req.headers["user-agent"] || "",
        });

        return await bulkAssignLeads(input.ids, input.userId);
      }),

    export: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          priority: z.string().optional(),
          search: z.string().optional(),
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
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getAllExpressLeads(input);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getExpressLeadById(input.id);
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
          entityType: "express_leads",
          details: JSON.stringify({ ids: input.ids, status: input.status }),
          ipAddress: ctx.req.ip || "",
          userAgent: ctx.req.headers["user-agent"] || "",
        });

        return await bulkUpdateExpressLeadStatus(input.ids, input.status);
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
          entityType: "express_leads",
          details: JSON.stringify({ ids: input.ids }),
          ipAddress: ctx.req.ip || "",
          userAgent: ctx.req.headers["user-agent"] || "",
        });

        return await bulkDeleteExpressLeads(input.ids);
      }),

    bulkAssign: protectedProcedure
      .input(
        z.object({
          ids: z.array(z.number()),
          userId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await logAdminActivity({
          userId: ctx.user.id,
          action: "bulk_assign",
          entityType: "express_leads",
          details: JSON.stringify({ ids: input.ids, assignedTo: input.userId }),
          ipAddress: ctx.req.ip || "",
          userAgent: ctx.req.headers["user-agent"] || "",
        });

        return await bulkAssignExpressLeads(input.ids, input.userId);
      }),

    export: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          priority: z.string().optional(),
          search: z.string().optional(),
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

    notes: router({
      create: protectedProcedure
        .input(
          z.object({
            expressLeadId: z.number(),
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
        .input(z.object({ expressLeadId: z.number() }))
        .query(async ({ ctx, input }) => {
          if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
            throw new TRPCError({ code: "FORBIDDEN" });
          }

          return await getExpressLeadNotes(input.expressLeadId);
        }),
    }),
  }),

  // Contact Messages Management
  contactMessages: router({
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
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getAllContactMessages(input);
      }),

    export: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          priority: z.string().optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const result = await getAllContactMessages({ ...input, limit: 10000 });

        await logAdminActivity({
          userId: ctx.user.id,
          action: "export",
          entityType: "contact_messages",
          details: JSON.stringify({ count: result.data.length }),
          ipAddress: ctx.req.ip || "",
          userAgent: ctx.req.headers["user-agent"] || "",
        });

        return result.data;
      }),
  }),

  // Activity Logs
  activityLogs: router({
    list: protectedProcedure
      .input(
        z.object({
          page: z.number().optional(),
          limit: z.number().optional(),
          userId: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getAdminActivityLogs(input);
      }),
  }),

  // Email Templates
  emailTemplates: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await getAllEmailTemplates();
    }),

    getByName: protectedProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getEmailTemplateByName(input.name);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          subject: z.string(),
          htmlContent: z.string(),
          textContent: z.string().optional(),
          variables: z.string().optional(),
          isActive: z.enum(["yes", "no"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await createEmailTemplate(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          subject: z.string().optional(),
          htmlContent: z.string().optional(),
          textContent: z.string().optional(),
          variables: z.string().optional(),
          isActive: z.enum(["yes", "no"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...updates } = input;
        return await updateEmailTemplate(id, updates);
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

    getByKey: protectedProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getSettingByKey(input.key);
      }),

    upsert: protectedProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
          description: z.string().optional(),
          category: z.string(),
          dataType: z.enum(["string", "number", "boolean", "json"]).optional(),
          isPublic: z.enum(["yes", "no"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await upsertSetting(input);
      }),
  }),

  // Import Jobs
  importJobs: router({
    list: protectedProcedure
      .input(
        z.object({
          page: z.number().optional(),
          limit: z.number().optional(),
          userId: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getAllImportJobs(input);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getImportJobById(input.id);
      }),
  }),
});
