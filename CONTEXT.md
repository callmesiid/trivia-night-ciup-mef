# MEF Trivia Night CIUP — Contexte Projet

> Fichier de référence pour Claude. Résume la structure, l'architecture et les mécaniques de chaque jeu sans nécessiter de lire tous les fichiers sources.

---

## Vue d'ensemble

Trivia night en 4 mini-jeux HTML/JS autonomes, tous ouverts directement dans un navigateur (pas de serveur). Communication entre fenêtres via `BroadcastChannel`. Données dans des JSON sources, compilées en fichiers JS via `build.py`.

**Repo GitHub :** `https://github.com/CallMeSiid/Trivia-Night-CIUP-MEF.git`

---

## Arborescence racine

```
Trivia Night MEF - CIUP/
├── customizer.html              ← Éditeur de données (File System Access API, Chrome/Edge)
├── build.py                     ← Compilateur JSON → JS (python build.py)
├── import_wagon_sources.py      ← Import one-shot RT → Wagon (usage unique)
├── CONTEXT.md                   ← Ce fichier
│
├── data/                        ← Sources JSON (éditées via customizer ou à la main)
│   ├── risque_tout/             ← ~18 fichiers JSON (un par thème)
│   ├── wagon/
│   │   ├── themes.json          ← Questions des 10 thèmes wagon
│   │   ├── bonuses.json         ← 12 bonus définis
│   │   ├── malus.json           ← 5 malus définis
│   │   └── themes_sync.json     ← Mapping thèmes wagon ↔ sources RT (pour build.py sync)
│   ├── surenchere/              ← ~27 fichiers JSON (un par thème)
│   └── snapshot/
│       └── photos.json          ← Liste des photos Mix & Twist
│
├── data/assets/
│   ├── images/                  ← Toutes les images (plat, sans sous-dossiers sauf logos/)
│   │   └── logos/1/ … 5/       ← 150 logos organisés par difficulté
│   ├── sons/chansons/
│   │   └── difficulte_1/ … 5/  ← 25 extraits .m4a organisés par difficulté
│   └── Images/                  ← Icônes thèmes (format PNG, utilisées par le Risque Tout)
│
├── Trivia Night MEF - Le Risque Tout/
├── Trivia Night MEF - Le Wagon/
├── Trivia Night MEF - La Surenchère/
└── Trivia Night MEF - Snapshot/
```

---

## build.py — Compilateur

Lance depuis la racine : `python build.py` (environnement Anaconda).

| Ce qu'il compile | Source JSON → Fichier JS de sortie |
|---|---|
| Le Risque Tout | `data/risque_tout/*.json` → `database.js` |
| La Surenchère | `data/surenchere/*.json` → `surenchere_data.js` |
| Le Wagon | `data/wagon/themes.json` + bonus + malus → patch `data.js` |
| Snapshot | `data/snapshot/photos.json` → `mix_data.js` |

**Flags de synchronisation wagon ↔ RT** (lignes 28-31 de build.py) :
```python
WAGON_AS_MAIN = False  # True → wagon themes.json écrase les JSON RT correspondants
RT_AS_MAIN    = False  # True → JSON RT écrase les thèmes wagon correspondants
```
Le mapping est dans `data/wagon/themes_sync.json` (musique, harry_potter, geographie, logo).

**utf-8-sig** : `read_json` utilise `encoding='utf-8-sig'` pour gérer le BOM de PowerShell.

---

## customizer.html

Interface web pour éditer les données sans toucher aux JSON. File System Access API (Chrome/Edge uniquement).

- **Onglets :** Le Risque Tout · Le Wagon · La Surenchère · Snapshot
- **Actions :** Ajouter/éditer/supprimer questions, valider, filtrer, importer en masse
- **Ajouter un thème :** Modale inline (pas de `prompt()`), ID auto-sanitisé
- **Bug corrigé :** Wagon utilise `q`/`a` (pas `question`/`answer`) — le modal lit les deux
- **Après chaque modification wagon :** relancer `python build.py` pour mettre à jour `data.js`

---

## Format des données

### Risque Tout (`data/risque_tout/*.json`)
```json
{
  "id": "geographie",
  "label": "Géographie",
  "icon": "../assets/Images/geographie.png",
  "questions": [
    { "type": "image", "file": "data/assets/images/France.png", "question": "Quel pays a ce drapeau ?", "answer": "France", "difficulty": 1, "validated": true },
    { "type": "text",  "question": "Quelle est la capitale de la France ?", "answer": "Paris", "difficulty": 1, "validated": true },
    { "type": "sound", "file": "data/assets/sons/chansons/difficulte_1/Daft_Punk_Get_Lucky.m4a", "question": "Quel est ce titre ?", "answer": "Get Lucky — Daft Punk", "difficulty": 1, "validated": true }
  ]
}
```
`build.py` appelle `to_game_path()` sur `file` : les chemins `data/assets/...` deviennent `../data/assets/...` dans `database.js`.

### Wagon (`data/wagon/themes.json`)
```json
{
  "id": "fleurs", "name": "🌸 Fleurs", "color": "#e84393",
  "questions": [
    { "q": "Texte de la question ?", "a": "Réponse", "difficulty": 1, "validated": true },
    { "q": "Quel pays a ce drapeau ?", "a": "France", "type": "image", "file": "data/assets/images/France.png", "difficulty": 1, "validated": true },
    { "q": "Quel est ce titre ?", "a": "Get Lucky — Daft Punk", "type": "sound", "file": "data/assets/sons/chansons/difficulte_1/Daft_Punk_Get_Lucky.m4a", "difficulty": 2, "validated": true }
  ]
}
```
`build.py` préserve `type`, `file`, `difficulty`. Pas de `to_game_path()` pour wagon (l'écran rajoute `../` lui-même).

### Surenchère (`data/surenchere/*.json`)
```json
{ "id": "capitales_eu", "label": "Capitales européennes", "icon": "...", "prompt": "Citez des capitales européennes", "answers": [{ "value": "Paris", "validated": true }] }
```

### Snapshot (`data/snapshot/photos.json`)
```json
{ "photos": [{ "file": "Mix & Twist/NomFichier.jpg", "name": "Prénom Nom", "validated": true }] }
```

---

## Session Logs (localStorage)

| Clé | Jeu | Contenu | Reset |
|---|---|---|---|
| `mef_rt_seen` | Risque Tout | `{ themeId: { level: [answers…] } }` | Auto par bucket vide |
| `mef_cross_game_seen` | RT + Wagon | `{ "question§réponse": count }` | Auto quand pool épuisé |
| `mef_surenchere_seen` | Surenchère | `{ themeId: bool }` | Début de session |
| `mef_snap_rotation` | Snapshot | `[file…]` vus | Auto quand toutes vues |

**Fingerprint cross-game :** `(q.toLowerCase() + "§" + a.toLowerCase())` — harmonisé entre les deux formats q/a et question/answer.

---

---

# LE RISQUE TOUT

## Fichiers

```
Trivia Night MEF - Le Risque Tout/
├── regie.html          ← Régie MC (contrôle total)
├── ecran_jeu.html      ← Écran joueurs (passif, reçoit messages)
├── database.js         ← Généré par build.py depuis data/risque_tout/
├── database_custom.js  ← Mode custom (vide par défaut)
├── data.js             ← GAME_CONFIG : thèmes, icônes, roue
├── scores.js           ← Gestion scores
└── style.css
```

**BroadcastChannel :** `rt_channel` (défini dans `data.js`)

## Mécanique

1. **Sélection thèmes** : Roue (mode NORMAL), slots (mode QUICK), ou mode HARD (tout mystère)
2. **Grille de buckets** : une ligne par thème sélectionné, 5 colonnes (×1 à ×5)
3. **Ligne MYSTÈRE** : auto-ajoutée après sélection normale, buckets ×6 à ×10
4. **Réponse** : MC clique correct/faux → points ajoutés/retirés

### Pondération difficultés MYSTÈRE

| Bucket | d1 | d2 | d3 | d4 | d5 |
|---|---|---|---|---|---|
| ×6 | 60% | 20% | 10% | 9% | 1% |
| ×7 | 50% | 30% | 10% | 9% | 1% |
| ×8 | 20% | 20% | 50% | 9% | 1% |
| ×9 | 10% | 10% | 15% | 60% | 5% |
| ×10 | 1% | 9% | 15% | 25% | 50% |

### Pool MYSTÈRE
Questions des thèmes **non sélectionnés** sur la roue, hors harry_potter images. Organisé par `level` (difficulty) dans `poolByDiff` pour le sampling pondéré.

## Thèmes disponibles (data/risque_tout/)

| ID | Label | Types |
|---|---|---|
| animaux | Animaux | images + sons + texte |
| annees_2000 | Années 2000 | texte |
| art | Art | texte |
| celebrites | Célébrités | images + texte |
| cinema | Cinéma | texte |
| cuisine | Cuisine | texte |
| disney | Disney | images + texte |
| geographie | Géographie | images (drapeaux) + texte (capitales) |
| harry_potter | Harry Potter | images + texte |
| histoire | Histoire | texte |
| jeux_video | Jeux Vidéo | texte |
| litterature | Littérature | texte |
| logo | Logos & Marques | images (`data/assets/images/logos/D/`) |
| musique | Musique | images (artistes) + sons (.m4a) + texte |
| mystere | Mystère | (vide, thème réservé à la roue) |
| sciences | Sciences | texte |
| sport | Sport | texte |

## database.js — structure

```js
const QUESTION_DATABASE = {
  "geographie": {
    "1": { "images": [{file, question, answer}], "sounds": [], "text": [{question, answer}] },
    "2": { ... },
    ...
    "5": { ... }
  },
  ...
}
```

---

---

# LE WAGON

## Fichiers

```
Trivia Night MEF - Le Wagon/
├── regie.html      ← Régie MC (HTML autonome avec JS embarqué, ~1500 lignes)
├── ecran_jeu.html  ← Écran joueurs
├── data.js         ← BONUSES, MALUS, AVAILABLE_THEMES (généré par build.py)
├── data_custom.js  ← Mode custom
└── scores.js / regie.css / wagon_game.css
```

**BroadcastChannel :** `wagon_channel`

## Mécanique

### Structure d'une partie
1. MC configure équipes (couleur, nom), puis valide
2. MC sélectionne 2-8 thèmes → crée les wagons
3. Tour par tour : une équipe choisit un wagon
4. Le wagon a `depth` questions (défaut 10) réparties sur 3 paliers + finale

### Paliers et points

| Palier | Questions | Points/Q | Banking autorisé |
|---|---|---|---|
| Palier 1 | Q1-Q3 | 1 pt | Fin Q3 |
| Palier 2 | Q4-Q6 | 2 pts | Fin Q6 |
| Palier 3 | Q7-Q9 | 3 pts | Fin Q9 |
| Finale | Q10 | 5 pts | Après Q10 |

### Mapping difficulté → position
```
Q1(d1), Q2(d1), Q3(d2), Q4(d2), Q5(d2), Q6(d3), Q7(d3), Q8(d4), Q9(d4), Q10(d5)
```
Fonction `getDifficultyForLevel(level, depth)` dans `regie.html` (avant `rerollQuestion`).

### Questions image et son
- `type:"image"` → `regie.html` affiche une `<img>`, `ecran_jeu.html` affiche `<img class="q-image">`
- `type:"sound"` → `regie.html` affiche un `<audio controls>`, `ecran_jeu.html` affiche `🎵 label + <audio autoplay>`
- Chemin résolu : `'../' + q.file` (l'écran est 1 niveau sous la racine projet)

### Thème Mystère (dynamique)
Dans `createWagons()`, si `theme.id === 'mystere'` : pool = toutes les questions de tous les thèmes **non sélectionnés** dans cette partie. Mélangé aléatoirement, tranché à `depth`.

### Changer Q (Reroll)
`rerollQuestion()` filtre le pool de thème par même difficulté que la position actuelle. Fallback sur toutes les questions si pool vide pour cette difficulté.

## Thèmes (data/wagon/themes.json) — 10 thèmes

| ID | Nom | Nb questions | Source |
|---|---|---|---|
| fleurs | 🌸 Fleurs | ~13 | wagon-native |
| jeux | 🎲 Jeux de société | ~10 | wagon-native |
| animaux | 🐶🐱 Chiens & chats | ~13 | wagon-native |
| football | ⚽ Football | ~13 | wagon-native |
| jeuxvideo | 🎮 Jeux vidéo | ~13 | wagon-native |
| musique | 🎵 Musique | ~317 | importé de RT musique |
| geographie | 🌍 Géographie | ~547 | importé de RT geographie |
| harry_potter | 🧙 Harry Potter | ~257 | importé de RT harry_potter |
| logo | 🏷️ Logos & Marques | ~150 | importé de RT logo |
| mystere | 🎭 Mystère | (dynamique) | thèmes non sélectionnés |

## Bonuses (12)

| ID | Nom | Timing | Effet |
|---|---|---|---|
| 1 | TCHOU TCHOU | POST_CORRECT | Double les points de la Q |
| 2 | FREIN D'URGENCE | POST_CORRECT | Bank disponible hors palier |
| 3 | AIGUILLAGE | PRE_QUESTION | Reroll question au lancement |
| 4 | CLASSE AFFAIRES | POST_CORRECT | Q suivante auto-validée + points |
| 5 | CHARBON | POST_CORRECT | +3 pts bonus |
| 7 | RETARD SNCF | PRE_QUESTION | +20s au timer |
| 8 | EXPRESS | PRE_QUESTION | Timer 10s mais points ×3 |
| 9 | VOL DE BAGAGE | IMMEDIATE | -3 pts au leader |
| 10 | TERMINUS | POST_CORRECT | Force le bank immédiatement |
| 11 | WAGON BAR | IMMEDIATE | +5 pts |
| 12 | GRIÈVE | IMMEDIATE | Bloque le wagon sélectionné |
| 18 | BILLET DE RETOUR | PRE_QUESTION | Si faux → question changée, rejouez sans perdre le tour |

## Malus (5)

| ID | Nom | Effet |
|---|---|---|
| 13 | VOL DE TOUR | Vole la main de l'équipe courante |
| 14 | PASSE TON TOUR | Prochain tour sauté |
| 15 | BLOQUER LE BANK | Bank bloqué au prochain palier |
| 16 | TIMER RÉDUIT | -20s au prochain timer |
| 17 | VOL DE BANQUE | Si la cible banque → points vont à l'activant |

## Messages BroadcastChannel (regie → écran)

| Type | Données | Effet écran |
|---|---|---|
| STATE_UPDATE | gameState | Mise à jour complète |
| START_INTRO | — | Lance Generique.mp4 |
| SKIP_INTRO | — | Skip la vidéo |
| QUESTION_LOADED | { theme, themeColor } | Affiche fond thématique, cache wagons |
| SHOW_QUESTION | { question, questionType, questionFile, level, depth, points, tier, teamName, teamColor, themeColor, pendingPoints } | Affiche la question |
| REROLL_QUESTION | { question, questionType, questionFile } | Met à jour la question affichée |
| CORRECT_ANSWER | { wagonIndex, level, teamColor } | Anime la fenêtre correcte |
| WRONG_ANSWER | { wagonIndex, level } | Anime la défaite |
| BANK_POINTS | { wagonIndex, teamName, teamColor, points, score, windowStates, currentLevel } | Colorie les fenêtres banquées |
| PALIER_END | { total, canContinue } | Écran "Fin de palier" |
| AWAIT_NEXT / CONTINUE_WAGON / HIDE_QUESTION | — | Reaffiche les wagons |
| SHOW_BONUS / SHOW_RESULTS / TEAM_QUALIFIED / SKIP_TURN | … | Notifications visuelles |

---

---

# LA SURENCHÈRE

## Fichiers

```
Trivia Night MEF - La Surenchère/
├── surenchere_regie.html   ← Régie MC
├── surenchere_ecran.html   ← Écran joueurs
├── surenchere_data.js      ← THEMES_DATA (généré par build.py)
├── surenchere_data_custom.js
└── style_surenchere.css
```

**BroadcastChannel :** `surenchere_channel`

## Mécanique

- MC tire un thème (aléatoire, non rejoué)
- Équipes citent des éléments appartenant à la catégorie
- Le joueur qui ne trouve plus ou donne une mauvaise réponse est éliminé
- Session log `mef_surenchere_seen` → thème déjà joué non retiré avant épuisement de tous

## Thèmes (27+, data/surenchere/)

afrique, amerique_latine, animaux_fr, artistes_fr, capitales_eu, ciup, departements, europe, films_fr, g20, grandes_villes_fr, instruments, jo_sports, langues, ligne1, ligne3, ligne4, ligne6, ligne8, ligne13, ligue1, metro_lignes, parcs, plats_fr, presidents_fr, series_fr, ue

Lignes de métro : liste complète des stations de chaque ligne (1, 3, 4, 6, 8, 13).

---

---

# SNAPSHOT (Mix & Twist)

## Fichiers

```
Trivia Night MEF - Snapshot/
├── snapshot_regie.html   ← Régie MC
├── snapshot_ecran.html   ← Écran joueurs
├── generique.html        ← Animation intro (Canvas 2D, GSAP, 18s)
├── mix_data.js           ← MIX_PHOTOS (généré par build.py)
├── mix_data_custom.js    ← Mode custom
├── scène.png             ← Image de fond théâtre (révélée à la fin du générique)
├── snapshot_logo.png     ← Logo Snapshot
├── Generique_Snapshot.mp3 ← Audio du générique
└── style_mix.css
```

**BroadcastChannel :** `snapshot_channel`

## Mécanique

1. MC clique **🎬 GÉNÉRIQUE** → `START_INTRO` → `snapshot_ecran.html` ouvre `generique.html` en iframe fullscreen (19.5s puis retire automatiquement)
2. MC clique **N** (Normal, 24 photos) ou **H** (Hard, 32 photos) → `INIT` → grille de cartes faces visibles
3. MC clique **LANCER MÉMO** → phase mémorisation (timer 24s/30s)
4. Fin mémorisation → cartes retournées, timer en jeu commence
5. MC clique **FAUX** ou timer expire → feedback

**Round-robin photos :** `snapLog_pickPhotos()` dans `snapshot_regie.html` utilise `mef_snap_rotation` localStorage pour garantir que chaque photo apparaît avant de revenir. Reset auto quand toutes vues.

## generique.html — Architecture

- **Canvas 2D `destination-out`** : remplit le canvas en noir, perce un trou radial gradient pour le spotlight
- **Portraits** (z-index 1) : sous le canvas, révélés passivement par le trou
- **Canvas** (z-index 2) : obscurité avec trou = spotlight
- **Chat** (z-index 5) : au-dessus du canvas, animé par GSAP
- **Flash** (z-index 50) : transition vers la scène
- **scène.png** (z-index 6) : image de théâtre, révélée sous le flash

**Scaling adaptatif :** `scaleComposition()` adapte la composition 1920×1080 à n'importe quelle résolution via `transform: translate+scale`.

**Photos :** 7 portraits sélectionnés aléatoirement (Fisher-Yates) à chaque ouverture. Noms masqués (`display:none`).

**Séquence GSAP (17-18s) :**
- t=0.3-12.9 : spotlight parcourt 7 portraits + apparition chat ×2 + bug électrique
- t=12.4 : flash
- t=12.5 : scène révélée
- t=13.0 : logo + cartes en éventail + tagline

---

---

## Dernières modifications (2026-05-08)

### Surenchère + Wagon : option "Aucun bonus/malus"
- Ajout `<option value="none">Aucun bonus/malus</option>` dans le sélecteur de mode kit des deux jeux
- `applyKitModeToTeams()` gère le cas `none` : `bonuses=[]`, `malus=[]`, slots remplis de `''`
- Kit manuel : `optionHTML()` / `kitOptionHTML()` ajoutent une option vide "Aucun" en tête de liste
- Fix `renderKitSetup()` : slots initialisés à `''` (pas à un ID aléatoire) si manquants
- Fix `applyKitModeToTeams()` mode manual : filtre les slots `''` avant de construire les tableaux `bonuses`/`malus`

---

## Notes techniques importantes

### Chemins de fichiers

| Contexte | Convention | Exemple |
|---|---|---|
| JSON Risque Tout (source) | Relatif à la racine projet | `data/assets/images/France.png` |
| database.js (après build) | Relatif au dossier du jeu | `../data/assets/images/France.png` |
| Wagon themes.json | Idem JSON RT | `data/assets/images/logos/1/Nike.png` |
| Wagon data.js (après build) | Stocké tel quel, l'écran ajoute `../` | idem |
| Logos (in JSON) | `data/assets/images/logos/D/Name.png` | (pas d'ancien `../../logos/`) |
| Extraits musicaux (in JSON) | `data/assets/sons/chansons/difficulte_D/Song.m4a` | |

### Données de jeu vs données sources

- **Sources JSON** (dans `data/`) : vérité éditable via customizer
- **Fichiers JS compilés** : `database.js`, `data.js`, `surenchere_data.js`, `mix_data.js` → regénérés par `build.py`
- **Fichiers `_custom.js`** : override mode custom (sélectionnable via bouton MODE dans chaque jeu)

### BroadcastChannel — Noms

| Jeu | Channel name |
|---|---|
| Le Risque Tout | `rt_channel` (défini dans `data.js`) |
| Le Wagon | `wagon_channel` |
| La Surenchère | `surenchere_channel` |
| Snapshot | `snapshot_channel` |

### Encodage

`build.py` utilise `encoding='utf-8-sig'` pour lire les JSON (gère le BOM ajouté par PowerShell 5.1). Les fichiers JS sont écrits en `utf-8` standard.
