"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

function num(formData: FormData, key: string) {
  return parseFloat((formData.get(key) as string) || "0") || 0;
}

function text(formData: FormData, key: string) {
  return ((formData.get(key) as string) ?? "").trim() || null;
}

function parseChild(formData: FormData) {
  const ageRaw = (formData.get("age") as string)?.trim();
  return {
    name: ((formData.get("name") as string) ?? "").trim(),
    age: ageRaw ? parseInt(ageRaw, 10) : null,
    city: text(formData, "city"),
    school_name: text(formData, "school_name"),
    class_name: text(formData, "class_name"),
    monthly_fee: num(formData, "monthly_fee"),
    reason: text(formData, "reason"),
    books_cost: num(formData, "books_cost"),
    clothes_cost: num(formData, "clothes_cost"),
    transport_cost: num(formData, "transport_cost"),
    guardian_contact: text(formData, "guardian_contact"),
    notes: text(formData, "notes"),
  };
}

export async function createChild(formData: FormData): Promise<ActionResult> {
  const child = parseChild(formData);
  if (!child.name) return { ok: false, message: "Name is required." };

  const supabase = createClient();
  const { error } = await supabase.from("children").insert(child);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/children");
  revalidatePath("/");
  return { ok: true, message: `${child.name} added.` };
}

export async function updateChild(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const child = parseChild(formData);
  if (!child.name) return { ok: false, message: "Name is required." };

  const supabase = createClient();
  const { error } = await supabase.from("children").update(child).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/children");
  revalidatePath("/");
  return { ok: true, message: "Changes saved." };
}

export async function deleteChild(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, message: "Missing child id." };

  const supabase = createClient();
  // Payments are removed automatically via ON DELETE CASCADE.
  const { error } = await supabase.from("children").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/children");
  revalidatePath("/");
  return { ok: true, message: "Child deleted." };
}
