import { describe, expect, it } from "vitest";

import { helpRequestSchema } from "./forms";

const valid = {
  fullName: "Sample Person",
  contactMethod: "email",
  contactDetail: "person@example.com",
  category: "education",
  description: "My child needs help paying exam fees this term.",
  consent: true,
};

describe("Request Help form rules", () => {
  it("accepts a complete request", () => {
    expect(helpRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("requires the consent checkbox", () => {
    const result = helpRequestSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects descriptions longer than 1000 characters", () => {
    const result = helpRequestSchema.safeParse({ ...valid, description: "a".repeat(1001) });
    expect(result.success).toBe(false);
  });

  it("requires a valid email when email is the contact method", () => {
    const result = helpRequestSchema.safeParse({ ...valid, contactDetail: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("does not keep fields beyond the allowed ones (no ID, bank or document data)", () => {
    const result = helpRequestSchema.safeParse({ ...valid, nationalId: "123", bankAccount: "456" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(Object.keys(result.data).sort()).toEqual(
        ["category", "consent", "contactDetail", "contactMethod", "description", "fullName"],
      );
    }
  });
});
