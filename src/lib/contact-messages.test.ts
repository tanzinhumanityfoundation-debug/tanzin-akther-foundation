import { describe, expect, it } from "vitest";

import { toContactMessageRow } from "./contact-messages";

const valid = {
  name: "Sample Visitor",
  email: "visitor@example.com",
  subject: "Volunteering",
  message: "I would like to volunteer on weekends.",
};

describe("Contact message saving", () => {
  it("only sends name, email, subject and message (never read or date)", () => {
    const row = toContactMessageRow({ ...valid, read: true, created_at: "2020-01-01" }, "id-1");
    expect(Object.keys(row).sort()).toEqual(["email", "id", "message", "name", "subject"]);
  });

  it("refuses an invalid email", () => {
    expect(() => toContactMessageRow({ ...valid, email: "not-an-email" }, "id-1")).toThrow();
  });

  it("refuses a message shorter than 10 characters", () => {
    expect(() => toContactMessageRow({ ...valid, message: "Hi" }, "id-1")).toThrow();
  });
});
