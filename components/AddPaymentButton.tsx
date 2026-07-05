"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import PaymentForm from "@/components/PaymentForm";
import type { Child } from "@/lib/types";

export default function AddPaymentButton({ children }: { children: Child[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Log payment
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Log a payment">
        <PaymentForm children={children} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}
