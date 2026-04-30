import { ReactNode } from "react";
import styles from "./AdminBadge.module.scss";

export default function AdminBadge({ children, color = "#e8503a" }: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      className={styles.badge}
      style={{ background: `${color}18`, color }}
    >
      {children}
    </span>
  );
}