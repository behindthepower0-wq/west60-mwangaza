-- West 60 Mwangaza - Seed Data
-- Run AFTER the schema migration SQL
-- Go to: Supabase Dashboard → SQL Editor → New Query → Run

-- ──── ADMIN USER ────────────────────────────────────────
INSERT INTO users (id, name, email, password, role, status)
VALUES (
  'admin-1',
  'West 60 Admin',
  'admin@west60mwangaza.com',
  '$2b$12$RbWtothZYZedLkH9yrRNeO5rtumfln1bUmoFrlXrzttGYUkUKeHHW',
  'SUPER_ADMIN',
  'ACTIVE'
) ON CONFLICT (email) DO NOTHING;

-- ──── SITE SETTINGS ─────────────────────────────────────
INSERT INTO site_settings (key, value, label) VALUES
  ('company_name', 'West 60 Mwangaza Properties Ltd', 'Company Name'),
  ('company_tagline', 'Creating Spaces. Building Futures.', 'Tagline'),
  ('company_description', 'West 60 Mwangaza Properties Ltd is committed to delivering quality properties that enhance lives and stand the test of time. Your trusted real estate partner across Kenya.', 'Description'),
  ('phone_primary', '0711 400 933', 'Primary Phone'),
  ('email', 'info@west60mwangaza.com', 'Email'),
  ('whatsapp', '0711400933', 'WhatsApp'),
  ('address', 'Repen Complex, Block B, 4th Floor, Suite 412
Katani Rd at the Junction of Katani Rd and Mombasa Rd
Syokimau, Nairobi, Kenya', 'Address'),
  ('working_hours', 'Monday–Friday: 8:00 a.m – 4:30 p.m
Saturday: 9:00 a.m – 1:00 p.m', 'Working Hours'),
  ('facebook_url', 'https://facebook.com', 'Facebook URL'),
  ('instagram_url', '', 'Instagram URL'),
  ('linkedin_url', '', 'LinkedIn URL'),
  ('stat_years', '', 'Years of Experience'),
  ('stat_properties', '', 'Properties Developed'),
  ('stat_clients', '', 'Happy Clients'),
  ('stat_satisfaction', '', 'Client Satisfaction %')
ON CONFLICT (key) DO NOTHING;

-- ──── NAVIGATION ────────────────────────────────────────
INSERT INTO navigation_items (id, label, url, target, sort_order, is_visible, is_external) VALUES
  ('nav-1', 'Home', '/', '_self', 1, true, false),
  ('nav-2', 'About Us', '/about', '_self', 2, true, false),
  ('nav-3', 'Properties', '/properties', '_self', 3, true, false),
  ('nav-5', 'Projects', '/projects', '_self', 5, true, false),
  ('nav-6', 'News', '/news', '_self', 6, true, false),
  ('nav-7', 'Contact Us', '/contact', '_self', 7, true, false)
ON CONFLICT (id) DO NOTHING;

-- ──── SERVICES ──────────────────────────────────────────
INSERT INTO services (id, name, slug, short_description, full_description, icon, sort_order, status) VALUES
  ('svc-land', 'Land Selling', 'land-selling',
   'We offer prime residential and commercial plots across Katani, Kitengela, Joska, Malaa and Kitui, all with ready title deeds.',
   'West 60 Mwangaza Properties specializes in selling genuine land across Kenya fastest-growing corridors. All our plots come with ready, clean title deeds. We offer both residential and commercial plots tailored to fit different budgets and investment goals. Our flexible Lipa Pole Pole payment plan allows you to own property through manageable installments spread over 18 months.',
   'Home', 1, 'PUBLISHED'),
  ('svc-consultancy', 'Real Estate Consultancy', 'real-estate-consultancy',
   'Professional guidance through the entire property buying process, from initial enquiry and site viewing to documentation and final ownership.',
   'Our expert consultants guide you through every step of property acquisition. From understanding your investment goals and budget, to identifying the right property, conducting site visits, reviewing documentation, and completing the transfer process, we are with you at every stage. We ensure you make informed decisions with no surprises.',
   'MessageSquare', 2, 'PUBLISHED'),
  ('svc-sales', 'Sales & Marketing', 'sales-and-marketing',
   'Strategic property marketing for developers and landowners. We connect the right buyers to the right properties through targeted campaigns.',
   'We provide comprehensive sales and marketing services for property developers, landowners and investors. Our team creates targeted marketing campaigns that reach qualified buyers through digital channels, social media, referral networks and on-ground activations. We handle everything from property photography to buyer negotiations.',
   'TrendingUp', 3, 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;

-- ──── CATEGORIES ────────────────────────────────────────
INSERT INTO categories (id, name, slug, description) VALUES
  ('cat-1', 'Real Estate', 'real-estate', 'Real estate news, tips and insights'),
  ('cat-2', 'Investment Tips', 'investment-tips', 'Property investment guides and tips')
ON CONFLICT (slug) DO NOTHING;

-- ──── HOMEPAGE SECTIONS ─────────────────────────────────
INSERT INTO homepage_sections (key, title, content, sort_order, is_visible) VALUES
  ('hero', 'Hero Section',
   '{"eyebrow":"Welcome to West 60 Mwangaza Properties Ltd","heading":"Creating Spaces.","headingGold":"Building Futures.","description":"We develop and manage quality properties that provide lasting value, comfort and exceptional living experiences across Kenya, with ready title deeds and flexible payment plans.","primaryCta":"Explore Properties","primaryCtaUrl":"/properties","secondaryCta":"Contact Us","secondaryCtaUrl":"/contact","backgroundImage":"/images/hero-bg.jpg"}',
   1, true),
  ('statistics', 'Statistics Strip',
   '{"stats":[{"value":"","label":"Years Experience","icon":"Calendar"},{"value":"","label":"Properties","icon":"Building2"},{"value":"","label":"Happy Clients","icon":"Users"},{"value":"","label":"Active Projects","icon":"FolderKanban"}]}',
   2, true),
  ('about', 'About Section',
   '{"eyebrow":"About Us","heading":"Building With Purpose.","headingGold":"Delivering Value.","description":"West 60 Mwangaza Properties Ltd is committed to delivering quality properties that enhance lives and stand the test of time. We specialize in genuine property investments across Kenya fastest-growing corridors.","image":"/images/about-building.jpg","ctaText":"Learn More","ctaUrl":"/about"}',
   3, true),
  ('services', 'Services Section',
   '{"eyebrow":"Our Services","heading":"What We Do"}',
   4, true),
  ('properties', 'Featured Properties',
   '{"eyebrow":"Featured Properties","heading":"Find Your Perfect Space"}',
   5, true),
  ('whychooseus', 'Why Choose Us',
   '{"eyebrow":"Why Choose Us","heading":"We Deliver More Than Properties"}',
   6, true),
  ('projects', 'Projects Section',
   '{"eyebrow":"Our Projects","heading":"Current & Completed Projects"}',
   7, true),
  ('team', 'Team Section',
   '{"eyebrow":"Our Team","heading":"Meet The People Behind The Brand"}',
   8, true),
  ('news', 'News Section',
   '{"eyebrow":"News & Insights","heading":"Latest From Our Blog"}',
   9, true),
  ('cta', 'CTA Banner',
   '{"heading":"Let''s Build Something Great Together","description":"Talk to us today and let''s turn your vision into reality.","primaryCta":"Get In Touch","primaryCtaUrl":"/contact"}',
   10, true)
ON CONFLICT (key) DO NOTHING;

-- ──── PROPERTIES ────────────────────────────────────────
INSERT INTO properties (id, name, slug, property_type, location, area, price, currency, price_label, status, short_description, full_description, land_size, main_image, is_featured, is_published, published_at) VALUES
  ('prop-valleys-gardens', 'Valleys Gardens', 'valleys-gardens', 'RESIDENTIAL', 'Ndovoini, Joska', 'Ndovoini, Joska', 479000, 'KES', 'KES 479,000 · Deposit KES 80,000', 'AVAILABLE',
   'Located in Ndovoini, 7 kms from Joska. 50x100 plots with flexible payment plans of up to 18 months.',
   'Valleys Gardens is located in Ndovoini, 7 kms from Joska. Plots measure 50 x 100 ft and are priced at Kshs. 479,000 with a deposit of Kshs. 80,000. Flexible payment plans of up to 18 months available.',
   464.5, '/images/property-1.jpg', true, true, now()),
  ('prop-celebration-gardens-katani', 'Celebration Gardens Katani', 'celebration-gardens-katani', 'RESIDENTIAL', 'Katani', 'Katani', 4799000, 'KES', 'KES 4,799,000 · Deposit KES 1,000,000', 'AVAILABLE',
   'Located 100 metres from tarmac in Katani. 50x100 plots with flexible payment plans of up to 18 months.',
   'Celebration Gardens Katani is located 100 metres from the tarmac. Plots measure 50 x 100 ft and are priced at Kshs. 4,799,000 with a deposit of Kshs. 1,000,000. Flexible payment plans of up to 18 months available.',
   464.5, '/images/property-2.jpg', true, true, now()),
  ('prop-precious-ridge-katani', 'Precious Ridge Katani', 'precious-ridge-katani', 'RESIDENTIAL', 'Katani', 'Katani', 2899000, 'KES', 'KES 2,899,000 · Deposit KES 500,000', 'AVAILABLE',
   'Located 1km from the tarmac in Katani. 50x100 plots with flexible payment plans of up to 18 months.',
   'Precious Ridge Katani is located 1 km from the tarmac. Plots measure 50 x 100 ft and are priced at Kshs. 2,899,000 with a deposit of Kshs. 500,000. Flexible payment plans of up to 18 months available.',
   464.5, '/images/property-3.jpg', true, true, now())
ON CONFLICT (id) DO NOTHING;

-- Property features
INSERT INTO property_features (id, property_id, feature, sort_order) VALUES
  ('pf-1', 'prop-valleys-gardens', 'Ready title deed', 1),
  ('pf-2', 'prop-valleys-gardens', 'Flexible payment plan up to 18 months', 2),
  ('pf-3', 'prop-valleys-gardens', 'Deposit: Kshs. 80,000', 3),
  ('pf-4', 'prop-valleys-gardens', 'Size: 50 x 100 ft', 4),
  ('pf-5', 'prop-celebration-gardens-katani', '100 metres from tarmac road', 1),
  ('pf-6', 'prop-celebration-gardens-katani', 'Ready title deed', 2),
  ('pf-7', 'prop-celebration-gardens-katani', 'Flexible payment plan up to 18 months', 3),
  ('pf-8', 'prop-celebration-gardens-katani', 'Deposit: Kshs. 1,000,000', 4),
  ('pf-9', 'prop-celebration-gardens-katani', 'Size: 50 x 100 ft', 5),
  ('pf-10', 'prop-precious-ridge-katani', '1 km from tarmac road', 1),
  ('pf-11', 'prop-precious-ridge-katani', 'Ready title deed', 2),
  ('pf-12', 'prop-precious-ridge-katani', 'Flexible payment plan up to 18 months', 3),
  ('pf-13', 'prop-precious-ridge-katani', 'Deposit: Kshs. 500,000', 4),
  ('pf-14', 'prop-precious-ridge-katani', 'Size: 50 x 100 ft', 5)
ON CONFLICT (id) DO NOTHING;

-- ──── TEAM MEMBERS ──────────────────────────────────────
INSERT INTO team_members (id, name, position, biography, photograph, sort_order, is_visible) VALUES
  ('team-1', 'Pamela Mbaabu', 'Chief Executive Officer',
   'Leading West 60 Mwangaza with vision and strategic direction, ensuring the company delivers on its promise of quality properties and exceptional service.',
   '/images/team/pamela-mbaabu.jpg', 1, true),
  ('team-2', 'Daniel Mwangangi', 'Senior Sales Manager',
   'Experienced sales professional with a proven track record in property sales and client relationship management.',
   '/images/team/daniel-mwangangi.jpg', 2, true),
  ('team-3', 'Sylvia Mwangi', 'Senior Sales Manager',
   'Dedicated sales manager specializing in helping clients find their ideal properties across Kenya growing corridors.',
   '/images/team/sylvia-mwangi.jpg', 3, true),
  ('team-4', 'Raymond', 'Senior Sales Manager',
   'Committed to delivering excellent service and matching clients with properties that meet their investment goals.',
   '/images/team/raymond.jpg', 4, true),
  ('team-5', 'Jacinta', 'Senior Sales Manager',
   'Passionate about real estate and helping clients make informed property investment decisions.',
   '/images/team/jacinta.jpg', 5, true),
  ('team-6', 'Esther', 'Senior Sales Manager',
   'Focused on client satisfaction and building long-term relationships through professional property guidance.',
   '/images/team/esther.jpg', 6, true),
  ('team-7', 'Dickson', 'Senior Sales Manager',
   'Results-driven sales manager with expertise in property markets across Katani, Kitengela, and surrounding areas.',
   '/images/team/dickson.jpg', 7, true),
  ('team-8', 'Jackson', 'Senior Sales Manager',
   'Experienced in property sales with deep knowledge of Kenya real estate market and investment opportunities.',
   '/images/team/jackson.jpg', 8, true),
  ('team-9', 'Aphia', 'Front Desk',
   'Welcoming face of West 60 Mwangaza, providing exceptional front-line service and administrative support.',
   '/images/team/aphia.jpg', 9, true)
ON CONFLICT (id) DO NOTHING;
