import { statusses } from "~/lib/constants";

export interface Client {
  companyName: string;
  contactName: string | null;
  email: string;
  phone: string | null;
  id: number;
}

export interface Payment {
  id: number;
  projectId: number;
  amount: number;
  date: string | null;
  paymentType: string;
  recurringFrequency?: string | null;
  paymentStatus: number;
}

export interface Project {
  id: number;
  clientId: number;
  name: string;
  description?: string | null;
  notes?: string | null;
  startDate: string | null; // Allow null
  endDate: string | null; // Allow null
}
