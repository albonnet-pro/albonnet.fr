"use client";

import { useState, useEffect } from "react";
import styles from "./HeroSection.module.scss";
import { useInView } from "@/hooks/useInView";
import { useScrollY } from "@/hooks/useScrollY";
import { HeroData } from "@/lib/types";
import { parseTitleMarkup } from "@/lib/parseTitleMarkup";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/site/atoms/Button";
import Badge from "@/components/site/atoms/Badge";
import AnimatedIn from "@/components/site/atoms/AnimatedIn";
import DotGrid from "@/components/site/atoms/DotGrid";
import { StatItem } from "@/components/site/molecules";
import { Icon } from "@/components/atoms";

export default function HeroSection({ hero }: { hero: HeroData }) {
  const [ref, visible] = useInView();
  const scrollY = useScrollY();
  const titleSegments = parseTitleMarkup(hero.title);
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [statFading, setStatFading] = useState(false);

  useEffect(() => {
    if (hero.stats.length <= 1) return;
    const interval = setInterval(() => {
      setStatFading(true);
      setTimeout(() => {
        setActiveStatIndex((i) => (i + 1) % hero.stats.length);
        setStatFading(false);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, [hero.stats.length]);

  return (
    <section ref={ref} id="hero" className={styles.section}>
      <DotGrid />
      <div className={styles.container}>
        <AnimatedIn visible={visible} delay={0}>
          <Badge className={styles.heroBadge}>{hero.badge}</Badge>
        </AnimatedIn>
        <AnimatedIn visible={visible} delay={0.1}>
          <Heading level={1}>
            {titleSegments.map((seg, i) => {
              if (seg.underline) return (
                <span key={i} className={styles.accentText}>
                  {seg.text}
                  <svg className={styles.underlineSvg} viewBox="0 0 300 12" fill="none">
                    <path d="M2 8C60 2 180 2 298 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </span>
              );
              if (seg.accent) return <span key={i} className={styles.accent}>{seg.text}</span>;
              return <span key={i}>{seg.text}</span>;
            })}
          </Heading>
        </AnimatedIn>
        <AnimatedIn visible={visible} delay={0.2}>
          <Text size="clamp(1.1rem, 2vw, 1.35rem)" className={styles.heroDescription}>
            {hero.description}
          </Text>
        </AnimatedIn>
        <AnimatedIn visible={visible} delay={0.3}>
          <div className={styles.ctas}>
            <Button variant="primary" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              Discutons de votre projet
              <Icon name="arrow-right" size={16} style={{ marginLeft: "6px" }} />
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("projets")?.scrollIntoView({ behavior: "smooth" })}>
              Voir mes réalisations
            </Button>
          </div>
        </AnimatedIn>
        <AnimatedIn visible={visible} delay={0.45}>
          {/* Desktop : tous les chiffres alignés */}
          <div className={styles.stats}>
            {hero.stats.map((stat, i) => (
              <StatItem key={i} number={stat.number} label={stat.label} visible={visible} delay={0.5 + i * 0.1} />
            ))}
          </div>
          {/* Mobile : carousel avec un seul chiffre à la fois */}
          <div className={styles.statsCarousel}>
            <div className={`${styles.statSlide} ${statFading ? styles.statFadeOut : styles.statFadeIn}`}>
              <StatItem
                number={hero.stats[activeStatIndex]?.number ?? ""}
                label={hero.stats[activeStatIndex]?.label ?? ""}
                visible={visible}
                delay={0}
              />
            </div>
            <div className={styles.statDots}>
              {hero.stats.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.statDot} ${i === activeStatIndex ? styles.statDotActive : ""}`}
                  onClick={() => { setStatFading(false); setActiveStatIndex(i); }}
                  aria-label={`Chiffre ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </AnimatedIn>
      </div>
    </section>
  );
}