"use client";

import styles from "./ExpertiseSection.module.scss";
import { useInView } from "@/hooks/useInView";
import { ExpertiseData } from "@/lib/types";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Badge from "@/components/site/atoms/Badge";
import AnimatedIn from "@/components/site/atoms/AnimatedIn";
import DotGrid from "@/components/site/atoms/DotGrid";
import { TechPill } from "@/components/site/molecules";

export default function ExpertiseSection({ expertise }: { expertise: ExpertiseData[] }) {
  const [ref, visible] = useInView();

  return (
    <section ref={ref} id="expertise" className={styles.section}>
      <DotGrid />
      <div className={styles.container}>
        <AnimatedIn visible={visible}>
          <Badge className={styles.sectionBadge}>Savoir-faire</Badge>
        </AnimatedIn>
        <AnimatedIn visible={visible} delay={0.05}>
          <Heading level={2} className={styles.sectionHeading}>
            Mes outils au quotidien<span className={styles.accentDot}>.</span>
          </Heading>
        </AnimatedIn>
        <AnimatedIn visible={visible} delay={0.1}>
          <Text size="1.1rem" className={styles.sectionIntro}>
            Derrière chaque site web, il y a des technologies fiables. Voici celles que je maîtrise pour donner vie à vos projets.
          </Text>
        </AnimatedIn>
        {expertise.map((group, gi) => (
          <AnimatedIn key={gi} visible={visible} delay={0.15 + gi * 0.1} className={styles.expertiseGroup}>
            <Text size="0.95rem" weight={600} color="var(--color-ink)" className={styles.groupLabel}>
              {group.label}
            </Text>
            <Text size="0.85rem" className={styles.groupDesc}>
              {group.description}
            </Text>
            <div className={styles.pills}>
              {group.items.map((name, i) => (
                <TechPill key={i} name={name} />
              ))}
            </div>
          </AnimatedIn>
        ))}
      </div>
    </section>
  );
}