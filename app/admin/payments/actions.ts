"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPayment(formData: FormData) {
  const supabase = createClient();

  const paymentType = formData.get("payment_type") as string;
  const child_id = formData.get("child_id") as string;
  const amount = parseFloat((formData.get("amount") as string) || "0") || 0;
  const payment_date = formData.get("payment_date") as string;

  if (!child_id || !payment_date) return;

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

  const { error } = await supabase.from("payments").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/payments");
  revalidatePath("/");
}

export async function deletePayment(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;
  if (!id) return;

  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/payments");
  revalidatePath("/");
}
