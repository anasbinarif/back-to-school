"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import type { ActionResult, Child } from "@/lib/types";

// Form used for both creating and editing a child. `action` is a server action
// bound by the caller. On success it toasts and either resets (create) or
// navigates to `redirectTo` (edit).
export default function ChildForm({
  action,
  child,
  submitLabel,
  showCancel = false,
  redirectTo,
  onSuccess,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  child?: Child;
  submitLabel: string;
  showCancel?: boolean;
  redirectTo?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);

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
    <form
      ref={formRef}
      action={handleSubmit}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={child?.name ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          min="0"
          defaultValue={child?.age ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="monthly_fee" className="block text-sm font-medium text-gray-700">
          Monthly Fee (PKR)
        </label>
        <input
          id="monthly_fee"
          name="monthly_fee"
          type="number"
          min="0"
          step="0.01"
          defaultValue={child?.monthly_fee ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <input
          id="city"
          name="city"
          defaultValue={child?.city ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="school_name" className="block text-sm font-medium text-gray-700">
          School
        </label>
        <input
          id="school_name"
          name="school_name"
          defaultValue={child?.school_name ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="class_name" className="block text-sm font-medium text-gray-700">
          Class
        </label>
        <input
          id="class_name"
          name="class_name"
          placeholder="e.g. 5, KG, Matric"
          defaultValue={child?.class_name ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="guardian_contact" className="block text-sm font-medium text-gray-700">
          Guardian contact number
        </label>
        <input
          id="guardian_contact"
          name="guardian_contact"
          type="tel"
          placeholder="e.g. 03001234567"
          defaultValue={child?.guardian_contact ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="responsible" className="block text-sm font-medium text-gray-700">
          Responsible
        </label>
        <input
          id="responsible"
          name="responsible"
          placeholder="Person responsible for this child"
          defaultValue={child?.responsible ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="sm:col-span-2">
        <p className="mt-2 text-sm font-medium text-gray-700">Estimated costs (PKR)</p>
        <p className="text-xs text-gray-400">One-off needs beyond the monthly fee.</p>
      </div>

      <div>
        <label htmlFor="books_cost" className="block text-sm font-medium text-gray-700">
          Books
        </label>
        <input
          id="books_cost"
          name="books_cost"
          type="number"
          min="0"
          step="0.01"
          defaultValue={child?.books_cost ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="clothes_cost" className="block text-sm font-medium text-gray-700">
          Clothes / uniform
        </label>
        <input
          id="clothes_cost"
          name="clothes_cost"
          type="number"
          min="0"
          step="0.01"
          defaultValue={child?.clothes_cost ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="transport_cost" className="block text-sm font-medium text-gray-700">
          Transport
        </label>
        <input
          id="transport_cost"
          name="transport_cost"
          type="number"
          min="0"
          step="0.01"
          defaultValue={child?.transport_cost ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason they can&apos;t afford school
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          defaultValue={child?.reason ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes <span className="font-normal text-gray-400">(internal, not shown publicly)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={child?.notes ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {submitLabel}
        </button>
        {showCancel && (
          <Link
            href="/admin/children"
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
