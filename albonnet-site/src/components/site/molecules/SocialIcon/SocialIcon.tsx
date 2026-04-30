"use client";

import styles from "./SocialIcon.module.scss";
import IconSvg from "@/components/atoms/IconSvg";

export default function SocialIcon({ href, d }: { href: string; d: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
      <IconSvg d={d} size={18} />
    </a>
  );
}