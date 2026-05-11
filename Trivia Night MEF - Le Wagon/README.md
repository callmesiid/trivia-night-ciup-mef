# Le Wagon

## Concept

Jeu de questions à paliers où les équipes montent dans des wagons de difficulté croissante. À chaque palier, l'équipe peut choisir de **banker** (sécuriser ses points) ou de **continuer** pour en gagner davantage — au risque de tout perdre en cas de mauvaise réponse.

## Mécanique

### Déroulement d'une partie

1. Le MC configure les équipes et sélectionne 2 à 8 thèmes — chaque thème devient un wagon
2. Les équipes jouent à tour de rôle : chacune choisit un wagon disponible
3. À l'intérieur d'un wagon, l'équipe répond à des questions de difficulté croissante
4. À la fin de chaque palier, elle décide : **BANK** (sécuriser) ou **CONTINUER** (risquer)
5. Une équipe est qualifiée quand elle atteint le seuil de points configuré (défaut : 50 pts)

### Paliers et points

| Palier | Questions | Points par question | Banking possible |
|--------|-----------|---------------------|-----------------|
| Palier 1 | Q1 – Q3 | 1 pt | Fin Q3 |
| Palier 2 | Q4 – Q6 | 2 pts | Fin Q6 |
| Palier 3 | Q7 – Q9 | 3 pts | Fin Q9 |
| Finale | Q10 | 5 pts | Après Q10 |

### Règle du banking

- **Bonne réponse en fin de palier** → le bouton BANK apparaît
- **BANK** → les points de session sont sécurisés dans le score de l'équipe, le wagon est libéré
- **CONTINUER** → le wagon continue au palier suivant, les points restent en jeu
- **Mauvaise réponse** → les points de session tombent dans le wagon (perdus pour l'équipe qui a raté), le tour passe

### Wagons

Les points non bankés s'accumulent dans le wagon. Une autre équipe peut récupérer ces points en reprenant et complétant le wagon là où l'équipe précédente s'est arrêtée.

### Thème Mystère

Si le thème Mystère est sélectionné, son contenu est dynamiquement constitué des questions des thèmes **non sélectionnés** pour cette partie. Tout est surprise.

---

## Bonus

Chaque équipe reçoit 3 bonus en début de partie (aléatoires ou choisis selon la configuration). Les bonus sont à usage unique et s'activent depuis la régie avant ou après une question.

| Emoji | Nom | Moment d'activation | Effet |
|-------|-----|---------------------|-------|
| 🚂 | TCHOU TCHOU | Avant la prochaine question | Double les points de la question suivante |
| 🚨 | FREIN D'URGENCE | Avant la prochaine question | Permet de banker après n'importe quelle bonne réponse, même hors palier |
| 🔀 | AIGUILLAGE | Avant le timer | Remplace la question au lancement (reroll automatique) |
| 💼 | CLASSE AFFAIRES | Avant la prochaine question | Après une bonne réponse, la question suivante du wagon est automatiquement validée et ses points accordés |
| 🚄 | EXPRESS | Avant le timer | Timer réduit à 10 secondes, mais points triplés si bonne réponse |
| ⛏️ | CHARBON | Avant la prochaine question | +3 points bonus si la réponse est correcte |
| ⏰ | RETARD SNCF | Avant le timer | +20 secondes au timer de la prochaine question |
| 🧳 | VOL DE BAGAGE | Immédiat | Vole 3 points à l'équipe en tête |
| 🏁 | TERMINUS | Avant la prochaine question | Force le bank immédiatement après une bonne réponse, même hors palier |
| 🍸 | WAGON BAR | Immédiat | +5 points instantanément au score de l'équipe |
| 🔒 | GRIÈVE | Immédiat | Bloque le wagon sélectionné pour ce tour |
| 🎫 | BILLET DE RETOUR | Avant le timer | Si la réponse est fausse, la question est automatiquement changée et l'équipe retente sans perdre son tour |

---

## Malus

Chaque équipe reçoit 2 malus en début de partie. Les malus ciblent une équipe adverse et s'activent depuis la régie avant le lancement du chrono.

| Emoji | Nom | Effet |
|-------|-----|-------|
| 🎯 | VOL DE TOUR | Vole le tour de jeu de l'équipe adverse — vous jouez à sa place immédiatement |
| ⛔ | PASSE TON TOUR | Force l'équipe adverse à passer son prochain tour |
| 🚫 | BLOQUER LE BANK | Empêche l'équipe adverse de banker au prochain palier — elle doit finir le wagon |
| ⏩ | TIMER RÉDUIT | Réduit le temps de réflexion de l'adversaire de 20 secondes pour sa prochaine question |
| 🦹 | VOL DE BANQUE | Si l'équipe adverse choisit de banker à son prochain palier, ses points vous reviennent. Si elle continue, le malus est perdu |

---

## Utilisation de la régie

### Ouverture

1. Ouvrez `regie.html` dans Chrome ou Edge
2. Cliquez **📺 OUVRIR ÉCRAN DE JEU** — une nouvelle fenêtre s'ouvre pour les joueurs
3. Placez la régie sur votre écran, l'écran jeu sur le vidéoprojecteur

### Configuration

Dans le panneau **CONFIGURATION** :

| Paramètre | Description | Défaut |
|-----------|-------------|--------|
| Profondeur wagons | Nombre de questions par wagon (4 à 10) | 10 |
| Seuil qualification | Score en points pour être qualifié | 50 pts |
| Timer par défaut | Durée du chrono par question | 30 sec |
| Bonus / malus | Aléatoire, choisi par équipe, ou aucun | Aléatoire |

### Équipes

1. Saisissez le nom et choisissez une couleur, cliquez **+**
2. Répétez pour chaque équipe
3. Cliquez **🎲 Ordre aléatoire** pour mélanger l'ordre de jeu si besoin
4. Cliquez **✓ VALIDER** pour verrouiller les équipes

### Thèmes

1. Cliquez sur les thèmes à inclure dans la partie (2 à 8)
2. Cliquez **✓ VALIDER THÈMES**

### Démarrage

- Cliquez **🎬 INTRO** pour lancer le générique, puis **⏭ SKIP** pour le passer
- Cliquez **🚂 DÉMARRER LE JEU** — les wagons apparaissent sur l'écran joueurs

### Jouer une question

1. Cliquez sur un wagon dans la grille régie pour le sélectionner
2. Activez un bonus ou jouez un malus si besoin (avant le timer)
3. Cliquez **⏱ GO** pour lancer le chrono et afficher la question sur l'écran
4. Mettez en pause (**⏸**) quand l'équipe répond, ou laissez le timer expirer
5. Cliquez **✅ BONNE RÉPONSE** ou **❌ MAUVAISE RÉPONSE**
6. Si fin de palier : choisissez **BANK** ou **CONTINUER**

### Contrôles additionnels

| Bouton | Action |
|--------|--------|
| ♻ Changer Q | Pioche une nouvelle question de même difficulté (irréversible) |
| ⬅ Préc. / Suiv. ➡ | Change l'équipe active manuellement |
| 🔄 Reset wagon | Remet le wagon sélectionné à zéro |
| 🔀 Remplacer | Remplace un wagon par un autre thème |
| ↩ Annuler dernière action | Annule la dernière validation de score |
| Corrections | Ajuste manuellement le score d'une équipe (champ + Appliquer) |
| 🏆 RÉSULTATS | Affiche le classement final sur l'écran joueurs |
| 🗑 Reset logs session | Remet à zéro les questions déjà vues (toutes redeviennent disponibles) |
