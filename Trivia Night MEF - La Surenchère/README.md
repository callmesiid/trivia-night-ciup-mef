# La Surenchère

## Concept

Jeu d'énumération à chrono. Un thème est tiré au sort, et l'équipe qui a la main doit citer un maximum d'éléments appartenant à la catégorie avant que le temps ne soit écoulé. L'équipe déclare une **mise** (combien d'éléments elle pense pouvoir citer) — si elle atteint sa mise, elle gagne des points ; si elle échoue, elle en perd.

## Mécanique

### Déroulement d'un round

1. Le MC tire un thème aléatoirement (la roue tourne sur l'écran joueurs)
2. Le MC affiche la question sur l'écran joueurs
3. L'équipe qui a la main déclare sa **mise** (nombre de réponses qu'elle s'engage à citer)
4. Le MC lance le chrono (30 secondes par défaut)
5. L'équipe cite ses réponses — le MC valide ou invalide chacune dans la régie
6. À la fin du chrono (ou quand l'équipe déclare forfait), le MC révèle les réponses et applique les points

### Calcul des points

- **Mise atteinte** → points positifs proportionnels au nombre de réponses citées
- **Mise non atteinte** → points négatifs proportionnels à l'écart

### Session log

Chaque thème joué est marqué comme vu. Il ne sera pas retiré de la rotation avant que tous les thèmes aient été joués au moins une fois.

---

## Bonus

Chaque équipe reçoit 2 bonus en début de partie. Les bonus appartiennent à l'équipe qui a la main et s'activent avant le lancement du chrono.

| Emoji | Nom | Effet |
|-------|-----|-------|
| ⏰+ | PLUS DE TEMPS | +25 secondes au chrono de ce round |
| 👍 | COUP DE POUCE | +5 réponses ajoutées aux réponses citées (ex : citez 10, compté 15). Annule le malus +5 MISE si actif |
| 👫 | À DEUX | Répondez en binôme avec de l'aide — aucun effet sur le score |

---

## Malus

Chaque équipe reçoit 2 malus en début de partie. Les malus ciblent l'équipe adverse et s'activent avant le lancement du chrono.

| Emoji | Nom | Effet |
|-------|-----|-------|
| ✖️2 | POINTS ×2 | Gains ×2 et pertes ×2 pour l'adversaire ce round — joue double ou rien |
| ➗ | DIVISION | Gains ÷3 (arrondi) ou pertes ×3 pour l'adversaire |
| ⏩ | PAS DE TEMPS | -15 secondes au chrono de l'adversaire |
| 📈 | +5 MISE | +5 à la mise de l'adversaire (jusqu'au maximum des réponses disponibles). Annulé par le bonus Coup de Pouce |

---

## Utilisation de la régie

### Ouverture

1. Ouvrez `surenchere_regie.html` dans Chrome ou Edge
2. Cliquez **OUVRIR L'ÉCRAN** — une nouvelle fenêtre s'ouvre pour les joueurs
3. Placez la régie sur votre écran, l'écran jeu sur le vidéoprojecteur

### Équipes

1. Saisissez le nom et choisissez une couleur, cliquez **+**
2. Choisissez le mode de distribution des bonus/malus :
   - **Bonus fixes pour tous** — tous reçoivent le même kit
   - **Aléatoires** — chaque équipe reçoit un kit différent tiré au sort
   - **Choisis par équipe** — le MC sélectionne manuellement les bonus et malus de chaque équipe
   - **Aucun bonus/malus** — partie sans effets
3. Cliquez **🎲 Ordre aléatoire** si besoin, puis **✓ VALIDER**

### Jouer un round

1. Sélectionnez l'équipe qui a la main dans **QUI A LA MAIN ?**
2. Cliquez **🎰 TIRAGE** — la roue tourne et tire un thème aléatoirement
3. Activez les bonus/malus souhaités (avant le chrono)
4. Déclarez la mise de l'équipe dans le champ **Mise déclarée**
5. Cliquez **❓ QUESTION** pour afficher la question sur l'écran joueurs
6. Cliquez **⏱ GO** pour lancer le chrono
7. Au fil des réponses, cliquez sur chaque réponse dans la grille pour la valider (verte) ou l'invalider
8. Mettez le chrono en pause (**⏸**) quand le temps est écoulé ou que l'équipe s'arrête
9. Cliquez **👁 RÉVÉLER** pour afficher toutes les réponses sur l'écran joueurs
10. Cliquez **APPLIQUER** pour calculer et attribuer les points

### Contrôles additionnels

| Bouton | Action |
|--------|--------|
| ✅ FX WON / ❌ FX LOST | Déclenche un effet sonore de victoire ou défaite |
| 🏆 SCORES | Affiche le classement sur l'écran joueurs |
| 🔄 NOUVEAU ROUND | Remet à zéro le round pour passer au suivant |
| 🗑 Reset logs | Remet à zéro les thèmes déjà joués (tous redeviennent disponibles) |
