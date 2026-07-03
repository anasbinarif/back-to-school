"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import type { ActionResult } from "@/lib/types";

// Confirms, then runs a bound delete server action and shows a toast.
export default function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Are you sure? This cannot be undone.",
}: {
  action: () => Promise<ActionResult>;
  label?: string;
  confirmText?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (!window.confirm(confirmText)) return;
    setPending(true);
    try {
      const res = await action();
      if (res.ok) {
        toast("success", res.message ?? "Deleted.");
        router.refresh();
      } else {
        toast("error", res.message ?? "Delete failed.");
      }
    } catch {
      toast("error", "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}
