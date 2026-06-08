"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function parseChild(formData: FormData) {
  const ageRaw = (formData.get("age") as string)?.trim();
  return {
    name: ((formData.get("name") as string) ?? "").trim(),
    age: ageRaw ? parseInt(ageRaw, 10) : null,
    city: ((formData.get("city") as string) ?? "").trim() || null,
    school_name: ((formData.get("school_name") as string) ?? "").trim() || null,
    monthly_fee: parseFloat((formData.get("monthly_fee") as string) || "0") || 0,
  };
}

export async function createChild(formData: FormData) {
  const supabase = createClient();
  const child = parseChild(formData);
  if (!child.name) return;

  const { error } = await supabase.from("children").insert(child);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/children");
  revalidatePath("/");
}

export async function updateChild(id: string, formData: FormData) {
  const supabase = createClient();
  const child = parseChild(formData);
  if (!child.name) return;

  const { error } = await supabase.from("children").update(child).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/children");
  revalidatePath("/");
  redirect("/admin/children");
}

export async function deleteChild(formData: FormData) {
  const supabase = createClient();
  const id = formData.get("id") as string;
  if (!id) return;

  // Payments are removed automatically via ON DELETE CASCADE.
  const { error } = await supabase.from("children").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/children");
  revalidatePath("/");
}
