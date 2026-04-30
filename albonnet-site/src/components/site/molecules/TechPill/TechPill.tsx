"use client";

import styles from "./TechPill.module.scss";

function stringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

export default function TechPill({ name }: { name: string }) {
  const hue = stringToHue(name);
  return (
    <span
      className={styles.pill}
      style={{ "--hue": String(hue) } as React.CSSProperties}
    >
      {name}
    </span>
  );
}