# ADR 0009: Intégration d’un système de messagerie externe

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

L’application doit notifier les utilisateurs (employés et secrétaires) lors de certains événements clés :

- Confirmation de réservation
- Modification ou annulation de réservation
- Rappel ou alerte liée à une réservation imminente

Afin d’assurer l’envoi de ces notifications de manière fiable et scalable, il est nécessaire d’externaliser ce service à une solution de messagerie.

## Options considérées

1. **SMTP interne depuis le backend**
   - ✅ Simple à implémenter
   - ❌ Pas de templating
   - ❌ Moins de garantie de délivrabilité
   - ❌ Pas de file de reprise

2. **Utilisation d’un plugin mail Spring directement**
   - ✅ Intégré au framework
   - ❌ Non scalable sans ajout d’une queue
   - ❌ Peu de logs ou de métriques

3. **Service de messagerie externe avec file d'attente** ✅ 
   - ✅ Résilient et scalable
   - ✅ Gestion d’erreurs, templates, logs
   - ✅ Intégration REST via JSON

## Décision

Nous avons choisi d’intégrer un **système de messagerie externe** (type Mailjet, SendGrid, Amazon SES, ou système interne de messagerie) pour gérer l’envoi des messages à destination des utilisateurs.

## Conséquences

- Le backend Spring Boot publiera un message dans une file (Kafka ou autre)
- Le message contiendra l’ID de l’utilisateur, le type de notification et les données dynamiques
- Le service de messagerie lira la file, construira l’email via un template, puis l’enverra
- Les erreurs d’envoi seront loggées et potentiellement relayées en admin interface
- Les notifications pourront être enrichies à l’avenir (SMS, push, etc.)
