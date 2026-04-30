"use client";

import { CSSProperties } from "react";
import styles from "./ProjectsEditor.module.scss";
import AdminInput from "@/components/admin/atoms/AdminInput";
import AdminTextArea from "@/components/admin/atoms/AdminTextArea";
import AdminButton from "@/components/admin/atoms/AdminButton";
import AdminIcon from "@/components/admin/atoms/AdminIcon";
import Separator from "@/components/admin/atoms/Separator";
import FieldGroup from "@/components/admin/molecules/FieldGroup";
import CardEditor from "@/components/admin/molecules/CardEditor";
import TagInput from "@/components/admin/molecules/TagInput";
import ImageUpload from "@/components/admin/molecules/ImageUpload";

export default function ProjectsEditor({ data, onChange }: { data: any[]; onChange: (v: any[]) => void }) {
  const update = (i: number, key: string, val: any) => {
    const c = [...data]; c[i] = { ...c[i], [key]: val }; onChange(c);
  };
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const add = () => onChange([...data, { title: "Nouveau projet", tags: [], description: "Description...", color: "#333366", url: "", imageUrl: "" }]);

  return (
    <div>
      {data.map((proj, i) => {
        const hasImage = proj.imageUrl && proj.imageUrl.trim();
        const previewBg: CSSProperties = hasImage
          ? { backgroundImage: `url(${proj.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { background: `linear-gradient(135deg, ${proj.color}cc 0%, ${proj.color} 100%)` };

        return (
          <CardEditor key={i} title={`Projet ${i + 1}`} onDelete={() => remove(i)}>
            <div className={styles.preview} style={previewBg}>
              {!hasImage && (
                <span className={styles.previewLabel}>Aperçu - {proj.color}</span>
              )}
              {proj.url && (
                <span className={styles.previewBadge}>
                  <AdminIcon name="eye" size={12} /> Lien actif
                </span>
              )}
            </div>
            <FieldGroup label="Titre">
              <AdminInput value={proj.title} onChange={(e) => update(i, "title", e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Lien du projet" hint="URL vers le site en ligne">
              <AdminInput value={proj.url || ""} onChange={(e) => update(i, "url", e.target.value)} placeholder="https://mon-projet.fr" />
            </FieldGroup>
            <FieldGroup label="Description">
              <AdminTextArea value={proj.description} onChange={(e) => update(i, "description", e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Tags / Technologies">
              <TagInput tags={proj.tags || []} onChange={(tags) => update(i, "tags", tags)} />
            </FieldGroup>
            <Separator />
            <div className={styles.visual}>
              <label className={styles.visualLabel}>Visuel du projet</label>
              <span className={styles.visualHint}>
                Uploadez une image ou utilisez une couleur de fond. L&apos;image est prioritaire si renseignée.
              </span>
              <FieldGroup label="Image" hint="jpg, png, webp, gif, svg">
                <ImageUpload value={proj.imageUrl || ""} onChange={(url) => update(i, "imageUrl", url)} />
              </FieldGroup>
              <FieldGroup label="Couleur de fond" hint="Utilisée si aucune image" style={{ marginBottom: 0 }}>
                <div className={styles.colorRow}>
                  <div className={styles.colorSwatch} style={{ background: proj.color }} />
                  <AdminInput value={proj.color} onChange={(e) => update(i, "color", e.target.value)} placeholder="#0f3460" />
                </div>
              </FieldGroup>
            </div>
          </CardEditor>
        );
      })}
      <AdminButton variant="ghost" onClick={add} style={{ width: "100%" }}>
        <AdminIcon name="plus" size={16} /> Ajouter un projet
      </AdminButton>
    </div>
  );
}