export const STATUS_LABEL: Record<string, string> = {
  NEW:           "New",
  CONTACTED:     "Contacted",
  QUALIFIED:     "Qualified",
  PROPOSAL_SENT: "Proposal Sent",
  WON:           "Won",
  LOST:          "Lost",
};

const STATUS_COLORS: Record<string, string> = {
  NEW:           "bg-blue-50 text-blue-600",
  CONTACTED:     "bg-purple-50 text-purple-600",
  QUALIFIED:     "bg-cyan-50 text-cyan-600",
  PROPOSAL_SENT: "bg-amber-50 text-amber-600",
  WON:           "bg-emerald-50 text-emerald-600",
  LOST:          "bg-red-50 text-red-500",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-500"}`}>
    {STATUS_LABEL[status] ?? status}
  </span>
);

export default StatusBadge;