import HomePage from "@/components/site/templates/HomePage";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getSiteData() {
  try {
    const [settings, hero, stats, services, projects, expertise] =
      await Promise.all([
        prisma.siteSettings.findUnique({ where: { id: "main" } }),
        prisma.heroContent.findUnique({ where: { id: "main" } }),
        prisma.heroStat.findMany({ orderBy: { position: "asc" } }),
        prisma.service.findMany({ orderBy: { position: "asc" } }),
        prisma.project.findMany({ orderBy: { position: "asc" } }),
        prisma.expertiseGroup.findMany({ orderBy: { position: "asc" } }),
      ]);
    if (!settings || !hero) return null;
    return { settings, hero: { ...hero, stats }, services, projects, expertise };
  } catch {
    return null;
  }
}

export default async function Page() {
  const siteData = await getSiteData();

  // JSON-LD structured data (Person + ProfessionalService)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://albonnet.fr/#person",
        name: "Alexis Bonnet",
        jobTitle: "Développeur Web Freelance",
        url: "https://albonnet.fr",
        email: "contact@albonnet.fr",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Grenoble",
          addressCountry: "FR",
        },
        sameAs: [
          siteData?.settings?.socialGithub,
          siteData?.settings?.socialLinkedin,
          siteData?.settings?.socialTwitter,
        ].filter(Boolean),
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://albonnet.fr/#service",
        name: siteData?.settings?.brandName ?? "Albonnet",
        description: siteData?.hero?.description ?? "Développeur Web Freelance",
        url: "https://albonnet.fr",
        provider: { "@id": "https://albonnet.fr/#person" },
        areaServed: "FR",
        serviceType: "Web Development",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage data={siteData} />
    </>
  );
}
