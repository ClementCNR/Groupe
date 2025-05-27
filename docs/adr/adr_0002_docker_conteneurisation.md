ADR 0002: Utilisation de la conteneurisation (Docker)

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

Nous avons besoin d’un environnement commun, stable et facilement déployable pour :

- un développement local simplifié,
- une montée en production sans écarts de configuration,
- une meilleure collaboration entre les membres de l’équipe.

## Options considérées

1. **Installation manuelle sur chaque machine**
   - ✅ Facile à comprendre au début
   - ❌ Risque d’écarts de configuration entre développeurs
   - ❌ Difficulté de mise à jour et déploiement non reproductible

2. **Machines virtuelles (VM) avec Vagrant ou VirtualBox**
   - ✅ Isolation complète de l’environnement
   - ❌ Lourdeur des images VM
   - ❌ Temps de démarrage et besoin de ressources élevé

3. **Conteneurisation avec Docker + docker-compose** ✅ 
   - ✅ Léger, rapide, et portable
   - ✅ Facilement versionnable et intégrable à CI/CD
   - ✅ Stack homogène pour dev, test et prod

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