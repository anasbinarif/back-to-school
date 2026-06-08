// Shared formatting helpers. All currency is PKR; all dates are DD/MM/YYYY.

const pkr = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number | string | null | undefined): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (value == null || Number.isNaN(value)) return pkr.format(0);
  return pkr.format(value);
}

// Accepts a Date, an ISO timestamp, or a YYYY-MM-DD string and returns DD/MM/YYYY.
export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return "—";
  let date: Date;
  if (input instanceof Date) {
    date = input;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    // Plain date — parse as local to avoid timezone shifting the day.
    const [y, m, d] = input.split("-").map(Number);
    date = new Date(y, m - 1, d);
  } else {
    date = new Date(input);
  }
  if (Number.isNaN(date.getTime())) return "—";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function toNumber(value: number | string | null | undefined): number {
  const n = typeof value === "string" ? parseFloat(value) : value ?? 0;
  return Number.isNaN(n) ? 0 : n;
}
