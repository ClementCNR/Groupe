# ADR 0005: Gestion des rôles et permissions

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

L’application distingue plusieurs profils d’utilisateur avec des besoins différents :

- **Employé** : réservation, check-in, consultation de ses réservations
- **Secrétaire** : gestion globale, ajout/modification des utilisateurs, édition des réservations
- **Manager** : tableau de bord d’usage, statistiques, réservation mensuelle

Il est donc nécessaire de définir des accès différenciés selon les rôles utilisateurs.

## Options considérées

1. **Gestion des rôles en dur dans le code frontend**
   - ✅ Rapide à implémenter
   - ❌ Difficilement maintenable
   - ❌ Failles de sécurité potentielles si mal synchronisé avec le backend

2. **Système d’autorisations basé sur des permissions dynamiques stockées dans la base**
   - ✅ Très flexible
   - ❌ Complexité de gestion élevée
   - ❌ Risque d’erreurs d’accès si mauvaise configuration

3. **Rôles explicites (`EMPLOYEE`, `SECRETARY`, `MANAGER`) liés à chaque utilisateur** ✅ 
   - ✅ Simple, clair et efficace
   - ✅ Intégration facile avec Spring Security et le frontend
   - ✅ Permet un contrôle d’accès robuste via annotations

## Décision

Une gestion fine des **rôles** et **permissions** sera mise en place avec des rôles explicites (`EMPLOYEE`, `SECRETARY`, `MANAGER`).

## Conséquences

- Les rôles seront stockés dans la base, liés à l’utilisateur
- L’interface s’adaptera dynamiquement selon le rôle
- Le backend filtrera les accès via `@PreAuthorize` ou `@RolesAllowed`