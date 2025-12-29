import { eq, desc, asc, and, or, isNull, sql, count, ilike, gte, lte } from "drizzle-orm";
import { getDb } from "./db";
import {
  leads,
  expressLeads,
  contactMessages,
  blogPosts,
  leadNotes,
  adminActivityLogs,
  emailTemplates,
  settings,
  webhooks,
} from "../drizzle/schema";

/**
 * Admin Dashboard Statistics
 */
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [
    totalLeads,
    totalExpressLeads,
    totalContactMessages,
    totalBlogPosts,
    newLeadsToday,
    newExpressLeadsToday,
  ] = await Promise.all([
    db.select({ count: count() }).from(leads).where(isNull(leads.deletedAt)),
    db.select({ count: count() }).from(expressLeads).where(isNull(expressLeads.deletedAt)),
    db.select({ count: count() }).from(contactMessages).where(isNull(contactMessages.deletedAt)),
    db.select({ count: count() }).from(blogPosts).where(isNull(blogPosts.deletedAt)),
    db
      .select({ count: count() })
      .from(leads)
      .where(
        and(
          isNull(leads.deletedAt),
          sql`DATE(${leads.createdAt}) = CURRENT_DATE`
        )
      ),
    db
      .select({ count: count() })
      .from(expressLeads)
      .where(
        and(
          isNull(expressLeads.deletedAt),
          sql`DATE(${expressLeads.createdAt}) = CURRENT_DATE`
        )
      ),
  ]);

  return {
    totalLeads: totalLeads[0]?.count || 0,
    totalExpressLeads: totalExpressLeads[0]?.count || 0,
    totalContactMessages: totalContactMessages[0]?.count || 0,
    totalBlogPosts: totalBlogPosts[0]?.count || 0,
    newLeadsToday: newLeadsToday[0]?.count || 0,
    newExpressLeadsToday: newExpressLeadsToday[0]?.count || 0,
  };
}

/**
 * Get all leads with pagination and filters
 */
export async function getAllLeads(options: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  startDate?: Date;
  endDate?: Date;
  month?: number;
  year?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const {
    page = 1,
    limit = 50,
    status,
    priority,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    includeDeleted = false,
    startDate,
    endDate,
    month,
    year,
  } = options;

  const offset = (page - 1) * limit;
  const conditions = [];

  if (!includeDeleted) {
    conditions.push(isNull(leads.deletedAt));
  }

  if (status && status !== "all") {
    conditions.push(eq(leads.status, status as any));
  }

  if (priority) {
    conditions.push(eq(leads.priority, priority as any));
  }

  if (search) {
    conditions.push(
      or(
        ilike(leads.email, `%${search}%`),
        ilike(leads.phone, `%${search}%`),
        ilike(leads.firstName, `%${search}%`),
        ilike(leads.lastName, `%${search}%`),
        ilike(leads.zipCode, `%${search}%`)
      )
    );
  }

  if (startDate) {
    conditions.push(gte(leads.createdAt, startDate));
  }
  if (endDate) {
    conditions.push(lte(leads.createdAt, endDate));
  }
  
  if (month) {
    conditions.push(sql`EXTRACT(MONTH FROM ${leads.createdAt}) = ${month}`);
  }
  if (year) {
    conditions.push(sql`EXTRACT(YEAR FROM ${leads.createdAt}) = ${year}`);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByColumn = sortBy === "createdAt" ? leads.createdAt : leads[sortBy as keyof typeof leads] || leads.createdAt;
  const orderBy = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

  const [data, totalCount] = await Promise.all([
    db.select().from(leads).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ count: count() }).from(leads).where(whereClause),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total: totalCount[0]?.count || 0,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
    },
  };
}

/**
 * Get all express leads with pagination and filters
 */
export async function getAllExpressLeads(options: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  startDate?: Date;
  endDate?: Date;
  month?: number;
  year?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const {
    page = 1,
    limit = 50,
    status,
    priority,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    includeDeleted = false,
    startDate,
    endDate,
    month,
    year,
  } = options;

  const offset = (page - 1) * limit;
  const conditions = [];

  if (!includeDeleted) {
    conditions.push(isNull(expressLeads.deletedAt));
  }

  if (status && status !== "all") {
    conditions.push(eq(expressLeads.status, status as any));
  }

  if (priority) {
    conditions.push(eq(expressLeads.priority, priority as any));
  }

  if (search) {
    conditions.push(
      or(
        ilike(expressLeads.email, `%${search}%`),
        ilike(expressLeads.phone, `%${search}%`)
      )
    );
  }

  if (startDate) {
    conditions.push(gte(expressLeads.createdAt, startDate));
  }
  if (endDate) {
    conditions.push(lte(expressLeads.createdAt, endDate));
  }
  
  if (month) {
    conditions.push(sql`EXTRACT(MONTH FROM ${expressLeads.createdAt}) = ${month}`);
  }
  if (year) {
    conditions.push(sql`EXTRACT(YEAR FROM ${expressLeads.createdAt}) = ${year}`);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByColumn = sortBy === "createdAt" ? expressLeads.createdAt : expressLeads[sortBy as keyof typeof expressLeads] || expressLeads.createdAt;
  const orderBy = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

  const [data, totalCount] = await Promise.all([
    db.select().from(expressLeads).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ count: count() }).from(expressLeads).where(whereClause),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total: totalCount[0]?.count || 0,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
    },
  };
}

/**
 * Bulk update lead status
 */
export async function bulkUpdateLeadStatus(ids: number[], status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(leads).set({ status: status as any, updatedAt: new Date() }).where(sql`id IN (${sql.join(ids.map(id => sql`${id}`), sql`, `)})`);

  return { success: true, updated: ids.length };
}

/**
 * Bulk update express lead status
 */
export async function bulkUpdateExpressLeadStatus(ids: number[], status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(expressLeads).set({ status: status as any, updatedAt: new Date() }).where(sql`id IN (${sql.join(ids.map(id => sql`${id}`), sql`, `)})`);

  return { success: true, updated: ids.length };
}

/**
 * Bulk soft delete leads
 */
export async function bulkDeleteLeads(ids: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(leads).set({ deletedAt: new Date() }).where(sql`id IN (${sql.join(ids.map(id => sql`${id}`), sql`, `)})`);

  return { success: true, deleted: ids.length };
}

/**
 * Bulk soft delete express leads
 */
export async function bulkDeleteExpressLeads(ids: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(expressLeads).set({ deletedAt: new Date() }).where(sql`id IN (${sql.join(ids.map(id => sql`${id}`), sql`, `)})`);

  return { success: true, deleted: ids.length };
}

/**
 * Bulk assign leads to user
 */
export async function bulkAssignLeads(ids: number[], userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(leads).set({ assignedTo: userId, updatedAt: new Date() }).where(sql`id IN (${sql.join(ids.map(id => sql`${id}`), sql`, `)})`);

  return { success: true, assigned: ids.length };
}

/**
 * Bulk assign express leads to user
 */
export async function bulkAssignExpressLeads(ids: number[], userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(expressLeads).set({ assignedTo: userId, updatedAt: new Date() }).where(sql`id IN (${sql.join(ids.map(id => sql`${id}`), sql`, `)})`);

  return { success: true, assigned: ids.length };
}

/**
 * Lead Notes
 */
export async function createLeadNote(note: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(leadNotes).values(note).returning({ id: leadNotes.id });
}

export async function getLeadNotes(leadId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(leadNotes).where(eq(leadNotes.leadId, leadId)).orderBy(desc(leadNotes.createdAt));
}

export async function getExpressLeadNotes(expressLeadId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(leadNotes).where(eq(leadNotes.expressLeadId, expressLeadId)).orderBy(desc(leadNotes.createdAt));
}

/**
 * Admin Activity Logs
 */
export async function logAdminActivity(log: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(adminActivityLogs).values(log);
}

export async function getAdminActivityLogs(options: { page?: number; limit?: number; userId?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { page = 1, limit = 50, userId } = options;
  const offset = (page - 1) * limit;

  const whereClause = userId ? eq(adminActivityLogs.userId, userId) : undefined;

  const [data, totalCount] = await Promise.all([
    db.select().from(adminActivityLogs).where(whereClause).orderBy(desc(adminActivityLogs.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(adminActivityLogs).where(whereClause),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total: totalCount[0]?.count || 0,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
    },
  };
}

/**
 * Email Templates
 */
export async function getAllEmailTemplates() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(emailTemplates).orderBy(asc(emailTemplates.name));
}

export async function getEmailTemplateByName(name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(emailTemplates).where(eq(emailTemplates.name, name)).limit(1);
  return result[0];
}

export async function createEmailTemplate(template: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(emailTemplates).values(template).returning({ id: emailTemplates.id });
}

export async function updateEmailTemplate(id: number, template: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(emailTemplates).set({ ...template, updatedAt: new Date() }).where(eq(emailTemplates.id, id));
  return { success: true };
}

/**
 * Settings
 */
export async function getAllSettings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(settings).orderBy(asc(settings.category));
}

export async function getSettingByKey(key: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result[0];
}

export async function upsertSetting(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(settings).values(data).onConflictDoUpdate({
    target: settings.key,
    set: { value: data.value, description: data.description, category: data.category, dataType: data.dataType, updatedAt: new Date() }
  });
}

/**
 * Webhooks
 */
export async function listWebhooks() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(webhooks).orderBy(desc(webhooks.createdAt));
}

export async function createWebhook(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(webhooks).values(data).returning({ id: webhooks.id });
}

export async function updateWebhook(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(webhooks).set({ ...data, updatedAt: new Date() }).where(eq(webhooks.id, id));
  return { success: true };
}

export async function deleteWebhook(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(webhooks).where(eq(webhooks.id, id));
  return { success: true };
}

/**
 * Contact Messages
 */
export async function getAllContactMessages(options: { page?: number; limit?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { page = 1, limit = 50 } = options;
  const offset = (page - 1) * limit;

  const [data, totalCount] = await Promise.all([
    db.select().from(contactMessages).where(isNull(contactMessages.deletedAt)).orderBy(desc(contactMessages.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(contactMessages).where(isNull(contactMessages.deletedAt)),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total: totalCount[0]?.count || 0,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
    },
  };
}
