"use client";

import { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./ProjectListItem.module.scss";
import AdminIcon from "@/components/admin/atoms/AdminIcon";
import { ProjectData } from "@/lib/types";

export default function ProjectListItem({ id, project, selected, dragDisabled, onSelect, onToggleVisibility }: {
  id: string;
  project: ProjectData;
  selected: boolean;
  dragDisabled: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: dragDisabled });

  const published = project.published ?? true;
  const tags = project.tags ?? [];
  const thumb: CSSProperties = project.imageUrl && project.imageUrl.trim()
    ? { backgroundImage: `url(${project.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: `linear-gradient(135deg, ${project.color}cc 0%, ${project.color} 100%)` };

  return (
    <div
      ref={setNodeRef}
      className={styles.item}
      data-selected={selected ? "true" : "false"}
      data-hidden={published ? "false" : "true"}
      data-dragging={isDragging ? "true" : "false"}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={onSelect}
    >
      <button
        type="button"
        className={styles.dragHandle}
        disabled={dragDisabled}
        onClick={(e) => e.stopPropagation()}
        aria-label="Réordonner"
        {...attributes}
        {...listeners}
      >
        <AdminIcon name="grip" size={14} />
      </button>
      <div className={styles.thumb} style={thumb} />
      <div className={styles.info}>
        <span className={styles.title}>{project.title}</span>
        {tags.length > 0 && (
          <span className={styles.tags}>
            {tags.slice(0, 2).join(" · ")}
            {tags.length > 2 ? ` · +${tags.length - 2}` : ""}
          </span>
        )}
      </div>
      <button
        type="button"
        className={styles.eyeBtn}
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
        title={published ? "Masquer du site" : "Publier sur le site"}
        aria-label={published ? "Masquer du site" : "Publier sur le site"}
      >
        <AdminIcon name={published ? "eye" : "eye-off"} size={15} />
      </button>
    </div>
  );
}
