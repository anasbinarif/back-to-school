import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { toNumber } from "@/lib/format";
import SummaryBar from "@/components/SummaryBar";
import ChildCard from "@/components/ChildCard";
import type { Child, Donation, Payment } from "@/lib/types";

// Always render fresh data so the public page reflects the latest entries.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();

  const [childrenRes, paymentsRes, donationsRes] = await Promise.all([
    supabase.from("children").select("*").order("name", { ascending: true }),
    supabase.from("payments").select("*"),
    supabase.from("donations").select("*"),
  ]);

  const children = (childrenRes.data ?? []) as Child[];
  const payments = (paymentsRes.data ?? []) as Payment[];
  const donations = (donationsRes.data ?? []) as Donation[];

  const loadError = childrenRes.error || paymentsRes.error || donationsRes.error;

  const totalDonated = donations.reduce((sum, d) => sum + toNumber(d.amount), 0);
  const totalSpent = payments.reduce((sum, p) => sum + toNumber(p.amount), 0);

  const paymentsByChild = new Map<string, Payment[]>();
  for (const p of payments) {
    const list = paymentsByChild.get(p.child_id) ?? [];
    list.push(p);
    paymentsByChild.set(p.child_id, list);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Back to School</h1>
          <p className="mt-1 text-sm text-gray-500">
            Transparent tracking of school sponsorship payments for children in Pakistan.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Admin →
        </Link>
      </header>

      {loadError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Data is temporarily unavailable. Please check back shortly.
        </div>
      ) : (
        <>
          <section className="mb-10">
            <SummaryBar totalDonated={totalDonated} totalSpent={totalSpent} />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Sponsored Children
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({children.length})
              </span>
            </h2>

            {children.length === 0 ? (
              <p className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-400">
                No children have been added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {children.map((child) => (
                  <ChildCard
                    key={child.id}
                    child={child}
                    payments={paymentsByChild.get(child.id) ?? []}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <footer className="mt-12 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
        All amounts in PKR · Updated in real time
      </footer>
    </main>
  );
}
