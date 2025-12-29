import { pgTable, serial, text, varchar, integer, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["user", "admin", "manager"]);
export const yesNoEnum = pgEnum("isActive", ["yes", "no"]);
export const blogStatusEnum = pgEnum("status", ["draft", "published", "archived"]);
export const messageStatusEnum = pgEnum("status", ["new", "read", "replied", "archived"]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high", "urgent"]);
export const leadStatusEnum = pgEnum("status", ["new", "sent", "failed", "contacted", "converted", "archived"]);
export const expressLeadStatusEnum = pgEnum("status", ["new", "contacted", "converted", "archived"]);
export const noteTypeEnum = pgEnum("noteType", ["call", "email", "sms", "meeting", "general"]);
export const jobStatusEnum = pgEnum("status", ["pending", "processing", "completed", "failed"]);
export const dataTypeEnum = pgEnum("dataType", ["string", "number", "boolean", "json"]);
export const ownershipStatusEnum = pgEnum("ownershipStatus", ["financed", "owned", "leased"]);
export const eventTypeEnum = pgEnum("eventType", ["view", "conversion"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  avatarUrl: text("avatarUrl"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  isActive: yesNoEnum("isActive").default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 500 }),
  category: varchar("category", { length: 100 }),
  tags: text("tags"),
  metaTitle: varchar("metaTitle", { length: 200 }),
  metaDescription: text("metaDescription"),
  status: blogStatusEnum("status").default("draft").notNull(),
  authorId: integer("authorId").references(() => users.id),
  publishedAt: timestamp("publishedAt"),
  viewCount: integer("viewCount").default(0).notNull(),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 300 }),
  message: text("message").notNull(),
  status: messageStatusEnum("status").default("new").notNull(),
  priority: priorityEnum("priority").default("medium").notNull(),
  assignedTo: integer("assignedTo").references(() => users.id),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  notes: text("notes"),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  age: integer("age").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zipCode: varchar("zipCode", { length: 10 }).notNull(),
  vehicleType: varchar("vehicleType", { length: 100 }).notNull(),
  vehicleYear: integer("vehicleYear").notNull(),
  hasRecentAccidents: yesNoEnum("hasRecentAccidents").notNull(),
  currentInsurer: varchar("currentInsurer", { length: 200 }).notNull(),
  coverageType: varchar("coverageType", { length: 100 }).notNull(),
  ownershipStatus: ownershipStatusEnum("ownershipStatus").notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  referrer: text("referrer"),
  utmSource: varchar("utmSource", { length: 200 }),
  utmMedium: varchar("utmMedium", { length: 200 }),
  utmCampaign: varchar("utmCampaign", { length: 200 }),
  status: leadStatusEnum("status").default("new").notNull(),
  priority: priorityEnum("priority").default("medium").notNull(),
  assignedTo: integer("assignedTo").references(() => users.id),
  sentToNetwork: varchar("sentToNetwork", { length: 200 }),
  sentAt: timestamp("sentAt"),
  estimatedValue: decimal("estimatedValue", { precision: 10, scale: 2 }),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const abTestVariants = pgTable("ab_test_variants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  headline: varchar("headline", { length: 500 }).notNull(),
  subheadline: text("subheadline"),
  ctaText: varchar("ctaText", { length: 100 }).notNull(),
  description: text("description"),
  isActive: yesNoEnum("isActive").default("yes").notNull(),
  isDefault: yesNoEnum("isDefault").default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const abTestEvents = pgTable("ab_test_events", {
  id: serial("id").primaryKey(),
  variantId: integer("variantId").notNull().references(() => abTestVariants.id),
  eventType: eventTypeEnum("eventType").notNull(),
  sessionId: varchar("sessionId", { length: 100 }).notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  leadId: integer("leadId").references(() => leads.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const expressLeads = pgTable("express_leads", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  referrer: text("referrer"),
  utmSource: varchar("utmSource", { length: 200 }),
  utmMedium: varchar("utmMedium", { length: 200 }),
  utmCampaign: varchar("utmCampaign", { length: 200 }),
  status: expressLeadStatusEnum("status").default("new").notNull(),
  priority: priorityEnum("priority").default("medium").notNull(),
  assignedTo: integer("assignedTo").references(() => users.id),
  notes: text("notes"),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const leadNotes = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("leadId").references(() => leads.id),
  expressLeadId: integer("expressLeadId").references(() => expressLeads.id),
  userId: integer("userId").notNull().references(() => users.id),
  noteType: noteTypeEnum("noteType").default("general").notNull(),
  content: text("content").notNull(),
  isImportant: yesNoEnum("isImportant").default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: integer("entityId"),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull().unique(),
  subject: varchar("subject", { length: 300 }).notNull(),
  htmlContent: text("htmlContent").notNull(),
  textContent: text("textContent"),
  variables: text("variables"),
  isActive: yesNoEnum("isActive").default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(),
  dataType: dataTypeEnum("dataType").default("string").notNull(),
  isPublic: yesNoEnum("isPublic").default("no").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const importJobs = pgTable("import_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  fileName: varchar("fileName", { length: 300 }).notNull(),
  status: jobStatusEnum("status").default("pending").notNull(),
  totalRows: integer("totalRows").default(0).notNull(),
  processedRows: integer("processedRows").default(0).notNull(),
  successRows: integer("successRows").default(0).notNull(),
  failedRows: integer("failedRows").default(0).notNull(),
  errorLog: text("errorLog"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});
