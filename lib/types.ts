export type PaymentType = "monthly_fee" | "one_time";

// Result returned by admin server actions so the client can show a toast.
export type ActionResult = { ok: boolean; message?: string };

export interface Child {
  id: string;
  name: string;
  age: number | null;
  city: string | null;
  school_name: string | null;
  class_name: string | null;
  monthly_fee: number;
  reason: string | null;
  books_cost: number;
  clothes_cost: number;
  transport_cost: number;
  guardian_contact: string | null;
  responsible: string | null;
  notes: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  child_id: string;
  amount: number;
  payment_type: PaymentType;
  one_time_category: string | null;
  payment_date: string;
  notes: string | null;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string | null;
  amount: number;
  donation_date: string;
  notes: string | null;
  created_at: string;
}
