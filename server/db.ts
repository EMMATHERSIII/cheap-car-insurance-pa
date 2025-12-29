import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, leads, InsertLead } from "../drizzle/schema";
import { contactMessages, InsertContactMessage, blogPosts, InsertBlogPost, abTestVariants, InsertAbTestVariant, abTestEvents, InsertAbTestEvent, expressLeads, InsertExpressLead } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Insert a new lead into the database
 */
export async function createLead(lead: InsertLead): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(leads).values(lead).returning({ id: leads.id });
  return result[0].id;
}

/**
 * Get a lead by ID
 */
export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Update lead status after sending to network
 */
export async function updateLeadStatus(
  id: number,
  status: "new" | "sent" | "failed",
  sentToNetwork?: string
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(leads)
    .set({
      status,
      sentToNetwork,
      sentAt: status === "sent" ? new Date() : undefined,
    })
    .where(eq(leads.id, id));
}

/**
 * Insert a new contact message
 */
export async function insertContactMessage(message: InsertContactMessage): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(contactMessages).values(message).returning({ id: contactMessages.id });
  return result[0].id;
}

/**
 * Get all published blog posts
 */
export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get recent blog posts for homepage
 */
export async function getRecentBlogPosts(limit: number = 3) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
}

/**
 * Create a new blog post
 */
export async function createBlogPost(post: InsertBlogPost): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(blogPosts).values(post).returning({ id: blogPosts.id });
  return result[0].id;
}

/**
 * Update a blog post
 */
export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(blogPosts).set(post).where(eq(blogPosts.id, id));
}

/**
 * Get all blog posts (including drafts) for admin
 */
export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

// A/B Testing functions
export async function getActiveAbTestVariants() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(abTestVariants)
    .where(eq(abTestVariants.isActive, "yes"));
  
  return result;
}

export async function getDefaultAbTestVariant() {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(abTestVariants)
    .where(eq(abTestVariants.isDefault, "yes"))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getAllAbTestVariants() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(abTestVariants);
  return result;
}

export async function createAbTestVariant(data: InsertAbTestVariant) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(abTestVariants).values(data).returning({ id: abTestVariants.id });
  return result[0].id;
}

export async function updateAbTestVariant(id: number, data: Partial<InsertAbTestVariant>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(abTestVariants).set(data).where(eq(abTestVariants.id, id));
}

export async function deleteAbTestVariant(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(abTestVariants).where(eq(abTestVariants.id, id));
}

export async function trackAbTestEvent(data: InsertAbTestEvent) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(abTestEvents).values(data);
}

export async function getAbTestAnalytics() {
  const db = await getDb();
  if (!db) return [];
  
  // Get view and conversion counts for each variant
  const result = await db
    .select({
      variantId: abTestVariants.id,
      variantName: abTestVariants.name,
      headline: abTestVariants.headline,
      ctaText: abTestVariants.ctaText,
      isActive: abTestVariants.isActive,
      isDefault: abTestVariants.isDefault,
    })
    .from(abTestVariants);
  
  const analytics = await Promise.all(
    result.map(async (variant) => {
      const views = await db
        .select()
        .from(abTestEvents)
        .where(
          sql`${abTestEvents.variantId} = ${variant.variantId} AND ${abTestEvents.eventType} = 'view'`
        );
      
      const conversions = await db
        .select()
        .from(abTestEvents)
        .where(
          sql`${abTestEvents.variantId} = ${variant.variantId} AND ${abTestEvents.eventType} = 'conversion'`
        );
      
      const viewCount = views.length;
      const conversionCount = conversions.length;
      const conversionRate = viewCount > 0 ? (conversionCount / viewCount) * 100 : 0;
      
      return {
        ...variant,
        views: viewCount,
        conversions: conversionCount,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      };
    })
  );
  
  return analytics;
}

// ===== Express Leads =====

export async function createExpressLead(data: InsertExpressLead): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(expressLeads).values(data).returning({ id: expressLeads.id });
  return result[0].id;
}

export async function getExpressLeadById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const results = await db.select().from(expressLeads).where(eq(expressLeads.id, id)).limit(1);
  return results[0] || null;
}

export async function getAllExpressLeads() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(expressLeads).orderBy(desc(expressLeads.createdAt));
}

export async function updateExpressLeadStatus(id: number, status: "new" | "contacted" | "converted") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(expressLeads).set({ status }).where(eq(expressLeads.id, id));
}
