import { db as fdb } from "./firebase";

const COLLECTIONS = {
  LEADS: "leads",
  EXPRESS_LEADS: "express_leads",
  CONTACT_MESSAGES: "contact_messages",
  ARTICLES: "articles",
  LEAD_NOTES: "lead_notes",
  ADMIN_ACTIVITY_LOGS: "admin_activity_logs",
  EMAIL_TEMPLATES: "email_templates",
  SETTINGS: "settings",
  WEBHOOKS: "webhooks",
};

/**
 * Admin Dashboard Statistics
 */
export async function getDashboardStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      leadsSnapshot,
      expressLeadsSnapshot,
      contactMessagesSnapshot,
      articlesSnapshot,
      newLeadsTodaySnapshot,
      newExpressLeadsTodaySnapshot,
    ] = await Promise.all([
      fdb.collection(COLLECTIONS.LEADS).where("deletedAt", "==", null).get(),
      fdb.collection(COLLECTIONS.EXPRESS_LEADS).where("deletedAt", "==", null).get(),
      fdb.collection(COLLECTIONS.CONTACT_MESSAGES).where("deletedAt", "==", null).get(),
      fdb.collection(COLLECTIONS.ARTICLES).where("deletedAt", "==", null).get(),
      fdb.collection(COLLECTIONS.LEADS)
        .where("deletedAt", "==", null)
        .where("createdAt", ">=", today)
        .get(),
      fdb.collection(COLLECTIONS.EXPRESS_LEADS)
        .where("deletedAt", "==", null)
        .where("createdAt", ">=", today)
        .get(),
    ]);

    return {
      totalLeads: leadsSnapshot.size || 0,
      totalExpressLeads: expressLeadsSnapshot.size || 0,
      totalContactMessages: contactMessagesSnapshot.size || 0,
      totalBlogPosts: articlesSnapshot.size || 0,
      newLeadsToday: newLeadsTodaySnapshot.size || 0,
      newExpressLeadsToday: newExpressLeadsTodaySnapshot.size || 0,
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return {
      totalLeads: 0,
      totalExpressLeads: 0,
      totalContactMessages: 0,
      totalBlogPosts: 0,
      newLeadsToday: 0,
      newExpressLeadsToday: 0,
    };
  }
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
  try {
    let query = fdb.collection(COLLECTIONS.LEADS);

    // Filter by deletion status
    if (!options.includeDeleted) {
      query = query.where("deletedAt", "==", null);
    }

    // Filter by status
    if (options.status) {
      query = query.where("status", "==", options.status);
    }

    // Get all documents
    const snapshot = await query.get();
    let leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Client-side filtering and sorting
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      leads = leads.filter(lead =>
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.firstName?.toLowerCase().includes(searchLower) ||
        lead.lastName?.toLowerCase().includes(searchLower)
      );
    }

    if (options.startDate) {
      leads = leads.filter(lead => new Date(lead.createdAt) >= options.startDate!);
    }

    if (options.endDate) {
      leads = leads.filter(lead => new Date(lead.createdAt) <= options.endDate!);
    }

    if (options.month && options.year) {
      leads = leads.filter(lead => {
        const date = new Date(lead.createdAt);
        return date.getMonth() === options.month! - 1 && date.getFullYear() === options.year!;
      });
    }

    // Sort
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";
    leads.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const start = (page - 1) * limit;
    const paginatedLeads = leads.slice(start, start + limit);

    return {
      leads: paginatedLeads,
      total: leads.length,
      page,
      limit,
      pages: Math.ceil(leads.length / limit),
    };
  } catch (error) {
    console.error("Error getting all leads:", error);
    return { leads: [], total: 0, page: 1, limit: 10, pages: 0 };
  }
}

/**
 * Get all express leads
 */
export async function getAllExpressLeads(options: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
} = {}) {
  try {
    let query = fdb.collection(COLLECTIONS.EXPRESS_LEADS);

    if (!options.includeDeleted) {
      query = query.where("deletedAt", "==", null);
    }

    if (options.status) {
      query = query.where("status", "==", options.status);
    }

    const snapshot = await query.get();
    let leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      leads = leads.filter(lead =>
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.phone?.includes(options.search!)
      );
    }

    // Sort
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";
    leads.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const start = (page - 1) * limit;
    const paginatedLeads = leads.slice(start, start + limit);

    return {
      leads: paginatedLeads,
      total: leads.length,
      page,
      limit,
      pages: Math.ceil(leads.length / limit),
    };
  } catch (error) {
    console.error("Error getting all express leads:", error);
    return { leads: [], total: 0, page: 1, limit: 10, pages: 0 };
  }
}

/**
 * Get contact messages
 */
export async function getContactMessages(options: {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
} = {}) {
  try {
    let query = fdb.collection(COLLECTIONS.CONTACT_MESSAGES);

    if (!options.includeDeleted) {
      query = query.where("deletedAt", "==", null);
    }

    const snapshot = await query.orderBy("createdAt", options.sortOrder === "asc" ? "asc" : "desc").get();
    let messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      messages = messages.filter(msg =>
        msg.email?.toLowerCase().includes(searchLower) ||
        msg.name?.toLowerCase().includes(searchLower) ||
        msg.subject?.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const start = (page - 1) * limit;
    const paginatedMessages = messages.slice(start, start + limit);

    return {
      messages: paginatedMessages,
      total: messages.length,
      page,
      limit,
      pages: Math.ceil(messages.length / limit),
    };
  } catch (error) {
    console.error("Error getting contact messages:", error);
    return { messages: [], total: 0, page: 1, limit: 10, pages: 0 };
  }
}

/**
 * Update lead status
 */
export async function updateLeadStatus(leadIds: number[], status: string) {
  try {
    const batch = fdb.batch();
    for (const id of leadIds) {
      const docRef = fdb.collection(COLLECTIONS.LEADS).doc(id.toString());
      batch.update(docRef, {
        status,
        updatedAt: new Date(),
      });
    }
    await batch.commit();
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
}

/**
 * Update express lead status
 */
export async function updateExpressLeadStatus(leadIds: number[], status: string) {
  try {
    const batch = fdb.batch();
    for (const id of leadIds) {
      const docRef = fdb.collection(COLLECTIONS.EXPRESS_LEADS).doc(id.toString());
      batch.update(docRef, {
        status,
        updatedAt: new Date(),
      });
    }
    await batch.commit();
  } catch (error) {
    console.error("Error updating express lead status:", error);
    throw error;
  }
}

/**
 * Delete leads
 */
export async function deleteLeads(leadIds: number[]) {
  try {
    const batch = fdb.batch();
    for (const id of leadIds) {
      const docRef = fdb.collection(COLLECTIONS.LEADS).doc(id.toString());
      batch.update(docRef, {
        deletedAt: new Date(),
      });
    }
    await batch.commit();
  } catch (error) {
    console.error("Error deleting leads:", error);
    throw error;
  }
}

/**
 * Delete express leads
 */
export async function deleteExpressLeads(leadIds: number[]) {
  try {
    const batch = fdb.batch();
    for (const id of leadIds) {
      const docRef = fdb.collection(COLLECTIONS.EXPRESS_LEADS).doc(id.toString());
      batch.update(docRef, {
        deletedAt: new Date(),
      });
    }
    await batch.commit();
  } catch (error) {
    console.error("Error deleting express leads:", error);
    throw error;
  }
}

/**
 * Assign lead to user
 */
export async function assignLeadToUser(leadIds: number[], userId: string) {
  try {
    const batch = fdb.batch();
    for (const id of leadIds) {
      const docRef = fdb.collection(COLLECTIONS.LEADS).doc(id.toString());
      batch.update(docRef, {
        assignedTo: userId,
        updatedAt: new Date(),
      });
    }
    await batch.commit();
  } catch (error) {
    console.error("Error assigning leads:", error);
    throw error;
  }
}

/**
 * Export leads to CSV format
 */
export async function exportLeads(format: "csv" | "json" = "csv") {
  try {
    const snapshot = await fdb.collection(COLLECTIONS.LEADS).where("deletedAt", "==", null).get();
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (format === "json") {
      return JSON.stringify(leads, null, 2);
    }

    // CSV format
    if (leads.length === 0) return "";

    const headers = Object.keys(leads[0]);
    const csvContent = [
      headers.join(","),
      ...leads.map(lead =>
        headers.map(header => {
          const value = lead[header as keyof typeof lead];
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        }).join(",")
      ),
    ].join("\n");

    return csvContent;
  } catch (error) {
    console.error("Error exporting leads:", error);
    throw error;
  }
}

/**
 * Export express leads to CSV format
 */
export async function exportExpressLeads(format: "csv" | "json" = "csv") {
  try {
    const snapshot = await fdb.collection(COLLECTIONS.EXPRESS_LEADS).where("deletedAt", "==", null).get();
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (format === "json") {
      return JSON.stringify(leads, null, 2);
    }

    // CSV format
    if (leads.length === 0) return "";

    const headers = Object.keys(leads[0]);
    const csvContent = [
      headers.join(","),
      ...leads.map(lead =>
        headers.map(header => {
          const value = lead[header as keyof typeof lead];
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        }).join(",")
      ),
    ].join("\n");

    return csvContent;
  } catch (error) {
    console.error("Error exporting express leads:", error);
    throw error;
  }
}

/**
 * Add note to lead
 */
export async function addLeadNote(leadId: number, note: string, userId: string) {
  try {
    await fdb.collection(COLLECTIONS.LEAD_NOTES).add({
      leadId,
      note,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding lead note:", error);
    throw error;
  }
}

/**
 * Get lead notes
 */
export async function getLeadNotes(leadId: number) {
  try {
    const snapshot = await fdb.collection(COLLECTIONS.LEAD_NOTES)
      .where("leadId", "==", leadId)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting lead notes:", error);
    return [];
  }
}

/**
 * Log admin activity
 */
export async function logAdminActivity(userId: string, action: string, details: any) {
  try {
    await fdb.collection(COLLECTIONS.ADMIN_ACTIVITY_LOGS).add({
      userId,
      action,
      details,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error logging admin activity:", error);
  }
}

/**
 * Get admin activity logs
 */
export async function getAdminActivityLogs(limit: number = 100) {
  try {
    const snapshot = await fdb.collection(COLLECTIONS.ADMIN_ACTIVITY_LOGS)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting admin activity logs:", error);
    return [];
  }
}
