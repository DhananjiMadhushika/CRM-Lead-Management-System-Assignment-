import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const inputCls = "w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="block mb-1.5 text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const AddSalesperson = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");
  const config = { headers: { Authorization: token } };

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "salesperson" });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      }, config);
      setSuccess(`${form.role === "admin" ? "Admin" : "Salesperson"} account created successfully!`);
      setForm({ name: "", email: "", password: "", role: "salesperson" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-6 py-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 w-9 h-9 rounded-xl hover:text-gray-800 hover:bg-gray-50"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Team Member</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create a new salesperson or admin account.</p>
        </div>
      </div>

      <div className="max-w-lg p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
        {error && (
          <div className="p-3 mb-6 text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl">{error}</div>
        )}
        {success && (
          <div className="p-3 mb-6 text-sm border text-emerald-700 border-emerald-200 bg-emerald-50 rounded-xl">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Full Name" required>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Smith"
              required
              className={inputCls}
            />
          </Field>

          <Field label="Email" required>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@company.com"
              required
              className={inputCls}
            />
          </Field>

          <Field label="Password" required>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 flex items-center text-gray-400 right-3 hover:text-gray-600"
              >
                {showPassword
                  ? <HiOutlineEyeOff className="w-5 h-5" />
                  : <HiOutlineEye className="w-5 h-5" />
                }
              </button>
            </div>
          </Field>

          <Field label="Role" required>
            <select name="role" value={form.role} onChange={handleChange} className={`${inputCls} cursor-pointer`}>
              <option value="salesperson">Salesperson</option>
              <option value="admin">Admin</option>
            </select>
          </Field>

          <hr className="border-gray-100" />

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isLoading ? (
                <><span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" /> Creating...</>
              ) : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalesperson;