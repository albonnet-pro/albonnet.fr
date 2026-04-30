"use client";

import { CSSProperties, ReactNode } from "react";
import styles from "./Text.module.scss";

interface TextProps {
  children: ReactNode;
  size?: string;
  color?: string;
  weight?: number;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export default function Text({ children, size = "1rem", color, weight = 400, style, as: Tag = "p", className }: TextProps) {
  return (
    <Tag
      className={`${styles.text}${className ? ` ${className}` : ""}`}
      style={{ fontSize: size, color: color || "var(--color-muted)", fontWeight: weight, ...style }}
    >
      {children}
    </Tag>
  );
}