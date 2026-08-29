"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  apiPath: string;
  itemName?: string;
  className?: string;
}

export function DeleteButton({
  id,
  apiPath,
  itemName = "item",
  className = "",
}: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${itemName}?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorText = await res.text();
        alert(errorText || "Failed to delete.");
        return;
      }
      router.refresh();
    } catch {
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors ${className}`}
      title={`Delete ${itemName}`}
    >
      {isDeleting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}
