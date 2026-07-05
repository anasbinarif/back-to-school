"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import ChildForm from "@/components/ChildForm";
import { createChild } from "@/app/admin/children/actions";

export default function AddChildButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Add child
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add a child">
        <ChildForm
          action={createChild}
          submitLabel="Add child"
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
