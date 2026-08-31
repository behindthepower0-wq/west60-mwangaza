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
import { TrustBadges } from "@/components/public/TrustBadges";
import { AwardsSection } from "@/components/public/AwardsSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "West 60 Mwangaza Properties | Premium Real Estate in Kenya",
  description:
    "West 60 Mwangaza Properties, your trusted partner for quality land and property in Kenya. Ready title deeds, flexible payment plans, free site visits. Katani, Kitengela, Joska, Malaa, Kitui.",
  openGraph: {
    title: "West 60 Mwangaza Properties",
    description: "Premium real estate in Kenya. Land with ready title deeds.",
    url: "/",
  },
};

async function getData() {
  try {
    const [featuredProperties, projects, teamMembers, latestPosts, services, testimonials, heroSection] =
      await Promise.all([
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
        prisma.service.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { order: "asc" },
        }),
        prisma.testimonial.findMany({
          where: { isVisible: true },
          orderBy: { order: "asc" },
          take: 6,
        }),
        prisma.homepageSection.findUnique({
          where: { key: "hero" },
        }),
      ]);

    // Parse hero images from CMS content
    let heroImages: string[] = [];
    if (heroSection?.content) {
      try {
        const content = JSON.parse(heroSection.content);
        heroImages = Array.isArray(content.heroImages) ? content.heroImages : [];
      } catch {
        heroImages = [];
      }
    }

    return { featuredProperties, projects, teamMembers, latestPosts, services, testimonials, heroImages };
  } catch {
    return {
      featuredProperties: [],
      projects: [],
      teamMembers: [],
      latestPosts: [],
      services: [],
      testimonials: [],
      heroImages: [],
    };
  }
}

export default async function HomePage() {
  const { featuredProperties, projects, teamMembers, latestPosts, services, testimonials, heroImages } =
    await getData();

  return (
    <>
      <HeroSection heroImages={heroImages} />
      <TrustBadges />
      <AboutSection />
      <ServicesSection services={services} />
      <FeaturedPropertiesSection properties={featuredProperties} />
      <WhyChooseUsSection />
      <AwardsSection />
      <ProjectsSection projects={projects} />
      <TeamSection teamMembers={teamMembers} />
      <TestimonialsSection testimonials={testimonials} />
      <NewsSection posts={latestPosts} />
    </>
  );
}
