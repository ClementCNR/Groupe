# Parking Reservation System

Système de réservation de parking avec une architecture hexagonale.

## Prérequis

- Docker

## Structure du Projet

```
.
├── backend/           # Application Spring Boot (Architecture Hexagonale)
├── frontend/         # Application Next.js
└── docker-compose.yml
```

## Lancement du Projet

### Option 1 : Avec Docker (Recommandé)

1. Cloner le projet :
```bash
git clone https://github.com/ClementCNR/Groupe
cd Groupe
```

2. À la racine du projet (où se trouve le docker-compose.yml), lancer l'application :
```bash
docker-compose up --build
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend : http://localhost:8080/api
- Swagger UI : http://localhost:8080/api/swagger-ui.html