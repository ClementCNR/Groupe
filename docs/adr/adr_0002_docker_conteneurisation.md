# ADR 0002: Utilisation de la conteneurisation (Docker)

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

Nous avons besoin d’un environnement commun, stable et facilement déployable pour :

- un développement local simplifié,
- une montée en production sans écarts de configuration,
- une meilleure collaboration entre les membres de l’équipe.

## Décision

Nous utiliserons Docker pour conteneuriser tous les services de l’application :

- Frontend : application web Next.js
- Backend : API Spring Boot
- Base de données : PostgreSQL
- File de messages : Kafka (ou équivalent)
- Scripts d’initialisation et de tests

L’orchestration de ces conteneurs se fera avec `docker-compose`.

## Conséquences

- Tous les environnements (dev, test, prod) auront la même stack
- Les mises à jour se feront depuis un fichier `docker-compose.yml` unique
- Moins de problèmes de compatibilité liés à la configuration machine
