# Spec — Upgrade de la gestion des projets dans le back-office

**Date :** 2026-06-11
**Statut :** validé

## Problème

Le back-office affiche les projets comme une liste verticale de cartes d'édition entièrement dépliées (`ProjectsEditor`). Avec beaucoup de projets, la page devient une liste interminable : impossible de retrouver un projet rapidement, de changer leur ordre, ou d'en masquer un sans le supprimer.

## Objectif

Refondre la section Projets du back-office en vue **master-detail** :

- Liste compacte à gauche (vignette, titre, tags, statut), éditeur du projet sélectionné à droite.
- **Recherche** instantanée par titre et tags.
- **Réorganisation** par drag & drop (l'ordre de la liste = l'ordre d'affichage sur le site).
- **Visibilité** publié/masqué par projet : un projet masqué reste en base mais n'apparaît plus sur le site public.

Périmètre : back-office uniquement. Le seul changement côté site public est le filtrage des projets masqués (conséquence directe de la visibilité).

## Architecture

### Composants (atomic design admin existant)

Chaque composant suit la convention du projet : dossier avec `Composant.tsx` + `Composant.module.scss` + `index.ts`, exports ajoutés aux `index.ts` de niveau (`atoms/index.ts`, `molecules/index.ts`, …).

| Composant | Type | Rôle |
|---|---|---|
| `ProjectsEditor` | organism (refonte) | Layout master-detail. État local : `selectedIndex`, `searchQuery`. Contient la liste (avec contexte dnd-kit) et le panneau d'édition. |
| `ProjectListItem` | molecule (nouveau) | Ligne compacte : poignée de drag, vignette (image ou dégradé couleur), titre, tags tronqués, bouton œil (toggle publié/masqué). État sélectionné stylé avec l'accent admin. |

Le panneau d'édition (partie « detail ») réutilise tels quels les composants existants : `FieldGroup`, `AdminInput`, `AdminTextArea`, `TagInput`, `ImageUpload`, `Separator`, `AdminButton`, ainsi que l'aperçu visuel et le bouton Supprimer actuels. Il reste interne à `ProjectsEditor` (pas de nouveau composant dédié).

### Icônes

Ajout dans la map `PATHS` de `AdminIcon` (`src/components/admin/atoms/AdminIcon/AdminIcon.tsx`), même style que l'existant (SVG 24×24, stroke 2, sans fill) :

- `search` — loupe (champ de recherche)
- `grip` — poignée de drag
- `eye-off` — œil barré (projet masqué) ; `eye` existe déjà pour publié
- `arrow-left` — bouton retour mobile

Pas de FontAwesome dans les éditeurs (FontAwesome reste cantonné à la sidebar, comme aujourd'hui).

### Dépendances

Ajout de `@dnd-kit/core` et `@dnd-kit/sortable` (drag & drop souris, tactile et clavier).

## Modèle de données

### Prisma (`prisma/schema.prisma`)

```prisma
model Project {
  // champs existants inchangés…
  published Boolean @default(true)
}
```

Application via `prisma db push` (le projet n'utilise pas de migrations versionnées — `prisma/migrations/` est gitignoré). Les projets existants reçoivent `published = true` : aucun changement visible après déploiement.

### Types (`src/lib/types.ts`)

`ProjectData` : ajout de `published: boolean`.

### Validation Zod (`src/lib/siteDataSchemas.ts`)

- `projectSchema` : ajout de `published: z.boolean().optional()` (défaut `true` côté route).
- `projectsSchema` : limite relevée de `.max(20)` à `.max(50)`.

### API (`src/app/api/site-data/route.ts`)

- **PUT** (case `projects`) : mapper `published: p.published ?? true`. Le mécanisme `deleteMany` + `createMany` avec `position = index` du tableau est inchangé — le drag & drop ne fait que réordonner le tableau côté client avant sauvegarde.
- **GET** : les projets avec `published: false` sont exclus de la réponse **sauf** si la requête porte une session admin (`getServerSession`). Sans cela, les projets masqués fuiteraient via l'API publique. Le back-office (qui a la session) continue de recevoir tous les projets.

### Site public (`src/app/page.tsx`)

`prisma.project.findMany({ where: { published: true }, orderBy: { position: "asc" } })`.

Aucun autre changement côté site public.

## Comportements UI

- **Recherche** : filtre instantané, insensible à la casse, sur titre et tags. Pendant une recherche active, le drag & drop est désactivé (réordonner une liste filtrée est ambigu) ; un hint discret l'indique.
- **Sélection** : clic sur une ligne → le panneau de droite affiche l'éditeur de ce projet. Sur desktop, le premier projet est sélectionné au chargement (s'il existe) ; sur mobile, aucune sélection initiale (la liste s'affiche seule, l'éditeur ne s'ouvre qu'au clic).
- **Toggle visibilité** : clic sur l'icône œil dans la ligne, sans passer par l'éditeur. L'état est aussi visible/modifiable dans le panneau détail (badge Publié/Masqué). Une ligne masquée est légèrement atténuée.
- **Ajout** : bouton « + Ajouter » à côté du champ de recherche. Le nouveau projet (mêmes valeurs par défaut qu'actuellement + `published: true`) est ajouté en fin de liste et auto-sélectionné.
- **Suppression** : bouton Supprimer dans le panneau détail (comme actuellement). La sélection passe au projet suivant, ou au précédent si c'était le dernier, ou à rien si la liste est vide.
- **Drag & drop** : poignée `grip` sur chaque ligne ; le déplacement met à jour l'ordre du tableau et déclenche `hasChanges` (bouton Enregistrer global du header, inchangé).
- **Sauvegarde** : mécanisme global existant inchangé (`useSiteData` → bouton Enregistrer du header).

### Responsive (mobile)

- Liste pleine largeur par défaut.
- Sélectionner un projet affiche l'éditeur plein écran avec un bouton « ← Retour à la liste » (`arrow-left`).
- Breakpoint aligné sur ceux déjà utilisés par le back-office.

### Cas limites

- Liste vide → état vide avec CTA « Ajouter un projet ».
- Recherche sans résultat → message « Aucun projet ne correspond ».
- Données existantes sans champ `published` (côté client avant resauvegarde) → traité comme `true` partout (`?? true`).

## Vérification

Le projet n'a pas de framework de test. Vérification :

1. `npm run build` sans erreur.
2. Test manuel en dev : recherche, drag & drop (ordre reflété sur le site public après sauvegarde), toggle masqué (projet absent du site public et de l'API publique, présent dans l'admin), ajout/suppression, comportement mobile.

## Hors périmètre

- Pagination ou filtres côté site public.
- Réorganisation des autres sections (services, expertise) — le pattern pourra être répliqué plus tard si besoin.
- Migration vers des migrations Prisma versionnées.
