import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";
import AddDonationButton from "@/components/AddDonationButton";
import DeleteButton from "@/components/DeleteButton";
import { deleteDonation } from "./actions";
import type { Donation } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DonationsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("donations")
    .select("*")
    .order("donation_date", { ascending: false });
  const donations = (data ?? []) as Donation[];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900">Donations</h1>
        <AddDonationButton />
      </div>

      <section>
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Donation log <span className="text-sm font-normal text-gray-400">({donations.length})</span>
        </h2>

        {donations.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400">
            No donations logged yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Donor</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 text-gray-700">{formatDate(d.donation_date)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {d.donor_name || "Anonymous"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{d.notes || "—"}</td>
                    <td className="px-4 py-3 text-right text-emerald-600">
                      {formatCurrency(d.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/donations/${d.id}/edit`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteDonation.bind(null, d.id)}
                          confirmText="Delete this donation?"
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
