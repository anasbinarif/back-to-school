"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export async function createDonation(formData: FormData): Promise<ActionResult> {
  const amount = parseFloat((formData.get("amount") as string) || "0") || 0;
  const donation_date = formData.get("donation_date") as string;
  if (!donation_date) return { ok: false, message: "Date is required." };

  const payload = {
    donor_name: ((formData.get("donor_name") as string) ?? "").trim() || null,
    amount,
    donation_date,
    notes: ((formData.get("notes") as string) ?? "").trim() || null,
  };

  const supabase = createClient();
  const { error } = await supabase.from("donations").insert(payload);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/donations");
  revalidatePath("/");
  return { ok: true, message: "Donation logged." };
}

export async function deleteDonation(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, message: "Missing donation id." };

  const supabase = createClient();
  const { error } = await supabase.from("donations").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/donations");
  revalidatePath("/");
  return { ok: true, message: "Donation deleted." };
}
