# ADR 0009: Intégration d’un système de messagerie externe

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

L’application doit notifier les utilisateurs (employés et secrétaires) lors de certains événements clés :

- Confirmation de réservation
- Modification ou annulation de réservation
- Rappel ou alerte liée à une réservation imminente

Afin d’assurer l’envoi de ces notifications de manière fiable et scalable, il est nécessaire d’externaliser ce service à une solution de messagerie.

## Décision

Nous avons choisi d’intégrer un **système de messagerie externe** (type Mailjet, SendGrid, Amazon SES, ou système interne de messagerie) pour gérer l’envoi des messages à destination des utilisateurs.

## Raisons

- Délégation des contraintes de délivrabilité et de mise en forme
- Gestion de la mise en file d’attente et des erreurs (ex: quota, email invalide)
- Possibilité de templating pour des emails dynamiques et multilingues
- Intégration facile avec des API REST (souvent via POST JSON)

## Conséquences

- Le backend Spring Boot publiera un message dans une file (Kafka ou autre)
- Le message contiendra l’ID de l’utilisateur, le type de notification et les données dynamiques
- Le service de messagerie lira la file, construira l’email via un template, puis l’enverra
- Les erreurs d’envoi seront loggées et potentiellement relayées en admin interface
- Les notifications pourront être enrichies à l’avenir (SMS, push, etc.)
