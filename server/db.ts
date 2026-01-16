import { db as fdb } from "./firebase";
import { eq, desc, sql } from "drizzle-orm";
import { InsertUser, users, leads, InsertLead } from "../drizzle/schema";
import { contactMessages, InsertContactMessage, blogPosts, InsertBlogPost, abTestVariants, InsertAbTestVariant, abTestEvents, InsertAbTestEvent, expressLeads, InsertExpressLead } from "../drizzle/schema";
import { ENV } from './_core/env';

// Firebase collections
const COLLECTIONS = {
  USERS: "users",
  LEADS: "leads",
  EXPRESS_LEADS: "express_leads",
  CONTACT_MESSAGES: "contact_messages",
  ARTICLES: "articles",
  AB_TEST_VARIANTS: "ab_test_variants",
  AB_TEST_EVENTS: "ab_test_events"
};

export async function getDb() {
  // Firebase is initialized globally, no need for connection pool
  return null;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) return;
  try {
    const userRef = fdb.collection(COLLECTIONS.USERS).doc(user.openId);
    const updateData: Record<string, any> = {
      openId: user.openId,
      lastSignedIn: new Date(),
    };
    
    if (user.name) updateData.name = user.name;
    if (user.email) updateData.email = user.email;
    if (user.loginMethod) updateData.loginMethod = user.loginMethod;
    
    if (user.role) {
      updateData.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      updateData.role = 'admin';
    }
    
    await userRef.set(updateData, { merge: true });
  } catch (error) {
    console.error("Upsert User Error:", error);
  }
}

export async function getUserByOpenId(openId: string) {
  try {
    const doc = await fdb.collection(COLLECTIONS.USERS).doc(openId).get();
    return doc.exists ? doc.data() : undefined;
  } catch (error) {
    console.error("Get User Error:", error);
    return undefined;
  }
}

export async function createLead(lead: InsertLead): Promise<number> {
  try {
    const docRef = await fdb.collection(COLLECTIONS.LEADS).add({
      ...lead,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Lead created successfully:", docRef.id);
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
    const docRef = await fdb.collection(COLLECTIONS.CONTACT_MESSAGES).add({
      ...message,
      createdAt: new Date(),
    });
    console.log("Contact message created successfully:", docRef.id);
    return 1;
  } catch (error) {
    console.error("Firebase Contact Error:", error);
    throw error;
  }
}

export async function getPublishedBlogPosts() {
  try {
    const snapshot = await fdb.collection(COLLECTIONS.ARTICLES)
      .where("status", "==", "published")
      .orderBy("publishedAt", "desc")
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firebase getPublishedBlogPosts Error:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const snapshot = await fdb.collection(COLLECTIONS.ARTICLES)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snapshot.empty) return undefined;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error("Firebase getBlogPostBySlug Error:", error);
    return undefined;
  }
}

export async function getRecentBlogPosts(limit: number = 3) {
  try {
    const snapshot = await fdb.collection(COLLECTIONS.ARTICLES)
      .where("status", "==", "published")
      .orderBy("publishedAt", "desc")
      .limit(limit)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firebase getRecentBlogPosts Error:", error);
    return [];
  }
}

export async function createBlogPost(post: InsertBlogPost): Promise<number> {
  try {
    const docRef = await fdb.collection(COLLECTIONS.ARTICLES).add({
      ...post,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: post.publishedAt || new Date(),
    });
    console.log("Blog post created successfully:", docRef.id);
    return 1;
  } catch (error) {
    console.error("Firebase Blog Error:", error);
    throw error;
  }
}

export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
  try {
    await fdb.collection(COLLECTIONS.ARTICLES).doc(id.toString()).update({
      ...post,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Firebase updateBlogPost Error:", error);
  }
}

export async function getAllBlogPosts() {
  try {
    const snapshot = await fdb.collection(COLLECTIONS.ARTICLES)
      .orderBy("createdAt", "desc")
      .get();
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
    const docRef = await fdb.collection(COLLECTIONS.EXPRESS_LEADS).add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Express lead created successfully:", docRef.id);
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
    const snapshot = await fdb.collection(COLLECTIONS.EXPRESS_LEADS)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firebase getAllExpressLeads Error:", error);
    return [];
  }
}

export async function updateExpressLeadStatus(id: number, status: any) {
  try {
    await fdb.collection(COLLECTIONS.EXPRESS_LEADS).doc(id.toString()).update({
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Firebase updateExpressLeadStatus Error:", error);
  }
}
