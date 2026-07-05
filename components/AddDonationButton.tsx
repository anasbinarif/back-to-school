"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import DonationForm from "@/components/DonationForm";

export default function AddDonationButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Log donation
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Log a donation">
        <DonationForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}
