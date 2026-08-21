import type { Metadata } from "next";
import Link from "next/link";
import { Building2, FolderKanban, MessageSquare, Users, Newspaper, TrendingUp, ArrowRight } from "lucide-react";
import prisma from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard — CMS" };

export default async function AdminDashboardPage() {
  const [propertyCount, projectCount, newEnquiries, totalEnquiries, teamCount, postCount] =
    await Promise.all([
      prisma.property.count().catch(() => 0),
      prisma.project.count().catch(() => 0),
      prisma.enquiry.count({ where: { status: "NEW" } }).catch(() => 0),
      prisma.enquiry.count().catch(() => 0),
      prisma.teamMember.count().catch(() => 0),
      prisma.post.count().catch(() => 0),
    ]);

  const recentEnquiries = await prisma.enquiry.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { property: { select: { name: true } } },
  }).catch(() => []);

  const stats = [
    { label: "Properties", value: propertyCount, icon: Building2, href: "/admin/properties", color: "#1A3A2A" },
    { label: "Projects", value: projectCount, icon: FolderKanban, href: "/admin/projects", color: "#2D5A3D" },
    { label: "New Enquiries", value: newEnquiries, icon: MessageSquare, href: "/admin/enquiries", color: newEnquiries > 0 ? "#C9A84C" : "#6B7280", badge: newEnquiries > 0 },
    { label: "Team Members", value: teamCount, icon: Users, href: "/admin/team", color: "#4B5563" },
    { label: "Articles", value: postCount, icon: Newspaper, href: "/admin/news", color: "#374151" },
    { label: "Total Enquiries", value: totalEnquiries, icon: TrendingUp, href: "/admin/enquiries", color: "#6B7280" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: "var(--font-serif)" }}>Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back. Here&apos;s what&apos;s happening on your site.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="admin-card hover:shadow-md transition-shadow group relative overflow-hidden">
            {stat.badge && (
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}15` }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-medium text-gray-400 group-hover:text-primary-600 transition-colors">
              View all <ArrowRight size={11} />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-700 text-sm" style={{ fontFamily: "var(--font-serif)" }}>Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-xs text-primary-600 hover:text-secondary-600 transition-colors font-medium flex items-center gap-1">
              All enquiries <ArrowRight size={11} />
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No enquiries yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map(e => (
                <div key={e.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "var(--color-primary)" }}>
                    {e.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-700 truncate">{e.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${e.status === "NEW" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                        {e.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{e.property?.name || e.subject || e.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card">
          <h2 className="font-bold text-gray-700 text-sm mb-4" style={{ fontFamily: "var(--font-serif)" }}>Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Add New Property", href: "/admin/properties/new", icon: Building2 },
              { label: "Add New Project", href: "/admin/projects/new", icon: FolderKanban },
              { label: "Write an Article", href: "/admin/news/new", icon: Newspaper },
              { label: "Add Team Member", href: "/admin/team/new", icon: Users },
              { label: "View Website", href: "/", icon: TrendingUp },
            ].map(action => (
              <Link key={action.href} href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 group transition-colors">
                <action.icon size={16} className="text-primary-400 group-hover:text-primary-600 transition-colors" />
                <span className="text-sm text-gray-600 group-hover:text-primary-700 transition-colors font-medium">{action.label}</span>
                <ArrowRight size={12} className="ml-auto text-gray-300 group-hover:text-primary-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
