# ADR 0006: Intégration des QR codes pour le check-in

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

Pour vérifier qu’un employé a bien utilisé sa place réservée, il est demandé qu’il scanne un **QR code** présent sur la place de parking.  
Ce QR code devra pointer vers un endpoint de check-in spécifique et sécurisé.

## Décision

Chaque place de parking aura un QR code généré dynamiquement contenant :

- l’**identifiant de la place**
- un **lien unique** vers l’endpoint de check-in sécurisé

## Conséquences

- Le backend exposera un endpoint `/checkin/{placeId}?token=XYZ`
- Un token unique ou un identifiant JWT lié à la réservation du jour sera utilisé
- Le scan mettra à jour l’état de la réservation dans la base
