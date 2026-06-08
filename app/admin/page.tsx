import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, toNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [childrenRes, paymentsRes, donationsRes] = await Promise.all([
    supabase.from("children").select("id"),
    supabase.from("payments").select("amount"),
    supabase.from("donations").select("amount"),
  ]);

  const childCount = childrenRes.data?.length ?? 0;
  const totalSpent = (paymentsRes.data ?? []).reduce((s, p) => s + toNumber(p.amount), 0);
  const totalDonated = (donationsRes.data ?? []).reduce((s, d) => s + toNumber(d.amount), 0);
  const balance = totalDonated - totalSpent;

  const stats = [
    { label: "Children", value: String(childCount) },
    { label: "Total Donated", value: formatCurrency(totalDonated) },
    { label: "Total Spent", value: formatCurrency(totalSpent) },
    { label: "Balance", value: formatCurrency(balance) },
  ];

  const actions = [
    { href: "/admin/children", title: "Manage Children", desc: "Add, edit or remove sponsored children." },
    { href: "/admin/payments", title: "Log Payments", desc: "Record monthly fees and one-time payments." },
    { href: "/admin/donations", title: "Log Donations", desc: "Record incoming donations." },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-gray-900">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-lg border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <h2 className="font-semibold text-gray-900">{a.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
