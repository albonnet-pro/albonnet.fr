"use client";

import styles from "./BackOffice.module.scss";
import { useSiteData } from "@/hooks/useSiteData";
import AdminSidebar from "@/components/admin/organisms/AdminSidebar";
import AdminHeader from "@/components/admin/organisms/AdminHeader";
import Toast from "@/components/admin/molecules/Toast";
import HeroEditor from "@/components/admin/organisms/HeroEditor";
import ServicesEditor from "@/components/admin/organisms/ServicesEditor";
import ProjectsEditor from "@/components/admin/organisms/ProjectsEditor";
import ExpertiseEditor from "@/components/admin/organisms/ExpertiseEditor";
import SettingsEditor from "@/components/admin/organisms/SettingsEditor";

const TITLES: Record<string, string> = {
  hero: "Accueil / Hero",
  services: "Services",
  projects: "Projets",
  expertise: "Expertise",
  settings: "Paramètres généraux",
};

const DESCRIPTIONS: Record<string, string> = {
  hero: "Gérez le contenu de la section d'accueil : titre, description et chiffres clés.",
  services: "Ajoutez, modifiez ou supprimez vos offres de services.",
  projects: "Gérez votre portfolio de réalisations.",
  expertise: "Organisez vos compétences par catégorie avec des descriptions accessibles.",
  settings: "Informations générales du site, contact et réseaux sociaux.",
};

interface BackOfficeProps {
  userEmail?: string;
}

export default function BackOffice({ userEmail }: BackOfficeProps) {
  const {
    data, loading, hasChanges,
    section, setSection,
    sidebarOpen, setSidebarOpen,
    updateSection, save, reload,
    toast, sectionsList,
  } = useSiteData();

  if (loading || !data) {
    return (
      <div className={styles.loadingState}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/48.svg" alt="Albonnet" width={48} height={48} className={styles.loadingIcon} />
        Chargement du back-office...
      </div>
    );
  }

  return (
    <>
      <style>{`
        body { background: var(--admin-bg); overflow-x: hidden; margin: 0; }
        ::selection { background: rgba(232, 80, 58, 0.25); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--admin-bg); }
        ::-webkit-scrollbar-thumb { background: var(--admin-border); border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: var(--admin-text-dim); }
      `}</style>

      <div className={styles.layout}>
        <div
          className={styles.overlay}
          data-open={sidebarOpen ? "true" : "false"}
          onClick={() => setSidebarOpen(false)}
        />

        <AdminSidebar
          sectionsList={sectionsList}
          activeSection={section}
          onSectionChange={setSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userEmail={userEmail}
        />

        <div className={styles.mainArea}>
          <AdminHeader
            title={TITLES[section]}
            description={DESCRIPTIONS[section]}
            hasChanges={hasChanges}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            onSave={save}
            onReload={reload}
          />

          <main className={styles.main}>
            {section === "hero" && <HeroEditor data={data.hero} onChange={(v) => updateSection("hero", v)} />}
            {section === "services" && <ServicesEditor data={data.services} onChange={(v) => updateSection("services", v)} />}
            {section === "projects" && <ProjectsEditor data={data.projects} onChange={(v) => updateSection("projects", v)} />}
            {section === "expertise" && <ExpertiseEditor data={data.expertise} onChange={(v) => updateSection("expertise", v)} />}
            {section === "settings" && <SettingsEditor data={data.settings} onChange={(v) => updateSection("settings", v)} />}
          </main>
        </div>

        <Toast {...toast} />
      </div>
    </>
  );
}
