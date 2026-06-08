"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createDonation(formData: FormData) {
  const supabase = createClient();

  const amount = parseFloat((formData.get("amount") as string) || "0") || 0;
  const donation_date = formData.get("donation_date") as string;
  if (!donation_date) return;

  const payload = {
    donor_name: ((formData.get("donor_name") as string) ?? "").trim() || null,
    amount,
    donation_date,
    notes: ((formData.get("notes") as string) ?? "").trim() || null,
  };

  const { error } = await supabase.from("donations").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/donations");
  revalidatePath("/");
}

export async function deleteDonation(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;
  if (!id) return;

  const { error } = await supabase.from("donations").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/donations");
  revalidatePath("/");
}
