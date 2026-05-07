import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlinePlusCircle,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineUserAdd,
} from "react-icons/hi";
import { useAuth } from "@/Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { icon: HiOutlineViewGrid, label: "Dashboard", href: "/dashboard" },
    { icon: HiOutlineUsers,    label: "Leads",     href: "/leads" },
    { icon: HiOutlinePlusCircle, label: "Add Lead", href: "/leads/new" },
    ...(isAdmin ? [{ icon: HiOutlineUserAdd, label: "Add Member", href: "/team/new" }] : []),
    { icon: HiOutlineCog, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex flex-col flex-1 w-full px-3 mt-6 overflow-y-auto">

      <div className="flex flex-col gap-0.5 mb-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              to={item.href}
              key={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-white/50"}`} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="pb-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
        >
          <HiOutlineLogout className="flex-shrink-0 w-5 h-5" />
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Menu;