import Menu from "@/components/Menu/Menu";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f6fb]">

      {/* ── Sidebar ── */}
      <div className="flex flex-col w-[72px] lg:w-[200px] xl:w-[220px] flex-shrink-0 bg-[#0a1a3e] border-r border-white/[0.06]">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.06]"
        >
        
         <div className="flex items-center justify-center">
            <img
              src="/crm_logo.png"
              alt="CRM Logo"
              className="object-contain h-21 w-21"
            />
          </div>
        </Link>

        {/* Navigation Menu */}
        <Menu />
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}