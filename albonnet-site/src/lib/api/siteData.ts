import { SiteData } from "@/lib/types";

export async function fetchSiteData(): Promise<SiteData> {
  const res = await fetch("/api/site-data");
  if (!res.ok) throw new Error("Erreur lors du chargement des données");
  return res.json();
}

export async function saveSiteData(section: string, data: SiteData[keyof SiteData]): Promise<void> {
  const res = await fetch("/api/site-data", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, data }),
  });
  if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
}
