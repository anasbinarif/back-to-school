import Link from "next/link";
import { signOut } from "@/app/admin/auth-actions";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/children", label: "Children" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/donations", label: "Donations" },
];

export default function AdminNav({ email }: { email?: string | null }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/admin" className="text-sm font-bold text-gray-900">
            Back to School Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {email && <span className="hidden text-xs text-gray-400 sm:inline">{email}</span>}
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            View site
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
