import { db as fd } from "./firebase";
import { 
  Lead, 
  ExpressLead, 
  BlogPost, 
  ContactMessage,
  InsertLead,
  InsertExpressLead,
  InsertBlogPost,
  InsertContactMessage
} from "../drizzle/schema";

// Helper to generate a numeric ID for compatibility with existing frontend expectations
const generateNumericId = () => Math.floor(Math.random() * 1000000);

export async function createLead(data: InsertLead) {
  try {
    const id = generateNumericId();
    const leadData = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await fd.collection("leads").doc(id.toString()).set(leadData);
    return [leadData];
  } catch (error) {
    console.error("Firebase createLead error:", error);
    throw error;
  }
}

export async function createExpressLead(data: InsertExpressLead) {
  try {
    const id = generateNumericId();
    const leadData = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await fd.collection("express_leads").doc(id.toString()).set(leadData);
    return [leadData];
  } catch (error) {
    console.error("Firebase createExpressLead error:", error);
    throw error;
  }
}

export async function insertContactMessage(data: InsertContactMessage) {
  try {
    const id = generateNumericId();
    const messageData = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await fd.collection("contact_messages").doc(id.toString()).set(messageData);
    return [messageData];
  } catch (error) {
    console.error("Firebase insertContactMessage error:", error);
    throw error;
  }
}

export async function createBlogPost(data: InsertBlogPost) {
  try {
    const id = generateNumericId();
    const postData = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await fd.collection("articles").doc(id.toString()).set(postData);
    return [postData];
  } catch (error) {
    console.error("Firebase createBlogPost error:", error);
    throw error;
  }
}

export async function getBlogPosts() {
  try {
    const snapshot = await fd.collection("articles").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => doc.data() as BlogPost);
  } catch (error) {
    console.error("Firebase getBlogPosts error:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const snapshot = await fd.collection("articles").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as BlogPost;
  } catch (error) {
    console.error("Firebase getBlogPostBySlug error:", error);
    return null;
  }
}

export async function getLeads() {
  try {
    const snapshot = await fd.collection("leads").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => doc.data() as Lead);
  } catch (error) {
    console.error("Firebase getLeads error:", error);
    return [];
  }
}

export async function getExpressLeads() {
  try {
    const snapshot = await fd.collection("express_leads").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => doc.data() as ExpressLead);
  } catch (error) {
    console.error("Firebase getExpressLeads error:", error);
    return [];
  }
}

// Mocking other functions to prevent build errors
export const db = {
  select: () => ({ from: () => ({ where: () => ({ limit: () => [] }) }) }),
  insert: () => ({ values: () => ({ returning: () => [] }) }),
  update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
  delete: () => ({ where: () => ({ returning: () => [] }) }),
};

export async function getDb() {
  return db;
}

export async function upsertUser(user: any) {
  try {
    await fd.collection("users").doc(user.openId).set({
      ...user,
      lastSignedIn: new Date()
    }, { merge: true });
  } catch (error) {
    console.error("Firebase upsertUser error:", error);
  }
}

export async function getUserByOpenId(openId: string) {
  try {
    const doc = await fd.collection("users").doc(openId).get();
    return doc.exists ? doc.data() : undefined;
  } catch (error) {
    console.error("Firebase getUserByOpenId error:", error);
    return undefined;
  }
}

export async function getPublishedBlogPosts() {
  try {
    const snapshot = await fd.collection("articles").where("status", "==", "published").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => doc.data() as BlogPost);
  } catch (error) {
    console.error("Firebase getPublishedBlogPosts error:", error);
    return [];
  }
}
