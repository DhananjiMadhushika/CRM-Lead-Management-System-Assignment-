import DeleteModal from "@/components/DeleteModal";
import LeadsTable from "@/components/Table";
import { useAuth } from "@/Providers/AuthProvider";
import { Lead, LeadsTableHeader, Pagination, Tab, User } from "@/types/Leads";
import axios from "axios";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import {
  HiChevronDown,
  HiOutlinePlus,
  HiOutlineSearch,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";


const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST"];
const SOURCES  = ["WEBSITE", "REFERRAL", "LINKEDIN", "COLD_CALL", "COLD_EMAIL", "EMAIL", "EVENT", "OTHER"];

const STATUS_LABEL: Record<string, string> = {
  NEW: "New", CONTACTED: "Contacted", QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent", WON: "Won", LOST: "Lost",
};
const SOURCE_LABEL: Record<string, string> = {
  WEBSITE: "Website", REFERRAL: "Referral", LINKEDIN: "LinkedIn",
  COLD_CALL: "Cold Call", COLD_EMAIL: "Cold Email", EMAIL: "Email",
  EVENT: "Event", OTHER: "Other",
};

const TABLE_HEADERS: LeadsTableHeader[] = [
  { header: "Lead",       accessor: "name",       type: "avatar"   },
  { header: "Company",    accessor: "company",                       hideOnMobile: false },
  { header: "Contact",    accessor: "email",       type: "contact",  hideOnMobile: false },
  { header: "Status",     accessor: "status",      type: "status"   },
  { header: "Priority",   accessor: "priority",    type: "priority", hideOnMobile: false },
  { header: "Source",     accessor: "source",      type: "source",   hideOnMobile: true  },
  { header: "Owner",      accessor: "assignedTo",  type: "assignee", hideOnMobile: true  },
  { header: "Deal Value", accessor: "dealValue",   type: "currency", hideOnMobile: false },
];

const Select = ({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder: string;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="py-2 pl-3 pr-8 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [sourceFilter, setSource] = useState("");
  const [ownerFilter, setOwner] = useState("");
  const [deleteTarget, setDelete] = useState<Lead | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState<Tab>(isAdmin ? "all" : "mine");

  const token = sessionStorage.getItem("authToken");
  const config = { headers: { Authorization: token } };

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = { limit: "20" };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;

      if (activeTab === "mine") {
        if (user?.id) params.assignedToId = String(user.id);
      } else {
        if (ownerFilter) params.assignedToId = ownerFilter;
      }

      const res = await axios.get("http://localhost:5000/api/leads", { ...config, params });
      setLeads(res.data.leads);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter, ownerFilter, activeTab, user]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users", config)
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 300);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`http://localhost:5000/api/leads/${deleteTarget.id}`, config);
      setDelete(null);
      fetchLeads();
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 sm:px-6 py-6">
     {deleteTarget && (
  <DeleteModal
    name={deleteTarget.name}
    onConfirm={handleDelete}
    onCancel={() => setDelete(null)}
  />
)}

      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {activeTab === "mine"
              ? `${pagination?.total ?? 0} leads assigned to you.`
              : `${pagination?.total ?? 0} leads across the full pipeline.`}
          </p>
        </div>
        <button
          onClick={() => navigate("/leads/new")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <HiOutlinePlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Lead</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="flex items-center gap-1 p-1 mb-5 bg-white border border-gray-100 shadow-sm w-fit rounded-xl">
        {([
          { key: "all",  label: "All Leads" },
          { key: "mine", label: "My Leads" },
        ] as { key: Tab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setOwner("");
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && pagination && (
              <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-md font-bold ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {pagination.total}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <HiOutlineSearch className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, company, or email..."
            className="w-full py-2 pr-4 text-sm placeholder-gray-400 bg-white border border-gray-200 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select value={statusFilter} onChange={setStatus} placeholder="All statuses"
          options={STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))} />
        <Select value={sourceFilter} onChange={setSource} placeholder="All sources"
          options={SOURCES.map((s) => ({ value: s, label: SOURCE_LABEL[s] }))} />
        {isAdmin && activeTab === "all" && (
          <Select value={ownerFilter} onChange={setOwner} placeholder="All salespeople"
            options={users.map((u) => ({ value: String(u.id), label: u.name }))} />
        )}
      </div>
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl md:bg-transparent md:border-0 md:shadow-none md:rounded-none">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-sm text-center text-gray-400">
            {activeTab === "mine" ? "No leads assigned to you yet" : "No leads found"}
          </div>
        ) : (
          <LeadsTable
            tableHeader={TABLE_HEADERS}
            data={leads}
            currentUserId={user?.id ? Number(user.id) : undefined}
            isAdmin={isAdmin}
            onView={(lead: { id: any; }) => navigate(`/leads/${lead.id}`)}
            onEdit={(lead: { id: any; }) => navigate(`/leads/${lead.id}/edit`)}
            onDelete={(lead: SetStateAction<Lead | null>) => setDelete(lead)}
          />
        )}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 bg-white border-t border-gray-100 rounded-b-2xl">
            <p className="text-xs text-gray-400">
              Showing {leads.length} of {pagination.total} leads
            </p>
            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 text-xs rounded-lg font-medium transition-colors ${
                    p === pagination.page
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;