import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChatAlt2,
  HiOutlinePaperAirplane,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
} from "react-icons/hi";
import { useAuth } from "@/Providers/AuthProvider";
import { Lead } from "@/types/Leads";
import DeleteModal from "@/components/DeleteModal";



const STATUS_STYLES: Record<string, string> = {
  NEW:           "bg-blue-50 text-blue-600 border border-blue-200",
  CONTACTED:     "bg-purple-50 text-purple-600 border border-purple-200",
  QUALIFIED:     "bg-cyan-50 text-cyan-600 border border-cyan-200",
  PROPOSAL_SENT: "bg-amber-50 text-amber-600 border border-amber-200",
  WON:           "bg-emerald-50 text-emerald-600 border border-emerald-200",
  LOST:          "bg-red-50 text-red-500 border border-red-200",
};

const STATUS_DOT: Record<string, string> = {
  NEW: "bg-blue-500", CONTACTED: "bg-purple-500", QUALIFIED: "bg-cyan-500",
  PROPOSAL_SENT: "bg-amber-500", WON: "bg-emerald-500", LOST: "bg-red-500",
};

const STATUS_LABEL: Record<string, string> = {
  NEW: "New", CONTACTED: "Contacted", QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent", WON: "Won", LOST: "Lost",
};

const SOURCE_LABEL: Record<string, string> = {
  WEBSITE: "Website", REFERRAL: "Referral", LINKEDIN: "LinkedIn",
  COLD_CALL: "Cold Call", EMAIL: "Email", OTHER: "Other",
  COLD_EMAIL: "Cold Email", EVENT: "Event",
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW:    "bg-gray-50 text-gray-500 border border-gray-200",
  MEDIUM: "bg-amber-50 text-amber-600 border border-amber-200",
  HIGH:   "bg-red-50 text-red-500 border border-red-200",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-0.5 rounded-lg bg-gray-50 text-gray-400">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-gray-800 break-all">{value || "—"}</div>
    </div>
  </div>
);


const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = sessionStorage.getItem("authToken");
  const config = { headers: { Authorization: token } };

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);

  const fetchLead = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`http://localhost:5000/api/leads/${id}`, config);
      setLead(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load lead");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [id]);

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setNoteLoading(true);
    setNoteError("");
    try {
      await axios.post("http://localhost:5000/api/notes", {
        content: noteContent.trim(),
        leadId: Number(id),
      }, config);
      setNoteContent("");
      fetchLead();
    } catch (err: any) {
      setNoteError(err.response?.data?.message || "Failed to add note");
    } finally {
      setNoteLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    setDeletingNoteId(noteId);
    try {
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`, config);
      fetchLead();
    } catch (err) {
      console.error("Failed to delete note", err);
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleDeleteLead = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`, config);
      navigate("/leads");
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error || "Lead not found"}</p>
          <button onClick={() => navigate("/leads")} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-6 py-6">
      {showDelete && (
        <DeleteModal 
        name = {lead.name}
        onConfirm={handleDeleteLead} onCancel={() => setShowDelete(false)} />
      )}

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/leads")}
          className="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 w-9 h-9 rounded-xl hover:text-gray-800 hover:bg-gray-50"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{lead.company || "No company"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/leads/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <HiOutlinePencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 transition-colors border border-red-100 bg-red-50 rounded-xl hover:bg-red-100"
          >
            <HiOutlineTrash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        <div className="space-y-4">
          <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[lead.status] ?? "bg-gray-100 text-gray-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[lead.status] ?? "bg-gray-400"}`} />
                {STATUS_LABEL[lead.status] ?? lead.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_STYLES[lead.priority] ?? "bg-gray-100 text-gray-500"}`}>
                {lead.priority} Priority
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Created {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <h2 className="mb-2 text-sm font-semibold text-gray-800">Contact Details</h2>
            <InfoRow icon={<HiOutlineUser className="w-4 h-4" />} label="Name" value={lead.name} />
            <InfoRow icon={<HiOutlineBriefcase className="w-4 h-4" />} label="Company" value={lead.company} />
            <InfoRow icon={<HiOutlineMail className="w-4 h-4" />} label="Email" value={lead.email} />
            <InfoRow icon={<HiOutlinePhone className="w-4 h-4" />} label="Phone" value={lead.phone} />
          </div>

          <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <h2 className="mb-2 text-sm font-semibold text-gray-800">Deal Info</h2>
            <InfoRow
              icon={<HiOutlineCurrencyDollar className="w-4 h-4" />}
              label="Deal Value"
              value={lead.dealValue ? fmt(lead.dealValue) : "—"}
            />
            <InfoRow
              icon={<HiOutlineTag className="w-4 h-4" />}
              label="Source"
              value={SOURCE_LABEL[lead.source] ?? lead.source}
            />
            <InfoRow
              icon={<HiOutlineUser className="w-4 h-4" />}
              label="Assigned To"
              value={
                lead.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-violet-500">
                      {lead.assignedTo.name.charAt(0).toUpperCase()}
                    </div>
                    {lead.assignedTo.name}
                  </div>
                ) : "Unassigned"
              }
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineChatAlt2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-800">Notes</h2>
              <span className="px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full">
                {lead.notes.length}
              </span>
            </div>


            <div className="mb-6">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add a note about this lead..."
                rows={3}
                className="w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all border border-gray-200 resize-none bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {noteError && (
                <p className="mt-1 text-xs text-red-500">{noteError}</p>
              )}
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddNote}
                  disabled={noteLoading || !noteContent.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {noteLoading ? (
                    <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                  ) : (
                    <HiOutlinePaperAirplane className="w-4 h-4 rotate-90" />
                  )}
                  Add Note
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {lead.notes.length === 0 ? (
                <div className="py-10 text-sm text-center text-gray-400">
                  No notes yet. Add the first one above.
                </div>
              ) : (
                lead.notes.map((note) => (
                  <div key={note.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center justify-center text-xs font-bold text-white rounded-full w-7 h-7 bg-gradient-to-br from-blue-500 to-violet-500">
                          {initials(note.createdBy.name)}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-800">{note.createdBy.name}</span>
                          <span className="ml-2 text-xs text-gray-400">{timeAgo(note.createdAt)}</span>
                        </div>
                      </div>
                      {(user?.id === note.createdBy.id.toString() || user?.role === "admin") && (
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={deletingNoteId === note.id}
                          className="flex-shrink-0 p-1 text-gray-300 transition-all rounded-lg opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50"
                          title="Delete note"
                        >
                          {deletingNoteId === note.id ? (
                            <span className="block w-4 h-4 border-2 border-red-300 rounded-full border-t-red-500 animate-spin" />
                          ) : (
                            <HiOutlineTrash className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;