"use client";

import { CSSProperties } from "react";
import styles from "./AdminTextArea.module.scss";

export default function AdminTextArea({ value, onChange, placeholder, rows = 3, style }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  style?: CSSProperties;
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={styles.textarea}
      style={style}
    />
  );
}