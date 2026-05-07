import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { User } from "@/types/Leads";


interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  dealValue: string;
  assignedToId: string;
  priority: string;
}

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "PROPOSAL_SENT", label: "Proposal Sent" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
];

const SOURCE_OPTIONS = [
  { value: "WEBSITE", label: "Website" },
  { value: "REFERRAL", label: "Referral" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "COLD_CALL", label: "Cold Call" },
  { value: "COLD_EMAIL", label: "Cold Email" },
  { value: "EMAIL", label: "Email" },
  { value: "EVENT", label: "Event" },
  { value: "OTHER", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block mb-1.5 text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

const selectCls = `${inputCls} cursor-pointer`;

const EditLead = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("authToken");

  const config = {
    headers: {
      Authorization: token,
    },
  };

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "NEW",
    source: "WEBSITE",
    dealValue: "",
    assignedToId: "",
    priority: "MEDIUM",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/leads/${id}`, config),
          axios.get("http://localhost:5000/api/users", config),
        ]);

        const lead = leadRes.data;

        setForm({
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          company: lead.company || "",
          status: lead.status || "NEW",
          source: lead.source || "WEBSITE",
          dealValue: lead.dealValue
            ? String(lead.dealValue)
            : "",
          assignedToId: lead.assignedToId
            ? String(lead.assignedToId)
            : "",
          priority: lead.priority || "MEDIUM",
        });

        setUsers(usersRes.data);
      } catch (err) {
        setError("Failed to load lead data");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const payload: Record<string, any> = {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        status: form.status,
        source: form.source,
        priority: form.priority,
      };

      if (form.phone.trim()) {
        payload.phone = form.phone.trim();
      }

      if (form.dealValue.trim()) {
        payload.dealValue = parseFloat(form.dealValue);
      }

      if (form.assignedToId) {
        payload.assignedToId = parseInt(form.assignedToId);
      }

      await axios.put(
        `http://localhost:5000/api/leads/${id}`,
        payload,
        config
      );

      navigate(`/leads/${id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update lead."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6fb]">
        <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(`/leads/${id}`)}
            className="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 w-9 h-9 rounded-xl hover:text-gray-800 hover:bg-gray-50"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Lead
            </h1>

            <p className="mt-0.5 text-sm text-gray-500">
              Update lead information below.
            </p>
          </div>
        </div>
        <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
          {error && (
            <div className="p-3 mb-6 text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" required>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="Company">
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email" required>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </Field>

              <Field label="Phone">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Status" required>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={selectCls}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Source" required>
                <select
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  className={selectCls}
                >
                  {SOURCE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Priority">
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={selectCls}
                >
                  {PRIORITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Deal Value ($)">
                <input
                  name="dealValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.dealValue}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>

              <Field label="Assign To">
                <select
                  name="assignedToId"
                  value={form.assignedToId}
                  onChange={handleChange}
                  className={selectCls}
                >
                  <option value="">Unassigned</option>

                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <hr className="border-gray-100" />

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate(`/leads/${id}`)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLead;