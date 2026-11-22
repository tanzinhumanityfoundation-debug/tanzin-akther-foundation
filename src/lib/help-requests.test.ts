import { describe, expect, it } from "vitest";

import { formatReference, toHelpRequestRow } from "./help-requests";

const valid = {
  fullName: "Sample Person",
  contactMethod: "email",
  contactDetail: "person@example.com",
  category: "medical",
  description: "We need help with medicine costs this month.",
  consent: true,
};

describe("Help request saving", () => {
  it("only sends name, contact, category and description (never status or date)", () => {
    const row = toHelpRequestRow(valid, "11111111-2222-3333-4444-555555555555");
    expect(Object.keys(row).sort()).toEqual(["category", "contact", "description", "id", "name"]);
  });

  it("stores the contact method together with the contact detail", () => {
    const row = toHelpRequestRow(valid, "11111111-2222-3333-4444-555555555555");
    expect(row.contact).toBe("Email: person@example.com");
  });

  it("refuses to build a row without consent", () => {
    expect(() => toHelpRequestRow({ ...valid, consent: false }, "x")).toThrow();
  });

  it("turns the ID into a TAF- reference", () => {
    expect(formatReference("3f9a1c2b-0000-4000-8000-000000000000")).toBe("TAF-3F9A1C2B");
  });
});
