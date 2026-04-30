// src/lib/types.ts

export interface SiteSettings {
  brandName: string;
  email: string;
  location: string;
  footerText: string;
  socialGithub: string;
  socialLinkedin: string;
  socialTwitter: string;
}

export interface HeroStat {
  number: string;
  label: string;
}

export interface HeroData {
  badge: string;
  title: string;
  description: string;
  stats: HeroStat[];
}

export interface ServiceData {
  id?: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  color: string;
  imageUrl: string;
  url: string;
  tags: string[];
}

export interface ExpertiseData {
  id?: string;
  label: string;
  description: string;
  items: string[];
}

export interface SiteData {
  settings: SiteSettings;
  hero: HeroData;
  services: ServiceData[];
  projects: ProjectData[];
  expertise: ExpertiseData[];
}
