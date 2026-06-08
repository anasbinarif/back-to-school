import Link from "next/link";
import type { Child } from "@/lib/types";

// Server-rendered form used for both creating and editing a child.
// `action` is a server action bound by the caller.
export default function ChildForm({
  action,
  child,
  submitLabel,
  showCancel = false,
}: {
  action: (formData: FormData) => void | Promise<void>;
  child?: Child;
  submitLabel: string;
  showCancel?: boolean;
}) {
  return (
    <form action={action} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
