import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Blog posts table for SEO content
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 500 }),
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // JSON array of tags
  metaTitle: varchar("metaTitle", { length: 200 }),
  metaDescription: text("metaDescription"),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  authorId: int("authorId").references(() => users.id),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Contact form submissions
 */
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 300 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * Leads table for storing auto insurance lead submissions
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  // Form data
  age: int("age").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zipCode: varchar("zipCode", { length: 10 }).notNull(),
  vehicleType: varchar("vehicleType", { length: 100 }).notNull(),
  vehicleYear: int("vehicleYear").notNull(),
  hasRecentAccidents: mysqlEnum("hasRecentAccidents", ["yes", "no"]).notNull(),
  currentInsurer: varchar("currentInsurer", { length: 200 }).notNull(),
  coverageType: varchar("coverageType", { length: 100 }).notNull(),
  ownershipStatus: mysqlEnum("ownershipStatus", ["financed", "owned", "leased"]).notNull(),
  // Contact details
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  // Tracking & metadata
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  referrer: text("referrer"),
  utmSource: varchar("utmSource", { length: 200 }),
  utmMedium: varchar("utmMedium", { length: 200 }),
  utmCampaign: varchar("utmCampaign", { length: 200 }),
  // Status tracking
  status: mysqlEnum("status", ["new", "sent", "failed"]).default("new").notNull(),
  sentToNetwork: varchar("sentToNetwork", { length: 200 }),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
/**
 * A/B test variants for landing page optimization
 */
export const abTestVariants = mysqlTable("ab_test_variants", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  headline: varchar("headline", { length: 500 }).notNull(),
  subheadline: text("subheadline"),
  ctaText: varchar("ctaText", { length: 100 }).notNull(),
  description: text("description"), // Internal notes about this variant
  isActive: mysqlEnum("isActive", ["yes", "no"]).default("yes").notNull(),
  isDefault: mysqlEnum("isDefault", ["yes", "no"]).default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AbTestVariant = typeof abTestVariants.$inferSelect;
export type InsertAbTestVariant = typeof abTestVariants.$inferInsert;

/**
 * Track A/B test impressions and conversions
 */
export const abTestEvents = mysqlTable("ab_test_events", {
  id: int("id").autoincrement().primaryKey(),
  variantId: int("variantId").notNull().references(() => abTestVariants.id),
  eventType: mysqlEnum("eventType", ["view", "conversion"]).notNull(),
  sessionId: varchar("sessionId", { length: 100 }).notNull(), // Browser session ID
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  leadId: int("leadId").references(() => leads.id), // Only for conversion events
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AbTestEvent = typeof abTestEvents.$inferSelect;
export type InsertAbTestEvent = typeof abTestEvents.$inferInsert;
