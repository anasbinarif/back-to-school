import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";
import PaymentForm from "@/components/PaymentForm";
import DeleteButton from "@/components/DeleteButton";
import { deletePayment } from "./actions";
import type { Child, Payment } from "@/lib/types";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  monthly_fee: "Monthly Fee",
  one_time: "One-time",
};

export default async function PaymentsPage() {
  const supabase = createClient();

  const [childrenRes, paymentsRes] = await Promise.all([
    supabase.from("children").select("*").order("name", { ascending: true }),
    supabase.from("payments").select("*").order("payment_date", { ascending: false }),
  ]);

  const children = (childrenRes.data ?? []) as Child[];
  const payments = (paymentsRes.data ?? []) as Payment[];
  const childName = new Map(children.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-gray-900">Payments</h1>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Log a payment</h2>
        <PaymentForm children={children} />
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Payment log <span className="text-sm font-normal text-gray-400">({payments.length})</span>
        </h2>

        {payments.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400">
            No payments logged yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Child</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 text-gray-700">{formatDate(p.payment_date)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {childName.get(p.child_id) ?? "—"}
                    </td>
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
                    <td className="px-4 py-3 text-right">
                      <form action={deletePayment}>
                        <input type="hidden" name="id" value={p.id} />
                        <DeleteButton confirmText="Delete this payment?" />
                      </form>
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
