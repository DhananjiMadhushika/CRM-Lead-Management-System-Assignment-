export type Lead = {
  notes: Note[];
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  dealValue: number;
  priority: string;
  
  createdAt: string;

  assignedTo: {
    id: number;
    name: string;
    email: string;
  } | null;
};

export type Note ={
  id: number;
  content: string;
  createdAt: string;
  createdBy: { id: number; name: string };
}
export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Tab = "all" | "mine";

export type LeadFilters = {
  search: string;
  statusFilter: string;
  sourceFilter: string;
  ownerFilter: string;
};

export type LeadsTableHeader = {
  header: string;
  accessor: string;
  classname?: string;
  type?: string;
  hideOnMobile?: boolean;
};