"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { createDonation } from "@/app/admin/donations/actions";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function DonationForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(formData: FormData) {
    await createDonation(formData);
    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div>
        <label htmlFor="donor_name" className="block text-sm font-medium text-gray-700">
          Donor name
        </label>
        <input
          id="donor_name"
          name="donor_name"
          placeholder="Optional (anonymous)"
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
          defaultValue={today}
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea id="notes" name="notes" rows={2} className={inputClass} />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Log donation
        </button>
      </div>
    </form>
  );
}
