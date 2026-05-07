import { RecentLead } from "./RecentLead";
import { TopSalesperson } from "./TopSalesperson";

export type DashboardStats = {
    totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  proposalSentLeads: number;
  wonLeads: number;
  lostLeads: number;
  totalDealValue: number;
  totalWonValue: number;
  bySource: Record<string, number>;
  recentLeads: RecentLead[];
  topSalespeople: TopSalesperson[];
   
  };
