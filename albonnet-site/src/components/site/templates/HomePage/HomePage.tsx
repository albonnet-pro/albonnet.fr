"use client";

import styles from "./HomePage.module.scss";
import { SiteData } from "@/lib/types";
import GrainOverlay from "@/components/site/atoms/GrainOverlay";
import Divider from "@/components/site/atoms/Divider";
import Navbar from "@/components/site/organisms/Navbar";
import HeroSection from "@/components/site/organisms/HeroSection";
import ServicesSection from "@/components/site/organisms/ServicesSection";
import ProjectsSection from "@/components/site/organisms/ProjectsSection";
import ExpertiseSection from "@/components/site/organisms/ExpertiseSection";
import ContactSection from "@/components/site/organisms/ContactSection";
import Footer from "@/components/site/organisms/Footer";

export default function HomePage({ data }: { data: SiteData | null }) {
  if (!data) {
    return (
      <div className={styles.loading}>
        Chargement du site...
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <GrainOverlay />
      <Navbar settings={data.settings} />
      <HeroSection hero={data.hero} />
      <Divider />
      <ServicesSection services={data.services} />
      <ProjectsSection projects={data.projects} />
      <ExpertiseSection expertise={data.expertise} />
      <ContactSection settings={data.settings} />
      <Footer settings={data.settings} />
    </div>
  );
}