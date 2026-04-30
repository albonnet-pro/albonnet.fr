"use client";

import { CSSProperties, ReactNode } from "react";
import styles from "./Badge.module.scss";

export default function Badge({ children, style, className }: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <span className={`${styles.badge}${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </span>
  );
}
