# ADR 0004: Authentification basée sur JWT

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

L’application doit gérer plusieurs types d’utilisateurs (employés, secrétaires, managers) avec des accès et vues personnalisés.  
L’expérience utilisateur doit rester fluide sans authentification intrusive, tout en garantissant la sécurité des accès.

## Décision

Nous utiliserons **JSON Web Token (JWT)** comme mécanisme d’authentification.

## Raisons

- JWT est stateless : pas de session à stocker côté serveur
- Compatible avec les API REST
- Facilement vérifiable côté backend
- Intégrable côté frontend avec des headers `Authorization`
- Permet l’encodage du rôle, de l’ID utilisateur et d’expiration dans le token

## Conséquences

- Les endpoints seront sécurisés avec Spring Security + JWT Filter
- Le frontend stockera le token dans `localStorage` ou `cookies` selon le besoin
- Des middlewares vérifieront l’authentification avant chaque appel API
