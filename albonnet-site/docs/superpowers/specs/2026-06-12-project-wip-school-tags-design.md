# Spec — Tags « En cours » (WIP) et « Projet d'école » sur les projets

**Date :** 2026-06-12
**Statut :** validé

## Problème

Tous les projets du portfolio sont présentés de la même façon. Impossible de signaler qu'un projet est en cours de développement, ni de distinguer un travail de cours d'un projet professionnel.

## Objectif

Deux étiquettes par projet, cochables dans le back-office, affichées côté visiteur :

- **« En cours »** (WIP) : le projet est en développement actif.
- **« Projet d'école »** : travail de cours, à différencier des projets pro.

Les deux flags sont indépendants — un projet d'école peut aussi être en cours. Ils sont publics (pas de filtrage par session, contrairement à `published`).

## Modèle de données

### Prisma (`prisma/schema.prisma`, model `Project`)

```prisma
wip    Boolean @default(false)
school Boolean @default(false)
```

Application via `prisma db push` (pattern du projet, pas de migrations versionnées). Les projets existants reçoivent `false` : aucun changement visible après déploiement.

### Types (`src/lib/types.ts`)

`ProjectData` : ajout de `wip?: boolean` et `school?: boolean` (optionnels, lus avec `?? false`).

### Validation Zod (`src/lib/siteDataSchemas.ts`)

`projectSchema` : ajout de `wip: z.boolean().optional()` et `school: z.boolean().optional()`.

### API (`src/app/api/site-data/route.ts`)

PUT, case `projects` : mapper `wip: p.wip ?? false` et `school: p.school ?? false`. Le GET ne change pas (les deux champs sont renvoyés tels quels, à tous).

## Back-office

### Nouvel atom `AdminCheckbox`

`src/components/admin/atoms/AdminCheckbox/` (tsx + module.scss + index.ts + export dans `atoms/index.ts`). Props : `{ label: string; checked: boolean; onChange: (checked: boolean) => void }`. Case à cocher native stylée avec les variables admin (`--admin-accent` quand cochée, `--admin-border` sinon), libellé cliquable.

### `ProjectsEditor` (panneau détail)

Un `FieldGroup` « Étiquettes » inséré entre « Tags / Technologies » et le séparateur du bloc visuel, contenant les deux cases côte à côte :

- « En cours (WIP) » → `update(selectedIndex, "wip", …)`
- « Projet d'école » → `update(selectedIndex, "school", …)`

Pas d'indicateur dans la liste de gauche (`ProjectListItem` inchangé).

## Site public

### `ProjectCard` (`src/components/site/molecules/ProjectCard/`)

Deux nouvelles props optionnelles : `wip?: boolean; school?: boolean`. Si l'une est active, un conteneur en position absolue en haut à gauche du `.visual` (12px du bord, flex avec gap 6px, au-dessus du `.visualBg`, sous l'`.overlay` de hover) affiche :

- « En cours » — pill fond `var(--color-accent)` (#e8503a), texte blanc
- « Projet d'école » — pill fond sombre neutre (rgba(20, 20, 28, 0.85)), texte blanc

Style pill : font-size ~0.7rem, font-weight 600, padding 4px 10px, border-radius full, même famille de police que `.visitBtn`.

### `ProjectsSection`

Passe `wip={p.wip}` et `school={p.school}` à chaque `ProjectCard`.

## Cas limites

- Données client sans les champs (avant resauvegarde) → `?? false` partout.
- Les deux flags actifs → les deux pills s'affichent côte à côte (« En cours » en premier).
- Aucun flag → aucun conteneur rendu (pas de div vide).

## Vérification

1. `npx tsc --noEmit` puis `npm run build` (Node 22 via nvm) sans erreur.
2. Manuel : cocher/décocher dans l'admin → Enregistrer → pills visibles sur `/` ; vérifier le rendu image ET dégradé couleur ; vérifier le hover (overlay « Visiter le site » au-dessus des pills).

## Hors périmètre

- Indicateurs WIP/école dans la liste admin.
- Filtre public par type de projet.
