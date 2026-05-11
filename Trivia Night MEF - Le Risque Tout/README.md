# Le Risque Tout

## Concept

Quiz de culture générale en équipes sur une grille de cases. Chaque case représente un thème et une valeur en points (×1 à ×10). L'équipe active choisit une case, répond à la question — bonne réponse : elle gagne les points, mauvaise réponse : elle les perd.

## Mécanique

### Déroulement d'une partie

1. Le MC configure le mode de jeu et lance la grille
2. Les équipes jouent à tour de rôle en mode serpentin (→ puis ←)
3. Le MC choisit la case pour l'équipe active et lance la question
4. Il valide VRAI ou FAUX selon la réponse
5. La partie se termine quand toutes les cases ont été jouées

### La grille

- Une **ligne par thème** sélectionné sur la roue, avec 5 cases (×1 à ×5)
- Une **ligne MYSTÈRE** ajoutée automatiquement avec des cases ×6 à ×10
- Les cases Mystère piochent dans les thèmes non sélectionnés avec une pondération par difficulté

### Modes de jeu

| Mode | Description |
|------|-------------|
| **Normal** | La roue tourne pour tirer les thèmes aléatoirement. Le MC configure combien de thèmes tirer (et peut en exclure certains). |
| **Quick** | Les thèmes sont tirés par une machine à slots, plus rapide. |
| **Hard** | Toute la grille est en mode Mystère — aucun thème affiché, tout est surprise. |

### Thèmes disponibles

Animaux, Années 2000, Art, Célébrités, Cinéma, Cuisine, Disney, Géographie, Harry Potter, Histoire, Jeux Vidéo, Littérature, Logos & Marques, Musique, Sciences, Sport

### Types de questions

- **Texte** — question orale, réponse orale
- **Image** — une image s'affiche sur l'écran joueurs
- **Son** — un extrait audio est joué

---

## Utilisation de la régie

### Ouverture

1. Ouvrez `regie.html` dans Chrome ou Edge
2. Cliquez **📺 OUVRIR ÉCRAN DE JEU** — une nouvelle fenêtre s'ouvre pour les joueurs
3. Placez la fenêtre régie sur votre écran, la fenêtre jeu sur le vidéoprojecteur

### Configuration

Avant de lancer, dans le panneau **CONFIGURATION** :
- Choisissez le mode (Normal / Quick / Hard)
- En mode Normal : sélectionnez le nombre de thèmes à tirer et les thèmes à exclure, puis cliquez **APPLIQUER**

### Équipes

1. Dans le panneau **ÉQUIPES**, saisissez le nom et choisissez une couleur
2. Cliquez **+** pour ajouter chaque équipe
3. Cliquez **✓ VALIDER LES ÉQUIPES** pour commencer

### Lancer la grille

- Cliquez **LANCER LA ROUE** (ou Slots selon le mode) pour générer la grille de questions
- Une fois la grille affichée, les cases apparaissent côté régie et côté joueurs

### Jouer une question

1. Cliquez sur une case dans la grille régie pour l'ouvrir
2. La question et la réponse s'affichent dans la régie (invisibles côté joueurs)
3. Cliquez **👁 RÉVÉLER** pour afficher la question sur l'écran joueurs et lancer le timer
4. Selon la réponse de l'équipe : cliquez **✅ VRAI** ou **❌ FAUX**
5. Les points sont ajoutés ou retirés automatiquement, le tour passe à l'équipe suivante

### Contrôles additionnels

| Bouton | Action |
|--------|--------|
| ♻ Changer Q | Pioche une nouvelle question pour la case ouverte (irréversible) |
| ↩ Annuler dernier score | Annule la dernière validation de points |
| ✎ (sur un score) | Édite manuellement le score d'une équipe |
| 🏆 PODIUM | Affiche le classement final sur l'écran joueurs |
| 🗑 Reset logs session | Remet à zéro les questions déjà vues (toutes questions redeviennent disponibles) |

### Fin de partie

Cliquez **🏆 PODIUM** pour afficher le classement final. Configurez le seuil de qualification (nombre d'équipes qualifiées) avant de l'envoyer.
