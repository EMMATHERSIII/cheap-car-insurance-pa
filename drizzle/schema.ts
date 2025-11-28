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