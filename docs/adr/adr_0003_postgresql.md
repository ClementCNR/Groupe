# ADR 0003: Choix de PostgreSQL comme base de données relationnelle

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

L’application nécessite une base de données relationnelle pour stocker des entités fortement liées : utilisateurs, réservations, places, rôles, historiques, etc.  
Nous avons besoin d’une solution robuste, open-source, compatible avec Spring Boot, et facilement intégrable dans une stack Docker.

## Options considérées

1. **MySQL**
   - ✅ Mature, répandue, bien connue
   - ❌ Moins de support pour les types complexes (JSONB, vues matérialisées)
   - ❌ Moins d'intégration native avec certains outils Spring avancés

2. **PostgreSQL** ✅ 
   - ✅ Solide, open-source, riche en fonctionnalités SQL
   - ✅ Bonne intégration avec Spring Data JPA
   - ✅ Supporte JSON, transactions avancées, indexation puissante
   - ❌ Légèrement plus lourd que MySQL pour des cas simples

3. **Oracle**
   - ✅ Très robuste en entreprise
   - ❌ Licence coûteuse
   - ❌ Déploiement complexe
   - ❌ Surdimensionnée pour un MVP

## Décision

Nous avons choisi **PostgreSQL** comme système de gestion de base de données relationnelle (SGBDR).

## Justification

PostgreSQL propose le meilleur équilibre entre **puissance**, **souplesse**, **intégration Spring Boot**, et **simplicité de déploiement** en Docker. Son adoption dans l’open-source et sa documentation en font une solution idéale pour notre projet.

## Conséquences

- La base sera initialisée avec des scripts SQL ou des migrations Liquibase/Flyway
- Les environnements Docker auront un conteneur PostgreSQL
- Les sauvegardes/restaurations seront automatisées via `volumes` et `cron`
