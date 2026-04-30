import type { Metadata } from "next";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { clashDisplay, generalSans, jetbrainsMono } from "@/lib/fonts";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Alexis Bonnet - Développeur Web Freelance",
  description:
    "Applications performantes, interfaces soignées et code robuste. Du concept au déploiement, je transforme vos idées en produits digitaux d'exception.",
  metadataBase: new URL("https://albonnet.fr"),
  alternates: {
    canonical: "https://albonnet.fr",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Alexis Bonnet - Développeur Web Freelance",
    description:
      "Création de sites web, applications et API sur-mesure. Grenoble, France.",
    url: "https://albonnet.fr",
    siteName: "Alexis Bonnet",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexis Bonnet - Développeur Web Freelance",
    description:
      "Création de sites web, applications et API sur-mesure. Grenoble, France.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${clashDisplay.variable} ${generalSans.variable} ${jetbrainsMono.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
