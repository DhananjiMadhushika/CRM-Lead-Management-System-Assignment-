import { Lead, LeadsTableHeader } from "@/types/Leads";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";



interface LeadsTableProps {
  tableHeader: LeadsTableHeader[];
  data: Lead[];
  currentUserId?: number;
  isAdmin?: boolean;
  onView?: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
}

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-600 border border-blue-200",
  CONTACTED: "bg-purple-50 text-purple-600 border border-purple-200",
  QUALIFIED: "bg-cyan-50 text-cyan-600 border border-cyan-200",
  PROPOSAL_SENT: "bg-amber-50 text-amber-600 border border-amber-200",
  WON: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  LOST: "bg-red-50 text-red-500 border border-red-200",
};
const STATUS_DOT: Record<string, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-purple-500",
  QUALIFIED: "bg-cyan-500",
  PROPOSAL_SENT: "bg-amber-500",
  WON: "bg-emerald-500",
  LOST: "bg-red-500",
};
const STATUS_LABEL: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent",
  WON: "Won",
  LOST: "Lost",
};
const SOURCE_LABEL: Record<string, string> = {
  WEBSITE: "Website",
  REFERRAL: "Referral",
  LINKEDIN: "LinkedIn",
  COLD_CALL: "Cold Call",
  COLD_EMAIL: "Cold Email",
  EMAIL: "Email",
  EVENT: "Event",
  OTHER: "Other",
};
const PRIORITY_STYLES: Record<string, string> = {
  LOW: "text-gray-400",
  MEDIUM: "text-amber-500",
  HIGH: "text-red-500",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const avatarColor = (name: string) => {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-cyan-100 text-cyan-700",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-rose-100 text-rose-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const renderCell = (col: LeadsTableHeader, lead: Lead, index: number) => {
  const raw = (lead as any)[col.accessor];

  switch (col.type) {
    case "avatar":
      return (
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold flex-shrink-0 ${avatarColor(
              lead.name
            )}`}
          >
            {initials(lead.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-800 whitespace-nowrap">
              {lead.name}
            </p>
            <p className="text-xs text-gray-400">L-{String(1000 + index + 1)}</p>
          </div>
        </div>
      );

    case "status":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            STATUS_STYLES[lead.status] ?? "bg-gray-100 text-gray-500"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              STATUS_DOT[lead.status] ?? "bg-gray-400"
            }`}
          />
          {STATUS_LABEL[lead.status] ?? lead.status}
        </span>
      );

    case "priority":
      return (
        <span
          className={`text-xs font-semibold ${
            PRIORITY_STYLES[lead.priority] ?? "text-gray-400"
          }`}
        >
          {lead.priority || "—"}
        </span>
      );

    case "source":
      return (
        <span className="text-gray-500">
          {SOURCE_LABEL[lead.source] ?? lead.source}
        </span>
      );

    case "currency":
      return (
        <span className="font-semibold text-gray-800">
          {lead.dealValue ? fmt(lead.dealValue) : "—"}
        </span>
      );

    case "assignee":
      return (
        <span className="text-gray-700">
          {lead.assignedTo?.name ?? "Unassigned"}
        </span>
      );

    case "contact":
      return (
        <div>
          <p className="text-gray-700">{lead.email}</p>
          <p className="text-xs text-gray-400">{lead.phone || ""}</p>
        </div>
      );

    default:
      return (
        <span className="text-gray-700">{raw != null ? String(raw) : "—"}</span>
      );
  }
};

const MobileCard = ({
  lead,
  index,
  tableHeader,
  currentUserId,
  isAdmin,
  onView,
  onEdit,
  onDelete,
}: {
  lead: Lead;
  index: number;
  tableHeader: LeadsTableHeader[];
  currentUserId?: number;
  isAdmin?: boolean;
  onView?: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
}) => {
  const avatarCol = tableHeader.find((h) => h.type === "avatar");
  const bodyColumns = tableHeader.filter(
    (h) => h.type !== "avatar" && !h.hideOnMobile
  );

  return (
    <div className="p-4 space-y-3 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center min-w-0 gap-3">
          {avatarCol && (
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold flex-shrink-0 ${avatarColor(
                lead.name
              )}`}
            >
              {initials(lead.name)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate">{lead.name}</p>
            <p className="text-xs text-gray-400">L-{String(1000 + index + 1)}</p>
          </div>
        </div>
        <div className="flex items-center flex-shrink-0 gap-1">
          {onView && (
            <button
              onClick={() => onView(lead)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View"
            >
              <HiOutlineEye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(lead)}
              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Edit"
            >
              <HiOutlinePencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (isAdmin || lead.assignedTo?.id === currentUserId) && (
            <button
              onClick={() => onDelete(lead)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 pt-2 border-t gap-x-4 gap-y-2 border-gray-50">
        {bodyColumns.map((col) => (
          <div key={col.accessor} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {col.header}
            </span>
            <div className="text-sm">{renderCell(col, lead, index)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LeadsTable = ({
  tableHeader,
  data,
  currentUserId,
  isAdmin,
  onView,
  onEdit,
  onDelete,
}: LeadsTableProps) => {
  return (
    <>
      <div className="hidden overflow-x-auto border border-gray-100 md:block rounded-2xl scrollbar-hide">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/50">
            <tr>
              {tableHeader.map((col) => (
                <th
                  key={col.accessor}
                  className={`px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap ${
                    col.classname || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
              <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? (
              data.map((lead, idx) => (
                <tr
                  key={lead.id}
                  className="transition-colors hover:bg-gray-50/70 group"
                >
                  {tableHeader.map((col) => (
                    <td
                      key={`${lead.id}-${col.accessor}`}
                      className={`px-5 py-4 ${col.classname || ""}`}
                    >
                      {renderCell(col, lead, idx)}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(lead)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <HiOutlineEye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(lead)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete &&
                        (isAdmin || lead.assignedTo?.id === currentUserId) && (
                          <button
                            onClick={() => onDelete(lead)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeader.length + 1}
                  className="px-4 py-8 text-sm text-center text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {data.length > 0 ? (
          data.map((lead, idx) => (
            <MobileCard
              key={lead.id}
              lead={lead}
              index={idx}
              tableHeader={tableHeader}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="py-16 text-sm text-center text-gray-400">
            No data available
          </div>
        )}
      </div>
    </>
  );
};

export default LeadsTable;