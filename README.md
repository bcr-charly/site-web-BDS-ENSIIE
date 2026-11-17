# Site web du BDS ENSIIE

Site public du Bureau des sports de l'ENSIIE, généré à partir de la spécification fonctionnelle et technique (v1.0).

- **Stack** : Next.js 14+ (App Router, TypeScript), Prisma, PostgreSQL, Tailwind CSS, shadcn/ui (composants à venir).
- **État actuel** : phases 0–1 de la spec — initialisation du projet, schéma Prisma complet (tables boutique incluses mais inutilisées), seed de données fictives + les 9 sports réels, et pages publiques (accueil, sports, planning, équipe, compétitions, boutique « bientôt disponible »).
- **Design** : noir `#000000`, blanc `#FFFFFF`, orange `#FFA500` (accent), typos Inter + Bricolage Grotesque, responsive mobile, accessibilité AA (contraste, focus visibles, alt).

## Démarrage en local

```bash
cp .env.example .env.local
# éditer DATABASE_URL (PostgreSQL local, ex. docker run -p 127.0.0.1:5432:5432 postgres)
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Le seed crée des données **fictives** (membres du bureau, joueurs, compétitions) plus les 9 sports réels et les 3 créneaux connus (volley lundi 18h15–20h15, foot lundi 20h30–22h00, badminton jeudi 18h15–20h00).

## Structure

```
prisma/schema.prisma   schéma complet (users, sports, sessions, teamMembers, competitions,
                       registrations, adhesions, payments, products/orders/orderItems, bdsMember)
prisma/seed.ts         seed fictif (npm run db:seed)
src/app/               pages App Router (publiques en v1)
src/components/        navbar, footer, hero, cartes (sport, membre, compétition), planning semaine
src/lib/               client Prisma, accès données, config du site
```

## Règles d'hygiène (obligatoires)

- Aucun secret dans le dépôt : tout passe par variables d'environnement (voir `.env.example`). Activer le push protection et le scan de secrets sur GitHub.
- Aucune donnée personnelle réelle dans le code : seed fictif uniquement ; photos et contenus réels en base/storage, jamais commités.
- Licence : MIT.

## Phases suivantes (spec §16)

- Phase 2 : planning (CRUD app admin + filtres côté public).
- Phase 3 : authentification Auth.js v5 (@ensiie.eu + vérification email) + cotisation HelloAsso à la création du compte + espace membre.
- Phase 4 : compétitions payantes (checkout API v5 + webhook + trace `payments` + validation auto) et inscription à un sport depuis sa page.
- Phase 5 : app admin séparée (Vercel) + API `/api/admin/*` sécurisée par jeton de service + grades.
- Phase 6 : déploiement serveur école (Docker, Nginx/Caddy, HTTPS, sauvegardes), SEO, mentions légales.
- Phase 7 (v2) : boutique complète + licence FFSU (18 €) + matchs FFSU dans les pages sports.

## Contenus à fournir par le BDS (spec §19)

Logo/favicons réels, `public/hero.jpg`, photos et postes des membres du bureau, photos/descriptions des 9 sports, créneaux manquants (basket, muscu, arts martiaux, course, natation, rugby) et lieux, liste des compétitions de la saison, montant de la cotisation, partenaires, réseaux sociaux, email de contact, mentions légales.

## Variables d'environnement

Voir `.env.example`. En prod (serveur de l'école) : `DATABASE_URL` pointe vers la PostgreSQL locale (jamais exposée), `ADMIN_API_TOKEN` est le jeton de service partagé avec l'app admin Vercel, les identifiants HelloAsso restent en sandbox tant que l'organisation n'est pas vérifiée.
