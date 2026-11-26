import { GraduationCap, HandCoins, HeartPulse, LifeBuoy, type LucideIcon } from "lucide-react";

export const SITE = {
  name: "Tanzin Akther Foundation",
  shortName: "Tanzin Akther",
  tagline: "Humanity First. Together, We Can Make a Difference.",
  description:
    "Tanzin Akther Foundation helps people facing hardship with education, financial difficulties, medical needs and other humanitarian situations.",
} as const;

/** Public contact details for the foundation. */
export const CONTACT = {
  email: "tanzinhumanityfoundation@gmail.com",
  address: "Jamtola Bazar, Shewrapara, Mirpur, Dhaka",
} as const;

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/request-help", label: "Request Help" },
  { to: "/contact", label: "Contact Us" },
] as const;

export type HelpCategoryId = "education" | "financial" | "medical" | "other";

export const HELP_CATEGORIES: {
  id: HelpCategoryId;
  title: string;
  summary: string;
  examples: string[];
  icon: LucideIcon;
}[] = [
  {
    id: "education",
    title: "Education",
    summary: "Support so that children and young people can keep learning.",
    examples: ["School or exam fees", "Books and supplies", "Uniforms"],
    icon: GraduationCap,
  },
  {
    id: "financial",
    title: "Financial Hardship",
    summary: "A helping hand for families going through a difficult time.",
    examples: ["Food and essentials", "Rent or utility arrears", "Loss of income"],
    icon: HandCoins,
  },
  {
    id: "medical",
    title: "Medical Needs",
    summary: "Help with costs related to treatment, medicine and care.",
    examples: ["Medicine costs", "Treatment expenses", "Travel to hospital"],
    icon: HeartPulse,
  },
  {
    id: "other",
    title: "Other Humanitarian Help",
    summary: "Urgent or unusual situations that don't fit a single category.",
    examples: ["Disaster recovery", "Emergency situations", "Other needs"],
    icon: LifeBuoy,
  },
];

export function categoryTitle(id: HelpCategoryId | string) {
  return HELP_CATEGORIES.find((c) => c.id === id)?.title ?? id;
}
