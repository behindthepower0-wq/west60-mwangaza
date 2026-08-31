"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard, Home, Building2, FolderKanban,
  Users, Star, Newspaper, Image, Navigation, MessageSquare,
  Search, Settings, UserCog, Activity, ChevronDown, ChevronRight, X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSidebar } from "./SidebarProvider";

type UserRole = "SUPER_ADMIN" | "ADMINISTRATOR" | "EDITOR" | "CONTENT_STAFF";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 4,
  ADMINISTRATOR: 3,
  EDITOR: 2,
  CONTENT_STAFF: 1,
};

function hasAccess(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

const navGroups = [
  {
    label: "Overview",
    minRole: "CONTENT_STAFF" as UserRole,
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    minRole: "CONTENT_STAFF" as UserRole,
    items: [
      { label: "Homepage", href: "/admin/homepage", icon: Home },
      { label: "Properties", href: "/admin/properties", icon: Building2 },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "News / Blog", href: "/admin/news", icon: Newspaper },
    ],
  },
  {
    label: "Assets",
    minRole: "CONTENT_STAFF" as UserRole,
    items: [
      { label: "Media Library", href: "/admin/media", icon: Image },
    ],
  },
  {
    label: "Site",
    minRole: "EDITOR" as UserRole,
    items: [
      { label: "Navigation", href: "/admin/navigation", icon: Navigation },
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
      { label: "SEO", href: "/admin/seo", icon: Search },
    ],
  },
  {
    label: "System",
    minRole: "SUPER_ADMIN" as UserRole,
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    label: "Access",
    minRole: "SUPER_ADMIN" as UserRole,
    items: [
      { label: "Users", href: "/admin/users", icon: UserCog },
      { label: "Activity Log", href: "/admin/activity", icon: Activity },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { open, close } = useSidebar();
  const { data: session } = useSession();
  const userRole = ((session?.user as { role?: string })?.role || "CONTENT_STAFF") as UserRole;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const visibleGroups = navGroups
    .filter((group) => hasAccess(userRole, group.minRole))
    .map((group) => ({
      ...group,
      items: group.items,
    }));

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen w-64 z-50 flex flex-col transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      style={{
        background: "linear-gradient(180deg, #081a10 0%, #0f2815 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo area */}
      <div className="p-5 border-b border-white/6 flex items-center justify-between">
        <div>
          <Logo variant="white" size="sm" />
          <p className="text-[10px] text-white/30 mt-1.5 font-medium tracking-wider uppercase pl-0.5">
            Content Management
          </p>
        </div>
        <button
          onClick={close}
          className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.15em] px-3 mb-1.5">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        active
                          ? "text-white"
                          : "text-white/45 hover:text-white/80 hover:bg-white/5"
                      )}
                      style={active ? {
                        background: "rgba(198,145,43,0.12)",
                        borderLeft: "2px solid #c6912b",
                        paddingLeft: "10px",
                      } : {}}
                    >
                      <item.icon size={15} className={active ? "text-secondary-400" : ""} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/6">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <ChevronRight size={12} />
          View Public Site
        </Link>
      </div>
    </aside>
  );
}
