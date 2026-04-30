"use client";

import styles from "./StatItem.module.scss";
import AnimatedIn from "@/components/site/atoms/AnimatedIn";
import Text from "@/components/atoms/Text";

export default function StatItem({ number, label, visible, delay }: {
  number: string;
  label: string;
  visible: boolean;
  delay: number;
}) {
  return (
    <AnimatedIn visible={visible} delay={delay}>
      <div className={styles.item}>
        <div className={styles.number}>{number}</div>
        <Text size="0.9rem" style={{ marginTop: "8px" }}>{label}</Text>
      </div>
    </AnimatedIn>
  );
}