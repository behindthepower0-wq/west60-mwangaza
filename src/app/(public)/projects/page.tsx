import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/db";
import { ProjectCard } from "@/components/public/ProjectCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse West 60 Mwangaza Properties projects — residential developments, land projects and commercial properties across Kenya.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  }).catch(() => []);

  const ongoing = projects.filter(p => p.status === "ONGOING");
  const completed = projects.filter(p => p.status === "COMPLETED");
  const other = projects.filter(p => !["ONGOING", "COMPLETED"].includes(p.status));

  return (
    <>
      <section className="relative pt-32 pb-16" style={{ background: "var(--color-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-eyebrow justify-center mb-4">
            <span className="w-8 h-px bg-secondary-400" />Projects<span className="w-8 h-px bg-secondary-400" />
          </div>
          <h1 className="section-heading-white mb-4">Our <span style={{ color: "#C9A84C" }}>Projects</span></h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            From ongoing developments to completed landmarks — discover the work we&apos;re proud of.
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--color-warm-white)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {ongoing.length > 0 && (
            <div>
              <h2 className="section-heading text-2xl mb-8">Ongoing Projects</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoing.map(p => <ProjectCard key={p.id} project={p} />)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="section-heading text-2xl mb-8">Completed Projects</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completed.map(p => <ProjectCard key={p.id} project={p} />)}
              </div>
            </div>
          )}
          {other.length > 0 && (
            <div>
              <h2 className="section-heading text-2xl mb-8">Other Projects</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {other.map(p => <ProjectCard key={p.id} project={p} />)}
              </div>
            </div>
          )}
          {projects.length === 0 && (
            <div className="text-center py-24 rounded-3xl bg-white">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold text-primary-700 mb-2" style={{ fontFamily: "var(--font-serif)" }}>Projects Coming Soon</h3>
              <p className="text-gray-500 text-sm mb-6">Our project portfolio is being set up. Contact us for details.</p>
              <Link href="/contact" className="btn-primary">Contact Us</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
