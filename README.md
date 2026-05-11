# MEF Trivia Night — Battle Royale de culture générale

> Hier, j'ai eu l'opportunité de réaliser une sorte de rêve : animer quelque chose qui ressemblait à une vraie émission de télé.
>
> En étant un grand fan de Popcorn, l'émission de Webedia animée par Pierre-Alexis Bizot sur Twitch, j'ai toujours adoré les passages où les invités jouent à des jeux qui rappellent les émissions qu'on regardait plus jeunes. Bon… dit comme ça, on dirait que j'ai 50 ans, mais vous avez l'idée. 😂
>
> L'idée est née après une soirée organisée par le comité des résidents de la CIUP. Je me suis dit : pourquoi ne pas créer un Battle Royale de culture générale ? Mais pas juste un quiz classique. Il fallait gamifier la culture G, créer de la tension, du rythme, faire en sorte que les participants passent un bon moment sans voir le temps passer.
>
> Je suis donc parti d'une inspiration simple : reprendre certains codes de Popcorn, puis les assaisonner avec un soupçon de chaos. J'ai introduit des bonus, des malus, des mécaniques de sabotage entre joueurs… jusqu'à transformer ça en véritable guerre psychologique. 😭
>
> L'idée était là. Restait maintenant à construire tout le reste.
>
> Au début, je pensais partir sur quelque chose de simple : quelques fiches, un projecteur, et basta. Puis je me suis rappelé qu'on vit dans une époque où on peut littéralement fabriquer ses propres outils. J'ai donc commencé à utiliser Claude pour concevoir les premières mécaniques de jeu et prototyper rapidement les concepts.
>
> Mais mon côté perfectionniste a pris le dessus.
>
> Je voulais que les joueurs soient complètement immergés dans l'expérience. Impossible que les participants ou le public voient une souris se balader sur l'interface pendant la partie. Une grosse production a une grosse régie… alors je me suis dit : je vais faire ma propre régie.
>
> J'ai donc développé toute une interface de pilotage avec :
> - monitoring en temps réel
> - gestion des événements de partie
> - système d'annulation d'actions
> - logs
> - contrôles rapides pour fluidifier l'animation
>
> Pour concevoir l'UI, je me suis beaucoup appuyé sur des notions d'affordance que j'avais découvertes pendant mes études en réalité virtuelle. Petite dédicace à mes enseignants de l'époque. 🙏
>
> Ensuite, il y avait toute la partie création des questions. Et honnêtement… ça a été beaucoup plus technique que prévu.
>
> J'ai récupéré des données via les API de WikiData, utilisé l'API iTunes pour récupérer des extraits musicaux, et même conçu un skill Claude dédié à la génération et à la rédaction des questions afin de garder un bon niveau de qualité et de variété.
>
> Pour les assets visuels, je pensais sortir l'iPad et dessiner pendant des heures… au final j'ai surtout utilisé de l'IA et du reverse prompting pour obtenir exactement le style visuel que j'avais en tête.
>
> Et évidemment, il y avait aussi toute la partie "invisible" :
> faire les demandes d'autorisations, gérer la logistique, préparer l'accueil des joueurs et du public, organiser le matériel…
>
> À la fin, j'ai regroupé tout le projet dans ce repo GitHub avec un `CONTEXT.md` ainsi que le skill utilisé pour générer les questions (`SKILL_generation_questions.md`), au cas où certains voudraient s'en inspirer ou contribuer.
>
> Le projet est encore loin d'être terminé. J'ai énormément d'idées pour pousser le concept beaucoup plus loin, et je continuerai de travailler dessus quand j'aurai le temps.
>
> Bref… c'était l'histoire de la première édition de la Trivia Night M.E.F.
> Et j'espère sincèrement qu'il y en aura beaucoup d'autres.
>
> Merci à toutes les personnes ayant contribué de près ou de loin à ce projet. ❤️

---

## Les 4 mini-jeux

| Jeu | Description |
|-----|-------------|
| [Le Risque Tout](Trivia%20Night%20MEF%20-%20Le%20Risque%20Tout/README.md) | Quiz Q/R classique sur grille de cases avec système de mise |
| [Le Wagon](Trivia%20Night%20MEF%20-%20Le%20Wagon/README.md) | Wagons de questions par paliers avec banking stratégique |
| [La Surenchère](Trivia%20Night%20MEF%20-%20La%20Surench%C3%A8re/README.md) | Citez un maximum d'éléments d'une catégorie avant de sécher |
| [Snapshot](Trivia%20Night%20MEF%20-%20Snapshot/README.md) | Mémorisez des visages puis retrouvez-les |

---

## Utilisation

### Prérequis

- **Chrome ou Edge** (Firefox non compatible pour certaines fonctions)
- **Python 3.8+** uniquement si vous souhaitez modifier les questions

### Jouer sans installation

1. Téléchargez le repo (`Code → Download ZIP` sur GitHub)
2. Décompressez le dossier où vous voulez
3. Ouvrez n'importe quel fichier `.html` dans Chrome ou Edge
4. Aucune installation nécessaire — tout fonctionne en local

### Modifier les questions (éditeur visuel — recommandé)

1. Ouvrez `customizer.html` dans Chrome
2. Cliquez sur **Connecter le dossier du projet**
3. Sélectionnez le dossier racine (celui qui contient `data/`)
4. Ajoutez, modifiez ou validez des questions directement
5. Les sauvegardes s'écrivent automatiquement dans `data/`
6. Relancez ensuite `python build.py` pour mettre les jeux à jour

### Modifier les questions (ligne de commande)

```bash
# Regénère tous les fichiers JS depuis data/
python build.py

# Mode données personnalisées
python build.py --custom
```

> `migrate.py` et `migrate_assets.py` sont des scripts one-shot déjà exécutés — ne pas relancer.

### Partager des questions

1. Compressez votre dossier `data/` et envoyez-le (Drive, WeTransfer…)
2. Le destinataire remplace son `data/` et lance `python build.py`
3. Les jeux sont à jour

---

## Structure du projet

```
MEF Trivia Night CIUP/
├── customizer.html                      ← Éditeur de données (Chrome/Edge)
├── build.py                             ← Compilateur JSON → JS
├── CONTEXT.md                           ← Documentation technique complète
├── SKILL_generation_questions.md        ← Skill Claude pour générer des questions
│
├── data/                                ← Sources JSON (vérité éditable)
│   ├── risque_tout/                     ← ~18 fichiers JSON (un par thème)
│   ├── wagon/                           ← themes.json, bonuses.json, malus.json
│   ├── surenchere/                      ← ~27 fichiers JSON (un par thème)
│   ├── snapshot/                        ← photos.json
│   └── assets/
│       ├── images/                      ← Images de questions
│       └── sons/                        ← Extraits audio
│
├── Trivia Night MEF - Le Risque Tout/
├── Trivia Night MEF - Le Wagon/
├── Trivia Night MEF - La Surenchère/
└── Trivia Night MEF - Snapshot/
```

---

## Pour aller plus loin

- **Documentation technique complète :** [`CONTEXT.md`](CONTEXT.md)
- **Générer des questions avec Claude :** [`SKILL_generation_questions.md`](SKILL_generation_questions.md)
