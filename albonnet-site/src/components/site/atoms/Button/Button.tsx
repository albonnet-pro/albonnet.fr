"use client";

import { CSSProperties, ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  onClick?: () => void;
  style?: CSSProperties;
  type?: "button" | "submit";
}

export default function Button({ children, variant = "primary", onClick, style, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.btn} ${styles[variant]}`}
      style={style}
    >
      {children}
    </button>
  );
}