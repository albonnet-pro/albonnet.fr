"use client";

import styles from "./Logo.module.scss";
import { parseTitleMarkup } from "@/lib/parseTitleMarkup";

export default function Logo({ brandName }: { brandName?: string }) {
  const name = brandName || "Albonnet";
  const segments = parseTitleMarkup(name);

  return (
    <div className={styles.logo}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/32.svg" alt="" aria-hidden="true" width={36} height={36} className={styles.icon} />
      <span className={styles.name}>
        {segments.map((seg, i) =>
          seg.accent
            ? <span key={i} className={styles.accent}>{seg.text}</span>
            : <span key={i}>{seg.text}</span>
        )}
      </span>
    </div>
  );
}