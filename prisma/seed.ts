import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import path from "node:path";

const adapter = new PrismaBetterSqlite3({ url: path.join(process.cwd(), "prisma", "west60.db") });
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("🌱 Seeding West 60 Mwangaza database...");

  // ─── SUPER ADMIN USER ───
  const hashedPassword = await hash("West60Admin@2026", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@west60mwangaza.com" },
    update: {},
    create: {
      name: "West 60 Admin",
      email: "admin@west60mwangaza.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ─── SITE SETTINGS (verified info) ───
  const settings = [
    { key: "company_name", value: "West 60 Mwangaza Properties Ltd", label: "Company Name" },
    { key: "company_tagline", value: "Creating Spaces. Building Futures.", label: "Tagline" },
    { key: "company_description", value: "West 60 Mwangaza Properties Ltd is committed to delivering quality properties that enhance lives and stand the test of time. Your trusted real estate partner across Kenya.", label: "Description" },
    { key: "phone_primary", value: "0711 400 933", label: "Primary Phone" },
    { key: "phone_secondary", value: "0701 303 501", label: "Secondary Phone" },
    { key: "email", value: "info@west60mwangaza.com", label: "Email" },
    { key: "whatsapp", value: "0711400933", label: "WhatsApp" },
    { key: "address", value: "Repen Complex, Block B, 4th Floor, Suite 412\nKatani Rd & Mombasa Rd, Syokimau\nNairobi, Kenya", label: "Address" },
    { key: "working_hours", value: "Monday–Friday: 8:00 AM – 6:00 PM\nSaturday: 9:00 AM – 4:00 PM", label: "Working Hours" },
    { key: "facebook_url", value: "https://facebook.com", label: "Facebook URL" },
    { key: "instagram_url", value: "", label: "Instagram URL" },
    { key: "linkedin_url", value: "", label: "LinkedIn URL" },
    { key: "stat_years", value: "", label: "Years of Experience" },
    { key: "stat_properties", value: "", label: "Properties Developed" },
    { key: "stat_clients", value: "", label: "Happy Clients" },
    { key: "stat_satisfaction", value: "", label: "Client Satisfaction %" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("✅ Site settings seeded");

  // ─── NAVIGATION ───
  const navItems = [
    { label: "Home", url: "/", order: 1 },
    { label: "About Us", url: "/about", order: 2 },
    { label: "Properties", url: "/properties", order: 3 },
    { label: "Services", url: "/services", order: 4 },
    { label: "Projects", url: "/projects", order: 5 },
    { label: "News", url: "/news", order: 6 },
    { label: "Contact Us", url: "/contact", order: 7 },
  ];

  for (const item of navItems) {
    await prisma.navigationItem.upsert({
      where: { id: `nav-${item.order}` },
      update: {},
      create: { id: `nav-${item.order}`, ...item },
    });
  }
  console.log("✅ Navigation seeded");

  // ─── SERVICES (verified from website) ───
  const services = [
    {
      id: "svc-land",
      name: "Land Selling",
      slug: "land-selling",
      shortDescription: "We offer prime residential and commercial plots across Katani, Kitengela, Joska, Malaa and Kitui, all with ready title deeds.",
      fullDescription: "West 60 Mwangaza Properties specializes in selling genuine land across Kenya's fastest-growing corridors. All our plots come with ready, clean title deeds. We offer both residential and commercial plots tailored to fit different budgets and investment goals. Our flexible Lipa Pole Pole payment plan allows you to own property through manageable installments spread over 18 months.",
      icon: "Home",
      order: 1,
      status: "PUBLISHED" as const,
    },
    {
      id: "svc-consultancy",
      name: "Real Estate Consultancy",
      slug: "real-estate-consultancy",
      shortDescription: "Professional guidance through the entire property buying process, from initial enquiry and site viewing to documentation and final ownership.",
      fullDescription: "Our expert consultants guide you through every step of property acquisition. From understanding your investment goals and budget, to identifying the right property, conducting site visits, reviewing documentation, and completing the transfer process, we are with you at every stage. We ensure you make informed decisions with no surprises.",
      icon: "MessageSquare",
      order: 2,
      status: "PUBLISHED" as const,
    },
    {
      id: "svc-sales",
      name: "Sales & Marketing",
      slug: "sales-and-marketing",
      shortDescription: "Strategic property marketing for developers and landowners. We connect the right buyers to the right properties through targeted campaigns.",
      fullDescription: "We provide comprehensive sales and marketing services for property developers, landowners and investors. Our team creates targeted marketing campaigns that reach qualified buyers through digital channels, social media, referral networks and on-ground activations. We handle everything from property photography to buyer negotiations.",
      icon: "TrendingUp",
      order: 3,
      status: "PUBLISHED" as const,
    },

  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: service,
    });
  }
  console.log("✅ Services seeded");

  // ─── BLOG CATEGORY ───
  await prisma.category.upsert({
    where: { slug: "real-estate" },
    update: {},
    create: {
      name: "Real Estate",
      slug: "real-estate",
      description: "Real estate news, tips and insights",
    },
  });
  await prisma.category.upsert({
    where: { slug: "investment-tips" },
    update: {},
    create: {
      name: "Investment Tips",
      slug: "investment-tips",
      description: "Property investment guides and tips",
    },
  });
  console.log("✅ Categories seeded");

  // ─── HOMEPAGE SECTIONS ───
  const homepageSections = [
    {
      key: "hero",
      title: "Hero Section",
      content: JSON.stringify({
        eyebrow: "Welcome to West 60 Mwangaza Properties Ltd",
        heading: "Creating Spaces.",
        headingGold: "Building Futures.",
        description: "We develop and manage quality properties that provide lasting value, comfort and exceptional living experiences across Kenya, with ready title deeds and flexible payment plans.",
        primaryCta: "Explore Properties",
        primaryCtaUrl: "/properties",
        secondaryCta: "Contact Us",
        secondaryCtaUrl: "/contact",
        backgroundImage: "/images/hero-bg.jpg",
      }),
      order: 1,
      isVisible: true,
    },
    {
      key: "statistics",
      title: "Statistics Strip",
      content: JSON.stringify({
        stats: [
          { value: "", label: "Years Experience", icon: "Calendar" },
          { value: "", label: "Properties", icon: "Building2" },
          { value: "", label: "Happy Clients", icon: "Users" },
          { value: "", label: "Active Projects", icon: "FolderKanban" },
        ],
      }),
      order: 2,
      isVisible: true,
    },
    {
      key: "about",
      title: "About Section",
      content: JSON.stringify({
        eyebrow: "About Us",
        heading: "Building With Purpose.",
        headingGold: "Delivering Value.",
        description: "West 60 Mwangaza Properties Ltd is committed to delivering quality properties that enhance lives and stand the test of time. We specialize in genuine property investments across Kenya's fastest-growing corridors.",
        image: "/images/about-building.jpg",
        ctaText: "Learn More",
        ctaUrl: "/about",
      }),
      order: 3,
      isVisible: true,
    },
    {
      key: "services",
      title: "Services Section",
      content: JSON.stringify({ eyebrow: "Our Services", heading: "What We Do" }),
      order: 4,
      isVisible: true,
    },
    {
      key: "properties",
      title: "Featured Properties",
      content: JSON.stringify({ eyebrow: "Featured Properties", heading: "Find Your Perfect Space" }),
      order: 5,
      isVisible: true,
    },
    {
      key: "whychooseus",
      title: "Why Choose Us",
      content: JSON.stringify({ eyebrow: "Why Choose Us", heading: "We Deliver More Than Properties" }),
      order: 6,
      isVisible: true,
    },
    {
      key: "projects",
      title: "Projects Section",
      content: JSON.stringify({ eyebrow: "Our Projects", heading: "Current & Completed Projects" }),
      order: 7,
      isVisible: true,
    },
    {
      key: "team",
      title: "Team Section",
      content: JSON.stringify({ eyebrow: "Our Team", heading: "Meet The People Behind The Brand" }),
      order: 8,
      isVisible: true,
    },
    {
      key: "news",
      title: "News Section",
      content: JSON.stringify({ eyebrow: "News & Insights", heading: "Latest From Our Blog" }),
      order: 9,
      isVisible: true,
    },
    {
      key: "cta",
      title: "CTA Banner",
      content: JSON.stringify({
        heading: "Let's Build Something Great Together",
        description: "Talk to us today and let's turn your vision into reality.",
        primaryCta: "Get In Touch",
        primaryCtaUrl: "/contact",
      }),
      order: 10,
      isVisible: true,
    },
  ];

  for (const section of homepageSections) {
    await prisma.homepageSection.upsert({
      where: { key: section.key },
      update: {},
      create: section,
    });
  }
  console.log("✅ Homepage sections seeded");

  // ─── PROPERTIES ───
  const properties = [
    {
      id: "prop-valleys-gardens",
      name: "Valleys Gardens",
      slug: "valleys-gardens",
      propertyType: "RESIDENTIAL" as const,
      location: "Ndovoini, Joska",
      area: "Ndovoini, Joska",
      price: 479000,
      currency: "KES",
      priceLabel: "KES 479,000 · Deposit KES 80,000",
      status: "AVAILABLE" as const,
      shortDescription: "Located in Ndovoini, 7 kms from Joska. 50x100 plots with flexible payment plans of up to 18 months.",
      fullDescription: "Valleys Gardens is located in Ndovoini, 7 kms from Joska. Plots measure 50 x 100 ft and are priced at Kshs. 479,000 with a deposit of Kshs. 80,000. Flexible payment plans of up to 18 months available.",
      landSize: 464.5,
      mainImage: "/images/property-1.jpg",
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
      features: {
        create: [
          { feature: "Ready title deed", order: 1 },
          { feature: "Flexible payment plan up to 18 months", order: 2 },
          { feature: "Deposit: Kshs. 80,000", order: 3 },
          { feature: "Size: 50 x 100 ft", order: 4 },
        ],
      },
    },
    {
      id: "prop-celebration-gardens-katani",
      name: "Celebration Gardens Katani",
      slug: "celebration-gardens-katani",
      propertyType: "RESIDENTIAL" as const,
      location: "Katani",
      area: "Katani",
      price: 4799000,
      currency: "KES",
      priceLabel: "KES 4,799,000 · Deposit KES 1,000,000",
      status: "AVAILABLE" as const,
      shortDescription: "Located 100 metres from tarmac in Katani. 50x100 plots with flexible payment plans of up to 18 months.",
      fullDescription: "Celebration Gardens Katani is located 100 metres from the tarmac. Plots measure 50 x 100 ft and are priced at Kshs. 4,799,000 with a deposit of Kshs. 1,000,000. Flexible payment plans of up to 18 months available.",
      landSize: 464.5,
      mainImage: "/images/property-2.jpg",
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
      features: {
        create: [
          { feature: "100 metres from tarmac road", order: 1 },
          { feature: "Ready title deed", order: 2 },
          { feature: "Flexible payment plan up to 18 months", order: 3 },
          { feature: "Deposit: Kshs. 1,000,000", order: 4 },
          { feature: "Size: 50 x 100 ft", order: 5 },
        ],
      },
    },
    {
      id: "prop-precious-ridge-katani",
      name: "Precious Ridge Katani",
      slug: "precious-ridge-katani",
      propertyType: "RESIDENTIAL" as const,
      location: "Katani",
      area: "Katani",
      price: 2899000,
      currency: "KES",
      priceLabel: "KES 2,899,000 · Deposit KES 500,000",
      status: "AVAILABLE" as const,
      shortDescription: "Located 1km from the tarmac in Katani. 50x100 plots with flexible payment plans of up to 18 months.",
      fullDescription: "Precious Ridge Katani is located 1 km from the tarmac. Plots measure 50 x 100 ft and are priced at Kshs. 2,899,000 with a deposit of Kshs. 500,000. Flexible payment plans of up to 18 months available.",
      landSize: 464.5,
      mainImage: "/images/property-3.jpg",
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date(),
      features: {
        create: [
          { feature: "1 km from tarmac road", order: 1 },
          { feature: "Ready title deed", order: 2 },
          { feature: "Flexible payment plan up to 18 months", order: 3 },
          { feature: "Deposit: Kshs. 500,000", order: 4 },
          { feature: "Size: 50 x 100 ft", order: 5 },
        ],
      },
    },
  ];

  for (const property of properties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: {},
      create: property,
    });
  }
  console.log("✅ Properties seeded");

  // ─── TEAM MEMBERS ───
  const teamMembers = [
    {
      id: "team-1",
      name: "Pamela Mbaabu",
      position: "Chief Executive Officer",
      biography: "Leading West 60 Mwangaza with vision and strategic direction, ensuring the company delivers on its promise of quality properties and exceptional service.",
      qualifications: "",
      photograph: "/images/team/pamela-mbaabu.jpg",
      facebookUrl: "",
      linkedinUrl: "",
      order: 1,
      isVisible: true,
    },
    {
      id: "team-2",
      name: "Daniel Mwangangi",
      position: "Senior Sales Manager",
      biography: "Experienced sales professional with a proven track record in property sales and client relationship management.",
      qualifications: "",
      photograph: "/images/team/daniel-mwangangi.jpg",
      facebookUrl: "",
      linkedinUrl: "",
      order: 2,
      isVisible: true,
    },
    {
      id: "team-3",
      name: "Sylvia Mwangi",
      position: "Senior Sales Manager",
      biography: "Dedicated sales manager specializing in helping clients find their ideal properties across Kenya's growing corridors.",
      qualifications: "",
      photograph: "/images/team/sylvia-mwangi.jpg",
      facebookUrl: "",
      linkedinUrl: "",
      order: 3,
      isVisible: true,
    },
    {
      id: "team-4",
      name: "Raymond",
      position: "Senior Sales Manager",
      biography: "Committed to delivering excellent service and matching clients with properties that meet their investment goals.",
      qualifications: "",
      photograph: "/images/team/raymond.jpg",
      facebookUrl: "",
      linkedinUrl: "",
      order: 4,
      isVisible: true,
    },
    {
      id: "team-5",
      name: "Jacinta",
      position: "Senior Sales Manager",
      biography: "Passionate about real estate and helping clients make informed property investment decisions.",
      qualifications: "",
      photograph: "/images/team/jacinta.jpg",
      facebookUrl: "",
      linkedinUrl: "",
      order: 5,
      isVisible: true,
    },
    {
      id: "team-6",
      name: "Esther",
      position: "Senior Sales Manager",
      biography: "Focused on client satisfaction and building long-term relationships through professional property guidance.",
      qualifications: "",
      photograph: "/images/team/esther.jpg",
      facebookUrl: "",
      linkedinUrl: "",
      order: 6,
      isVisible: true,
    },
    {
      id: "team-7",
      name: "Dickson",
      position: "Senior Sales Manager",
      biography: "Results-driven sales manager with expertise in property markets across Katani, Kitengela, and surrounding areas.",
      qualifications: "",
      photograph: "/images/team/dickson.jpg",
      facebookUrl: "",
      linkedinUrl: "",
      order: 7,
      isVisible: true,
    },
    {
      id: "team-8",
      name: "Jackson",
      position: "Senior Sales Manager",
      biography: "Experienced in property sales with deep knowledge of Kenya's real estate market and investment opportunities.",
      qualifications: "",
      photograph: "/images/team/jackson.jpg",
      facebookUrl: "",
      linkedinUrl: "",
      order: 8,
      isVisible: true,
    },
    {
      id: "team-9",
      name: "Aphia",
      position: "Front Desk",
      biography: "Welcoming face of West 60 Mwangaza, providing exceptional front-line service and administrative support.",
      qualifications: "",
      photograph: "/images/team/aphia.jpg",
      facebookUrl: "",
      linkedinUrl: "",
      order: 9,
      isVisible: true,
    },
  ];

  const keepIds = teamMembers.map((m) => m.id);
  await prisma.teamMember.deleteMany({ where: { id: { notIn: keepIds } } });

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {},
      create: member,
    });
  }
  console.log("✅ Team members seeded");

  console.log("\n🎉 Database seeded successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Admin login: admin@west60mwangaza.com");
  console.log("  Password:    West60Admin@2026");
  console.log("  URL:         http://localhost:3000/admin");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("⚠️  CHANGE THE DEFAULT PASSWORD IMMEDIATELY after first login!");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
