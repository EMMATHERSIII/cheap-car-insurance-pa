import { db as fdb } from "./firebase";
import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, leads, InsertLead } from "../drizzle/schema";
import { contactMessages, InsertContactMessage, blogPosts, InsertBlogPost, abTestVariants, InsertAbTestVariant, abTestEvents, InsertAbTestEvent, expressLeads, InsertExpressLead } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const queryClient = postgres(process.env.DATABASE_URL);
      _db = drizzle(queryClient);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) return;
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, any> = {};
    ["name", "email", "loginMethod"].forEach((field: any) => {
      if (user[field as keyof InsertUser] !== undefined) {
        values[field as keyof InsertUser] = user[field as keyof InsertUser] as any;
        updateSet[field] = user[field as keyof InsertUser];
      }
    });
    if (user.lastSignedIn) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("Upsert User Error:", error);
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createLead(lead: InsertLead): Promise<number> {
  try {
    const docRef = await fdb.collection("leads").add({
      ...lead,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return 1; // Return dummy ID
  } catch (error) {
    console.error("Firebase Lead Error:", error);
    throw error;
  }
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateLeadStatus(id: number, status: any, sentToNetwork?: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(leads).set({ status, sentToNetwork, sentAt: new Date() }).where(eq(leads.id, id));
}

export async function insertContactMessage(message: InsertContactMessage): Promise<number> {
  try {
    await fdb.collection("contact_messages").add({
      ...message,
      createdAt: new Date(),
    });
    return 1;
  } catch (error) {
    console.error("Firebase Contact Error:", error);
    throw error;
  }
}

export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRecentBlogPosts(limit: number = 3) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.publishedAt)).limit(limit);
}

export async function createBlogPost(post: InsertBlogPost): Promise<number> {
  try {
    await fdb.collection("articles").add({
      ...post,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return 1;
  } catch (error) {
    console.error("Firebase Blog Error:", error);
    throw error;
  }
}

export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
  // For now, we only support creating in Firebase
  console.log("Update blog post not implemented for Firebase yet");
}

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getActiveAbTestVariants() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(abTestVariants).where(eq(abTestVariants.isActive, "yes"));
}

export async function getAllAbTestVariants() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(abTestVariants);
}

export async function createAbTestVariant(data: InsertAbTestVariant) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(abTestVariants).values(data).returning({ id: abTestVariants.id });
  return result[0].id;
}

export async function updateAbTestVariant(id: number, data: Partial<InsertAbTestVariant>) {
  const db = await getDb();
  if (!db) return;
  await db.update(abTestVariants).set(data).where(eq(abTestVariants.id, id));
}

export async function deleteAbTestVariant(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(abTestVariants).where(eq(abTestVariants.id, id));
}

export async function trackAbTestEvent(data: InsertAbTestEvent) {
  const db = await getDb();
  if (!db) return;
  await db.insert(abTestEvents).values(data);
}

export async function getAbTestAnalytics() {
  return []; // Simplified for now
}

export async function createExpressLead(data: InsertExpressLead): Promise<number> {
  try {
    await fdb.collection("express_leads").add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return 1;
  } catch (error) {
    console.error("Firebase Express Lead Error:", error);
    throw error;
  }
}

export async function getExpressLeadById(id: number) {
  return null;
}

export async function getAllExpressLeads() {
  return [];
}

export async function updateExpressLeadStatus(id: number, status: any) {
  // Not implemented
}
