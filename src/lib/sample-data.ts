import type { ContactMethodId } from "./forms";
import type { HelpCategoryId } from "./site";

/** SAMPLE DATA ONLY. These are fictional entries used to design the admin dashboard. */

export type RequestStatus = "new" | "in_review" | "approved" | "closed";

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new: "New",
  in_review: "In review",
  approved: "Approved",
  closed: "Closed",
};

export interface SampleHelpRequest {
  id: string;
  fullName: string;
  contactMethod: ContactMethodId;
  contactDetail: string;
  category: HelpCategoryId;
  description: string;
  status: RequestStatus;
  submittedAt: string;
  note: string;
}

export interface SampleContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
  read: boolean;
}

export const SAMPLE_REQUESTS: SampleHelpRequest[] = [
  {
    id: "REQ-1012",
    fullName: "Sample Person A",
    contactMethod: "phone",
    contactDetail: "Sample phone (hidden)",
    category: "education",
    description:
      "My daughter is in class 8 and we cannot afford her exam fees and books this term. Any support for school costs would help her continue.",
    status: "new",
    submittedAt: "2026-11-21T09:15:00Z",
    note: "",
  },
  {
    id: "REQ-1011",
    fullName: "Sample Person B",
    contactMethod: "email",
    contactDetail: "person.b@example.com",
    category: "medical",
    description:
      "My father needs regular medicine after a recent illness. The monthly cost is more than we can manage right now.",
    status: "in_review",
    submittedAt: "2026-11-20T14:40:00Z",
    note: "Called once — follow up next week.",
  },
  {
    id: "REQ-1010",
    fullName: "Sample Person C",
    contactMethod: "sms",
    contactDetail: "Sample phone (hidden)",
    category: "financial",
    description:
      "I lost my job two months ago and we are behind on rent. Looking for short-term help with food and essentials for my family.",
    status: "in_review",
    submittedAt: "2026-11-19T08:05:00Z",
    note: "",
  },
  {
    id: "REQ-1009",
    fullName: "Sample Person D",
    contactMethod: "phone",
    contactDetail: "Sample phone (hidden)",
    category: "other",
    description:
      "Our home was damaged in heavy rain last week. We need help with basic repairs and some household items.",
    status: "approved",
    submittedAt: "2026-11-17T17:22:00Z",
    note: "Approved for household items package.",
  },
  {
    id: "REQ-1008",
    fullName: "Sample Person E",
    contactMethod: "email",
    contactDetail: "person.e@example.com",
    category: "education",
    description:
      "I am a first-year university student and need help buying textbooks for this semester.",
    status: "closed",
    submittedAt: "2026-11-12T11:00:00Z",
    note: "Supported with book costs.",
  },
  {
    id: "REQ-1007",
    fullName: "Sample Person F",
    contactMethod: "phone",
    contactDetail: "Sample phone (hidden)",
    category: "medical",
    description:
      "Need help with travel costs to take my child to hospital appointments in the city twice a month.",
    status: "new",
    submittedAt: "2026-11-22T06:30:00Z",
    note: "",
  },
];

export const SAMPLE_MESSAGES: SampleContactMessage[] = [
  {
    id: "MSG-204",
    name: "Sample Visitor 1",
    email: "visitor1@example.com",
    subject: "Volunteering",
    message: "Hello, I would like to know how I can volunteer with your foundation on weekends.",
    receivedAt: "2026-11-21T12:10:00Z",
    read: false,
  },
  {
    id: "MSG-203",
    name: "Sample Visitor 2",
    email: "visitor2@example.com",
    subject: "Question about a request",
    message: "I submitted a request last week. How long does it usually take to hear back?",
    receivedAt: "2026-11-20T09:45:00Z",
    read: true,
  },
  {
    id: "MSG-202",
    name: "Sample Visitor 3",
    email: "visitor3@example.com",
    subject: "School partnership",
    message: "Our community school would like to talk about working together on an education programme.",
    receivedAt: "2026-11-18T16:00:00Z",
    read: true,
  },
];
