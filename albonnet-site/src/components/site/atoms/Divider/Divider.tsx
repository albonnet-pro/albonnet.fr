"use client";

import { CSSProperties } from "react";
import styles from "./Divider.module.scss";

export default function Divider({ style }: { style?: CSSProperties }) {
  return <div className={styles.divider} style={style} />;
}