import { ReactNode } from "react";

export interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  icon: ReactNode;
  iconBg: string;
}

const StatCard = ({ label, value, delta, deltaPositive, icon, iconBg }: StatCardProps) => (
  <div className="flex flex-col gap-3 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm min-w-[130px] flex-1">
    <div className="flex items-center justify-between">
      <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${iconBg}`}>
        {icon}
      </div>
      {delta && (
        <span className={`text-xs font-semibold ${deltaPositive ? "text-emerald-500" : "text-red-500"}`}>
          {delta}
        </span>
      )}
    </div>
    <div>
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

export default StatCard;