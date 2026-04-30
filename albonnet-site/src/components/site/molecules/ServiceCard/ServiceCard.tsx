"use client";

import styles from "./ServiceCard.module.scss";
import AnimatedIn from "@/components/site/atoms/AnimatedIn";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import IconSvg from "@/components/atoms/IconSvg";
import iconPaths from "@/lib/iconPaths";

export default function ServiceCard({ icon, title, description, index, visible }: {
  icon: string;
  title: string;
  description: string;
  index: number;
  visible: boolean;
}) {
  return (
    <AnimatedIn visible={visible} delay={0.1 * index}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <IconSvg d={iconPaths[icon] || iconPaths.layers} size={28} />
        </div>
        <Heading level={3} style={{ marginBottom: "12px" }}>{title}</Heading>
        <Text size="0.95rem">{description}</Text>
      </div>
    </AnimatedIn>
  );
}