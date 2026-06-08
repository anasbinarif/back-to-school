import { formatCurrency } from "@/lib/format";

interface SummaryBarProps {
  totalDonated: number;
  totalSpent: number;
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="flex-1 rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tracking-tight ${accent}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}

export default function SummaryBar({ totalDonated, totalSpent }: SummaryBarProps) {
  const balance = totalDonated - totalSpent;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Stat label="Total Donated" value={totalDonated} accent="text-emerald-600" />
      <Stat label="Total Spent" value={totalSpent} accent="text-gray-900" />
      <Stat
        label="Balance Remaining"
        value={balance}
        accent={balance >= 0 ? "text-blue-600" : "text-red-600"}
      />
    </div>
  );
}
