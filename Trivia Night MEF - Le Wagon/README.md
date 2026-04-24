# LE RISQUE WAGON 🚂

Un jeu de quiz interactif avec gestion de risque et système de banking inspiré du concept des tunnels, mais avec des wagons !

## ⚡ NOUVELLE VERSION - CORRECTIONS APPLIQUÉES

✅ **Wagons visuels** maintenant affichés sur l'écran de jeu avec fenêtres qui s'allument  
✅ **Affichage automatique** de la réponse dans la régie (plus besoin de cliquer)  
✅ **Bug du freeze** à la 5ème question corrigé  
✅ **Timer de 10 secondes** avec affichage visuel et son  
✅ **Effets sonores** ajoutés (timer.mp3 et selected.mp3)  
✅ **Bouton de lancement** pour afficher le jeu sur l'écran  

## 📋 Fichiers du jeu

- **regie.html** : Interface de contrôle pour l'animateur
- **ecran_jeu.html** : Écran de projection pour les joueurs
- **regie.css** : Styles de la régie
- **wagon_game.css** : Styles de l'écran de jeu
- **regie.js** : Logique de la régie
- **wagon_game.js** : Logique de l'écran de jeu

## 🚀 Installation

1. Placez tous les fichiers dans le même dossier
2. **IMPORTANT** : Créez un dossier `effets_sonores` dans le même répertoire
3. Ajoutez les fichiers audio `timer.mp3` et `selected.mp3` dans le dossier `effets_sonores`
4. Ouvrez **regie.html** dans un navigateur (pour l'animateur)
5. Ouvrez **ecran_jeu.html** dans un autre onglet/fenêtre (pour la projection)

⚠️ **Important** : Les deux fenêtres doivent être ouvertes dans le même navigateur pour que la communication fonctionne (via BroadcastChannel API).

## 🎮 Comment jouer

### 1️⃣ Configuration (Régie)

#### A. Paramétrer le jeu
- **Profondeur des wagons** : Nombre de questions par wagon (4-20)
- **Seuil de qualification** : Points nécessaires pour se qualifier
- **Timer questions** : 
  - Cochez pour activer le timer
  - Durée configurable (5-60 secondes, par défaut 10s)
  - Un compte à rebours s'affiche sur l'écran de jeu avec son
- Cliquez sur **"DÉMARRER LE JEU"** une fois tout configuré

#### B. Ajouter les équipes
- Entrez le nom de l'équipe
- Choisissez une couleur pour l'équipe
- Cliquez sur **"+ Ajouter"**
- Ajoutez au minimum 2 équipes
- Utilisez **"🎲 Ordre aléatoire"** pour mélanger l'ordre de passage

#### C. Sélectionner les thèmes
- Cliquez sur 6 thèmes parmi ceux disponibles
- Les thèmes sélectionnés apparaissent en dessous
- Cliquez sur **"✓ Valider les thèmes"** pour créer les wagons

### 2️⃣ Déroulement du jeu

#### Tour de jeu
1. L'équipe dont c'est le tour sélectionne un wagon (thème)
2. Une question s'affiche automatiquement
3. L'animateur attend la réponse de l'équipe

#### Actions possibles (Régie)

**Note importante** : La réponse s'affiche automatiquement dans la régie (en vert) pour que l'animateur puisse valider rapidement.

- **✓ CORRECT** : L'équipe a répondu correctement
  - Les points sont ajoutés au wagon (mais pas encore banqués)
  - L'équipe peut choisir de continuer ou de banquer
  
- **✗ FAUX** : L'équipe s'est trompée
  - Tous les points non banqués du wagon sont perdus
  - Le wagon revient au dernier niveau banqué
  - Passage à l'équipe suivante

- **👁️ Montrer réponse au jeu** : Affiche la réponse sur l'écran de projection (après que l'équipe ait répondu)

- **💰 BANQUER** : L'équipe décide de sécuriser ses points
  - Les points sont ajoutés au score de l'équipe
  - Les fenêtres du wagon prennent la couleur de l'équipe
  - Passage à l'équipe suivante

- **➡️ Équipe suivante** : Passer au joueur suivant

- **⏭️ Passer question** : Passer la question sans pénalité

### 3️⃣ Système de points

#### Paliers de difficulté
- **Questions 1-3** : 1 point chacune
- **Questions 4-6** : 2 points chacune
- **Questions 7-9** : 3 points chacune
- **Question 10** : 5 points

#### Banking
- On ne peut banquer les points QUE si on a atteint la fin d'un palier
- Une fois banqués, les points sont sécurisés
- Si une équipe se trompe, elle perd TOUS les points non banqués du wagon

#### Reprise de wagon
- Si une équipe échoue, une autre peut reprendre le wagon
- Elle reprend là où l'équipe précédente s'est arrêtée
- Si elle réussit, elle récupère tous les points laissés dans le wagon

### 4️⃣ Bonus 🎁

Chaque équipe dispose de **3 bonus** qu'elle peut utiliser pendant la partie.

#### Liste des bonus disponibles
1. **Double Points** : Points de la prochaine question doublés
2. **Bouclier** : Protection contre la prochaine erreur
3. **Vol de Points** : Vole 5 points à une équipe
4. **Question Bonus** : Question supplémentaire immédiate
5. **Passe ton Tour** : Force une équipe à passer
6. **Échange** : Échange de scores entre deux équipes
7. **Révélation** : Voir la réponse avant de répondre
8. **Choix Multiple** : Question transformée en QCM
9. **Temps Bonus** : Double le temps de réflexion
10. **Joker 50/50** : Élimine 2 mauvaises réponses
11. **Sabotage** : -3 points à tous les adversaires
12. **Jackpot** : +10 points instantanés

Pour activer un bonus : Cliquez sur **"🎲 Activer un bonus aléatoire"**

### 5️⃣ Fonctionnalités avancées

#### Corrections manuelles
- Sélectionnez une équipe dans la liste déroulante
- Entrez un nombre (positif ou négatif) pour ajuster le score
- Cliquez sur **"Appliquer"**

#### Historique et annulation
- Toutes les actions sont enregistrées dans l'historique
- Cliquez sur **"↶ Annuler dernière action"** pour revenir en arrière
- Utile en cas d'erreur de manipulation

#### Réinitialiser un wagon
- Sélectionnez le wagon
- Cliquez sur **"🔄 Reset wagon sélectionné"**
- Confirme la réinitialisation

#### Afficher les résultats
- Cliquez sur **"🏆 Afficher résultats"**
- Affiche le classement final sur l'écran de jeu
- Indique qui est qualifié et qui est éliminé

## 🎯 Stratégie

### Pour les joueurs
- **Risque vs Sécurité** : Avancer pour gagner plus de points ou banquer pour sécuriser ?
- **Choix des thèmes** : Choisir ses points forts ou prendre les thèmes difficiles quand on a un avantage
- **Gestion des bonus** : Quand utiliser ses 3 bonus pour maximiser leur effet ?

### Pour l'animateur
- Suivez le rythme : ne laissez pas trop de temps mort entre les questions
- Utilisez l'historique pour suivre la partie
- Affichez la réponse uniquement après que l'équipe ait répondu
- Encouragez l'ambiance et les prises de risque !

## 🎨 Affichage visuel

### Wagons
- Chaque wagon représente un thème avec un design façon train
- Les **fenêtres jaunes brillantes** = questions en cours (non banquées) avec effet de pulsation
- Les **fenêtres colorées** = points banqués (couleur de l'équipe)
- Progression affichée sous chaque wagon
- Design amélioré avec ombres et effets visuels

### Scores
- Score en temps réel en haut de l'écran de jeu
- Équipe active mise en évidence (bordure dorée)
- Indication "✓ QUALIFIÉ" pour les équipes qui ont atteint le seuil

### Timer
- Barre de progression colorée en haut de la question (vert → orange → rouge)
- Compte à rebours visible avec chiffres
- Son de tic-tac pendant le décompte
- Animation d'urgence quand il reste 3 secondes

### Effets sonores
- **timer.mp3** : Son de tic-tac pendant le compte à rebours
- **selected.mp3** : Son joué quand une question apparaît

## 🔧 Dépannage

### Les deux écrans ne se synchronisent pas
- Vérifiez que les deux fenêtres sont ouvertes dans le même navigateur
- Actualisez les deux pages
- Assurez-vous qu'aucune extension de navigateur ne bloque la BroadcastChannel API

### Le jeu ne démarre pas
- Vérifiez d'avoir ajouté au moins 2 équipes
- Vérifiez d'avoir validé exactement 6 thèmes
- Cliquez sur "DÉMARRER LE JEU"

### Indicateur de connexion
- **Point vert** = Connexion établie entre régie et écran de jeu
- **Point rouge** = Pas de connexion

## 📝 Personnalisation

### Modifier les thèmes et questions
Éditez le fichier **regie.js**, section `AVAILABLE_THEMES` :
```javascript
{
    name: '🎯 Mon Thème',
    questions: [
        { q: "Question 1 ?", a: "Réponse 1", tier: 0 },
        { q: "Question 2 ?", a: "Réponse 2", tier: 0 },
        // ... 10 questions au total
    ]
}
```

### Modifier les bonus
Éditez le fichier **regie.js**, section `BONUS_TYPES` pour ajouter/modifier des bonus.

### Modifier les couleurs
Éditez les fichiers CSS pour personnaliser les couleurs et le style.

## 🎉 Conseils pour animer

1. **Préparation** : Testez le jeu avant avec des données fictives
2. **Ambiance** : Mettez de la musique entre les questions
3. **Engagement** : Encouragez les équipes à prendre des risques
4. **Bonus** : Créez du suspense lors de l'activation des bonus
5. **Résultats** : Faites un roulement de tambour avant d'afficher les résultats !

---

Bon jeu ! 🚂🎮🏆

---

## 📝 Changelog

### Version 1.1 (Corrections et améliorations)

✅ **Corrections de bugs**
- Fix du freeze après la question 5 (problème de gestion d'état résolu)
- Les wagons s'affichent maintenant correctement sur l'écran de jeu
- Système de fenêtres illuminées fonctionnel avec animation

✅ **Nouvelles fonctionnalités**
- Timer configurable (5-60 secondes) avec compte à rebours visuel
- Affichage automatique de la réponse dans la régie (plus besoin de cliquer)
- Effets sonores : timer.mp3 et selected.mp3
- Design amélioré des wagons avec effet "train" plus réaliste
- Grille 3 colonnes pour meilleure visibilité des wagons
- Animation de pulsation sur les fenêtres actives

✅ **Améliorations UX**
- La réponse est visible immédiatement pour l'animateur
- Bouton séparé pour montrer la réponse aux joueurs
- Messages d'alerte plus clairs
- Reset du wagon qui revient au dernier niveau banqué en cas d'erreur
