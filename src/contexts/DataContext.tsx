import React, { createContext, useContext, useState, ReactNode } from "react";
import { Customer, Collection, Agent, ChitType, mockCustomers, mockCollections, mockAgents } from "@/data/mockData";

interface DataContextType {
  customers: Customer[];
  collections: Collection[];
  agents: Agent[];
  addCustomer: (customer: Omit<Customer, "id" | "status" | "paidDays" | "totalPaidAmount">) => void;
  addCollection: (collection: Omit<Collection, "id">) => void;
  updateCustomerPayment: (customerId: string, amount: number, daysPaid: number) => void;
  getCustomersByAgent: (agentId: string) => Customer[];
  getCollectionsByAgent: (agentId: string) => Collection[];
  getTodaysCollections: () => Collection[];
  calculateDueAmount: (customer: Customer) => number;
  getRemainingAmount: (customer: Customer) => number;
  getRemainingDays: (customer: Customer) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [agents] = useState<Agent[]>(mockAgents);

  const addCustomer = (customerData: Omit<Customer, "id" | "status" | "paidDays" | "totalPaidAmount">) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `C${String(customers.length + 1).padStart(3, "0")}`,
      status: "active",
      paidDays: 0,
      totalPaidAmount: 0,
    };
    setCustomers((prev) => [...prev, newCustomer]);
  };

  const addCollection = (collectionData: Omit<Collection, "id">) => {
    const newCollection: Collection = {
      ...collectionData,
      id: `COL${String(collections.length + 1).padStart(3, "0")}`,
    };
    setCollections((prev) => [...prev, newCollection]);
    
    // Update customer payment info
    updateCustomerPayment(collectionData.customerId, collectionData.amount, collectionData.daysPaid);
  };

  const updateCustomerPayment = (customerId: string, amount: number, daysPaid: number) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              paidDays: customer.paidDays + daysPaid,
              totalPaidAmount: customer.totalPaidAmount + amount,
              lastPaymentDate: new Date().toISOString().split("T")[0],
              status: customer.paidDays + daysPaid >= customer.totalDays ? "completed" : customer.status,
            }
          : customer
      )
    );
  };

  const getCustomersByAgent = (agentId: string): Customer[] => {
    return customers.filter((c) => c.agentId === agentId);
  };

  const getCollectionsByAgent = (agentId: string): Collection[] => {
    return collections.filter((c) => c.agentId === agentId);
  };

  const getTodaysCollections = (): Collection[] => {
    const today = new Date().toISOString().split("T")[0];
    return collections.filter((c) => c.date === today);
  };

  const calculateDueAmount = (customer: Customer): number => {
    const dailyAmount = customer.chitValue / customer.totalDays;
    const daysSinceStart = Math.floor(
      (new Date().getTime() - new Date(customer.startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const expectedPaidDays = Math.min(daysSinceStart, customer.totalDays);
    const expectedAmount = expectedPaidDays * dailyAmount;
    return Math.max(0, expectedAmount - customer.totalPaidAmount);
  };

  const getRemainingAmount = (customer: Customer): number => {
    return customer.chitValue - customer.totalPaidAmount;
  };

  const getRemainingDays = (customer: Customer): number => {
    return customer.totalDays - customer.paidDays;
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        collections,
        agents,
        addCustomer,
        addCollection,
        updateCustomerPayment,
        getCustomersByAgent,
        getCollectionsByAgent,
        getTodaysCollections,
        calculateDueAmount,
        getRemainingAmount,
        getRemainingDays,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
