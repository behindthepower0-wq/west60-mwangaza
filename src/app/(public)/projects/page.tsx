import type { Metadata } from "next";
import prisma from "@/lib/db";
import { ProjectsShowcase } from "@/components/public/ProjectsShowcase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse West 60 Mwangaza Properties projects: residential developments, land projects and commercial properties across Kenya.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project
    .findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        videos: { orderBy: { order: "asc" } },
      },
    })
    .catch(() => []);

  return (
    <>
      <section
        className="relative pt-32 pb-16"
        style={{ background: "var(--color-primary)" }}
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="section-eyebrow mb-4 justify-center">
            <span className="h-px w-8 bg-secondary-400" />
            Projects
            <span className="h-px w-8 bg-secondary-400" />
          </div>
          <h1 className="section-heading-white mb-4">
            Our <span style={{ color: "#c6912b" }}>Projects</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            From ongoing developments to completed landmarks, discover the work
            we&apos;re proud of.
          </p>
        </div>
      </section>

      <section
        className="py-16"
        style={{ background: "var(--color-warm-white)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProjectsShowcase projects={projects} variant="listing" />
        </div>
      </section>
    </>
  );
}
