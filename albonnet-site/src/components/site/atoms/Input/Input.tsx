"use client";

import { CSSProperties, ChangeEvent } from "react";
import styles from "./Input.module.scss";

export default function Input({ value, onChange, placeholder, type = "text", style, className, name }: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  style?: CSSProperties;
  className?: string;
  name?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${styles.input}${className ? ` ${className}` : ""}`}
      style={style}
    />
  );
}
