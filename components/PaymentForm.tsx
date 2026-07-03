"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPayment } from "@/app/admin/payments/actions";
import { useToast } from "@/components/Toast";
import type { Child } from "@/lib/types";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function PaymentForm({ children }: { children: Child[] }) {
  const router = useRouter();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [paymentType, setPaymentType] = useState<"monthly_fee" | "one_time">("monthly_fee");
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(formData: FormData) {
    try {
      const res = await createPayment(formData);
      if (res.ok) {
        toast("success", res.message ?? "Payment logged.");
        formRef.current?.reset();
        // Reset the type back to default; router.refresh re-renders the log.
        setPaymentType("monthly_fee");
        router.refresh();
      } else {
        toast("error", res.message ?? "Something went wrong.");
      }
    } catch {
      toast("error", "Something went wrong. Please try again.");
    }
  }

  if (children.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Add a child first before logging a payment.
      </p>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="child_id" className="block text-sm font-medium text-gray-700">
          Child <span className="text-red-500">*</span>
        </label>
        <select id="child_id" name="child_id" required className={inputClass}>
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          id="payment_type"
          name="payment_type"
          required
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value as "monthly_fee" | "one_time")}
          className={inputClass}
        >
          <option value="monthly_fee">Monthly Fee</option>
          <option value="one_time">One-time</option>
        </select>
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

      {paymentType === "one_time" && (
        <div>
          <label
            htmlFor="one_time_category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            id="one_time_category"
            name="one_time_category"
            placeholder="uniform, books, admission…"
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          id="payment_date"
          name="payment_date"
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
          Log payment
        </button>
      </div>
    </form>
  );
}
