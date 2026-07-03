import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChildForm from "@/components/ChildForm";
import { updateChild } from "../../actions";
import type { Child } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditChildPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("children")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) notFound();
  const child = data as Child;

  // Bind the child id to the update server action.
  const action = updateChild.bind(null, child.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/children" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to children
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">Edit {child.name}</h1>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <ChildForm
          action={action}
          child={child}
          submitLabel="Save changes"
          showCancel
          redirectTo="/admin/children"
        />
      </section>
    </div>
  );
}
