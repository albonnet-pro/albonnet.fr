# Tarifs Hébergement & TMA — Freelance (Albonnet)

## Contexte

Hébergement assuré sur **serveur personnel** (homelab, ex. N100 mini-ITX).  
Coût réel estimé : **1–3 €/mois/site** (électricité + amortissement matériel).

---

## 1. Hébergement

### Tarification

| Type de site | Coût réel | Ce que tu factures |
|---|---|---|
| Site vitrine simple | ~1–2 €/mois | **20–30 €/mois** |
| Site avec back-office / base de données | ~2–3 €/mois | **30–40 €/mois** |

### Points importants

- **Mentionner dans le contrat** que l'hébergement est sur infrastructure privée, sans garantie de disponibilité contractuelle (best effort)
- **Backups hors-site obligatoires** pour chaque client (ex. Backblaze B2, ~0,006 $/Go/mois)
- Pour des clients "critiques" (e-commerce, site à fort trafic), orienter vers Infomaniak ou OVH plutôt que le homelab
- Souscrire une **RC Pro** (obligatoire en freelance dev)

---

## 2. TMA (Tierce Maintenance Applicative)

### Forfait mensuel (abonnement)

| Niveau | Ce qui est inclus | Tarif conseillé |
|---|---|---|
| **Basique** | Mises à jour CMS/plugins, sauvegardes, monitoring | 50–80 €/mois |
| **Standard** | + petites modifs contenu (1–2h/mois), support réactif | 80–150 €/mois |
| **Avancé** | + dev léger (3–5h/mois), reporting mensuel | 150–300 €/mois |

### Intervention ponctuelle (hors forfait)

- Taux horaire débutant freelance : **35–55 €/h**
- En micro-entreprise sous le seuil de franchise TVA : pas de TVA à facturer

---

## 3. Bundle Hébergement + TMA

Le bundle est plus facile à vendre qu'un TMA seul : un seul interlocutoire pour le client, revenu récurrent pour toi.

### Exemple concret — Restaurant (type Le Vieux Moulin)

Site Next.js custom avec back-office :

| Poste | Tarif |
|---|---|
| Hébergement (homelab) | 30–40 €/mois |
| TMA basique (mises à jour menu, events, horaires) | 80–120 €/mois |
| **Total client** | **~120–160 €/mois** |

---

## 4. Bonnes pratiques

- **Formaliser le contrat** : heures incluses, délai de réponse, ce qui est "hors forfait" — sinon le client suppose que tout est inclus
- **Commencer bas** pour les 2–3 premiers clients, revaloriser à la prochaine échéance annuelle
- Mieux vaut 60 €/mois × 5 clients que 0 client à 150 €
- Le modèle **"jetons"** (accumulation d'heures sur les mois calmes, utilisables pour des évolutions ponctuelles) est de plus en plus répandu et appréciable pour les clients
