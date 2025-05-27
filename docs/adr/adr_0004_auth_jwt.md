# ADR 0004: Authentification basée sur JWT

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

L’application doit gérer plusieurs types d’utilisateurs, avec des rôles et des vues personnalisés, sans perturber l’expérience utilisateur.

## Options considérées

1. **Session côté serveur (Spring Session, cookies)**
   - ✅ Simple à mettre en place
   - ❌ Moins adapté aux API REST stateless
   - ❌ Moins flexible pour du frontend moderne

2. **OAuth2 / OpenID Connect**
   - ✅ Sécurisé et standardisé
   - ❌ Plus complexe à mettre en place
   - ❌ Surdimensionné pour un MVP interne

3. **JWT (JSON Web Token)** ✅
   - ✅ Stateless, portable, sécurisé
   - ✅ Compatible avec Spring Security
   - ✅ Facile à transmettre via headers

## Décision

Utilisation de JWT pour l’authentification.

## Conséquences

- Filtrage via Spring Security
- Stockage du token côté frontend (localStorage ou cookies)
- Auth middleware pour protéger les routes
