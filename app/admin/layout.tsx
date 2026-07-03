import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/AdminNav";
import { ToastProvider } from "@/components/Toast";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The login page renders without chrome. Middleware guards all other
  // /admin routes, so an authenticated user is present here otherwise.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminNav email={user.email} />
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
      </div>
    </ToastProvider>
  );
}
