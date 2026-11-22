import { z } from "zod";

export const CONTACT_METHODS = [
  { id: "phone", label: "Phone call" },
  { id: "sms", label: "Text message (SMS)" },
  { id: "email", label: "Email" },
] as const;

export type ContactMethodId = (typeof CONTACT_METHODS)[number]["id"];

const emailSchema = z.string().email();
// Digits with optional +, spaces, dashes or brackets; 7–15 digits in total.
const phonePattern = /^\+?[\d\s\-()]{7,20}$/;

export const DESCRIPTION_MIN = 20;
export const DESCRIPTION_MAX = 1000;

export const helpRequestSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Please enter your name." })
      .max(100, { message: "Name must be under 100 characters." }),
    contactMethod: z.enum(["phone", "sms", "email"], {
      errorMap: () => ({ message: "Please choose how we should contact you." }),
    }),
    contactDetail: z
      .string()
      .trim()
      .min(1, { message: "Please enter your phone number or email." })
      .max(255, { message: "This is too long." }),
    category: z.enum(["education", "financial", "medical", "other"], {
      errorMap: () => ({ message: "Please choose a category." }),
    }),
    description: z
      .string()
      .trim()
      .min(DESCRIPTION_MIN, {
        message: `Please write at least ${DESCRIPTION_MIN} characters so we understand your situation.`,
      })
      .max(DESCRIPTION_MAX, {
        message: `Please keep it under ${DESCRIPTION_MAX} characters.`,
      }),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Please confirm your consent to continue." }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.contactMethod === "email") {
      if (!emailSchema.safeParse(data.contactDetail).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["contactDetail"],
          message: "Please enter a valid email address.",
        });
      }
    } else {
      const digits = data.contactDetail.replace(/\D/g, "");
      if (!phonePattern.test(data.contactDetail) || digits.length < 7 || digits.length > 15) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["contactDetail"],
          message: "Please enter a valid phone number.",
        });
      }
    }
  });

export type HelpRequestInput = z.input<typeof helpRequestSchema>;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name." })
    .max(100, { message: "Name must be under 100 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." })
    .max(255, { message: "Email must be under 255 characters." }),
  subject: z
    .string()
    .trim()
    .min(2, { message: "Please add a short subject." })
    .max(120, { message: "Subject must be under 120 characters." }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Please write at least 10 characters." })
    .max(1000, { message: "Please keep it under 1000 characters." }),
});

export type ContactInput = z.input<typeof contactSchema>;
