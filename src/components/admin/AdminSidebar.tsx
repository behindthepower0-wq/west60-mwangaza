"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Home, Building2, FolderKanban, Wrench,
  Users, Star, Newspaper, Image, Navigation, MessageSquare,
  Search, Settings, UserCog, Activity, ChevronDown, ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Homepage", href: "/admin/homepage", icon: Home },
      { label: "Properties", href: "/admin/properties", icon: Building2 },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Services", href: "/admin/services", icon: Wrench },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "News / Blog", href: "/admin/news", icon: Newspaper },
    ],
  },
  {
    label: "Assets",
    items: [
      { label: "Media Library", href: "/admin/media", icon: Image },
    ],
  },
  {
    label: "Site",
    items: [
      { label: "Navigation", href: "/admin/navigation", icon: Navigation },
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    label: "Access",
    items: [
      { label: "Users", href: "/admin/users", icon: UserCog },
      { label: "Activity Log", href: "/admin/activity", icon: Activity },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-64 z-50 flex flex-col"
      style={{
        background: "linear-gradient(180deg, #081a10 0%, #0f2815 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo area */}
      <div className="p-5 border-b border-white/6">
        <Logo variant="white" size="sm" />
        <p className="text-[10px] text-white/30 mt-1.5 font-medium tracking-wider uppercase pl-0.5">
          Content Management
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => (
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
