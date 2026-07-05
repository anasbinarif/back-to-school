"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createDonation } from "@/app/admin/donations/actions";
import { useToast } from "@/components/Toast";
import type { ActionResult, Donation } from "@/lib/types";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

// Handles both logging a new donation and editing an existing one.
// - create: no `donation`, uses createDonation, resets on success.
// - edit: pass `donation` + bound `action` + `redirectTo`; navigates on success.
export default function DonationForm({
  donation,
  action = createDonation,
  submitLabel = "Log donation",
  redirectTo,
  onSuccess,
}: {
  donation?: Donation;
  action?: (formData: FormData) => Promise<ActionResult>;
  submitLabel?: string;
  redirectTo?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(formData: FormData) {
    try {
      const res = await action(formData);
      if (res.ok) {
        toast("success", res.message ?? "Saved.");
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          formRef.current?.reset();
          router.refresh();
          onSuccess?.();
        }
      } else {
        toast("error", res.message ?? "Something went wrong.");
      }
    } catch {
      toast("error", "Something went wrong. Please try again.");
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="donor_name" className="block text-sm font-medium text-gray-700">
          Donor name
        </label>
        <input
          id="donor_name"
          name="donor_name"
          placeholder="Optional (anonymous)"
          defaultValue={donation?.donor_name ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount (PKR) <span className="text-red-500">*</span>
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={donation?.amount ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="donation_date" className="block text-sm font-medium text-gray-700">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          id="donation_date"
          name="donation_date"
          type="date"
          required
          defaultValue={donation?.donation_date ?? today}
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={donation?.notes ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {submitLabel}
        </button>
        {redirectTo && (
          <Link
            href={redirectTo}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
