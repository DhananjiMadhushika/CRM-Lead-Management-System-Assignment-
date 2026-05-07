import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/Providers/AuthProvider";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
} from "react-icons/hi";

const inputCls =
  "w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-400";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block mb-1.5 text-sm font-medium text-gray-700">
      {label}
    </label>
    {children}
  </div>
);

const Settings = () => {
  const { user, refreshUser } = useAuth() as any;
  const token = sessionStorage.getItem("authToken");
  const config = { headers: { Authorization: token } };

  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${user?.id}/profile`,
        { name: profileForm.name.trim(), email: profileForm.email.trim() },
        config
      );
      setProfileSuccess("Profile updated successfully.");
      if (typeof refreshUser === "function") refreshUser();
    } catch (err: any) {
      setProfileError(
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setPasswordLoading(true);
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${user?.id}/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        config
      );
      setPasswordSuccess("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Manage your profile and account security.
        </p>
      </div>

      <div className="grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">

        <div className="p-5 bg-white border border-gray-100 shadow-sm sm:p-6 rounded-2xl">
          <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-100">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-lg font-bold text-white rounded-full sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-violet-500">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-sm text-gray-400 truncate">{user?.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <HiOutlineShieldCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-blue-600 capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <h2 className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-800">
            <HiOutlineUser className="w-4 h-4 text-gray-400" />
            Profile Information
          </h2>

          {profileError && (
            <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl">
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="p-3 mb-4 text-sm border text-emerald-700 border-emerald-200 bg-emerald-50 rounded-xl">
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Field label="Full Name">
              <div className="relative">
                <HiOutlineUser className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  placeholder="Your full name"
                  required
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>
            <Field label="Email Address">
              <div className="relative">
                <HiOutlineMail className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  placeholder="your@email.com"
                  required
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {profileLoading ? (
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

        <div className="p-5 bg-white border border-gray-100 shadow-sm sm:p-6 rounded-2xl">
          <h2 className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-800">
            <HiOutlineLockClosed className="w-4 h-4 text-gray-400" />
            Change Password
          </h2>
          {passwordError && (
            <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-3 mb-4 text-sm border text-emerald-700 border-emerald-200 bg-emerald-50 rounded-xl">
              {passwordSuccess}
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {[
              {
                label: "Current Password",
                field: "currentPassword",
                show: showCurrent,
                toggle: () => setShowCurrent((p) => !p),
              },
              {
                label: "New Password",
                field: "newPassword",
                show: showNew,
                toggle: () => setShowNew((p) => !p),
              },
              {
                label: "Confirm New Password",
                field: "confirmPassword",
                show: showConfirm,
                toggle: () => setShowConfirm((p) => !p),
              },
            ].map(({ label, field, show, toggle }) => (
              <Field key={field} label={label}>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    name={field}
                    type={show ? "text" : "password"}
                    value={(passwordForm as any)[field]}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    placeholder="••••••••"
                    required
                    className={`${inputCls} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={toggle}
                    className="absolute inset-y-0 flex items-center text-gray-400 right-3 hover:text-gray-600"
                  >
                    {show ? (
                      <HiOutlineEyeOff className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </Field>
            ))}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {passwordLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Settings;