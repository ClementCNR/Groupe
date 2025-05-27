# ADR 0006: Intégration des QR codes pour le check-in

**Statut :** Accepté  
**Date :** 2025-05-26

## Contexte

Besoin de confirmer la présence réelle d’un employé à sa place de parking réservée.

## Options considérées

1. **Badge RFID ou NFC**
   - ✅ Rapide et sécurisé
   - ❌ Nécessite du matériel (bornes, lecteurs)
   - ❌ Complexité de déploiement

2. **App mobile avec bouton “je suis arrivé”**
   - ✅ Facile à intégrer dans l’app
   - ❌ Moins vérifiable (peut être cliqué à distance)

3. **QR code scanné sur place** ✅ 
   - ✅ Vérification géographique implicite
   - ✅ Faible coût d’installation (papier ou plaque)
   - ✅ Facilement intégrable avec des endpoints sécurisés

## Décision

Un QR code est apposé sur chaque place, contenant l’ID et un token sécurisé.

## Conséquences

- Endpoint `/checkin/{placeId}?token=XYZ`
- Validation de la réservation active
- Statut mis à jour automatiquement
