"use client";

import { CSSProperties, ReactNode } from "react";
import styles from "./Heading.module.scss";

interface HeadingProps {
  level?: 1 | 2 | 3;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export default function Heading({ level = 1, children, style, className }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag className={`${styles.heading} ${styles[`h${level}`]}${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </Tag>
  );
}