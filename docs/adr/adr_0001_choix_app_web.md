# ADR 0001: Choix de l'application Web comme plateforme principale

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

Le système actuel de réservation repose sur un échange de mails hebdomadaire avec les secrétaires, qui centralisent les demandes dans un fichier Excel partagé. Ce processus est :

- chronophage,
- propice aux erreurs humaines,
- difficilement maintenable.

L’usage de solutions numériques modernes est devenu une nécessité pour automatiser ce processus. Les utilisateurs finaux sont des employés non techniques, habitués aux outils web.

## Décision

Nous avons choisi de concevoir une application web responsive comme plateforme principale, car elle offre un bon compromis entre accessibilité, simplicité et déploiement rapide.

Raisons du choix :

- Compatible avec tout appareil (ordinateur, mobile, tablette)
- UX adaptée à des utilisateurs non techniques
- Déploiement centralisé, sans installation locale
- Possibilité d’intégrer des QR codes pour les check-ins
- Intégration facile avec une base de données, des APIs et une file de messages

## Conséquences

- Le frontend sera développé avec Next.js
- Le backend sera exposé via une API REST utilisant Spring Boot
- L’application sera conteneurisée avec Docker
- Les QR codes installés sur les places de parking pointeront vers des endpoints sécurisés pour le check-in

## Logs

- **INFO**: Lancement de l'application
- **DEBUG**: Chargement des données de réservation
- **WARNING**: Erreur de connexion à la base de données
- **ERROR**: Erreur de traitement des données de réservation
- **INFO**: Fin de l'exécution de l'application# ADR 0001: Choix de l'application Web comme plateforme principale

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

Le système actuel de réservation repose sur un échange de mails hebdomadaire avec les secrétaires, qui centralisent les demandes dans un fichier Excel partagé. Ce processus est :

- chronophage,
- propice aux erreurs humaines,
- difficilement maintenable.

L’usage de solutions numériques modernes est devenu une nécessité pour automatiser ce processus. Les utilisateurs finaux sont des employés non techniques, habitués aux outils web.

## Décision

Nous avons choisi de concevoir une application web responsive comme plateforme principale, car elle offre un bon compromis entre accessibilité, simplicité et déploiement rapide.

Raisons du choix :

- Compatible avec tout appareil (ordinateur, mobile, tablette)
- UX adaptée à des utilisateurs non techniques
- Déploiement centralisé, sans installation locale
- Possibilité d’intégrer des QR codes pour les check-ins
- Intégration facile avec une base de données, des APIs et une file de messages

## Conséquences

- Le frontend sera développé avec Next.js
- Le backend sera exposé via une API REST utilisant Spring Boot
- L’application sera conteneurisée avec Docker
- Les QR codes installés sur les places de parking pointeront vers des endpoints sécurisés pour le check-in
