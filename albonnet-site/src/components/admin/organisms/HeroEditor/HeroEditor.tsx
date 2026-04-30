"use client";

import styles from "./HeroEditor.module.scss";
import AdminInput from "@/components/admin/atoms/AdminInput";
import AdminTextArea from "@/components/admin/atoms/AdminTextArea";
import Separator from "@/components/admin/atoms/Separator";
import FieldGroup from "@/components/admin/molecules/FieldGroup";
import CardEditor from "@/components/admin/molecules/CardEditor";

export default function HeroEditor({ data, onChange }: { data: any; onChange: (v: any) => void }) {
  const update = (key: string, val: any) => onChange({ ...data, [key]: val });
  const updateStat = (i: number, key: string, val: string) => {
    const stats = [...data.stats];
    stats[i] = { ...stats[i], [key]: val };
    update("stats", stats);
  };
  const addStat = () => {
    if (data.stats.length >= 6) return;
    update("stats", [...data.stats, { number: "", label: "" }]);
  };
  const removeStat = (i: number) => {
    update("stats", data.stats.filter((_: any, idx: number) => idx !== i));
  };

  return (
    <div>
      <FieldGroup label="Badge" hint="Texte au-dessus du titre">
        <AdminInput value={data.badge} onChange={(e) => update("badge", e.target.value)} />
      </FieldGroup>
      <FieldGroup label="Titre principal" hint="*texte* = couleur · **texte** = couleur + soulignement">
        <AdminTextArea value={data.title} onChange={(e) => update("title", e.target.value)} rows={2} />
      </FieldGroup>
      <FieldGroup label="Description" hint="Sous-titre explicatif">
        <AdminTextArea value={data.description} onChange={(e) => update("description", e.target.value)} />
      </FieldGroup>
      <Separator />
      <div className={styles.statsSection}>
        <div className={styles.statsHeader}>
          <label className={styles.statsLabel}>Chiffres clés</label>
          {data.stats.length < 6 && (
            <button type="button" className={styles.addBtn} onClick={addStat}>+ Ajouter</button>
          )}
        </div>
        <div className={styles.statsGrid}>
          {data.stats.map((stat: any, i: number) => (
            <CardEditor key={i} title={`Stat ${i + 1}`} onDelete={() => removeStat(i)} style={{ padding: "16px", marginBottom: 0 }}>
              <FieldGroup label="Chiffre" style={{ marginBottom: "10px" }}>
                <AdminInput value={stat.number} onChange={(e) => updateStat(i, "number", e.target.value)} placeholder="7+" />
              </FieldGroup>
              <FieldGroup label="Libellé" style={{ marginBottom: 0 }}>
                <AdminInput value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Années d'exp." />
              </FieldGroup>
            </CardEditor>
          ))}
        </div>
      </div>
    </div>
  );
}