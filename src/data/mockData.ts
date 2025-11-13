export type ChitType = "daily" | "weekly" | "monthly";

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  chitType: ChitType;
  chitValue: number;
  totalDays: number;
  startDate: string;
  agentId: string;
  status: "active" | "completed" | "overdue";
  paidDays: number;
  totalPaidAmount: number;
  lastPaymentDate?: string;
}

export interface Agent {
  id: string;
  name: string;
  mobile: string;
  status: "active" | "inactive";
}

export interface Collection {
  id: string;
  customerId: string;
  agentId: string;
  date: string;
  amount: number;
  daysPaid: number;
  notes?: string;
  isPartial: boolean;
}

export const mockAgents: Agent[] = [
  { id: "A001", name: "Rajesh Kumar", mobile: "9876543210", status: "active" },
  { id: "A002", name: "Priya Singh", mobile: "9876543211", status: "active" },
  { id: "A003", name: "Amit Patel", mobile: "9876543212", status: "active" },
];

export const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "Suresh Babu",
    mobile: "9988776655",
    address: "123 Main St, Chennai",
    chitType: "daily",
    chitValue: 10000,
    totalDays: 100,
    startDate: "2025-01-01",
    agentId: "A001",
    status: "active",
    paidDays: 45,
    totalPaidAmount: 4500,
    lastPaymentDate: "2025-11-09",
  },
  {
    id: "C002",
    name: "Lakshmi Devi",
    mobile: "9988776656",
    address: "456 Park Ave, Chennai",
    chitType: "weekly",
    chitValue: 5200,
    totalDays: 52,
    startDate: "2025-02-01",
    agentId: "A001",
    status: "active",
    paidDays: 20,
    totalPaidAmount: 2000,
    lastPaymentDate: "2025-11-03",
  },
  {
    id: "C003",
    name: "Venkat Raman",
    mobile: "9988776657",
    address: "789 Lake Rd, Chennai",
    chitType: "monthly",
    chitValue: 12000,
    totalDays: 12,
    startDate: "2025-01-15",
    agentId: "A001",
    status: "overdue",
    paidDays: 8,
    totalPaidAmount: 8000,
    lastPaymentDate: "2025-09-15",
  },
  {
    id: "C004",
    name: "Meena Kumari",
    mobile: "9988776658",
    address: "321 Hill St, Chennai",
    chitType: "daily",
    chitValue: 5000,
    totalDays: 50,
    startDate: "2025-03-01",
    agentId: "A002",
    status: "active",
    paidDays: 30,
    totalPaidAmount: 3000,
    lastPaymentDate: "2025-11-08",
  },
  {
    id: "C005",
    name: "Kumar Swamy",
    mobile: "9988776659",
    address: "654 Beach Rd, Chennai",
    chitType: "daily",
    chitValue: 10000,
    totalDays: 100,
    startDate: "2025-01-20",
    agentId: "A002",
    status: "completed",
    paidDays: 100,
    totalPaidAmount: 10000,
    lastPaymentDate: "2025-04-30",
  },
];

export const mockCollections: Collection[] = [
  // Today's collections
  {
    id: "COL001",
    customerId: "C001",
    agentId: "A001",
    date: new Date().toISOString().split("T")[0],
    amount: 100,
    daysPaid: 1,
    notes: "Morning collection",
    isPartial: false,
  },
  {
    id: "COL002",
    customerId: "C002",
    agentId: "A001",
    date: new Date().toISOString().split("T")[0],
    amount: 100,
    daysPaid: 1,
    notes: "",
    isPartial: false,
  },
  {
    id: "COL003",
    customerId: "C004",
    agentId: "A002",
    date: new Date().toISOString().split("T")[0],
    amount: 100,
    daysPaid: 1,
    notes: "",
    isPartial: false,
  },
  // Recent collections
  {
    id: "COL004",
    customerId: "C001",
    agentId: "A001",
    date: "2025-11-12",
    amount: 100,
    daysPaid: 1,
    notes: "",
    isPartial: false,
  },
  {
    id: "COL005",
    customerId: "C002",
    agentId: "A001",
    date: "2025-11-11",
    amount: 100,
    daysPaid: 1,
    notes: "",
    isPartial: false,
  },
  {
    id: "COL006",
    customerId: "C004",
    agentId: "A002",
    date: "2025-11-12",
    amount: 100,
    daysPaid: 1,
    notes: "",
    isPartial: false,
  },
  {
    id: "COL007",
    customerId: "C001",
    agentId: "A001",
    date: "2025-11-10",
    amount: 200,
    daysPaid: 2,
    notes: "",
    isPartial: false,
  },
  {
    id: "COL008",
    customerId: "C005",
    agentId: "A002",
    date: "2025-11-09",
    amount: 100,
    daysPaid: 1,
    notes: "",
    isPartial: false,
  },
];

// Helper functions
export const getCustomersByAgent = (agentId: string): Customer[] => {
  return mockCustomers.filter((c) => c.agentId === agentId);
};

export const getCollectionsByAgent = (agentId: string): Collection[] => {
  return mockCollections.filter((c) => c.agentId === agentId);
};

export const getTodaysCollections = (): Collection[] => {
  const today = new Date().toISOString().split("T")[0];
  return mockCollections.filter((c) => c.date === today);
};

export const calculateDueAmount = (customer: Customer): number => {
  const dailyAmount = customer.chitValue / customer.totalDays;
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(customer.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const expectedPaidDays = Math.min(daysSinceStart, customer.totalDays);
  const expectedAmount = expectedPaidDays * dailyAmount;
  return Math.max(0, expectedAmount - customer.totalPaidAmount);
};

export const getRemainingAmount = (customer: Customer): number => {
  return customer.chitValue - customer.totalPaidAmount;
};

export const getRemainingDays = (customer: Customer): number => {
  return customer.totalDays - customer.paidDays;
};
