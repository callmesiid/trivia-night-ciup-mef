# CHANGELOG - Le Risque Wagon

## Version 2.0 - Corrections majeures (29/01/2025)

### 🐛 Bugs corrigés

#### 1. Wagons manquants sur l'écran de jeu ✅
**Problème :** L'écran de jeu n'affichait pas les wagons visuellement, les joueurs ne pouvaient pas voir l'état du jeu.

**Solution :**
- Ajout d'un affichage complet des wagons en grille 3 colonnes
- Chaque wagon affiche ses fenêtres avec :
  - Fenêtres grises = vides
  - Fenêtres jaunes = en cours (non banquées)
  - Fenêtres colorées = banquées (couleur de l'équipe)
- Animation de pulsation quand les fenêtres s'allument
- Effet de glow permanent sur les fenêtres actives

#### 2. Réponse non visible dans la régie ✅
**Problème :** L'animateur devait cliquer sur "Montrer réponse" pour voir la réponse, ce qui ralentissait le jeu.

**Solution :**
- La réponse s'affiche maintenant AUTOMATIQUEMENT en vert dans la régie dès qu'une question est posée
- Le bouton "Montrer réponse" sert uniquement à l'afficher sur l'écran de jeu
- L'animateur peut immédiatement valider ou invalider la réponse

#### 3. Freeze à la 5ème question ✅
**Problème :** Le jeu se bloquait après la 4ème ou 5ème question, impossibilité de continuer.

**Cause :** Problème dans le calcul des paliers (tiers) et l'indexation des questions.

**Solution :**
- Réécriture complète de la fonction `getPointsForQuestion()`
- Simplification de la structure des tiers
- Vérification stricte de l'existence de la question avant affichage
- Calcul des points basé sur l'index de question :
  - Questions 0-2 (1-3) : 1 point
  - Questions 3-5 (4-6) : 2 points
  - Questions 6-8 (7-9) : 3 points
  - Question 9 (10) : 5 points

#### 4. Absence de timer ✅
**Problème :** Pas de système pour mettre la pression et accélérer le rythme du jeu.

**Solution :**
- Ajout d'un bouton "⏱️ TIMER" dans la régie
- Timer configurable (5-60 secondes, par défaut 10s)
- Affichage visuel sur l'écran de jeu :
  - Cercle progressif qui se vide
  - Numéro du décompte au centre
  - Changement de couleur à 3 secondes (orange → rouge)
- Son du timer en boucle pendant le décompte
- Arrêt automatique du timer et du son quand :
  - Le temps est écoulé
  - L'animateur valide/invalide la réponse
  - L'animateur ferme la question

#### 5. Absence d'effets sonores ✅
**Problème :** Jeu silencieux, manque d'ambiance.

**Solution :**
- Intégration de 2 effets sonores :
  - **timer.mp3** : Joué en boucle pendant le décompte
  - **selected.mp3** : Joué lors des actions importantes :
    - Démarrage du jeu
    - Passage à l'équipe suivante
    - Affichage d'une question
    - Activation d'un bonus
    - Affichage des résultats

#### 6. Absence de bouton de lancement ✅
**Problème :** Pas de moyen clair de lancer l'affichage sur l'écran de jeu.

**Solution :**
- Ajout d'un bouton "📺 LANCER SUR L'ÉCRAN" dans la régie
- Apparaît après avoir démarré le jeu
- Envoie un signal à l'écran de jeu pour commencer l'affichage
- Empêche la sélection de wagons avant le lancement

### ✨ Améliorations

#### Système de points temporaires
- Les points gagnés ne sont plus immédiatement banqués
- Les points sont d'abord "temporaires" et affichés dans la liste des équipes
- L'équipe doit cliquer sur "BANQUER" pour sécuriser ses points
- En cas d'erreur, les points temporaires sont perdus
- Cela encourage la prise de risque

#### Meilleure visibilité
- Wagons affichés en grille claire et espacée
- Équipe active mise en évidence avec animation de pulsation
- Progression visible sur chaque wagon
- Indicateurs de connexion entre régie et écran de jeu

#### Interface de la régie optimisée
- Réorganisation des boutons par importance
- Labels plus clairs
- Affichage des points temporaires dans la liste des équipes
- Messages de confirmation plus explicites

### 🎯 Utilisation

#### Déroulement d'une partie type :

1. **Préparation** (Régie)
   - Ajouter les équipes
   - Sélectionner 6 thèmes
   - Valider les thèmes
   - Configurer le timer (optionnel)

2. **Démarrage** (Régie)
   - Cliquer sur "🚀 DÉMARRER LE JEU"
   - Cliquer sur "📺 LANCER SUR L'ÉCRAN"

3. **Jeu** (Régie + Écran)
   - Sélectionner un wagon
   - La question s'affiche automatiquement sur l'écran de jeu
   - La réponse est visible dans la régie
   - (Optionnel) Lancer le timer avec "⏱️ TIMER"
   - Attendre la réponse de l'équipe
   - Valider avec "✓ CORRECT" ou "✗ FAUX"
   - Si correct : équipe peut continuer ou banquer
   - Si faux : points temporaires perdus, passage à l'équipe suivante

4. **Banking** (Régie)
   - Cliquer sur "💰 BANQUER" pour sécuriser les points
   - Les fenêtres du wagon prennent la couleur de l'équipe
   - Passage automatique à l'équipe suivante

5. **Fin** (Régie)
   - Cliquer sur "🏆 Afficher résultats"
   - Classement affiché sur l'écran de jeu avec qualifiés/éliminés

### 📝 Notes techniques

- Utilisation de BroadcastChannel API pour la communication temps réel
- Les deux fenêtres doivent être ouvertes dans le même navigateur
- Support des navigateurs modernes (Chrome, Firefox, Edge)
- Nécessite les fichiers audio dans `/effets_sonores/`

### 🔜 Améliorations futures possibles

- Personnalisation des sons
- Mode plein écran automatique pour l'écran de jeu
- Sauvegarde de l'état de la partie
- Export des résultats en PDF
- Thèmes personnalisables depuis l'interface
- Plus de bonus différents avec effets visuels

---

**Version précédente :** 1.0 (28/01/2025)
