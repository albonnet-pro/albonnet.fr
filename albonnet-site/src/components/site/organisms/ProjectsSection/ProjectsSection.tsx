"use client";

import styles from "./ProjectsSection.module.scss";
import { useInView } from "@/hooks/useInView";
import { ProjectData } from "@/lib/types";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Badge from "@/components/site/atoms/Badge";
import AnimatedIn from "@/components/site/atoms/AnimatedIn";
import { ProjectCard } from "@/components/site/molecules";

export default function ProjectsSection({ projects }: { projects: ProjectData[] }) {
  const [ref, visible] = useInView();

  return (
    <section ref={ref} id="projets" className={styles.section}>
      <div className={styles.container}>
        <AnimatedIn visible={visible}>
          <Badge className={styles.sectionBadge}>Portfolio</Badge>
        </AnimatedIn>
        <AnimatedIn visible={visible} delay={0.05}>
          <Heading level={2} className={styles.sectionHeading}>
            Projets récents<span className={styles.accentDot}>.</span>
          </Heading>
        </AnimatedIn>
        <AnimatedIn visible={visible} delay={0.1}>
          <Text size="1.1rem" className={styles.sectionIntro}>
            Une sélection de réalisations récentes qui illustrent mon savoir-faire.
          </Text>
        </AnimatedIn>
        <div className={styles.grid}>
          {projects.map((p, i) => {
            const image = p.imageUrl
              ? p.imageUrl
              : `linear-gradient(135deg, ${p.color}cc 0%, ${p.color} 100%)`;
            return (
              <ProjectCard
                key={i}
                title={p.title}
                tags={p.tags}
                description={p.description}
                image={image}
                url={p.url}
                index={i}
                visible={visible}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}