"use client";

import { ReactNode } from "react";
import styles from "./NavLink.module.scss";

export default function NavLink({ href, children, active, onClick }: { href: string; children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <a href={href} onClick={onClick} className={`${styles.link} ${active ? styles.active : ""}`}>
      {children}
      <span className={styles.underline} />
    </a>
  );
}