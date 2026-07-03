import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PaymentForm from "@/components/PaymentForm";
import { updatePayment } from "../../actions";
import type { Child, Payment } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPaymentPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [paymentRes, childrenRes] = await Promise.all([
    supabase.from("payments").select("*").eq("id", params.id).single(),
    supabase.from("children").select("*").order("name", { ascending: true }),
  ]);

  if (!paymentRes.data) notFound();
  const payment = paymentRes.data as Payment;
  const children = (childrenRes.data ?? []) as Child[];

  const action = updatePayment.bind(null, payment.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/payments" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to payments
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">Edit payment</h1>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <PaymentForm
          children={children}
          payment={payment}
          action={action}
          submitLabel="Save changes"
          redirectTo="/admin/payments"
        />
      </section>
    </div>
  );
}
