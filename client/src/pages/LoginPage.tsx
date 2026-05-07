import { useAuth } from "@/Providers/AuthProvider";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const userID = response.data.user.id;
        

        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("userID", userID);
       
      }

      handleLoginSuccess(() => {
          navigate("/dashboard", { replace: true });
        });
        
    } catch (err: any) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid username or password";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-[#060d1f]">
      <div className="flex w-full max-w-[860px] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/[0.07]">

        {/* ── LEFT SECTION ── */}
        <div className="hidden md:flex flex-col justify-between w-[45%] p-10 bg-gradient-to-br from-[#0d2252] via-[#0a1a3e] to-[#071430] border-r border-white/[0.06]">


          <div className="flex items-center justify-center">
            <img
              src="/crm_logo.png"
              alt="CRM Logo"
              className="object-contain w-40 h-40"
            />
          </div>
          <div>
            <h2 className="text-white font-bold text-[1.75rem] leading-tight mb-4">
              Close more deals with focused, modern lead management.
            </h2>
            <p className="text-sm leading-relaxed text-white/50">
              Track every lead, every conversation without the bloat. Built for small sales teams that move fast.
            </p>

            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {[
                  { initials: "SJ", bg: "bg-violet-600" },
                  { initials: "MC", bg: "bg-blue-600" },
                  { initials: "ED", bg: "bg-cyan-600" },
                ].map(({ initials, bg }) => (
                  <div
                    key={initials}
                    className={`flex items-center justify-center w-8 h-8 text-xs font-semibold text-white rounded-full border-2 border-white/20 ${bg}`}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-white/40 text-[0.8rem]">
                Trusted by 2,400+ sales teams
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT SECTION ── */}
        <div className="flex flex-col justify-center flex-1 p-10 bg-[#f1f3f6]">
          <h1 className="text-gray-900 font-bold text-[1.6rem] mb-1">
            Welcome back
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            Sign in to your workspace to continue.
          </p>

          {error && (
            <div className="p-3 mb-5 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="email"
                className="block mb-1.5 text-sm font-medium text-gray-800"
              >
               Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 text-sm rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-800"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-11 text-sm rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute inset-y-0 flex items-center text-gray-400 transition-colors right-3 hover:text-gray-600"
                >
                  {showPassword
                    ? <AiOutlineEyeInvisible className="w-5 h-5" />
                    : <AiOutlineEye className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 px-4 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <a href="#" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
              Request a demo
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}