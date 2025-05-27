# ADR 0001: Choix de l'application Web comme plateforme principale

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

Le système actuel de réservation repose sur un échange de mails hebdomadaire avec les secrétaires, qui centralisent les demandes dans un fichier Excel partagé. Ce processus est :
- chronophage,
- propice aux erreurs humaines,
- difficilement maintenable.

L’usage de solutions numériques modernes est devenu une nécessité pour automatiser ce processus.

## Options considérées

1. **Application mobile native (iOS/Android)**
   - ✅ Expérience utilisateur fluide
   - ❌ Coût de développement plus élevé (2 plateformes)
   - ❌ Nécessite une installation locale

2. **Application desktop**
   - ✅ Utilisable en entreprise avec SSO
   - ❌ Non accessible sur mobile ou tablette
   - ❌ Moins flexible pour les check-ins

3. **Application Web Responsive** ✅ 
   - ✅ Accessible sur tout appareil (ordinateur, mobile, tablette)
   - ✅ UX adaptée à des utilisateurs non techniques
   - ✅ Déploiement centralisé, sans installation

## Décision

Nous avons choisi de concevoir une application web responsive comme plateforme principale.

## Conséquences

- Frontend avec Next.js
- Backend Spring Boot via API REST
- Conteneurisation Docker
- QR codes pointant vers des endpoints sécurisés
