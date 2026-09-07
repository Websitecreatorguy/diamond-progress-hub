export const SITE_URL = "https://diamond-progress-hub.lovable.app";
export const SITE_NAME = "Christian Yoo Web Design";
export const SITE_TAGLINE =
  "Modern, affordable websites for local businesses.";

export const CONTACT = {
  primaryEmail: "yoochristian11@gmail.com",
  secondaryEmail: "christianyoo21@gmail.com",
  phone: "310-707-7941",
  phoneHref: "tel:+13107077941",
  smsHref: "sms:+13107077941",
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: string;
};

export const SERVICES: Service[] = [
  {
    slug: "business-websites",
    title: "Business Websites",
    description:
      "A clear, professional home online: who you are, what you do, and how customers reach you.",
    icon: "Building2",
  },
  {
    slug: "restaurant-websites",
    title: "Restaurant Websites",
    description:
      "Menus, hours, location, and photos laid out so hungry visitors find what they need fast.",
    icon: "UtensilsCrossed",
  },
  {
    slug: "auto-shop-websites",
    title: "Auto Shop Websites",
    description:
      "Services, pricing info, and a simple way for drivers to call or request an appointment.",
    icon: "Wrench",
  },
  {
    slug: "portfolio-websites",
    title: "Portfolio Websites",
    description:
      "A polished place to show your work, whether you're a photographer, tradesperson, or creator.",
    icon: "Images",
  },
  {
    slug: "sports-team-websites",
    title: "Sports & Team Websites",
    description:
      "Schedules, rosters, registration details, and announcements for clubs and organizations.",
    icon: "Trophy",
  },
  {
    slug: "landing-pages",
    title: "Landing Pages",
    description:
      "One focused page built around a single offer, event, or promotion you're running.",
    icon: "MousePointerClick",
  },
  {
    slug: "website-redesigns",
    title: "Website Redesigns",
    description:
      "Already have a site that feels dated? I rebuild it to look modern and work on phones.",
    icon: "RefreshCw",
  },
  {
    slug: "custom-projects",
    title: "Custom Website Projects",
    description:
      "Something outside the usual? Tell me the idea and I'll put together a plan for it.",
    icon: "Sparkles",
  },
];

export const STEPS = [
  {
    number: "1",
    title: "Tell Me About Your Business",
    description:
      "Send me your business information, what you want on the website, and any ideas you have.",
  },
  {
    number: "2",
    title: "I Build Your Website",
    description: "I create a modern website specifically for your business.",
  },
  {
    number: "3",
    title: "You Review It",
    description:
      "You can see the website and tell me what you want changed.",
  },
  {
    number: "4",
    title: "Launch",
    description:
      "Once you're happy with it, we can get your website ready to go live.",
  },
];

export const REASONS = [
  {
    title: "Affordable pricing",
    description: "Straightforward pricing that makes sense for a small business.",
    icon: "Tag",
  },
  {
    title: "Modern designs",
    description: "Clean, current layouts — not a tired template everyone else uses.",
    icon: "Palette",
  },
  {
    title: "Mobile-friendly websites",
    description: "Built to look right on phones first, since that's where most visitors are.",
    icon: "Smartphone",
  },
  {
    title: "Fast turnaround",
    description: "I work in short cycles so you see progress quickly, not weeks later.",
    icon: "Zap",
  },
  {
    title: "Personalized service",
    description: "You talk directly to the person building your site. No account managers.",
    icon: "MessageCircle",
  },
  {
    title: "Changes based on your feedback",
    description: "Tell me what to adjust and I'll adjust it before anything goes live.",
    icon: "PencilRuler",
  },
  {
    title: "Designed for your business",
    description: "Every site is built around what your specific business needs to show.",
    icon: "Target",
  },
];

export const STARTER_FEATURES = [
  "Modern website design",
  "Mobile-friendly layout",
  "Business information",
  "Services/menu section",
  "Contact information",
  "Maps/social links when needed",
];

export const BUSINESS_TYPES = [
  "Restaurant / Café",
  "Auto Shop",
  "Retail Store",
  "Home Services / Trades",
  "Salon / Barbershop",
  "Sports Team or Organization",
  "Professional Services",
  "Other",
];

export const NEEDS_OPTIONS = [
  "A brand new website",
  "A redesign of my current website",
  "A single landing page",
  "Not sure yet — need advice",
];

/**
 * Portfolio projects.
 * To add a new project, copy one block and fill it in.
 * `image` can be any image URL (a screenshot of the site works well).
 * Leave `url` empty ("") if the site isn't public yet — the button hides itself.
 */
export type Project = {
  name: string;
  category: string;
  description: string;
  url: string;
  image: string;
};

export const PROJECTS: Project[] = [];
