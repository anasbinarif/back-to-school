import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, toNumber } from "@/lib/format";
import AddPaymentButton from "@/components/AddPaymentButton";
import type { Child, Payment } from "@/lib/types";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  monthly_fee: "Monthly Fee",
  one_time: "One-time",
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value || "—"}</dd>
    </div>
  );
}

export default async function ChildDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [childRes, paymentsRes] = await Promise.all([
    supabase.from("children").select("*").eq("id", params.id).single(),
    supabase
      .from("payments")
      .select("*")
      .eq("child_id", params.id)
      .order("payment_date", { ascending: false }),
  ]);

  if (!childRes.data) notFound();
  const child = childRes.data as Child;
  const payments = (paymentsRes.data ?? []) as Payment[];

  const totalSpent = payments.reduce((sum, p) => sum + toNumber(p.amount), 0);
  const oneOffTotal =
    toNumber(child.books_cost) +
    toNumber(child.clothes_cost) +
    toNumber(child.transport_cost);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/children" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to children
          </Link>
          <h1 className="mt-2 text-xl font-bold text-gray-900">{child.name}</h1>
        </div>
        <Link
          href={`/admin/children/${child.id}/edit`}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Edit
        </Link>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Details</h2>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Age" value={child.age != null ? String(child.age) : ""} />
          <Field label="Class" value={child.class_name} />
          <Field label="City" value={child.city} />
          <Field label="School" value={child.school_name} />
          <Field label="Guardian contact" value={child.guardian_contact} />
          <Field label="Responsible" value={child.responsible} />
          <Field label="Monthly fee" value={formatCurrency(child.monthly_fee)} />
          <Field label="Books cost" value={formatCurrency(child.books_cost)} />
          <Field label="Clothes cost" value={formatCurrency(child.clothes_cost)} />
          <Field label="Transport cost" value={formatCurrency(child.transport_cost)} />
          <Field label="One-off costs total" value={formatCurrency(oneOffTotal)} />
          <Field label="Added on" value={formatDate(child.created_at)} />
        </dl>

        {(child.reason || child.notes) && (
          <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">
            {child.reason && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-400">
                  Reason they can&apos;t afford school
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                  {child.reason}
                </dd>
              </div>
            )}
            {child.notes && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-400">
                  Notes <span className="normal-case text-gray-300">(internal)</span>
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                  {child.notes}
                </dd>
              </div>
            )}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">
            Payment history{" "}
            <span className="text-sm font-normal text-gray-400">({payments.length})</span>
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              Total spent:{" "}
              <span className="font-semibold text-gray-900">{formatCurrency(totalSpent)}</span>
            </p>
            <AddPaymentButton children={[child]} />
          </div>
        </div>

        {payments.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400">
            No payments recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 text-gray-700">{formatDate(p.payment_date)}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {TYPE_LABEL[p.payment_type] ?? p.payment_type}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {p.payment_type === "one_time" ? p.one_time_category || "—" : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.notes || "—"}</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {formatCurrency(p.amount)}
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
