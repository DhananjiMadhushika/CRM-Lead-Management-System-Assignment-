export const STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
] as const;

export const SOURCES = [
  "WEBSITE",
  "REFERRAL",
  "LINKEDIN",
  "COLD_CALL",
  "COLD_EMAIL",
  "EMAIL",
  "EVENT",
  "OTHER",
] as const;

export const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-600 border border-blue-200",
  CONTACTED: "bg-purple-50 text-purple-600 border border-purple-200",
  QUALIFIED: "bg-cyan-50 text-cyan-600 border border-cyan-200",
  PROPOSAL_SENT: "bg-amber-50 text-amber-600 border border-amber-200",
  WON: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  LOST: "bg-red-50 text-red-500 border border-red-200",
};

export const STATUS_DOT: Record<string, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-purple-500",
  QUALIFIED: "bg-cyan-500",
  PROPOSAL_SENT: "bg-amber-500",
  WON: "bg-emerald-500",
  LOST: "bg-red-500",
};

export const STATUS_LABEL: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent",
  WON: "Won",
  LOST: "Lost",
};

export const SOURCE_LABEL: Record<string, string> = {
  WEBSITE: "Website",
  REFERRAL: "Referral",
  LINKEDIN: "LinkedIn",
  COLD_CALL: "Cold Call",
  COLD_EMAIL: "Cold Email",
  EMAIL: "Email",
  EVENT: "Event",
  OTHER: "Other",
};

export const PRIORITY_STYLES: Record<string, string> = {
  LOW: "text-gray-400",
  MEDIUM: "text-amber-500",
  HIGH: "text-red-500",
};