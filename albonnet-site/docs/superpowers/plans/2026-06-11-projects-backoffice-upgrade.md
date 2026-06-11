# Projects Back-Office Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre la section Projets du back-office en vue master-detail avec recherche, drag & drop (@dnd-kit) et visibilité publié/masqué par projet.

**Architecture:** Le `ProjectsEditor` (organism) devient un layout master-detail : liste compacte à gauche (nouvelle molecule `ProjectListItem`, sortable via dnd-kit), éditeur du projet sélectionné à droite (réutilise les champs existants). Un champ `published` est ajouté au modèle Prisma `Project`, propagé dans les types, la validation Zod, la route API et le rendu public. La sauvegarde globale existante (deleteMany + createMany, position = index du tableau) est inchangée.

**Tech Stack:** Next.js 16 (App Router), React 18, TypeScript, SCSS modules, Prisma (PostgreSQL), Zod, @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities.

**Spec :** `docs/superpowers/specs/2026-06-11-projects-backoffice-upgrade-design.md`

**Note vérification :** le projet n'a aucun framework de test (pas de jest/vitest). Chaque tâche est vérifiée par `npx tsc --noEmit`, et le plan se termine par `npm run build` + une checklist de tests manuels. Les commits suivent le style du repo : `(feat) : …`, `(fix) : …`.

**Répertoire de travail :** `/home/alexis/Documents/Perso/albonnet-pro/albonnet.fr/albonnet-site` (toutes les commandes s'exécutent depuis là).

---

## Task 1: Installer les dépendances dnd-kit

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Installer les paquets**

Run: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
Expected: `added N packages` sans erreur, les 3 paquets apparaissent dans `dependencies` de `package.json`.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "(feat) : add @dnd-kit dependencies for project reordering"
```

---

## Task 2: Champ `published` dans le schéma Prisma

**Files:**
- Modify: `prisma/schema.prisma` (model `Project`)

- [ ] **Step 1: Ajouter le champ au modèle**

Dans `prisma/schema.prisma`, model `Project`, ajouter la ligne `published` après `tags` :

```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  description String
  color       String   @default("#333366")
  imageUrl    String   @default("")
  url         String   @default("")
  tags        String[] @default([])
  published   Boolean  @default(true)
  position    Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- [ ] **Step 2: Pousser le schéma vers la base et régénérer le client**

Le projet n'utilise pas de migrations versionnées (`prisma/migrations/` est gitignoré) — on utilise `db push` :

Run: `npx prisma db push`
Expected: `Your database is now in sync with your Prisma schema.` (le client est régénéré automatiquement ; si ce n'est pas le cas, lancer `npx prisma generate`).

Les projets existants reçoivent `published = true` (valeur par défaut) : aucun changement visible.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "(feat) : add published field to Project model"
```

---

## Task 3: Types, validation Zod et route PUT

**Files:**
- Modify: `src/lib/types.ts:32-40` (interface `ProjectData`)
- Modify: `src/lib/siteDataSchemas.ts:34-43` (`projectSchema`, `projectsSchema`)
- Modify: `src/app/api/site-data/route.ts:106-120` (case `projects` du PUT)

- [ ] **Step 1: Ajouter `published` à `ProjectData`**

Dans `src/lib/types.ts`, remplacer l'interface `ProjectData` par :

```ts
export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  color: string;
  imageUrl: string;
  url: string;
  tags: string[];
  published?: boolean;
}
```

(`published` optionnel : les données côté client peuvent ne pas l'avoir avant la première resauvegarde ; partout ailleurs on le lit avec `?? true`.)

- [ ] **Step 2: Mettre à jour le schéma Zod**

Dans `src/lib/siteDataSchemas.ts`, remplacer `projectSchema` et `projectsSchema` par :

```ts
const projectSchema = z.object({
  title:       z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  color:       z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  imageUrl:    z.string().max(500).optional(),
  url:         z.string().url().max(500).or(z.literal("")).optional(),
  tags:        z.array(z.string().max(30)).max(10).optional(),
  published:   z.boolean().optional(),
});

export const projectsSchema = z.array(projectSchema).max(50);
```

(Limite relevée de 20 à 50 projets, conformément à la spec.)

- [ ] **Step 3: Mapper `published` dans le PUT**

Dans `src/app/api/site-data/route.ts`, remplacer le `case "projects":` par :

```ts
      case "projects":
        await prisma.project.deleteMany();
        await prisma.project.createMany({
          data: (parsed.data as { title: string; description: string; color?: string; imageUrl?: string; url?: string; tags?: string[]; published?: boolean }[])
            .map((p, i) => ({
              title: p.title,
              description: p.description,
              color: p.color ?? "#333366",
              imageUrl: p.imageUrl ?? "",
              url: p.url ?? "",
              tags: p.tags ?? [],
              published: p.published ?? true,
              position: i,
            })),
        });
        break;
```

- [ ] **Step 4: Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/siteDataSchemas.ts src/app/api/site-data/route.ts
git commit -m "(feat) : add published field to project types, validation and save route"
```

---

## Task 4: Filtrer les projets masqués côté public

**Files:**
- Modify: `src/app/api/site-data/route.ts:16-39` (GET)
- Modify: `src/app/page.tsx:6-22` (`getSiteData`)

- [ ] **Step 1: Filtrer dans le GET de l'API (sauf session admin)**

L'API GET est publique : sans filtre, les projets masqués fuiteraient. Le back-office (session admin) doit en revanche tout recevoir. Dans `src/app/api/site-data/route.ts`, remplacer la fonction `GET` par (les imports `getServerSession` et `authOptions` existent déjà en tête de fichier) :

```ts
// GET - Public : retourne toutes les données du site
// (les projets masqués ne sont renvoyés qu'aux admins connectés)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";

    const [settings, hero, stats, services, projects, expertise] =
      await Promise.all([
        prisma.siteSettings.findUnique({ where: { id: "main" } }),
        prisma.heroContent.findUnique({ where: { id: "main" } }),
        prisma.heroStat.findMany({ orderBy: { position: "asc" } }),
        prisma.service.findMany({ orderBy: { position: "asc" } }),
        prisma.project.findMany({
          where: isAdmin ? {} : { published: true },
          orderBy: { position: "asc" },
        }),
        prisma.expertiseGroup.findMany({ orderBy: { position: "asc" } }),
      ]);

    return NextResponse.json({
      settings,
      hero: { ...hero, stats },
      services,
      projects,
      expertise,
    });
  } catch (error) {
    console.error("GET site-data error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Filtrer dans la page publique**

Dans `src/app/page.tsx`, fonction `getSiteData`, remplacer la ligne `prisma.project.findMany({ orderBy: { position: "asc" } }),` par :

```ts
        prisma.project.findMany({ where: { published: true }, orderBy: { position: "asc" } }),
```

- [ ] **Step 3: Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/site-data/route.ts src/app/page.tsx
git commit -m "(feat) : hide unpublished projects from public site and public API"
```

---

## Task 5: Nouvelles icônes dans AdminIcon

**Files:**
- Modify: `src/components/admin/atoms/AdminIcon/AdminIcon.tsx:1-14` (map `PATHS`)

- [ ] **Step 1: Ajouter les paths**

Dans `src/components/admin/atoms/AdminIcon/AdminIcon.tsx`, ajouter ces 4 entrées à la fin de la map `PATHS` (même style que l'existant : SVG 24×24, stroke, pas de fill) :

```ts
  search: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z",
  grip: "M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01",
  "eye-off": "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22",
  "arrow-left": "M19 12H5M12 19l-7-7 7-7",
}; // ← l'accolade fermante existante de PATHS
```

(`grip` : 6 micro-segments qui, avec `strokeLinecap="round"` déjà présent sur le composant, se rendent comme 6 points de poignée.)

- [ ] **Step 2: Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/atoms/AdminIcon/AdminIcon.tsx
git commit -m "(feat) : add search, grip, eye-off and arrow-left icons to AdminIcon"
```

---

## Task 6: Molecule ProjectListItem

**Files:**
- Create: `src/components/admin/molecules/ProjectListItem/ProjectListItem.tsx`
- Create: `src/components/admin/molecules/ProjectListItem/ProjectListItem.module.scss`
- Create: `src/components/admin/molecules/ProjectListItem/index.ts`
- Modify: `src/components/admin/molecules/index.ts`

- [ ] **Step 1: Créer `ProjectListItem.tsx`**

```tsx
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
```

- [ ] **Step 2: Créer `ProjectListItem.module.scss`**

```scss
.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius-sm);
  background: var(--admin-surface);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, opacity 0.15s ease;

  &:hover {
    background: var(--admin-surface-hover);
  }

  &[data-selected="true"] {
    border-color: var(--admin-accent);
    background: var(--admin-accent-soft);
  }

  &[data-hidden="true"] {
    opacity: 0.55;
  }

  &[data-dragging="true"] {
    opacity: 0.4;
  }
}

.dragHandle {
  display: flex;
  align-items: center;
  border: none;
  background: none;
  padding: 4px 2px;
  color: var(--admin-text-dim);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
}

.thumb {
  width: 42px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid var(--admin-border);
  flex-shrink: 0;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--admin-text);
  font-family: var(--font-body);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tags {
  font-size: 0.7rem;
  color: var(--admin-text-muted);
  font-family: var(--font-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.eyeBtn {
  display: flex;
  align-items: center;
  border: none;
  background: none;
  padding: 6px;
  border-radius: var(--admin-radius-sm);
  color: var(--admin-text-muted);
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: var(--admin-surface-hover);
    color: var(--admin-text);
  }
}
```

- [ ] **Step 3: Créer `index.ts`**

```ts
export { default } from "./ProjectListItem";
```

- [ ] **Step 4: Exporter depuis `molecules/index.ts`**

Dans `src/components/admin/molecules/index.ts`, ajouter à la fin :

```ts
export { default as ProjectListItem } from "./ProjectListItem";
```

- [ ] **Step 5: Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/molecules/ProjectListItem src/components/admin/molecules/index.ts
git commit -m "(feat) : add ProjectListItem molecule for compact project rows"
```

---

## Task 7: Refonte du ProjectsEditor en master-detail

**Files:**
- Modify (réécriture complète): `src/components/admin/organisms/ProjectsEditor/ProjectsEditor.tsx`
- Modify (réécriture complète): `src/components/admin/organisms/ProjectsEditor/ProjectsEditor.module.scss`

**Notes de conception :**
- dnd-kit a besoin d'ids stables ; les projets neufs n'ont pas d'`id` BDD (et `deleteMany`+`createMany` les régénère à chaque save). On maintient donc un tableau de clés client (`keysRef`) parallèle au tableau `data` : toute opération (ajout, suppression, déplacement) met à jour les deux.
- Sélection par clé (`selectedKey`), pas par index, pour survivre aux réordonnancements. Sur desktop, repli sur le premier projet si rien n'est sélectionné. Sur mobile (`max-width: 767px`, breakpoint du back-office), le panneau détail ne s'affiche que si `detailOpen` est vrai (attribut `data-detail-open` + CSS).
- Drag désactivé quand une recherche est active (réordonner une liste filtrée est ambigu) ; un hint l'indique.

- [ ] **Step 1: Réécrire `ProjectsEditor.tsx`**

```tsx
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
            <SortableContext items={visible.map((v) => v.key)} strategy={verticalListSortingStrategy}>
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
```

- [ ] **Step 2: Réécrire `ProjectsEditor.module.scss`**

Les classes `.preview`, `.previewLabel`, `.previewBadge`, `.visual`, `.visualLabel`, `.visualHint`, `.colorRow`, `.colorSwatch` existantes sont conservées telles quelles ; on ajoute le layout master-detail. Contenu complet du fichier :

```scss
.layout {
  display: grid;
  grid-template-columns: minmax(280px, 2fr) 3fr;
  gap: 20px;
  align-items: start;
}

.listPane {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.searchRow {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.searchField {
  position: relative;
  flex: 1;
  min-width: 0;
}

.searchIcon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: var(--admin-text-dim);
  pointer-events: none;
  z-index: 1;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  border: 1px dashed var(--admin-border);
  border-radius: var(--admin-radius-sm);
  color: var(--admin-text-muted);
  font-size: 0.82rem;
  font-family: var(--font-body);
  text-align: center;
}

.hint {
  font-size: 0.7rem;
  color: var(--admin-text-dim);
  font-family: var(--font-body);
  text-align: center;
  margin-top: 4px;
}

.detailPane {
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius);
  background: var(--admin-surface);
  padding: 20px;
}

.detailPlaceholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--admin-text-dim);
  font-size: 0.85rem;
  font-family: var(--font-body);
}

.detailHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.detailActions {
  display: flex;
  gap: 8px;
}

.backBtn {
  display: none;
  align-items: center;
  gap: 6px;
  border: none;
  background: none;
  padding: 0 0 14px 0;
  color: var(--admin-text-muted);
  font-size: 0.8rem;
  font-family: var(--font-body);
  cursor: pointer;

  &:hover {
    color: var(--admin-text);
  }
}

@media (max-width: 767px) {
  .layout {
    grid-template-columns: 1fr;

    &[data-detail-open="false"] .detailPane {
      display: none;
    }

    &[data-detail-open="true"] .listPane {
      display: none;
    }
  }

  .backBtn {
    display: flex;
  }
}

.preview {
  height: 120px;
  border-radius: var(--admin-radius-sm);
  margin-bottom: 20px;
  border: 1px solid var(--admin-border);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.previewLabel {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 12px;
  border-radius: 99px;
}

.previewBadge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.68rem;
  font-family: var(--font-mono);
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 3px 10px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.visual {
  margin-top: 16px;
}

.visualLabel {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--admin-text);
  font-family: var(--font-body);
  display: block;
  margin-bottom: 12px;
}

.visualHint {
  font-size: 0.75rem;
  color: var(--admin-text-dim);
  font-family: var(--font-body);
  display: block;
  margin-bottom: 14px;
}

.colorRow {
  display: flex;
  gap: 10px;
  align-items: center;
}

.colorSwatch {
  width: 36px;
  height: 36px;
  border-radius: var(--admin-radius-sm);
  border: 1px solid var(--admin-border);
  flex-shrink: 0;
}
```

- [ ] **Step 3: Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/organisms/ProjectsEditor
git commit -m "(feat) : rework ProjectsEditor as master-detail with search, dnd and visibility"
```

---

## Task 8: Build final et vérification manuelle

- [ ] **Step 1: Build de production**

Run: `npm run build`
Expected: build réussi, aucune erreur TypeScript/ESLint.

- [ ] **Step 2: Vérification manuelle en dev**

Run: `npm run dev`, puis dans le navigateur :

1. **Admin → Projets** (`/admin`, section Projets) : la vue master-detail s'affiche, le premier projet est sélectionné, l'éditeur de droite fonctionne (titre, description, tags, image, couleur).
2. **Recherche** : taper un titre partiel et un tag → la liste filtre ; vérifier que les poignées de drag sont désactivées et que le hint change.
3. **Drag & drop** : réordonner deux projets, Enregistrer, recharger → l'ordre persiste ; vérifier l'ordre sur la page publique `/`.
4. **Visibilité** : masquer un projet via l'œil de la liste, Enregistrer → il disparaît de `/` et de `GET /api/site-data` en navigation privée (non connecté), mais reste visible dans l'admin. Le republier → il réapparaît.
5. **Ajout / suppression** : Ajouter → nouveau projet auto-sélectionné en fin de liste ; Supprimer → la sélection passe au projet suivant ; supprimer tout → état vide avec CTA.
6. **Mobile** (devtools, largeur < 768px) : la liste s'affiche seule ; sélectionner ouvre l'éditeur plein écran ; « Retour à la liste » fonctionne.

- [ ] **Step 3: Commit final éventuel**

Si des ajustements ont été faits pendant la vérification, les committer en `(fix) : …`.
