import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Providers/AuthProvider";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineBadgeCheck,
  HiOutlineTrendingUp,
  HiOutlineXCircle,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
  HiOutlinePlus,
} from "react-icons/hi";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { DashboardStats } from "@/types/DashboardStats";

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}k`
    : `${n}`;

const STATUS_COLORS: Record<string, string> = {
  NEW:           "#3b82f6",
  CONTACTED:     "#8b5cf6",
  QUALIFIED:     "#06b6d4",
  PROPOSAL_SENT: "#f59e0b",
  WON:           "#10b981",
  LOST:          "#ef4444",
};

const Dashboard = () => {
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const { user }              = useAuth();
  const navigate              = useNavigate();
  const token                 = sessionStorage.getItem("authToken");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/dashboard/stats", {
        headers: { Authorization: token },
      });
      setStats(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
    else { setLoading(false); setError("No authentication token found"); }
  }, []);

  const pieData = stats
    ? [
        { name: "New",       value: stats.newLeads,          color: STATUS_COLORS.NEW },
        { name: "Contacted", value: stats.contactedLeads,    color: STATUS_COLORS.CONTACTED },
        { name: "Qualified", value: stats.qualifiedLeads,    color: STATUS_COLORS.QUALIFIED },
        { name: "Proposal",  value: stats.proposalSentLeads, color: STATUS_COLORS.PROPOSAL_SENT },
        { name: "Won",       value: stats.wonLeads,          color: STATUS_COLORS.WON },
        { name: "Lost",      value: stats.lostLeads,         color: STATUS_COLORS.LOST },
      ].filter((d) => d.value > 0)
    : [];

  const sourceData = stats
    ? Object.entries(stats.bySource).map(([source, count]) => ({
        name:  source.charAt(0) + source.slice(1).toLowerCase(),
        leads: count,
      }))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <button onClick={fetchStats} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-6 py-6 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Welcome back, {user?.name ?? "there"}
          </p>
        </div>
        <button
          onClick={() => navigate("/leads/new")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <HiOutlinePlus className="w-4 h-4" />
          New Lead
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <StatCard label="Total Leads"    value={stats?.totalLeads ?? 0}         delta="+12.4%" deltaPositive icon={<HiOutlineUsers className="w-5 h-5 text-blue-600" />}          iconBg="bg-blue-50" />
        <StatCard label="New Leads"      value={stats?.newLeads ?? 0}           delta={`+${stats?.newLeads ?? 0}`} deltaPositive icon={<HiOutlineUserAdd className="w-5 h-5 text-violet-600" />}       iconBg="bg-violet-50" />
        <StatCard label="Qualified"      value={stats?.qualifiedLeads ?? 0}     delta="+8.1%" deltaPositive icon={<HiOutlineBadgeCheck className="w-5 h-5 text-cyan-600" />}       iconBg="bg-cyan-50" />
        <StatCard label="Won"            value={stats?.wonLeads ?? 0}           delta={`+${stats?.wonLeads ?? 0}`} deltaPositive icon={<HiOutlineTrendingUp className="w-5 h-5 text-emerald-600" />}    iconBg="bg-emerald-50" />
        <StatCard label="Lost"           value={stats?.lostLeads ?? 0}          delta={stats?.lostLeads ? `-${stats.lostLeads}` : undefined} deltaPositive={false} icon={<HiOutlineXCircle className="w-5 h-5 text-red-500" />}          iconBg="bg-red-50" />
        <StatCard label="Pipeline Value" value={fmt(stats?.totalDealValue ?? 0)} delta="+18%" deltaPositive icon={<HiOutlineCurrencyDollar className="w-5 h-5 text-amber-600" />}   iconBg="bg-amber-50" />
        <StatCard label="Won Value"      value={fmt(stats?.totalWonValue ?? 0)} delta="+24%" deltaPositive icon={<HiOutlineChartBar className="w-5 h-5 text-blue-600" />}          iconBg="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="p-6 bg-white border border-gray-100 shadow-sm lg:col-span-2 rounded-2xl">
          <h2 className="text-base font-semibold text-gray-800">Pipeline activity</h2>
          <p className="text-xs text-gray-400 mt-0.5">Leads by source</p>
          <div className="h-64 mt-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="leads" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h2 className="text-base font-semibold text-gray-800">Status breakdown</h2>
          <p className="text-xs text-gray-400 mt-0.5">Leads by current stage</p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-500">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-700">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="p-6 bg-white border border-gray-100 shadow-sm lg:col-span-2 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Recent Leads</h2>
              <p className="text-xs text-gray-400 mt-0.5">Latest 5 added leads</p>
            </div>
            <button onClick={() => navigate("/leads")} className="text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700">
              View all →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Name", "Company", "Status", "Value", "Assigned"].map((h) => (
                    <th key={h} className="pb-3 text-xs font-semibold tracking-wider text-left text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(stats?.recentLeads ?? []).map((lead) => (
                  <tr key={lead.id} className="transition-colors cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/leads/${lead.id}`)}>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-gray-800">{lead.name}</div>
                      <div className="text-xs text-gray-400">{lead.email}</div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{lead.company || "—"}</td>
                    <td className="py-3 pr-4"><StatusBadge status={lead.status} /></td>
                    <td className="py-3 pr-4 font-semibold text-right text-gray-800">{lead.dealValue ? fmt(lead.dealValue) : "—"}</td>
                    <td className="py-3 text-xs text-gray-500">{lead.assignedTo?.name ?? "Unassigned"}</td>
                  </tr>
                ))}
                {(stats?.recentLeads ?? []).length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-sm text-center text-gray-400">No leads yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800">Top Salespeople</h2>
            <p className="text-xs text-gray-400 mt-0.5">By won deal value</p>
          </div>
          <div className="space-y-4">
            {(stats?.topSalespeople ?? []).map((person, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white rounded-full w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{person.name}</p>
                  <p className="text-xs text-gray-400">{person.wonDeals} deals</p>
                </div>
                <span className="text-sm font-bold text-emerald-600">{fmt(person.wonValue)}</span>
              </div>
            ))}
            {(stats?.topSalespeople ?? []).length === 0 && (
              <p className="py-4 text-sm text-center text-gray-400">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;