import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const email = process.env.ADMIN_EMAIL || "contact@albonnet.fr";
  const password = process.env.ADMIN_PASSWORD || "changeme_admin_password";
  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: hash, name: "Alexis Bonnet", role: "admin" },
  });
  console.log(`✅ Admin user: ${email}`);

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      brandName: "Albonnet",
      email: "contact@albonnet.fr",
      location: "Paris, France",
      footerText: "© 2026 Alexis Bonnet — Développeur Web Freelance",
      socialGithub: "",
      socialLinkedin: "",
      socialTwitter: "",
    },
  });

  await prisma.heroContent.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      badge: "Développeur Web Freelance",
      title: "Je conçois des expériences web qui marquent.",
      description:
        "Applications performantes, interfaces soignées et code robuste. Du concept au déploiement, je transforme vos idées en produits digitaux d'exception.",
    },
  });

  const heroStatsCount = await prisma.heroStat.count();
  if (heroStatsCount === 0) {
    await prisma.heroStat.createMany({
      data: [
        { number: "7+", label: "Années d'expérience", position: 0 },
        { number: "50+", label: "Projets livrés", position: 1 },
        { number: "98%", label: "Clients satisfaits", position: 2 },
      ],
    });
  }

  const servicesCount = await prisma.service.count();
  if (servicesCount === 0) {
    await prisma.service.createMany({
      data: [
        { title: "Applications Web", description: "SPA & SSR avec React, Next.js et Vue.js. Architecture moderne, performante et scalable pour vos projets ambitieux.", icon: "layers", position: 0 },
        { title: "Sites Vitrine & E-commerce", description: "Sites sur-mesure optimisés SEO. Headless CMS, Shopify, WooCommerce — l'outil adapté à votre besoin.", icon: "grid", position: 1 },
        { title: "API & Backend", description: "APIs RESTful & GraphQL avec Node.js, Express, NestJS. Base de données, authentification et déploiement cloud.", icon: "zap", position: 2 },
        { title: "UI/UX Design", description: "Interfaces intuitives et esthétiques. Prototypage Figma, design system et intégration pixel-perfect.", icon: "pen", position: 3 },
      ],
    });
  }

  const projectsCount = await prisma.project.count();
  if (projectsCount === 0) {
    await prisma.project.createMany({
      data: [
        { title: "Plateforme SaaS FinTech", description: "Dashboard analytique temps réel avec gestion multi-tenant et intégration Stripe.", color: "#0f3460", tags: ["Next.js", "TypeScript", "Prisma"], url: "https://example.com", position: 0 },
        { title: "E-commerce Luxe", description: "Boutique en ligne haute performance avec animations fluides et expérience d'achat immersive.", color: "#6b2737", tags: ["React", "Node.js", "Headless CMS"], url: "https://example.com", position: 1 },
        { title: "App Mobile Santé", description: "Application de suivi médical avec synchronisation temps réel et chiffrement bout-en-bout.", color: "#0d6d6e", tags: ["React Native", "GraphQL", "AWS"], url: "https://example.com", position: 2 },
      ],
    });
  }

  const expertiseCount = await prisma.expertiseGroup.count();
  if (expertiseCount === 0) {
    await prisma.expertiseGroup.createMany({
      data: [
        { label: "Ce que vous voyez — l'interface", description: "Les outils que j'utilise pour créer des sites rapides, élégants et agréables à utiliser.", items: ["React", "Next.js", "TypeScript", "Vue.js", "Tailwind CSS"], position: 0 },
        { label: "Ce qui tourne en coulisses — le moteur", description: "Les technologies qui font fonctionner votre site : données, sécurité, connexions.", items: ["Node.js", "NestJS", "Express", "GraphQL", "Prisma"], position: 1 },
        { label: "Mise en ligne & maintenance", description: "Votre site hébergé, sécurisé et mis à jour en continu, sans que vous ayez à y penser.", items: ["Docker", "AWS", "Vercel", "Git", "Figma"], position: 2 },
      ],
    });
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());