"use client";

import { CSSProperties, ReactNode } from "react";
import styles from "./AdminButton.module.scss";

export default function AdminButton({ children, onClick, variant = "primary", style, disabled }: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "success";
  style?: CSSProperties;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      className={styles.btn}
      style={style}
    >
      {children}
    </button>
  );
}