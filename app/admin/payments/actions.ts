"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export async function createPayment(formData: FormData): Promise<ActionResult> {
  const paymentType = formData.get("payment_type") as string;
  const child_id = formData.get("child_id") as string;
  const amount = parseFloat((formData.get("amount") as string) || "0") || 0;
  const payment_date = formData.get("payment_date") as string;

  if (!child_id || !payment_date) {
    return { ok: false, message: "Child and date are required." };
  }

  const payload = {
    child_id,
    amount,
    payment_type: paymentType === "one_time" ? "one_time" : "monthly_fee",
    one_time_category:
      paymentType === "one_time"
        ? ((formData.get("one_time_category") as string) ?? "").trim() || null
        : null,
    payment_date,
    notes: ((formData.get("notes") as string) ?? "").trim() || null,
  };

  const supabase = createClient();
  const { error } = await supabase.from("payments").insert(payload);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/payments");
  revalidatePath("/");
  return { ok: true, message: "Payment logged." };
}

export async function deletePayment(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, message: "Missing payment id." };

  const supabase = createClient();
  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/payments");
  revalidatePath("/");
  return { ok: true, message: "Payment deleted." };
}
