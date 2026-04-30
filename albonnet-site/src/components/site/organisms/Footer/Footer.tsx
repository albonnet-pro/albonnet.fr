"use client";

import Link from "next/link";
import styles from "./Footer.module.scss";
import { SiteSettings } from "@/lib/types";
import { parseTitleMarkup } from "@/lib/parseTitleMarkup";
import Text from "@/components/atoms/Text";
import { SocialIcon } from "@/components/site/molecules";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const segments = parseTitleMarkup(settings.brandName);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <div className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/32.svg" alt="" aria-hidden="true" width={28} height={28} className={styles.brandIcon} />
            <span className={styles.brandName}>
              {segments.map((seg, i) =>
                seg.accent
                  ? <span key={i} className={styles.accent}>{seg.text}</span>
                  : <span key={i}>{seg.text}</span>
              )}
            </span>
          </div>
          <Text size="0.85rem" color="var(--color-muted)">
            {settings.footerText}
          </Text>
        </div>
        <nav className={styles.legal}>
          <Link href="/mentions-legales" className={styles.legalLink}>Mentions légales</Link>
          <Link href="/confidentialite" className={styles.legalLink}>Confidentialité</Link>
          <Link href="/cgv" className={styles.legalLink}>CGV</Link>
        </nav>
        <div className={styles.socials}>
          {settings.socialGithub && (
            <SocialIcon
              href={settings.socialGithub}
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
            />
          )}
          {settings.socialLinkedin && (
            <SocialIcon href={settings.socialLinkedin} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          )}
          {settings.socialTwitter && (
            <SocialIcon
              href={settings.socialTwitter}
              d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0023 3z"
            />
          )}
        </div>
      </div>
    </footer>
  );
}