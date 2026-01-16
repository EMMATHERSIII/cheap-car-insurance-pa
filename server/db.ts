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
    await fdb.collection("leads").add({
      ...lead,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return 1;
  } catch (error) {
    console.error("Firebase Lead Error:", error);
    throw error;
  }
}

export async function getLeadById(id: number) {
  return undefined;
}

export async function updateLeadStatus(id: number, status: any, sentToNetwork?: string) {
  // Not implemented for Firebase
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
  try {
    const snapshot = await fdb.collection("articles").where("status", "==", "published").orderBy("publishedAt", "desc").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firebase getPublishedBlogPosts Error:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const snapshot = await fdb.collection("articles").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) return undefined;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error("Firebase getBlogPostBySlug Error:", error);
    return undefined;
  }
}

export async function getRecentBlogPosts(limit: number = 3) {
  try {
    const snapshot = await fdb.collection("articles").where("status", "==", "published").orderBy("publishedAt", "desc").limit(limit).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firebase getRecentBlogPosts Error:", error);
    return [];
  }
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
  // Not implemented
}

export async function getAllBlogPosts() {
  try {
    const snapshot = await fdb.collection("articles").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firebase getAllBlogPosts Error:", error);
    return [];
  }
}

export async function getActiveAbTestVariants() {
  return [];
}

export async function getAllAbTestVariants() {
  return [];
}

export async function createAbTestVariant(data: InsertAbTestVariant) {
  return 1;
}

export async function updateAbTestVariant(id: number, data: Partial<InsertAbTestVariant>) {
}

export async function deleteAbTestVariant(id: number) {
}

export async function trackAbTestEvent(data: InsertAbTestEvent) {
}

export async function getAbTestAnalytics() {
  return [];
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
  try {
    const snapshot = await fdb.collection("express_leads").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firebase getAllExpressLeads Error:", error);
    return [];
  }
}

export async function updateExpressLeadStatus(id: number, status: any) {
}
