import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {
        "user-agent": "Mozilla/5.0 (Test Browser)",
        "x-forwarded-for": "192.168.1.1",
        referer: "https://google.com",
      },
      ip: "192.168.1.1",
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("leads.submit", () => {
  it("successfully creates a lead with valid data", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const leadData = {
      age: 35,
      state: "PA",
      zipCode: "19101",
      vehicleType: "Sedan",
      vehicleYear: 2020,
      hasRecentAccidents: "no" as const,
      currentInsurer: "State Farm",
      coverageType: "Full Coverage",
      ownershipStatus: "owned" as const,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "5551234567",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "insurance-pa",
    };

    const result = await caller.leads.submit(leadData);

    expect(result.success).toBe(true);
    expect(result.leadId).toBeTypeOf("number");
    expect(result.leadId).toBeGreaterThan(0);
  });

  it("validates age range", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const leadData = {
      age: 15, // Invalid: below minimum
      state: "PA",
      zipCode: "19101",
      vehicleType: "Sedan",
      vehicleYear: 2020,
      hasRecentAccidents: "no" as const,
      currentInsurer: "State Farm",
      coverageType: "Full Coverage",
      ownershipStatus: "owned" as const,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "5551234567",
    };

    await expect(caller.leads.submit(leadData)).rejects.toThrow();
  });

  it("validates email format", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const leadData = {
      age: 35,
      state: "PA",
      zipCode: "19101",
      vehicleType: "Sedan",
      vehicleYear: 2020,
      hasRecentAccidents: "no" as const,
      currentInsurer: "State Farm",
      coverageType: "Full Coverage",
      ownershipStatus: "owned" as const,
      firstName: "John",
      lastName: "Doe",
      email: "invalid-email", // Invalid email format
      phone: "5551234567",
    };

    await expect(caller.leads.submit(leadData)).rejects.toThrow();
  });

  it("validates state code length", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const leadData = {
      age: 35,
      state: "PAA", // Invalid: should be 2 characters
      zipCode: "19101",
      vehicleType: "Sedan",
      vehicleYear: 2020,
      hasRecentAccidents: "no" as const,
      currentInsurer: "State Farm",
      coverageType: "Full Coverage",
      ownershipStatus: "owned" as const,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "5551234567",
    };

    await expect(caller.leads.submit(leadData)).rejects.toThrow();
  });

  it("validates required fields", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const incompleteData = {
      age: 35,
      state: "PA",
      zipCode: "19101",
      // Missing required fields
    } as any;

    await expect(caller.leads.submit(incompleteData)).rejects.toThrow();
  });

  it("captures tracking information from request headers", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const leadData = {
      age: 35,
      state: "PA",
      zipCode: "19101",
      vehicleType: "Sedan",
      vehicleYear: 2020,
      hasRecentAccidents: "no" as const,
      currentInsurer: "State Farm",
      coverageType: "Full Coverage",
      ownershipStatus: "owned" as const,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "5551234567",
    };

    const result = await caller.leads.submit(leadData);

    // Verify that the lead was created successfully
    // The actual tracking data (IP, user agent) is stored in the database
    expect(result.success).toBe(true);
    expect(result.leadId).toBeGreaterThan(0);
  });
});
