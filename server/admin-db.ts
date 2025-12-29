import { eq, desc, asc, and, or, isNull, isNotNull, sql, count, like } from "drizzle-orm";
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
  importJobs,
  InsertLeadNote,
  InsertAdminActivityLog,
  InsertEmailTemplate,
  InsertSetting,
  InsertImportJob,
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
          sql`DATE(${leads.createdAt}) = CURDATE()`
        )
      ),
    db
      .select({ count: count() })
      .from(expressLeads)
      .where(
        and(
          isNull(expressLeads.deletedAt),
          sql`DATE(${expressLeads.createdAt}) = CURDATE()`
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
  } = options;

  const offset = (page - 1) * limit;
  const conditions = [];

  if (!includeDeleted) {
    conditions.push(isNull(leads.deletedAt));
  }

  if (status) {
    conditions.push(eq(leads.status, status as any));
  }

  if (priority) {
    conditions.push(eq(leads.priority, priority as any));
  }

  if (search) {
    conditions.push(
      or(
        like(leads.email, `%${search}%`),
        like(leads.phone, `%${search}%`),
        like(leads.firstName, `%${search}%`),
        like(leads.lastName, `%${search}%`),
        like(leads.zipCode, `%${search}%`)
      )!
    );
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
  } = options;

  const offset = (page - 1) * limit;
  const conditions = [];

  if (!includeDeleted) {
    conditions.push(isNull(expressLeads.deletedAt));
  }

  if (status) {
    conditions.push(eq(expressLeads.status, status as any));
  }

  if (priority) {
    conditions.push(eq(expressLeads.priority, priority as any));
  }

  if (search) {
    conditions.push(
      or(
        like(expressLeads.email, `%${search}%`),
        like(expressLeads.phone, `%${search}%`)
      )!
    );
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
 * Get all contact messages with pagination and filters
 */
export async function getAllContactMessages(options: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
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
  } = options;

  const offset = (page - 1) * limit;
  const conditions = [];

  if (!includeDeleted) {
    conditions.push(isNull(contactMessages.deletedAt));
  }

  if (status) {
    conditions.push(eq(contactMessages.status, status as any));
  }

  if (priority) {
    conditions.push(eq(contactMessages.priority, priority as any));
  }

  if (search) {
    conditions.push(
      or(
        like(contactMessages.email, `%${search}%`),
        like(contactMessages.name, `%${search}%`),
        like(contactMessages.message, `%${search}%`)
      )!
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByColumn = sortBy === "createdAt" ? contactMessages.createdAt : contactMessages[sortBy as keyof typeof contactMessages] || contactMessages.createdAt;
  const orderBy = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

  const [data, totalCount] = await Promise.all([
    db.select().from(contactMessages).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ count: count() }).from(contactMessages).where(whereClause),
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
export async function createLeadNote(note: InsertLeadNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(leadNotes).values(note);
  return result[0].insertId;
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
export async function logAdminActivity(log: InsertAdminActivityLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(adminActivityLogs).values(log);
  return result[0].insertId;
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

export async function createEmailTemplate(template: InsertEmailTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(emailTemplates).values(template);
  return result[0].insertId;
}

export async function updateEmailTemplate(id: number, template: Partial<InsertEmailTemplate>) {
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

  return await db.select().from(settings).orderBy(asc(settings.category), asc(settings.key));
}

export async function getSettingByKey(key: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result[0];
}

export async function upsertSetting(setting: InsertSetting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .insert(settings)
    .values(setting)
    .onDuplicateKeyUpdate({
      set: { value: setting.value, updatedAt: new Date() },
    });

  return { success: true };
}

/**
 * Import Jobs
 */
export async function createImportJob(job: InsertImportJob) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(importJobs).values(job);
  return result[0].insertId;
}

export async function updateImportJob(id: number, updates: Partial<InsertImportJob>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(importJobs).set(updates).where(eq(importJobs.id, id));
  return { success: true };
}

export async function getImportJobById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(importJobs).where(eq(importJobs.id, id)).limit(1);
  return result[0];
}

export async function getAllImportJobs(options: { page?: number; limit?: number; userId?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { page = 1, limit = 50, userId } = options;
  const offset = (page - 1) * limit;

  const whereClause = userId ? eq(importJobs.userId, userId) : undefined;

  const [data, totalCount] = await Promise.all([
    db.select().from(importJobs).where(whereClause).orderBy(desc(importJobs.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(importJobs).where(whereClause),
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
