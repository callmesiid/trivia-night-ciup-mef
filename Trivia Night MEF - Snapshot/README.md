# Snapshot (Mix & Twist)

## Concept

Jeu de mémoire visuelle en équipes. Une grille de photos de personnalités s'affiche pendant une courte phase de mémorisation — les cartes se retournent, et les joueurs doivent retrouver les noms des personnes face cachée. Chaque bonne réponse rapporte des points, chaque erreur fait perdre le tour.

## Mécanique

### Déroulement d'un round

1. Le MC lance un générique d'introduction (optionnel)
2. Le MC génère une nouvelle grille — les photos apparaissent sur l'écran joueurs avec les noms visibles
3. Le MC lance la **phase de mémorisation** (timer 24s en mode Normal, 30s en mode Hard)
4. Les cartes se retournent — les noms disparaissent, seules les photos restent
5. Les équipes jouent à tour de rôle : le joueur actif désigne une photo et annonce un nom
6. Si correct → la carte est retirée et l'équipe marque un point ; si faux → le tour passe
7. Le round se termine quand toutes les cartes sont trouvées ou quand le MC clique FIN DU ROUND

### Modes de grille

| Mode | Nombre de photos |
|------|-----------------|
| Normal (N) | 24 photos |
| Hard (H) | 32 photos |

### Ordre des joueurs

Les joueurs d'une même équipe jouent en rotation. L'ordre complet du round est affiché dans la régie.

### Session log

Les photos sont tirées en round-robin : chaque photo apparaît avant qu'une autre ne soit répétée. Le log se remet à zéro automatiquement quand toutes les photos ont été vues au moins une fois.

---

## Utilisation de la régie

### Ouverture

1. Ouvrez `snapshot_regie.html` dans Chrome ou Edge
2. Cliquez **OUVRIR L'ÉCRAN** — une nouvelle fenêtre s'ouvre pour les joueurs
3. Placez la régie sur votre écran, l'écran jeu sur le vidéoprojecteur

### Configuration initiale

Sur l'écran de setup :

| Paramètre | Description | Défaut |
|-----------|-------------|--------|
| Rounds | Nombre de rounds dans la partie | 5 |
| Équipes qualifiées (top) | Nombre d'équipes qualifiées en fin de partie | 2 |
| Joueurs/équipe | Nombre de joueurs par défaut par équipe | 2 |

Ajoutez chaque équipe (nom, couleur, nombre de joueurs), puis cliquez **▶ DÉMARRER LA PARTIE**.

### Jouer un round

1. Cliquez **INTRO** pour lancer le générique (optionnel), ou **SKIP** pour le passer
2. Cliquez **🔄 NOUVELLE GRILLE** pour générer et afficher les photos sur l'écran joueurs
3. Cliquez **MÉMO** pour lancer la phase de mémorisation — le timer démarre, les joueurs mémorisent
4. À la fin du timer, les cartes se retournent automatiquement
5. Cliquez **PLAY ▶** pour lancer le timer de jeu du premier joueur
6. Quand le joueur actif désigne une photo dans la grille (côté régie), cliquez dessus pour la valider
   - Bonne réponse → la carte disparaît, le tour continue
   - Cliquez **✗ FAUX** pour passer au joueur suivant en cas de mauvaise réponse
7. Le timer se remet automatiquement entre chaque joueur
8. Cliquez **▶ FIN DU ROUND** quand le round est terminé

### Contrôles additionnels

| Bouton | Action |
|--------|--------|
| RESET ⟳ | Remet le timer à zéro sans changer de joueur |
| ↩ ANNULER | Annule la dernière action (remet une carte, ajuste le score) |
| 🏆 PODIUM | Affiche le classement final sur l'écran joueurs |
| 🗑 RESET LOGS | Remet à zéro le log des photos vues (toutes redeviennent disponibles) |
| MODE | Bascule entre la base de photos normale et la base personnalisée |
