"use client";

import { CSSProperties } from "react";
import styles from "./AdminInput.module.scss";

export default function AdminInput({ value, onChange, placeholder, type = "text", style }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  style?: CSSProperties;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.input}
      style={style}
    />
  );
}