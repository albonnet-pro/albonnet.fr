import { ReactNode, CSSProperties } from "react";
import styles from "./FieldGroup.module.scss";

export default function FieldGroup({ label, hint, children, style }: {
  label: string;
  hint?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className={styles.group} style={style}>
      <div className={styles.header}>
        <label className={styles.label}>{label}</label>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}