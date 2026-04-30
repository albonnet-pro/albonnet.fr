"use client";

import { useState, useEffect, useCallback } from "react";
import { SiteData } from "@/lib/types";
import { fetchSiteData, saveSiteData } from "@/lib/api/siteData";
import { IconName } from "@fortawesome/fontawesome-svg-core";

type ToastType = "success" | "error";
type ToastState = { visible: boolean; message: string; type: ToastType };

export function useSiteData() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [section, setSection] = useState("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: "", type: "success" });

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  }, []);

  useEffect(() => {
    fetchSiteData()
      .then((d) => {
        setData({ hero: d.hero, services: d.services, projects: d.projects, expertise: d.expertise, settings: d.settings });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateSection = useCallback((key: string, value: SiteData[keyof SiteData]) => {
    setData((prev) => prev ? { ...prev, [key]: value } : prev);
    setHasChanges(true);
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    try {
      const sections = ["hero", "services", "projects", "expertise", "settings"] as const;
      for (const s of sections) {
        await saveSiteData(s, data[s]);
      }
      setHasChanges(false);
      showToast("Modifications enregistrées !");
    } catch {
      showToast("Erreur lors de la sauvegarde", "error");
    }
  }, [data, showToast]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const d = await fetchSiteData();
      setData({ hero: d.hero, services: d.services, projects: d.projects, expertise: d.expertise, settings: d.settings });
      setHasChanges(false);
      showToast("Données rechargées depuis la base");
    } catch {
      showToast("Erreur lors du rechargement", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const sectionsList: { id: string; icon: IconName; label: string; badge?: string }[] = [
    { id: "hero", icon: "house", label: "Accueil / Hero" },
    { id: "services", icon: "layer-group", label: "Services", badge: data ? String(data.services.length) : undefined },
    { id: "projects", icon: "folder", label: "Projets", badge: data ? String(data.projects.length) : undefined },
    { id: "expertise", icon: "screwdriver-wrench", label: "Expertise", badge: data ? String(data.expertise.length) : undefined },
    { id: "settings", icon: "gear", label: "Paramètres" },
  ];

  return {
    data, loading, hasChanges,
    section, setSection,
    sidebarOpen, setSidebarOpen,
    updateSection, save, reload,
    toast, sectionsList,
  };
}
