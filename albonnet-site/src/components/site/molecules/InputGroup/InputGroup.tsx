"use client";

import { ReactNode } from "react";
import styles from "./InputGroup.module.scss";
import Text from "@/components/atoms/Text";

export default function InputGroup({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.group}>
      <Text as="label" size="0.85rem" weight={600} color="var(--color-ink)" style={{ display: "block", marginBottom: "8px" }}>
        {label}
      </Text>
      {children}
    </div>
  );
}