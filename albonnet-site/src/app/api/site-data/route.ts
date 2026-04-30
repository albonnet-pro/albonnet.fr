import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  settingsSchema,
  heroSchema,
  servicesSchema,
  projectsSchema,
  expertiseSchema,
} from "@/lib/siteDataSchemas";

// GET - Public : retourne toutes les données du site
export async function GET() {
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

    return NextResponse.json({
      settings,
      hero: { ...hero, stats },
      services,
      projects,
      expertise,
    });
  } catch (error) {
    console.error("GET site-data error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT - Protégé admin : met à jour une section
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { section, data } = body;

  if (!section || !data) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  // Validation Zod selon la section
  const schemas: Record<string, z.ZodTypeAny> = {
    settings: settingsSchema,
    hero:     heroSchema,
    services: servicesSchema,
    projects: projectsSchema,
    expertise: expertiseSchema,
  };

  const schema = schemas[section];
  if (!schema) {
    return NextResponse.json({ error: "Section inconnue" }, { status: 400 });
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error?.message },
      { status: 422 }
    );
  }

  try {
    switch (section) {
      case "settings":
        await prisma.siteSettings.update({
          where: { id: "main" },
          data: parsed.data as Parameters<typeof prisma.siteSettings.update>[0]["data"],
        });
        break;

      case "hero": {
        const { stats, ...heroData } = parsed.data as { stats?: unknown[]; badge: string; title: string; description: string };
        await prisma.heroContent.update({ where: { id: "main" }, data: heroData });
        if (stats) {
          await prisma.heroStat.deleteMany();
          await prisma.heroStat.createMany({
            data: (stats as { number: string; label: string }[]).map((s, i) => ({ ...s, position: i })),
          });
        }
        break;
      }

      case "services":
        await prisma.service.deleteMany();
        await prisma.service.createMany({
          data: (parsed.data as { title: string; description: string; icon: string }[])
            .map((s, i) => ({ ...s, position: i })),
        });
        break;

      case "projects":
        await prisma.project.deleteMany();
        await prisma.project.createMany({
          data: (parsed.data as { title: string; description: string; color?: string; imageUrl?: string; url?: string; tags?: string[] }[])
            .map((p, i) => ({
              title: p.title,
              description: p.description,
              color: p.color ?? "#333366",
              imageUrl: p.imageUrl ?? "",
              url: p.url ?? "",
              tags: p.tags ?? [],
              position: i,
            })),
        });
        break;

      case "expertise":
        await prisma.expertiseGroup.deleteMany();
        await prisma.expertiseGroup.createMany({
          data: (parsed.data as { label: string; description: string; items: string[] }[])
            .map((e, i) => ({ ...e, position: i })),
        });
        break;
    }

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
