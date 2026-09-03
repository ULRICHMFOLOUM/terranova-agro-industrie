# TERRANOVA AGRO-INDUSTRIE — Plateforme E-Commerce & Vitrine Premium

Plateforme e-commerce et vitrine d'excellence pour la firme agro-pastorale et industrielle **TERRANOVA AGRO-INDUSTRIE**.

Conçue avec un niveau d'exigence digne d'une agence haut de gamme, l'application allie une identité visuelle chaleureuse et industrielle, une scène 3D interactive Three.js réactive au défilement, un CMS dynamique en base de données, une authentification sécurisée à double rôle (ADMIN / CLIENT), un tunnel d'achat sans friction avec paiement Fapshi (Orange Money & MTN MoMo) et WhatsApp, une génération de factures PDF de prestige, et une Progressive Web App (PWA) installable.

---

## 🛠️ Stack Technique

- **Framework** : Next.js 15 (App Router, Server Components & Server Actions)
- **Langage & Typage** : React 19 + TypeScript strict
- **Design & Styles** : Tailwind CSS avec palette de tokens sur mesure (argile profonde `#141C15`, terre brûlée `#C26526`, ambre `#E6AF2E`, lin chaud `#FBF9F5`)
- **Base de Données & ORM** : Prisma ORM avec base SQLite prête à l'emploi (ou compatible PostgreSQL via `DATABASE_URL`)
- **3D Interactive** : React Three Fiber + Three.js (scène agro-industrielle procédurale réactive au scroll, chargée côté client avec fallback WebGL)
- **Animations & Micro-interactions** : Framer Motion + GSAP
- **Authentification & Rôles** : Module d'authentification sécurisé (hachage bcrypt, JWT, cookies HttpOnly, rôle ADMIN et rôle CLIENT)
- **Paiements** : Passerelle Fapshi (Orange Money & MTN MoMo avec simulateur sandbox intégré) + Commande directe WhatsApp (`wa.me`)
- **Facturation** : Générateur de factures PDF haute fidélité avec sceau numérique
- **PWA** : `manifest.json`, Service Worker de mise en cache (`sw.js`), icônes adaptatives et bouton d'installation natif.

---

## 🚀 Démarrage Rapide en Local

### 1. Cloner et Installer les dépendances
```bash
npm install --legacy-peer-deps
```

### 2. Initialiser la Base de Données et Charger les Données de Démonstration
```bash
# Appliquer le schéma Prisma
npx prisma db push

# Exécuter le script de seed (crée les utilisateurs, 5 filières, 13 produits riches et 8 sections CMS)
npx tsx prisma/seed.ts
```

### 3. Lancer le Serveur de Développement
```bash
npm run dev
```
L'application est immédiatement accessible à l'adresse : **`http://localhost:3000`**

---

## 🔑 Identifiants des Comptes de Démonstration

| Rôle | Email | Mot de Passe | Accès & Rôle |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `admin@terranova.agri` | `AdminTerra2026!` | Accès complet au back-office `/admin` (gestion des ventes, produits, filières, CMS, stocks) |
| **Client Test** | `client@terranova.agri` | `ClientTerra2026!` | Espace client `/compte` (historique des commandes, factures PDF, validation de commande) |

---

## 🎨 Remplacement du Logo et des Icônes PWA

Le logo temporaire (monogramme géométrique épi et "T" d'or) peut être remplacé à tout moment sans modification de code.

Pour installer le logo définitif du client :
1. Remplacer les fichiers suivants dans le dossier `/public` :
   - `public/favicon.svg` : Logo vectoriel
   - `public/favicon.ico` : Favicon multi-résolution
   - `public/icon-192.png` : Icône carrée 192×192 px
   - `public/icon-512.png` : Icône carrée 512×512 px
   - `public/icon-maskable-512.png` : Icône adaptative 512×512 px (avec 15% de marge de sécurité pour Android)
2. Actualiser la page ou vider le cache du Service Worker : le nouveau logo apparaîtra immédiatement sur tous les écrans et sur l'écran d'accueil des smartphones/ordinateurs.

---

## 📑 Parcours Utilisateur Validés

1. **Visite & Découverte** : Écran de chargement avec monogramme animé, Hero avec scène 3D interactive, sections éditoriales et familles de produits.
2. **Consultation du Catalogue** : Filtres par catégorie, recherche textuelle, tri par prix et consultation des fiches techniques agronomiques.
3. **Panier Persistant** : Ajout sans obligation de compte, ajustement des quantités et sous-total dynamique en FCFA.
4. **Validation de Commande & Paiement** :
   - Connexion / inscription client sans perte du panier.
   - Choix du paiement Fapshi (Orange Money / MTN MoMo) ou Commande WhatsApp.
   - Simulation de validation de paiement instantanée en environnement de test.
5. **Facturation & Espace Client** : Visualisation et téléchargement direct de la facture PDF avec mentions légales et sceau numérique.
6. **Administration** : Dashboard avec chiffre d'affaires, gestion des filières (CRUD avec sécurité), gestion des produits (édition rapide des prix et stocks), réorganisation en glisser-déposer des sections CMS.
