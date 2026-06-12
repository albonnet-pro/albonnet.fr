# Project WIP & School Tags Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deux étiquettes par projet — « En cours » (WIP) et « Projet d'école » — cochables dans le back-office et affichées en pills sur la carte projet publique.

**Architecture:** Deux booléens indépendants `wip` et `school` sur le modèle Prisma `Project`, propagés comme `published` (types → Zod → PUT). Côté admin, un nouvel atom `AdminCheckbox` utilisé dans un FieldGroup « Étiquettes » du panneau détail de `ProjectsEditor`. Côté public, `ProjectCard` affiche des pills en haut à gauche du visuel.

**Tech Stack:** Next.js 16 (App Router), React 18, TypeScript, SCSS modules, Prisma (PostgreSQL), Zod.

**Spec :** `docs/superpowers/specs/2026-06-12-project-wip-school-tags-design.md`

**Notes :**
- Pas de framework de test dans ce repo : vérification par `npx tsc --noEmit` par tâche, `npm run build` final (nécessite Node ≥ 20.9 : `export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"` car le node système est en v18), contrôle manuel à la fin.
- Commits sur `main` directement (choix du user), style `(feat) : …`.
- Répertoire de travail : `/home/alexis/Documents/Perso/albonnet-pro/albonnet.fr/albonnet-site`.
- L'arbre de travail contient une modification locale de `src/components/admin/templates/BackOffice/BackOffice.module.scss` qui n'appartient PAS à cette feature : ne pas la stager, ne pas la committer, ne pas la modifier.

---

## Task 1: Champs `wip` et `school` dans Prisma + pipeline de données

**Files:**
- Modify: `prisma/schema.prisma` (model `Project`)
- Modify: `src/lib/types.ts` (interface `ProjectData`)
- Modify: `src/lib/siteDataSchemas.ts` (`projectSchema`)
- Modify: `src/app/api/site-data/route.ts` (case `projects` du PUT)

- [ ] **Step 1: Ajouter les colonnes au modèle Prisma**

Dans `prisma/schema.prisma`, model `Project`, ajouter deux lignes après `published` :

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
  wip         Boolean  @default(false)
  school      Boolean  @default(false)
  position    Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- [ ] **Step 2: Pousser le schéma**

Run: `npx prisma db push`
Expected: `Your database is now in sync with your Prisma schema.` — la base tourne dans le conteneur Docker `albonnet-site-db` (port 5432) ; s'il est arrêté, le démarrer avec `docker start albonnet-site-db`.

- [ ] **Step 3: Ajouter les champs à `ProjectData`**

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
  wip?: boolean;
  school?: boolean;
}
```

- [ ] **Step 4: Mettre à jour le schéma Zod**

Dans `src/lib/siteDataSchemas.ts`, remplacer `projectSchema` par :

```ts
const projectSchema = z.object({
  title:       z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  color:       z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  imageUrl:    z.string().max(500).optional(),
  url:         z.string().url().max(500).or(z.literal("")).optional(),
  tags:        z.array(z.string().max(30)).max(10).optional(),
  published:   z.boolean().optional(),
  wip:         z.boolean().optional(),
  school:      z.boolean().optional(),
});
```

(`projectsSchema` reste `z.array(projectSchema).max(50)` — ne pas y toucher.)

- [ ] **Step 5: Mapper dans le PUT**

Dans `src/app/api/site-data/route.ts`, remplacer le `case "projects":` par :

```ts
      case "projects":
        await prisma.project.deleteMany();
        await prisma.project.createMany({
          data: (parsed.data as { title: string; description: string; color?: string; imageUrl?: string; url?: string; tags?: string[]; published?: boolean; wip?: boolean; school?: boolean }[])
            .map((p, i) => ({
              title: p.title,
              description: p.description,
              color: p.color ?? "#333366",
              imageUrl: p.imageUrl ?? "",
              url: p.url ?? "",
              tags: p.tags ?? [],
              published: p.published ?? true,
              wip: p.wip ?? false,
              school: p.school ?? false,
              position: i,
            })),
        });
        break;
```

Le GET ne change pas (il renvoie déjà tous les champs du modèle).

- [ ] **Step 6: Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma src/lib/types.ts src/lib/siteDataSchemas.ts src/app/api/site-data/route.ts
git commit -m "(feat) : add wip and school flags to Project data pipeline"
```

---

## Task 2: Atom AdminCheckbox

**Files:**
- Create: `src/components/admin/atoms/AdminCheckbox/AdminCheckbox.tsx`
- Create: `src/components/admin/atoms/AdminCheckbox/AdminCheckbox.module.scss`
- Create: `src/components/admin/atoms/AdminCheckbox/index.ts`
- Modify: `src/components/admin/atoms/index.ts`

- [ ] **Step 1: Créer `AdminCheckbox.tsx` avec exactement ce contenu**

```tsx
"use client";

import styles from "./AdminCheckbox.module.scss";

export default function AdminCheckbox({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={styles.wrapper}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.input}
      />
      <span className={styles.box} aria-hidden="true">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
```

- [ ] **Step 2: Créer `AdminCheckbox.module.scss` avec exactement ce contenu**

```scss
.wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + .box {
    background: var(--admin-accent);
    border-color: var(--admin-accent);
    color: #fff;

    svg {
      opacity: 1;
    }
  }

  &:focus-visible + .box {
    outline: 2px solid var(--admin-accent-glow);
    outline-offset: 2px;
  }
}

.box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--admin-border-light);
  border-radius: 4px;
  background: var(--admin-surface);
  transition: background 0.15s ease, border-color 0.15s ease;
  flex-shrink: 0;

  svg {
    opacity: 0;
    transition: opacity 0.1s ease;
  }
}

.label {
  font-size: 0.82rem;
  color: var(--admin-text);
  font-family: var(--font-body);
}
```

- [ ] **Step 3: Créer `index.ts`**

```ts
export { default } from "./AdminCheckbox";
```

- [ ] **Step 4: Ajouter l'export au barrel**

Dans `src/components/admin/atoms/index.ts`, ajouter à la fin :

```ts
export { default as AdminCheckbox } from "./AdminCheckbox";
```

- [ ] **Step 5: Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/atoms/AdminCheckbox src/components/admin/atoms/index.ts
git commit -m "(feat) : add AdminCheckbox atom"
```

---

## Task 3: Cases « Étiquettes » dans le panneau détail de ProjectsEditor

**Files:**
- Modify: `src/components/admin/organisms/ProjectsEditor/ProjectsEditor.tsx`
- Modify: `src/components/admin/organisms/ProjectsEditor/ProjectsEditor.module.scss`

- [ ] **Step 1: Importer AdminCheckbox**

Dans `src/components/admin/organisms/ProjectsEditor/ProjectsEditor.tsx`, ajouter après la ligne `import AdminBadge from "@/components/admin/atoms/AdminBadge";` :

```tsx
import AdminCheckbox from "@/components/admin/atoms/AdminCheckbox";
```

- [ ] **Step 2: Insérer le FieldGroup « Étiquettes »**

Dans le même fichier, le panneau détail contient actuellement :

```tsx
            <FieldGroup label="Tags / Technologies">
              <TagInput tags={selected.tags || []} onChange={(tags) => update(selectedIndex, "tags", tags)} />
            </FieldGroup>
            <Separator />
```

Remplacer ce bloc par :

```tsx
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
```

- [ ] **Step 3: Ajouter le style `.flagsRow`**

Dans `src/components/admin/organisms/ProjectsEditor/ProjectsEditor.module.scss`, ajouter à la fin du fichier :

```scss
.flagsRow {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 4px 0;
}
```

- [ ] **Step 4: Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/organisms/ProjectsEditor
git commit -m "(feat) : add wip and school checkboxes to project detail panel"
```

---

## Task 4: Pills sur la carte projet publique

**Files:**
- Modify: `src/components/site/molecules/ProjectCard/ProjectCard.tsx`
- Modify: `src/components/site/molecules/ProjectCard/ProjectCard.module.scss`
- Modify: `src/components/site/organisms/ProjectsSection/ProjectsSection.tsx`

- [ ] **Step 1: Ajouter les props et les pills à `ProjectCard.tsx`**

Remplacer la signature et le JSX du lien visuel. La signature actuelle :

```tsx
export default function ProjectCard({ title, tags, description, image, url, index, visible }: {
  title: string;
  tags: string[];
  description: string;
  image: string;
  url?: string;
  index: number;
  visible: boolean;
}) {
```

devient :

```tsx
export default function ProjectCard({ title, tags, description, image, url, index, visible, wip, school }: {
  title: string;
  tags: string[];
  description: string;
  image: string;
  url?: string;
  index: number;
  visible: boolean;
  wip?: boolean;
  school?: boolean;
}) {
```

Puis, dans le JSX, juste après la ligne `<div className={styles.visualBg} style={visualStyle} />` et avant le bloc `{url && (` de l'overlay, insérer :

```tsx
          {(wip || school) && (
            <div className={styles.flags}>
              {wip && <span className={`${styles.flag} ${styles.flagWip}`}>En cours</span>}
              {school && <span className={`${styles.flag} ${styles.flagSchool}`}>Projet d&apos;école</span>}
            </div>
          )}
```

(Ainsi les pills sont au-dessus du `.visualBg` mais sous l'`.overlay` de hover, qui est rendu après dans le DOM.)

- [ ] **Step 2: Ajouter les styles des pills**

Dans `src/components/site/molecules/ProjectCard/ProjectCard.module.scss`, ajouter à la fin du fichier :

```scss
.flags {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.flag {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.flagWip {
  background: var(--color-accent);
}

.flagSchool {
  background: rgba(20, 20, 28, 0.85);
}
```

- [ ] **Step 3: Passer les props depuis `ProjectsSection`**

Dans `src/components/site/organisms/ProjectsSection/ProjectsSection.tsx`, le rendu actuel :

```tsx
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
```

devient :

```tsx
              <ProjectCard
                key={i}
                title={p.title}
                tags={p.tags}
                description={p.description}
                image={image}
                url={p.url}
                index={i}
                visible={visible}
                wip={p.wip}
                school={p.school}
              />
```

- [ ] **Step 4: Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

- [ ] **Step 5: Commit**

```bash
git add src/components/site/molecules/ProjectCard src/components/site/organisms/ProjectsSection/ProjectsSection.tsx
git commit -m "(feat) : show wip and school pills on public project cards"
```

---

## Task 5: Build final et vérification

- [ ] **Step 1: Build de production**

Run: `export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH" && npm run build`
Expected: build réussi sans erreur.

- [ ] **Step 2: Vérification de bout en bout (serveur dev déjà lancé sur :3000)**

Le serveur dev tourne déjà (tâche de fond) et la base dans `albonnet-site-db`. Vérifier sans session admin :

```bash
docker exec albonnet-site-db psql -U albonnet -d albonnet -c "UPDATE \"Project\" SET wip = true, school = true WHERE position = 0;"
curl -s http://localhost:3000/api/site-data | python3 -c "import json,sys; print([(p['title'], p['wip'], p['school']) for p in json.load(sys.stdin)['projects']])"
curl -s http://localhost:3000/ | grep -c -E 'En cours|Projet d.école'
docker exec albonnet-site-db psql -U albonnet -d albonnet -c "UPDATE \"Project\" SET wip = false, school = false WHERE position = 0;"
```

Expected : l'API renvoie `wip`/`school`, le grep trouve au moins 2 occurrences sur la page publique, puis l'état est restauré.

- [ ] **Step 3: Vérification manuelle (utilisateur)**

Dans l'admin : cocher « En cours (WIP) » et « Projet d'école » sur un projet, Enregistrer, vérifier les pills en haut à gauche du visuel sur `/` (rendu image ET dégradé), vérifier le hover (l'overlay « Visiter le site » passe au-dessus des pills).
