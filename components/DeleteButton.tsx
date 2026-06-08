"use client";

// A small submit button that confirms before performing a delete server action.
export default function DeleteButton({
  label = "Delete",
  confirmText = "Are you sure you want to delete this? This cannot be undone.",
}: {
  label?: string;
  confirmText?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmText)) {
          e.preventDefault();
        }
      }}
      className="text-sm font-medium text-red-600 hover:text-red-700"
    >
      {label}
    </button>
  );
}
