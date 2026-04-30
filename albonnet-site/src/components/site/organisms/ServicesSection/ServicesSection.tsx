"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ServicesSection.module.scss";
import { useInView } from "@/hooks/useInView";
import { ServiceData } from "@/lib/types";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Badge from "@/components/site/atoms/Badge";
import AnimatedIn from "@/components/site/atoms/AnimatedIn";
import IconSvg from "@/components/atoms/IconSvg";
import Icon from "@/components/atoms/Icon/Icon";
import iconPaths from "@/lib/iconPaths";

const DURATION = 12000;

export default function ServicesSection({ services }: { services: ServiceData[] }) {
  const [ref, visible] = useInView();
  const [activeIndex, setActiveIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const goTo = (index: number) => {
    if (index === activeIndex || exiting) return;
    clearTimeout(timerRef.current);
    setExiting(true);
    setTimeout(() => {
      setActiveIndex(index);
      setExiting(false);
    }, 380);
  };

  useEffect(() => {
    if (!visible || services.length <= 1) return;
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setActiveIndex(i => (i + 1) % services.length);
        setExiting(false);
      }, 380);
    }, DURATION);
    return () => clearTimeout(timerRef.current);
  }, [activeIndex, visible, services.length]);

  const active = services[activeIndex];
  if (!active) return null;

  return (
    <section ref={ref} id="services" className={styles.section}>
      <div className={styles.container}>
        <AnimatedIn visible={visible} delay={0}>
          <Badge className={styles.sectionBadge}>Ce que je fais</Badge>
        </AnimatedIn>
        <AnimatedIn visible={visible} delay={0.05}>
          <Heading level={2} className={styles.sectionHeading}>
            Services<span className={styles.accentDot}>.</span>
          </Heading>
        </AnimatedIn>

        <AnimatedIn visible={visible} delay={0.1}>
          <div className={styles.spotlight}>

            {/* ── Panneau principal ── */}
            <div className={styles.panel}>
              <div className={`${styles.content} ${exiting ? styles.exit : styles.enter}`}>
                <div className={styles.panelTop}>
                  <span className={styles.num}>
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.iconWrap}>
                    <IconSvg d={iconPaths[active.icon] || iconPaths.layers} size={28} />
                  </div>
                </div>
                <Heading level={3} className={styles.panelHeading}>{active.title}</Heading>
                <Text size="1.05rem">{active.description}</Text>
              </div>

              {/* Barre de progression */}
              <div className={styles.progressTrack}>
                <div
                  key={`${activeIndex}-${exiting}`}
                  className={exiting ? styles.progressFillPause : styles.progressFill}
                  style={{ animationDuration: `${DURATION}ms` }}
                />
              </div>
            </div>

            {/* ── Liste latérale ── */}
            <ul className={styles.list}>
              {services.map((s, i) => (
                <li
                  key={i}
                  className={`${styles.listItem} ${i === activeIndex ? styles.listItemActive : ""}`}
                  onClick={() => goTo(i)}
                >
                  <span className={styles.listNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.listTitle}>{s.title}</span>
                  <Icon name="chevron-right" size={12} className={styles.listArrow} />
                </li>
              ))}
            </ul>

          </div>
        </AnimatedIn>
      </div>
    </section>
  );
}