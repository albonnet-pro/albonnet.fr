"use client";

import { CSSProperties } from "react";
import styles from "./ProjectCard.module.scss";
import AnimatedIn from "@/components/site/atoms/AnimatedIn";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Badge from "@/components/site/atoms/Badge";

export default function ProjectCard({ title, tags, description, image, url, index, visible }: {
  title: string;
  tags: string[];
  description: string;
  image: string;
  url?: string;
  index: number;
  visible: boolean;
}) {
  const isImageUrl = image && (image.startsWith("http") || image.startsWith("/"));
  const visualStyle: CSSProperties = isImageUrl
    ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: image };

  return (
    <AnimatedIn visible={visible} delay={0.12 * index}>
      <div className={styles.card}>
        <a
          href={url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.visual} ${!url ? styles.noLink : ""}`}
          onClick={(e) => { if (!url) e.preventDefault(); }}
        >
          <div className={styles.visualBg} style={visualStyle} />
          {url && (
            <div className={styles.overlay}>
              <span className={styles.visitBtn}>
                Visiter le site
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </span>
            </div>
          )}
        </a>
        <div className={styles.content}>
          <div className={styles.tags}>
            {tags.map((t, i) => <Badge key={i}>{t}</Badge>)}
          </div>
          <Heading level={3} style={{ marginBottom: "10px" }}>{title}</Heading>
          <Text size="0.9rem">{description}</Text>
        </div>
      </div>
    </AnimatedIn>
  );
}