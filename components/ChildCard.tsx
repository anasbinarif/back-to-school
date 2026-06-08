import { formatCurrency, formatDate, toNumber } from "@/lib/format";
import type { Child, Payment } from "@/lib/types";

interface ChildCardProps {
  child: Child;
  payments: Payment[];
}

const TYPE_LABEL: Record<string, string> = {
  monthly_fee: "Monthly Fee",
  one_time: "One-time",
};

export default function ChildCard({ child, payments }: ChildCardProps) {
  const total = payments.reduce((sum, p) => sum + toNumber(p.amount), 0);
  const sorted = [...payments].sort(
    (a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
  );

  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-100 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{child.name}</h3>
            <p className="mt-0.5 text-sm text-gray-500">
              {[
                child.age != null ? `Age ${child.age}` : null,
                child.city,
                child.school_name,
              ]
                .filter(Boolean)
                .join(" · ") || "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-gray-400">Monthly Fee</p>
            <p className="text-base font-medium text-gray-900">
              {formatCurrency(child.monthly_fee)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {sorted.length === 0 ? (
          <p className="text-sm text-gray-400">No payments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 pr-4 text-gray-700">{formatDate(p.payment_date)}</td>
                    <td className="py-2 pr-4 text-gray-700">
                      {TYPE_LABEL[p.payment_type] ?? p.payment_type}
                    </td>
                    <td className="py-2 pr-4 text-gray-500">
                      {p.payment_type === "one_time" ? p.one_time_category || "—" : "—"}
                    </td>
                    <td className="py-2 text-right font-medium text-gray-900">
                      {formatCurrency(p.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3">
        <span className="text-sm text-gray-500">Total spent on {child.name.split(" ")[0]}</span>
        <span className="text-sm font-semibold text-gray-900">{formatCurrency(total)}</span>
      </div>
    </article>
  );
}
