"use client";

import { CSSProperties, useRef, useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy,
  arrayMove, sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import styles from "./ProjectsEditor.module.scss";
import { ProjectData } from "@/lib/types";
import AdminInput from "@/components/admin/atoms/AdminInput";
import AdminTextArea from "@/components/admin/atoms/AdminTextArea";
import AdminButton from "@/components/admin/atoms/AdminButton";
import AdminIcon from "@/components/admin/atoms/AdminIcon";
import AdminBadge from "@/components/admin/atoms/AdminBadge";
import AdminCheckbox from "@/components/admin/atoms/AdminCheckbox";
import Separator from "@/components/admin/atoms/Separator";
import FieldGroup from "@/components/admin/molecules/FieldGroup";
import TagInput from "@/components/admin/molecules/TagInput";
import ImageUpload from "@/components/admin/molecules/ImageUpload";
import ProjectListItem from "@/components/admin/molecules/ProjectListItem";

const newKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `k-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function ProjectsEditor({ data, onChange }: { data: ProjectData[]; onChange: (v: ProjectData[]) => void }) {
  // Clés client stables pour dnd-kit et la sélection (parallèles à data).
  const keysRef = useRef<string[]>([]);
  while (keysRef.current.length < data.length) keysRef.current.push(newKey());
  if (keysRef.current.length > data.length) keysRef.current = keysRef.current.slice(0, data.length);
  const keys = keysRef.current;

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [query, setQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Sur desktop le panneau détail est toujours visible : repli sur le premier projet.
  const effectiveKey = selectedKey && keys.includes(selectedKey) ? selectedKey : keys[0] ?? null;
  const selectedIndex = effectiveKey ? keys.indexOf(effectiveKey) : -1;
  const selected = selectedIndex >= 0 ? data[selectedIndex] : null;

  const q = query.trim().toLowerCase();
  const visible = data
    .map((p, i) => ({ p, key: keys[i] }))
    .filter(({ p }) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  const dragDisabled = q.length > 0;

  // signature identique à l'ancien éditeur (clé dynamique, idiome du repo)
  const update = (i: number, key: string, val: any) => {
    const c = [...data];
    c[i] = { ...c[i], [key]: val };
    onChange(c);
  };

  const add = () => {
    const k = newKey();
    keysRef.current = [...keys, k];
    onChange([...data, { title: "Nouveau projet", tags: [], description: "Description...", color: "#333366", url: "", imageUrl: "", published: true }]);
    setSelectedKey(k);
    setDetailOpen(true);
    setQuery("");
  };

  const remove = (i: number) => {
    const nextKeys = keys.filter((_, idx) => idx !== i);
    keysRef.current = nextKeys;
    const nextSel = nextKeys[i] ?? nextKeys[i - 1] ?? null;
    setSelectedKey(nextSel);
    if (!nextSel) setDetailOpen(false);
    // la sélection suivante peut ne pas matcher le filtre actif : on le réinitialise
    setQuery("");
    onChange(data.filter((_, idx) => idx !== i));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = keys.indexOf(String(active.id));
    const to = keys.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    keysRef.current = arrayMove(keys, from, to);
    onChange(arrayMove(data, from, to));
  };

  const published = selected ? selected.published ?? true : true;
  const hasImage = selected?.imageUrl && selected.imageUrl.trim();
  const previewBg: CSSProperties = selected
    ? hasImage
      ? { backgroundImage: `url(${selected.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: `linear-gradient(135deg, ${selected.color}cc 0%, ${selected.color} 100%)` }
    : {};

  return (
    <div className={styles.layout} data-detail-open={detailOpen ? "true" : "false"}>
      <div className={styles.listPane}>
        <div className={styles.searchRow}>
          <div className={styles.searchField}>
            <span className={styles.searchIcon}><AdminIcon name="search" size={15} /></span>
            <AdminInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher (titre, tag)..."
              style={{ paddingLeft: "34px" }}
            />
          </div>
          <AdminButton onClick={add}>
            <AdminIcon name="plus" size={15} /> Ajouter
          </AdminButton>
        </div>

        {data.length === 0 ? (
          <div className={styles.emptyState}>
            Aucun projet pour le moment.
            <AdminButton variant="ghost" onClick={add} style={{ marginTop: "12px" }}>
              <AdminIcon name="plus" size={15} /> Ajouter un projet
            </AdminButton>
          </div>
        ) : visible.length === 0 ? (
          <div className={styles.emptyState}>Aucun projet ne correspond à « {query.trim()} ».</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={keys} strategy={verticalListSortingStrategy}>
              <div className={styles.list}>
                {visible.map(({ p, key }) => (
                  <ProjectListItem
                    key={key}
                    id={key}
                    project={p}
                    selected={key === effectiveKey}
                    dragDisabled={dragDisabled}
                    onSelect={() => { setSelectedKey(key); setDetailOpen(true); }}
                    onToggleVisibility={() => {
                      const i = keys.indexOf(key);
                      update(i, "published", !(data[i].published ?? true));
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <span className={styles.hint}>
          {dragDisabled
            ? "Réorganisation désactivée pendant une recherche."
            : "Glissez la poignée pour réordonner — l'œil publie/masque un projet."}
        </span>
      </div>

      <div className={styles.detailPane}>
        {!selected ? (
          <div className={styles.detailPlaceholder}>Sélectionnez un projet dans la liste pour l&apos;éditer.</div>
        ) : (
          <>
            <button type="button" className={styles.backBtn} onClick={() => setDetailOpen(false)}>
              <AdminIcon name="arrow-left" size={15} /> Retour à la liste
            </button>

            <div className={styles.detailHeader}>
              {/* AdminBadge concatène `${color}18` pour le fond : il faut un hex, pas une var CSS */}
              <AdminBadge color={published ? "#34d399" : "#8b8998"}>
                {published ? "Publié" : "Masqué"}
              </AdminBadge>
              <div className={styles.detailActions}>
                <AdminButton variant="ghost" onClick={() => update(selectedIndex, "published", !published)}>
                  <AdminIcon name={published ? "eye-off" : "eye"} size={14} /> {published ? "Masquer" : "Publier"}
                </AdminButton>
                <AdminButton variant="danger" onClick={() => remove(selectedIndex)}>
                  <AdminIcon name="trash" size={14} /> Supprimer
                </AdminButton>
              </div>
            </div>

            <div className={styles.preview} style={previewBg}>
              {!hasImage && (
                <span className={styles.previewLabel}>Aperçu - {selected.color}</span>
              )}
              {selected.url && (
                <span className={styles.previewBadge}>
                  <AdminIcon name="eye" size={12} /> Lien actif
                </span>
              )}
            </div>

            <FieldGroup label="Titre">
              <AdminInput value={selected.title} onChange={(e) => update(selectedIndex, "title", e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Lien du projet" hint="URL vers le site en ligne">
              <AdminInput value={selected.url || ""} onChange={(e) => update(selectedIndex, "url", e.target.value)} placeholder="https://mon-projet.fr" />
            </FieldGroup>
            <FieldGroup label="Description">
              <AdminTextArea value={selected.description} onChange={(e) => update(selectedIndex, "description", e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Tags / Technologies">
              <TagInput tags={selected.tags || []} onChange={(tags) => update(selectedIndex, "tags", tags)} />
            </FieldGroup>
            <FieldGroup label="Étiquettes" hint="Affichées en haut du visuel côté visiteur">
              <div className={styles.flagsRow}>
                <AdminCheckbox
                  label="En cours (WIP)"
                  checked={selected.wip ?? false}
                  onChange={(v) => update(selectedIndex, "wip", v)}
                />
                <AdminCheckbox
                  label="Projet d'école"
                  checked={selected.school ?? false}
                  onChange={(v) => update(selectedIndex, "school", v)}
                />
              </div>
            </FieldGroup>
            <Separator />
            <div className={styles.visual}>
              <label className={styles.visualLabel}>Visuel du projet</label>
              <span className={styles.visualHint}>
                Uploadez une image ou utilisez une couleur de fond. L&apos;image est prioritaire si renseignée.
              </span>
              <FieldGroup label="Image" hint="jpg, png, webp, gif, svg">
                <ImageUpload value={selected.imageUrl || ""} onChange={(url) => update(selectedIndex, "imageUrl", url)} />
              </FieldGroup>
              <FieldGroup label="Couleur de fond" hint="Utilisée si aucune image" style={{ marginBottom: 0 }}>
                <div className={styles.colorRow}>
                  <div className={styles.colorSwatch} style={{ background: selected.color }} />
                  <AdminInput value={selected.color} onChange={(e) => update(selectedIndex, "color", e.target.value)} placeholder="#0f3460" />
                </div>
              </FieldGroup>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
