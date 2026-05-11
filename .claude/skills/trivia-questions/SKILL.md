---
name: trivia-questions
description: Génère des questions, thèmes ou listes de réponses pour les jeux MEF Trivia Night (Le Risque Tout, Le Wagon, La Surenchère). Utilise ce skill quand l'utilisateur demande de générer du contenu de jeu — questions Q/R, thèmes Surenchère, ou quand il mentionne un jeu MEF.
argument-hint: "[jeu] [thème] [nombre]"
---

## Phase 1 — Collecte des infos (toujours avant de générer)

Collecter ces infos avant toute génération. Poser les questions manquantes en une seule fois :

| Info | Question à poser | Défaut si absent |
|---|---|---|
| **Jeu cible** | "Pour quel jeu ? (Le Risque Tout / Le Wagon / La Surenchère)" | Demander obligatoirement |
| **Thème** | "Sur quel thème ?" | Demander obligatoirement |
| **Audience** | "Niveau du public ? (étudiants MEF/CIUP, grand public, experts)" | Demander obligatoirement |
| **Langue** | "En quelle langue ? (français, anglais, autre)" | Demander obligatoirement |
| **Nombre** | "Combien de questions ?" | RT/Wagon : 10 · Surenchère : 30 réponses |
| **Source** | Texte fourni ou génération libre ? | Libre si rien n'est fourni |

### Dialogues de précaution avant génération

Déclencher ces dialogues si la situation le justifie :

- **Thème très vague** (ex : "sport", "histoire") → demander une précision : "Sport en général ou un sport/sport spécifique ? (ex : football, tennis, JO)"
- **Thème Surenchère déjà existant** → signaler : "Ce thème existe déjà (ex: `ligue1`). Tu veux compléter la liste existante ou créer une variante ?"
- **Nombre demandé irréaliste pour la Surenchère** → si > 50 : rappeler la limite et proposer de scinder en deux thèmes
- **Texte source fourni mais trop court** (< 200 mots) → signaler que la qualité sera limitée et demander confirmation

---

## Phase 2 — Format de sortie

**Par défaut : texte dans le chat** (tableau markdown lisible). Autre format (JSON, CSV…) uniquement si l'utilisateur le demande explicitement.

---

## Phase 3 — Génération par jeu

### Le Risque Tout

#### Format de sortie

Tableau markdown, regroupé par niveau, au moins 2 questions par niveau :

```
| Niveau | Question                              | Réponse             | Confiance |
|--------|---------------------------------------|---------------------|-----------|
| 1      | Quelle est la capitale de la France ? | Paris               | ✅        |
| 1      | Quel est le plus grand océan ?        | Pacifique           | ✅        |
| 2      | Quel fleuve traverse Berlin ?         | La Spree            | ⚠️        |
| 3      | ...                                   | ...                 | ✅        |
```

#### Types de questions

- **Texte uniquement.** Image et son = fichiers physiques non générables par IA — informer l'utilisateur si demandé.
- **Thèmes existants :** animaux, années 2000, art, célébrités, cinéma, cuisine, disney, géographie, harry_potter, histoire, jeux_video, littérature, logo, musique, sciences, sport
- Nouveau thème → signaler qu'il faudra le créer via le customizer et relancer `build.py`

#### Distribution imposée par niveau

Pour 10 questions, respecter cette répartition cible :

| Niveau | Nb questions cible | Critère public |
|--------|-------------------|----------------|
| 1 | 2 | Connu de presque tout le monde |
| 2 | 3 | Culture générale solide, lycée/fac |
| 3 | 3 | Connaissance précise du thème |
| 4 | 1 | Question pointue, amateur averti |
| 5 | 1 | Très difficile, niveau expert |

Pour un nombre différent de questions, adapter proportionnellement. Ne jamais générer 0 questions pour le niveau 1 ou 2.

> ⚠️ **Disclaimer difficulté :** Le calibrage est estimatif. La difficulté perçue varie selon le niveau réel de l'audience ce soir-là. Une relecture humaine vaudra toujours mieux qu'une calibration IA — ajustez les niveaux dans le customizer après test.

#### Scoring de confiance par question

Attribuer un flag à chaque question générée :

| Flag | Signification | Quand l'utiliser |
|------|--------------|-----------------|
| ✅ | Sûr | Fait établi, réponse unique, intemporel |
| ⚠️ | À vérifier | Réponse potentiellement contestée, variante possible, dépend du contexte culturel |
| ❌ | À retravailler | Réponse ambiguë, subjective, ou temporellement dépendante |

Après génération, lister séparément les questions ⚠️ et ❌ avec l'explication du problème.

#### Anti-patterns ❌

- Réponse qui répète les mots clés de la question (ex : "Qui a fondé la fondation X ?" → "Le fondateur de X")
- Questions dont la réponse change avec le temps : "Qui est l'actuel président de…", "Quel est le record actuel de…"
- Réponse valide en France mais fausse ailleurs (ex : noms de plats régionaux présentés comme universels)
- Deux questions qui mènent à la même réponse sous un angle différent
- Questions subjectives déguisées : "Quelle est la meilleure…", "Quel est le plus célèbre…"
- Réponse trop longue : préférer 1-4 mots, sinon signaler ⚠️

#### Message après génération

> Pour intégrer : ouvre le **customizer** (onglet Risque Tout → thème → AJOUTER), puis relance `python build.py`.

---

### Le Wagon

#### Format de sortie

Même tableau que Le Risque Tout avec colonne Confiance (mêmes règles qualité et anti-patterns).

#### Spécificités Wagon

- Mapping difficulté→position fixe : `Q1(d1), Q2(d1), Q3(d2), Q4(d2), Q5(d2), Q6(d3), Q7(d3), Q8(d4), Q9(d4), Q10(d5)`
- Pour un wagon de 10 questions, répartir : 2×d1, 3×d2, 2×d3, 2×d4, 1×d5
- **Thèmes natifs :** fleurs, jeux de société, chiens & chats, football, jeux vidéo
- Thèmes importés depuis RT : musique, géographie, harry_potter, logo — pour enrichir ces thèmes, orienter l'utilisateur vers le Risque Tout

#### Message après génération

> Pour intégrer : ouvre le **customizer** (onglet Le Wagon → thème → AJOUTER), puis relance `python build.py`.

---

### La Surenchère

#### Format de sortie

```
**Thème :** Capitales européennes
**Question posée :** Citez un maximum de capitales européennes.

1. Paris          ✅
2. Berlin         ✅
3. Madrid         ✅
4. Tbilissi       ⚠️ (capitale géographiquement en Europe/Asie — à valider)
...
```

- Trier par popularité décroissante (les + connues en premier)
- **Maximum 50 réponses** par génération

> ⚠️ **Disclaimer exhaustivité :** Cette liste n'est pas exhaustive. Vérifie et complète avant d'intégrer — les thèmes géographiques ou culturels sont particulièrement sujets aux oublis et aux cas limites.

#### Distribution imposée

Structurer la liste en trois blocs pour équilibrer le jeu :

| Bloc | Part de la liste | Description |
|------|-----------------|-------------|
| Évidentes | ~40% | Réponses que tout le monde trouve facilement |
| Intermédiaires | ~40% | Réponses connues des gens cultivés sur le sujet |
| Pointues | ~20% | Réponses rares qui départagent les meilleures équipes |

#### Scoring de confiance Surenchère

Attribuer ✅ / ⚠️ / ❌ à chaque réponse :

- ✅ Appartient indiscutablement à la catégorie
- ⚠️ Cas limite ou variante orthographique à trancher (ex : "États-Unis" vs "USA")
- ❌ Appartenance discutable, à retirer

Lister les ⚠️ et ❌ séparément après la liste principale avec explication.

#### Règles qualité Surenchère

- Chaque réponse doit être **indiscutablement dans la catégorie**
- Pas d'éléments subjectifs ou dont l'appartenance peut être débattue
- Éviter les doublons orthographiques — ou les lister comme variantes ⚠️
- La question (`prompt`) doit être claire et sans ambiguïté sur ce qui est accepté ou non

#### Thèmes existants

afrique, amerique_latine, animaux_fr, artistes_fr, capitales_eu, ciup, departements, europe, films_fr, g20, grandes_villes_fr, instruments, jo_sports, langues, lignes de métro (1/2/3/4/5/6/7/8/9/10/13), ligue1, parcs, plats_fr, presidents_fr, series_fr, ue

#### Message après génération

> Pour intégrer : ouvre le **customizer** (onglet La Surenchère → thème → Import en masse, une réponse par ligne), édite le champ "Question posée", puis relance `python build.py`.

---

## Phase 4 — Génération depuis un texte source

Si l'utilisateur fournit un texte (cours, article, doc) :

1. Extraire les **faits vérifiables** uniquement — pas d'opinions, pas d'estimations
2. Formuler la question sans paraphraser trop directement le texte
3. Varier les formulations (Qui / Quoi / Quand / Où / Combien / Quel)
4. Signaler si des faits sont trop pointus, trop proches les uns des autres, ou liés à une date précise
5. Texte < 200 mots → signaler la limite et demander confirmation avant de générer

---

## Phase 5 — Rapport de génération

Après chaque génération, produire un résumé structuré :

```
## Résumé de génération

- Jeu : Le Risque Tout — Thème : Géographie
- Langue : Français · Audience : Étudiants MEF/CIUP
- Questions générées : 10

Distribution par niveau :
  d1 ██ 2   d2 ███ 3   d3 ███ 3   d4 █ 1   d5 █ 1

Scoring de confiance :
  ✅ Sûres : 8   ⚠️ À vérifier : 2   ❌ À retravailler : 0

Points d'attention :
  ⚠️ Q3 — "Quelle est la longueur du Nil ?" → réponse varie selon la source
  ⚠️ Q7 — "Quel est le plus grand pays du monde ?" → Russie (surface) ou Canada (hors Russie) ?
```

---

## Comportement général

- **Ne jamais inventer** une réponse incertaine — signaler explicitement le doute avec ⚠️
- **Pas de redondance** : pas de questions qui testent le même fait sous des angles différents
- **Pas de questions subjectives** — faits objectifs vérifiables uniquement
- Regrouper les questions par niveau dans le tableau
- Nouveau thème inexistant → proposer un ID slug valide (`a-z`, `0-9`, `_`) et rappeler la procédure customizer + build.py
- **Types image/son :** informer que ce n'est pas possible par génération IA — fichiers physiques requis
