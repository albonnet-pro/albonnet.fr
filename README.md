# albonnet.fr - Site vitrine

Site vitrine et portfolio d'**Alexis Bonnet**, développeur web freelance basé à Grenoble.  
Conçu pour présenter l'activité, les projets et permettre la prise de contact.

## Ce que fait ce projet

**Pour les visiteurs**
- Présentation de l'activité, des services proposés et du positionnement
- Portfolio de projets réalisés avec descriptions et technologies utilisées
- Sections expertise organisées par domaine de compétence
- Formulaire de contact directement relié à une boîte mail via [Resend](https://resend.com)

**Pour l'administrateur**
- Back-office sécurisé permettant de modifier l'intégralité du contenu du site sans toucher au code
- Gestion des sections : Hero, Services, Projets, Expertise, Paramètres généraux
- Upload d'images pour les visuels de projets

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, ISR) |
| Langage | TypeScript |
| Base de données | PostgreSQL via Prisma ORM |
| Authentification | NextAuth.js (JWT) |
| Email | Resend |
| Style | SCSS Modules |
| Déploiement | Docker + Portainer |

## Architecture

Le projet suit le pattern **Atomic Design** :

```
src/
├── app/                  # Routes Next.js (pages publiques + admin + API)
├── components/
│   ├── atoms/            # Éléments de base (Button, Text, Icon…)
│   ├── molecules/        # Composants composites (NavLink, Logo, Card…)
│   ├── organisms/        # Sections complètes (Navbar, Hero, Footer…)
│   └── templates/        # Layouts de pages (HomePage, BackOffice)
└── lib/                  # Utilitaires, config auth, schémas Zod, fonts
```

## Sécurité

- Authentification par JWT avec sessions 7 jours
- Rate limiting en mémoire sur le formulaire de contact et la page de login
- Validation des entrées API avec [Zod](https://zod.dev)
- Validation magic bytes sur les uploads (JPEG, PNG, WebP, GIF uniquement)
- Content-Security-Policy, HSTS, X-Frame-Options et autres headers de sécurité
- Protection des routes `/admin` et `/api` via middleware Next.js

## SEO & Performance

- Rendu ISR (revalidation toutes les 24h)
- Sitemap et robots.txt générés automatiquement
- JSON-LD structuré (Person + ProfessionalService)
- Open Graph et Twitter Card
- Image OG dynamique via `ImageResponse`
- Polices auto-hébergées (Clash Display, General Sans, JetBrains Mono)
- PWA-ready : manifest, icônes toutes tailles

---

---

**v1.1.0** - © 2025 Alexis Bonnet - Tous droits réservés. Voir [LICENSE](./albonnet-site/LICENSE).
