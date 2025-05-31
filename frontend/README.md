# Frontend - Système de Réservation de Parking

## Vue d'ensemble

Application web de gestion des réservations de parking d'entreprise, développée avec Next.js 14, TypeScript et Tailwind CSS.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Production

```bash
npm run build
npm start
```

## Architecture

### Structure des dossiers

```
frontend/
├── app/                    # Pages Next.js (App Router)
│   ├── login/             # Page de connexion
│   ├── dashboard/         # Dashboards par rôle
│   │   ├── employee/      # Dashboard employé
│   │   ├── secretary/     # Dashboard secrétaire (admin)
│   │   └── manager/       # Dashboard manager
│   └── ...
├── components/            # Composants réutilisables
├── services/              # Services (API, auth)
├── types/                 # Types TypeScript
└── middleware.ts          # Middleware d'authentification
```

## Rôles et Permissions

### 1. Employee (Employé)
- **Réservation** : Maximum 5 jours ouvrables
- **Check-in** : Obligatoire avant 11h00
- **Places électriques** : Peut réserver dans les rangées A et F
- **Fonctionnalités** :
  - Faire une réservation
  - Voir ses réservations actives
  - Faire un check-in (QR code ou manuel)
  - Consulter l'historique
  - Voir le plan du parking

### 2. Secretary (Secrétaire)
- **Accès admin complet**
- **Fonctionnalités** :
  - Gérer toutes les réservations
  - Check-in/check-out manuel pour tous
  - Gestion des utilisateurs (CRUD)
  - Créer des réservations pour les employés
  - Accès à l'historique complet
  - Configuration du parking
  - Export des données
  - Support aux employés

### 3. Manager
- **Réservation** : Jusqu'à 30 jours consécutifs
- **Statistiques** : Accès complet aux analytics
- **Fonctionnalités** :
  - Dashboard avec KPIs
  - Taux d'occupation
  - Statistiques de no-show
  - Utilisation des places électriques
  - Génération de rapports
  - Gestion des utilisateurs
  - Configuration du parking

## Règles Métier

### Places de Parking
- **Total** : 60 places (numérotées A01 à F10)
- **Organisation** : 6 rangées (A-F) de 10 places chacune
- **Places électriques** : Rangées A et F (20 places avec chargeurs)
- **Layout** : [A B|C D|E F]

### Réservations
- **Durée max employé** : 5 jours ouvrables
- **Durée max manager** : 30 jours
- **Check-in** : Obligatoire avant 11h00
- **Libération automatique** : Places non confirmées à 11h00
- **QR Code** : Disponible pour chaque place

## Authentification

- **Token JWT** : Stocké dans un cookie HTTPOnly
- **Données utilisateur** : Stockées dans localStorage
- **Protection des routes** : Via middleware Next.js

## API Endpoints Principaux

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion

### Réservations
- `GET /api/reservations` - Liste des réservations
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/{id}/checkin` - Check-in
- `DELETE /api/reservations/{id}` - Annuler

### Utilisateurs (Admin)
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/{id}` - Modifier
- `DELETE /api/users/{id}` - Supprimer

### Statistiques (Manager)
- `GET /api/stats/occupancy` - Taux d'occupation
- `GET /api/stats/no-shows` - Statistiques no-show
- `GET /api/stats/electric` - Utilisation places électriques

## Comptes de Test

### Manager
- Email: `lucas.petit@parking.fr`
- Mot de passe: `Password123!`

### Employee
- Email: `marie.martin@parking.fr`
- Mot de passe: `Password123!`

### Secretary
- Email: `sophie.bernard@parking.fr`
- Mot de passe: `Password123!`

## Variables d'Environnement

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Technologies

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript/JavaScript
- **Styling** : Tailwind CSS
- **Auth** : JWT avec cookies
- **HTTP Client** : Axios
- **State** : React hooks

## Déploiement

L'application est containerisée avec Docker :

```bash
docker build -t parking-frontend .
docker run -p 3000:3000 parking-frontend
``` 