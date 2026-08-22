import type { Metadata } from "next";
import prisma from "@/lib/db";
import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { FeaturedPropertiesSection } from "@/components/public/PropertyCard";
import { ProjectsSection } from "@/components/public/ProjectCard";
import { WhyChooseUsSection } from "@/components/public/WhyChooseUsSection";
import { TeamSection } from "@/components/public/TeamSection";
import { NewsSection } from "@/components/public/NewsSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "West 60 Mwangaza Properties — Premium Real Estate in Kenya",
  description:
    "West 60 Mwangaza Properties — your trusted partner for quality land and property in Kenya. Ready title deeds, flexible payment plans, free site visits. Katani, Kitengela, Joska, Malaa, Kitui.",
  openGraph: {
    title: "West 60 Mwangaza Properties",
    description: "Premium real estate in Kenya. Land with ready title deeds.",
    url: "/",
  },
};

async function getData() {
  try {
    const [services, featuredProperties, projects, teamMembers, latestPosts] =
      await Promise.all([
        prisma.service.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { order: "asc" },
          take: 4,
        }),
        prisma.property.findMany({
          where: { isFeatured: true, isPublished: true },
          orderBy: { createdAt: "desc" },
          take: 6,
          include: { images: { orderBy: { order: "asc" }, take: 1 } },
        }),
        prisma.project.findMany({
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
          take: 3,
          include: { images: { orderBy: { order: "asc" }, take: 1 } },
        }),
        prisma.teamMember.findMany({
          where: { isVisible: true },
          orderBy: { order: "asc" },
          take: 8,
        }),
        prisma.post.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { publishedAt: "desc" },
          take: 3,
          include: { category: true, author: true },
        }),
      ]);

    return { services, featuredProperties, projects, teamMembers, latestPosts };
  } catch {
    return {
      services: [],
      featuredProperties: [],
      projects: [],
      teamMembers: [],
      latestPosts: [],
    };
  }
}

export default async function HomePage() {
  const { services, featuredProperties, projects, teamMembers, latestPosts } =
    await getData();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection services={services} />
      <FeaturedPropertiesSection properties={featuredProperties} />
      <WhyChooseUsSection />
      <ProjectsSection projects={projects} />
      <TeamSection teamMembers={teamMembers} />
      <NewsSection posts={latestPosts} />
    </>
  );
}
