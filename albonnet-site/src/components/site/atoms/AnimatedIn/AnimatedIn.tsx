"use client";

import { CSSProperties, ReactNode } from "react";
import styles from "./AnimatedIn.module.scss";

export default function AnimatedIn({
  children,
  delay = 0,
  visible,
  style,
  className,
}: {
  children: ReactNode;
  delay?: number;
  visible: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`${styles.wrapper}${className ? ` ${className}` : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
