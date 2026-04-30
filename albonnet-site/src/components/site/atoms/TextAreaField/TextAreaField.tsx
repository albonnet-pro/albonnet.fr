"use client";

import { CSSProperties, ChangeEvent } from "react";
import styles from "./TextAreaField.module.scss";

export default function TextAreaField({
  placeholder,
  name,
  value,
  onChange,
  rows = 5,
  style,
  className,
}: {
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`${styles.textarea}${className ? ` ${className}` : ""}`}
      style={style}
    />
  );
}