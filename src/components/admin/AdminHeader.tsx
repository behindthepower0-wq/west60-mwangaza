"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";

interface AdminHeaderProps {
  user: Session["user"];
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white flex-shrink-0 shadow-sm"
    >
      <div>
        <h1 className="text-sm font-semibold text-gray-700">West 60 Mwangaza CMS</h1>
        <p className="text-xs text-gray-400">Content Management System</p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
        >
          <ExternalLink size={13} />
          Public Site
        </Link>

        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #1A3A2A, #2D5A3D)" }}>
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-700 leading-tight">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-gray-400 leading-tight">{(user as { role?: string })?.role || "Administrator"}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
