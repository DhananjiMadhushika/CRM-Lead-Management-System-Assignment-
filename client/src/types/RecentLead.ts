export type RecentLead = {
  id: number;
  name: string;
  company: string;
  email: string;
  status: string;
  dealValue: number;
  source: string;
  createdAt: string;
  assignedTo: { id: number; name: string; email: string } | null;

   
  };
