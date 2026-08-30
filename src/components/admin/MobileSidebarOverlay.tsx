"use client";

import { useSidebar } from "./SidebarProvider";

export function MobileSidebarOverlay() {
  const { open, close } = useSidebar();

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={close}
      aria-hidden="true"
    />
  );
}
