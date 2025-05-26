# ADR 0005: Gestion des rôles et permissions

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

L’application distingue plusieurs profils d’utilisateur avec des besoins différents :

- **Employé** : réservation, check-in, consultation de ses réservations
- **Secrétaire** : gestion globale, ajout/modification des utilisateurs, édition des réservations
- **Manager** : tableau de bord d’usage, statistiques, réservation mensuelle

## Décision

Une gestion fine des **rôles** et **permissions** sera mise en place avec des rôles explicites (`EMPLOYEE`, `SECRETARY`, `MANAGER`).

## Conséquences

- Les rôles seront stockés dans la base, liés à l’utilisateur
- L’interface s’adaptera dynamiquement selon le rôle
- Le backend filtrera les accès via `@PreAuthorize` ou `@RolesAllowed`
