# ADR 0003: Choix de PostgreSQL comme base de données relationnelle

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

L’application nécessite une base de données relationnelle pour stocker des entités fortement liées : utilisateurs, réservations, places, rôles, historiques, etc.  
Nous avons besoin d’une solution robuste, open-source, compatible avec Spring Boot, et facilement intégrable dans une stack Docker.

## Décision

Nous avons choisi **PostgreSQL** comme système de gestion de base de données relationnelle (SGBDR).

Raisons principales :

- Compatibilité native avec Spring Boot via Spring Data JPA
- Fiabilité, robustesse et conformité aux standards SQL
- Fonctionnalités avancées (JSON, indexation, vues matérialisées…)
- Large adoption et documentation abondante
- Intégration facile dans des environnements Docker

## Conséquences

- La base sera initialisée avec des scripts SQL ou des migrations Liquibase/Flyway
- Les environnements Docker auront un conteneur PostgreSQL
- Les sauvegardes/restaurations seront automatisées via `volumes` et `cron`
