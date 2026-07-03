import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";
import ChildForm from "@/components/ChildForm";
import DeleteButton from "@/components/DeleteButton";
import { createChild, deleteChild } from "./actions";
import type { Child } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ChildrenPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("children")
    .select("*")
    .order("name", { ascending: true });
  const children = (data ?? []) as Child[];

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-gray-900">Children</h1>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Add a child</h2>
        <ChildForm action={createChild} submitLabel="Add child" />
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          All children <span className="text-sm font-normal text-gray-400">({children.length})</span>
        </h2>

        {children.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400">
            No children yet. Add one above.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">School</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Guardian</th>
                  <th className="px-4 py-3 text-right font-medium">Monthly Fee</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {children.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.age ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{c.city ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{c.school_name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{c.class_name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{c.guardian_contact ?? "—"}</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {formatCurrency(c.monthly_fee)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/children/${c.id}/edit`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteChild.bind(null, c.id)}
                          confirmText={`Delete ${c.name}? This also removes their payment history.`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
