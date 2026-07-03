import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DonationForm from "@/components/DonationForm";
import { updateDonation } from "../../actions";
import type { Donation } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditDonationPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("donations")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) notFound();
  const donation = data as Donation;

  const action = updateDonation.bind(null, donation.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/donations" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to donations
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">Edit donation</h1>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <DonationForm
          donation={donation}
          action={action}
          submitLabel="Save changes"
          redirectTo="/admin/donations"
        />
      </section>
    </div>
  );
}
