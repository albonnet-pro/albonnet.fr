"use client";

import { useState } from "react";
import styles from "./Navbar.module.scss";
import { useScrollY } from "@/hooks/useScrollY";
import { SiteSettings } from "@/lib/types";
import Button from "@/components/site/atoms/Button";
import NavLink from "@/components/site/molecules/NavLink";
import Logo from "@/components/site/molecules/Logo";

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const scrollY = useScrollY();
  const scrolled = scrollY > 60;
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "#services", label: "Services" },
    { href: "#projets", label: "Projets" },
    { href: "#expertise", label: "Expertise" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""} ${mobileOpen ? styles.menuOpen : ""}`}>
      <div className={styles.inner}>
        <Logo brandName={settings.brandName} />
        <div className={styles.right}>
          {links.map((l) => (
            <span key={l.href} className="nav-desktop">
              <NavLink href={l.href}>{l.label}</NavLink>
            </span>
          ))}
          <span className="nav-desktop">
            <Button
              variant="primary"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Démarrer un projet
            </Button>
          </span>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`nav-mobile ${styles.hamburger}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 7h18" />
                  <path d="M3 12h18" />
                  <path d="M3 17h12" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}>
        {links.map((l) => (
          <NavLink key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</NavLink>
        ))}
        <Button
          variant="primary"
          onClick={() => {
            setMobileOpen(false);
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Démarrer un projet
        </Button>
      </div>
    </nav>
  );
}
