// =====================================================================
// LE WAGON - DATA.JS
// Configuration, Bonus, Malus et Questions
// =====================================================================

const CHANNEL_NAME = 'wagon_channel';

// --- CONFIGURATION ---
const GAME_CONFIG = {
    tiers: [
        { endAt: 3, points: 1 },   // Q1-Q3 : 1 pt
        { endAt: 6, points: 2 },   // Q4-Q6 : 2 pts
        { endAt: 9, points: 3 },   // Q7-Q9 : 3 pts
        { endAt: 10, points: 5 }   // Q10   : 5 pts
    ],
    bonusPerTeam: 3,
    malusPerTeam: 2,
    defaultDepth: 10,
    defaultThreshold: 50,
    defaultTimer: 30
};

function getPointsForLevel(level) {
    // level est 1-indexé (1 à 10)
    if (level <= 3) return 1;
    if (level <= 6) return 2;
    if (level <= 9) return 3;
    return 5;
}

function isBankingAllowed(level, depth) {
    // Banking autorisé uniquement à la fin d'un palier
    const d = depth || 10;
    const tier1End = Math.ceil(d * 3 / 10);
    const tier2End = Math.ceil(d * 6 / 10);
    const tier3End = Math.ceil(d * 9 / 10);
    return level === tier1End || level === tier2End || level === tier3End || level === d;
}

function getTierForLevel(level) {
    if (level <= 3) return 1;
    if (level <= 6) return 2;
    if (level <= 9) return 3;
    return 4;
}

// --- 12 BONUS THÈME TRAIN ---
// timing: 'IMMEDIATE' = s'applique au moment de l'activation
//         'PRE_QUESTION' = s'applique quand la prochaine question DÉMARRE (au timer)
//         'POST_CORRECT' = s'applique après une bonne réponse
//         'TARGET' = vise un wagon/adversaire
// type: 'AUTO' = appliqué automatiquement en code | 'MANUAL' = le MC gère manuellement
const BONUSES = [
    {
        "id": 1,
        "name": "TCHOU TCHOU",
        "emoji": "🚂",
        "type": "AUTO",
        "timing": "POST_CORRECT",
        "desc": "Double les points de la question suivante.",
        "how": "Activez AVANT de lancer la prochaine question. Appliqué automatiquement si bonne réponse."
    },
    {
        "id": 2,
        "name": "FREIN D'URGENCE",
        "emoji": "🚨",
        "type": "AUTO",
        "timing": "POST_CORRECT",
        "desc": "Permet de banquer après n'importe quelle bonne réponse (hors palier).",
        "how": "Activez AVANT la question. Si bonne réponse, le bouton BANK apparaît."
    },
    {
        "id": 3,
        "name": "AIGUILLAGE",
        "emoji": "🔀",
        "type": "AUTO",
        "timing": "PRE_QUESTION",
        "desc": "Remplace la question au moment de son lancement (reroll automatique).",
        "how": "Activez avant le timer. La question est changée au lancement."
    },
    {
        "id": 4,
        "name": "CLASSE AFFAIRES",
        "emoji": "💼",
        "type": "AUTO",
        "timing": "POST_CORRECT",
        "desc": "Après une bonne réponse, la question suivante dans le wagon est automatiquement validée et ses points vous sont accordés.",
        "how": "Activez avant la question. Si bonne réponse, la Q suivante est grillée et ses points ajoutés à votre session."
    },
    {
        "id": 8,
        "name": "EXPRESS",
        "emoji": "🚄",
        "type": "AUTO",
        "timing": "PRE_QUESTION",
        "desc": "La prochaine question n'a que 10 secondes de timer — mais les points sont triplés si vous répondez correctement.",
        "how": "Activez avant le timer. Le timer passe à 10s, les points à ×3. Haut risque, haute récompense !"
    },
    {
        "id": 5,
        "name": "CHARBON",
        "emoji": "⛏️",
        "type": "AUTO",
        "timing": "POST_CORRECT",
        "desc": "+3 points bonus si la réponse est correcte.",
        "how": "Activez avant la question. +3 ajoutés automatiquement si bonne réponse."
    },
    {
        "id": 7,
        "name": "RETARD SNCF",
        "emoji": "⏰",
        "type": "AUTO",
        "timing": "PRE_QUESTION",
        "desc": "+20 secondes au timer de la prochaine question.",
        "how": "Activez avant le timer. Le timer sera allongé automatiquement."
    },
    {
        "id": 9,
        "name": "VOL DE BAGAGE",
        "emoji": "🧳",
        "type": "AUTO",
        "timing": "IMMEDIATE",
        "desc": "Vole 3 points à l'équipe en tête — effet immédiat.",
        "how": "Appliqué automatiquement dès confirmation."
    },
    {
        "id": 10,
        "name": "TERMINUS",
        "emoji": "🏁",
        "type": "AUTO",
        "timing": "POST_CORRECT",
        "desc": "Force le bank immédiatement après une bonne réponse, même hors palier.",
        "how": "Activez avant la question. Si bonne réponse, bank forcé automatiquement."
    },
    {
        "id": 11,
        "name": "WAGON BAR",
        "emoji": "🍸",
        "type": "AUTO",
        "timing": "IMMEDIATE",
        "desc": "+5 points instantanément à votre score.",
        "how": "Appliqué automatiquement dès confirmation."
    },
    {
        "id": 12,
        "name": "GRIÈVE",
        "emoji": "🔒",
        "type": "AUTO",
        "timing": "IMMEDIATE",
        "desc": "Bloque le wagon sélectionné pour ce tour.",
        "how": "Sélectionnez d'abord un wagon (cliquez dessus), puis activez GRIÈVE."
    },
    {
        "id": 18,
        "name": "BILLET DE RETOUR",
        "emoji": "🎫",
        "type": "AUTO",
        "timing": "PRE_QUESTION",
        "desc": "Seconde chance : si vous ratez la question, elle est automatiquement changée et vous pouvez retenter sans perdre votre tour !",
        "how": "Activez AVANT de lancer le timer. En cas de mauvaise réponse, la question change automatiquement et vous rejouez."
    }
];

// --- 4 MALUS (ciblés sur un adversaire) ---
const MALUS = [
    {
        "id": 13,
        "name": "VOL DE TOUR",
        "emoji": "🎯",
        "type": "AUTO",
        "timing": "IMMEDIATE",
        "desc": "Vole le tour de jeu de l'équipe adverse — vous jouez à sa place immédiatement.",
        "how": "Sélectionnez la cible. Vous prenez la main à leur place."
    },
    {
        "id": 14,
        "name": "PASSE TON TOUR",
        "emoji": "⛔",
        "type": "AUTO",
        "timing": "IMMEDIATE",
        "desc": "Force l'équipe adverse à passer son prochain tour.",
        "how": "La prochaine fois que l'équipe doit jouer, son tour est sauté automatiquement."
    },
    {
        "id": 15,
        "name": "BLOQUER LE BANK",
        "emoji": "🚫",
        "type": "AUTO",
        "timing": "IMMEDIATE",
        "desc": "Empêche l'équipe adverse de banquer au prochain palier — elle doit finir le wagon.",
        "how": "Le bouton BANK sera désactivé pour la prochaine opportunité de cette équipe."
    },
    {
        "id": 16,
        "name": "TIMER RÉDUIT",
        "emoji": "⏩",
        "type": "AUTO",
        "timing": "IMMEDIATE",
        "desc": "Réduit le temps de réflexion de l'adversaire de 20 secondes pour sa prochaine question.",
        "how": "Appliqué automatiquement au prochain timer de l'équipe ciblée."
    },
    {
        "id": 17,
        "name": "VOL DE BANQUE",
        "emoji": "🦹",
        "type": "AUTO",
        "timing": "PRE_QUESTION",
        "desc": "Si l'équipe adverse choisit de BANQUER à son prochain palier, ses points vous reviennent. Si elle continue, le malus est perdu.",
        "how": "Activez avant que l'adversaire joue. Leur bank = vos points. Ils continuent = malus perdu."
    }
];

// --- THÈMES & QUESTIONS ---
// Questions ordonnées par difficulté croissante (Q1-Q10 pour le jeu standard).
// Les questions supplémentaires (index >= 10) servent de pool pour "Changer Q".
// Champs image : type:"image", file:"data/assets/images/NomFichier.ext"
const AVAILABLE_THEMES = [
    {
        "id": "fleurs",
        "name": "🌸 Fleurs",
        "color": "#e84393",
        "questions": [
            {
                "q": "De quelle couleur est le tournesol ?",
                "a": "Jaune",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur est le symbole universel de l'amour ?",
                "a": "La rose",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur blanche de mai sent très fort et porte bonheur ?",
                "a": "Le muguet",
                "difficulty": 2
            },
            {
                "q": "Quelle fleur carnivore referme ses mâchoires sur les insectes ?",
                "a": "La dionée (Venus flytrap)",
                "difficulty": 2
            },
            {
                "q": "Quelle fleur japonaise symbolise la beauté éphémère du printemps ?",
                "a": "Le cerisier (sakura)",
                "difficulty": 2
            },
            {
                "q": "Comment appelle-t-on l'étude scientifique des fleurs et des plantes ?",
                "a": "La botanique",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur produit l'opium quand on en incise la capsule ?",
                "a": "Le pavot",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur néerlandaise a causé une bulle spéculative au XVIIe siècle ?",
                "a": "La tulipe",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom de la fleur qui pousse tous les 100 ans ?",
                "a": "Agave Americana (Century plant)",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur sacrée dans l'hindouisme a la particularité de rester propre grâce à ses feuilles hydrophobes ?",
                "a": "Le lotus (effet lotus)",
                "difficulty": 5
            },
            {
                "q": "Quel est le nom précis de l'organe femelle de la fleur, composé du stigmate, du style et de l'ovaire ?",
                "a": "Le pistil (ou gynécée)",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur tropicale ressemble à la tête d'un oiseau exotique ?",
                "a": "L'oiseau de paradis (Strelitzia)",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom scientifique de la famille des roses ?",
                "a": "Les Rosacées",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur est associée à la Provence et utilisée en parfumerie ?",
                "a": "La lavande",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur est souvent offerte à la Saint-Valentin ?",
                "a": "La rose rouge",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur suit la course du soleil ?",
                "a": "Le tournesol",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur est utilisée pour produire le safran ?",
                "a": "Le crocus",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur est traditionnellement associée au souvenir des soldats ?",
                "a": "Le coquelicot",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle fleur est emblématique des Pays-Bas ?",
                "a": "La tulipe",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur japonaise célèbre la beauté éphémère ?",
                "a": "Le sakura (cerisier)",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle fleur est utilisée pour faire des tisanes relaxantes ?",
                "a": "La camomille",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle fleur est le symbole national de l’Écosse ?",
                "a": "Le chardon",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur est utilisée dans la fabrication de certaines huiles essentielles apaisantes ?",
                "a": "La lavande",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur violette est utilisée dans certains bonbons ?",
                "a": "La violette",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle fleur est parfois appelée « dent-de-lion » ?",
                "a": "Le pissenlit",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle fleur tropicale est souvent portée à Hawaï en collier ?",
                "a": "L’hibiscus",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur a donné son nom à un célèbre peintre néerlandais ?",
                "a": "Le tournesol",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur produit parfois des capsules contenant de l’opium ?",
                "a": "Le pavot somnifère",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur rouge pousse souvent dans les champs de blé ?",
                "a": "Le coquelicot",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur est cultivée pour produire de la vanille ?",
                "a": "L’orchidée",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur est connue pour se refermer la nuit ?",
                "a": "La belle-de-nuit",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur a une odeur rappelant le chocolat ?",
                "a": "Le cosmos chocolat",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur est utilisée pour parfumer certains thés asiatiques ?",
                "a": "Le jasmin",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle fleur attire particulièrement les abeilles ?",
                "a": "La lavande",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur a des pétales bleus très rares dans la nature ?",
                "a": "Le bleuet",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur possède un nom lié à une couleur et un animal ?",
                "a": "Gueule-de-loup",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur carnivore utilise des urnes pour piéger ses proies ?",
                "a": "La népenthès",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur est souvent représentée dans les tableaux de Van Gogh ?",
                "a": "Le tournesol",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur est utilisée pour produire certaines infusions digestives ?",
                "a": "La camomille",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur est emblématique de la Toscane ?",
                "a": "L’iris",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur possède une odeur rappelant le citron ?",
                "a": "La mélisse en fleur",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur est surnommée « soleil des jardins » ?",
                "a": "Le tournesol",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur est connue pour sa symétrie parfaite ?",
                "a": "L’orchidée",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur est associée à la déesse grecque Aphrodite ?",
                "a": "La rose",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur est réputée pour attirer les colibris ?",
                "a": "La sauge rouge",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur bleue est symbole de mémoire en France ?",
                "a": "Le bleuet",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur est utilisée dans certaines salades méditerranéennes ?",
                "a": "La fleur de courgette",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle fleur est connue pour ses longues grappes violettes pendantes ?",
                "a": "La glycine",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur est célébrée lors de la fête symbolisant la lutte contre le cancer organisée par l’Institut Curie en France ?",
                "a": "La jonquille",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur possède le plus grand génome connu parmi les plantes à fleurs ?",
                "a": "Le Paris japonica",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur rare du Sri Lanka fleurit une seule nuit avant de mourir ?",
                "a": "avant de mourir ? Le kadupul",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur possède des feuilles créant “l’effet lotus” qui repousse l’eau ?",
                "a": "Le lotus",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur rare fleurit parfois seulement une nuit ?",
                "a": "Le kadupul",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur carnivore utilise des urnes pour piéger les insectes ?",
                "a": "La népenthès",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur a inspiré les célèbres tableaux de Claude Monet ?",
                "a": "Le nénuphar",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur produit l’épice la plus chère du monde ?",
                "a": "Le crocus à safran",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle fleur sert de symbole à la ville de Florence en Italie ?",
                "a": "Le lys rouge",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle fleur attire particulièrement les abeilles ?",
                "a": "La lavande",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur a des pétales comestibles souvent utilisés en salade ?",
                "a": "La capucine",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur est la plus vendue dans le monde ?",
                "a": "La rose",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle fleur symbolise la modestie ?",
                "a": "La violette",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel nom porte le phénomène où certaines fleurs s’ouvrent uniquement à une heure précise de la journée ?",
                "a": "La nyctinastie",
                "type": "text",
                "difficulty": 5
            }
        ]
    },
    {
        "id": "jeux",
        "name": "🎲 Jeux de société",
        "color": "#3498db",
        "questions": [
            {
                "q": "Quel jeu de société fait jouer de petits chevaux colorés ?",
                "a": "Le jeu des petits chevaux",
                "difficulty": 1
            },
            {
                "q": "Dans quel jeu cherche-t-on à faire couler les bateaux adverses ?",
                "a": "La Bataille navale",
                "difficulty": 1
            },
            {
                "q": "Quel jeu de société coopératif médical vous demande d'opérer un patient ?",
                "a": "Docteur Maboul",
                "difficulty": 2
            },
            {
                "q": "Combien y a-t-il de cases sur un échiquier ?",
                "a": "64",
                "difficulty": 2
            },
            {
                "q": "Dans le Monopoly, quelle est la rue la plus chère en version française ?",
                "a": "La Rue de la Paix",
                "difficulty": 2
            },
            {
                "q": "Dans le Scrabble, combien vaut la lettre Z ?",
                "a": "10 points",
                "difficulty": 3
            },
            {
                "q": "Quel jeu de plateau lancé en 1995 se joue sur une île avec des routes et des villes ?",
                "a": "Les Colons de Catane",
                "difficulty": 3
            },
            {
                "q": "Dans les échecs, quel est le seul coup où on déplace deux pièces simultanément ?",
                "a": "Le roque",
                "difficulty": 4
            },
            {
                "q": "Combien de propriétés y a-t-il dans un Monopoly standard ?",
                "a": "28",
                "difficulty": 4
            },
            {
                "q": "Qui a inventé le Rubik's Cube ?",
                "a": "Ernő Rubik (en 1974)",
                "difficulty": 5
            },
            {
                "q": "Dans quel jeu achète-t-on et vend-on des maisons et des hôtels ?",
                "a": "Monopoly",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu utilise des lettres pour former des mots ?",
                "a": "Scrabble",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Dans quel jeu les pièces sont un roi, une reine et des cavaliers ?",
                "a": "Les échecs",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu consiste à résoudre un meurtre dans un manoir ?",
                "a": "Cluedo",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu de cartes utilise des cartes +4 et changement de couleur ?",
                "a": "Uno",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu demande de faire deviner des mots sans certains termes interdits ?",
                "a": "Taboo",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle couleur joue en premier aux échecs ?",
                "a": "Blanc",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel jeu peut-on être “Mr. White” ?",
                "a": "Loups-Garous",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel jeu place-t-on des navires sur une grille ?",
                "a": "Bataille navale",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu d’ambiance demande de mentir avec assurance ?",
                "a": "Bluff",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel jeu demande de construire une cité antique avec des cartes ?",
                "a": "7 Wonders",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Combien de propriétés vertes existe-t-il au Monopoly classique ?",
                "a": "3",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le seul pion qui peut sauter par-dessus les autres aux échecs ?",
                "a": "Le cavalier",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans Uno, que permet une carte “Reverse” ?",
                "a": "Inverser le sens du jeu",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom du pion principal aux échecs ?",
                "a": "Le roi",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel pion vaut généralement le plus aux échecs après la reine ?",
                "a": "La tour",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Combien de cases compte un plateau d’échecs ?",
                "a": "64",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle lettre vaut le moins de points au Scrabble ?",
                "a": "Le E",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle pièce d’échecs peut se déplacer en diagonale uniquement ?",
                "a": "Le fou",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans Time’s Up, combien de manches différentes y a-t-il ?",
                "a": "3",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel jeu consiste à capturer le roi adverse ?",
                "a": "Les échecs",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu de cartes utilise des suites et des brelans ?",
                "a": "Poker",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel jeu consiste à construire une civilisation antique ?",
                "a": "7 Wonders",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel jeu de cartes est basé sur des monstres invoqués ?",
                "a": "Yu-Gi-Oh!",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel jeu consiste à faire exploser ses adversaires avec des chatons ?",
                "a": "Exploding Kittens",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel jeu de rôle médiéval fantastique est le plus célèbre ?",
                "a": "Donjons et Dragons",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans Catan, combien de dés sont lancés à chaque tour ?",
                "a": "2",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Combien de tuiles contient un jeu de domino double-six",
                "a": "28",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le but principal du jeu Ludo ?",
                "a": "Arriver au centre",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "uel jeu utilise des rôles cachés et du bluff politique ?",
                "a": "Secret Hitler",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle pièce vaut le plus aux échecs après la reine ?",
                "a": "Tour",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Dans Risk, quel continent donne le plus de renforts ?",
                "a": "Asie",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Dans Scrabble français, combien de lettres contient le sac ?",
                "a": "102",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Que signifie HP en Donjons & Dragons ?",
                "a": "Points de vie",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans Citadelles, combien de personnages sont choisis par manche ?",
                "a": "8",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle faction est basée sur la guérilla dans Root ?",
                "a": "La Canopée",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel personnage agit en dernier dans citadelles ?",
                "a": "L'assassin",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel personnage permet de voler de l’or dans Citadelles ?",
                "a": "Le voleur",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui gagne si Hitler est élu chancelier après 3 lois fascistes dans Secret Hitler ?",
                "a": "Les fascistes",
                "type": "text",
                "difficulty": 5
            }
        ]
    },
    {
        "id": "animaux",
        "name": "🐶🐱 Chiens & chats",
        "color": "#f39c12",
        "questions": [
            {
                "q": "Comment s'appelle le bébé du chat ?",
                "a": "Le chaton",
                "difficulty": 1
            },
            {
                "q": "Les chats voient-ils les couleurs comme les humains ?",
                "a": "Non, ils voient en nuances limitées (dichromates)",
                "difficulty": 1
            },
            {
                "q": "Combien d'heures par jour un chat dort-il en moyenne ?",
                "a": "12 à 16 heures",
                "difficulty": 2
            },
            {
                "q": "Quelle race de chat est célèbre pour son absence totale de poils ?",
                "a": "Le Sphynx",
                "difficulty": 2
            },
            {
                "q": "Quel est le chien de course le plus rapide au monde, pouvant atteindre 70 km/h ?",
                "a": "Le lévrier (Greyhound)",
                "difficulty": 2
            },
            {
                "q": "Quelle race de chien sauveteur en montagne est souvent représentée avec un tonneau autour du cou ?",
                "a": "Le Saint-Bernard",
                "difficulty": 3
            },
            {
                "q": "Comment s'appelle la race de chat originaire de Thaïlande aux yeux bleus ?",
                "a": "Le Siamois",
                "difficulty": 3
            },
            {
                "q": "Quelle nourriture appréciée des humains est très toxique pour les chiens ?",
                "a": "Le chocolat",
                "difficulty": 4
            },
            {
                "q": "Quelle est la seule race de chien qui possède une langue de couleur bleue ou violette ?",
                "a": "Le Chow-Chow",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom de la race de chien la plus ancienne au monde qui n'aboie pas mais yodle ?",
                "a": "Le Basenji",
                "difficulty": 5
            },
            {
                "q": "Quelle race de chien japonaise est devenue célèbre grâce à Hachiko ?",
                "a": "L'Akita Inu",
                "difficulty": 3
            },
            {
                "q": "Combien de muscles un chat possède-t-il dans chacune de ses oreilles ?",
                "a": "32 muscles",
                "difficulty": 5
            },
            {
                "q": "Combien de dents possède un chat adulte ?",
                "a": "30 dents",
                "difficulty": 4
            }
        ]
    },
    {
        "id": "football",
        "name": "⚽ Football",
        "color": "#27ae60",
        "questions": [
            {
                "q": "De quelle couleur est un carton d'expulsion ?",
                "a": "Rouge",
                "difficulty": 1
            },
            {
                "q": "Combien de joueurs y a-t-il dans une équipe de football sur le terrain ?",
                "a": "11 joueurs",
                "difficulty": 1
            },
            {
                "q": "Combien de temps dure un match de football réglementaire ?",
                "a": "90 minutes (2×45)",
                "difficulty": 2
            },
            {
                "q": "Qui a gagné la Coupe du Monde 2018 ?",
                "a": "La France",
                "difficulty": 2
            },
            {
                "q": "Quel pays a remporté le plus de Coupes du Monde dans l'histoire ?",
                "a": "Le Brésil (5 titres)",
                "difficulty": 2
            },
            {
                "q": "Quel joueur détient le record du nombre de Ballons d'Or remportés ?",
                "a": "Lionel Messi (8 Ballons d'Or)",
                "difficulty": 3
            },
            {
                "q": "Comment appelle-t-on le fait de marquer trois buts dans un même match ?",
                "a": "Un coup du chapeau (Hat-trick)",
                "difficulty": 3
            },
            {
                "q": "Quel joueur détient le record de buts marqués sur une seule édition de Coupe du Monde (13 buts) ?",
                "a": "Just Fontaine",
                "difficulty": 4
            },
            {
                "q": "Quel club est le seul club français à avoir remporté la Ligue des Champions (en 1993) ?",
                "a": "L'Olympique de Marseille (OM)",
                "difficulty": 4
            },
            {
                "q": "En quelle année la règle de la passe en arrière au gardien fut-elle instaurée ?",
                "a": "1992",
                "difficulty": 5
            },
            {
                "q": "Quel est le surnom de l'équipe nationale d'Angleterre ?",
                "a": "Les Three Lions",
                "difficulty": 3
            },
            {
                "q": "Quel joueur est le seul à avoir remporté trois Coupes du Monde en tant que joueur ?",
                "a": "Pelé",
                "difficulty": 5
            },
            {
                "q": "Quelle équipe a créé la surprise en remportant l'Euro 2004 face au Portugal ?",
                "a": "La Grèce",
                "difficulty": 4
            },
            {
                "q": "Quelle est la durée d’un match de football ?",
                "a": "90 minutes",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Combien de joueurs par équipe sur le terrain ?",
                "a": "11 joueurs",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Comment s’appelle le fait de marquer 3 buts ?",
                "a": "Hat-trick",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Combien de remplacements sont autorisés ?",
                "a": "5 remplacements",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui a gagné la première coupe du monde dans l'histoire du football ?",
                "a": "L'Uruguay",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui a gagné la Coupe du Monde 2006 ?",
                "a": "Italie",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui a marqué en finale 2014 côté Allemagne ?",
                "a": "Götze",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui a gagné la Ligue des Champions 2019 ?",
                "a": "Liverpool",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel pays a perdu 7-1 en 2014 ?",
                "a": "3",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle nation a organisé le Mondial 1998 ?",
                "a": "France",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle couleur pour la carte d'avertissement ?",
                "a": "Jaune",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle couleur pour un carton d’expulsion ?",
                "a": "Rouge",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel joueur est surnommé La Pulga ?",
                "a": "Messi",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui a gagné le Ballon d’Or 2018 ?",
                "a": "Luka Modrić",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel club joue au stade Old Trafford ?",
                "a": "Manchester United",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui a gagné Ballon d’Or 2007 ?",
                "a": "Kaká",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui a marqué la main de Dieu ?",
                "a": "Maradona",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel club est invaincu en Premier League 2004 ?",
                "a": "Arsenal",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "En quelle année la France a-t-elle remporté l'Euro pour la première fois ?",
                "a": "1984",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle équipe africaine fut la première à atteindre les demi-finales d'un Mondial ?",
                "a": "Le Maroc",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui est le meilleur buteur de l'histoire de la sélection allemande ?",
                "a": "Miroslav Klose",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel pays a perdu trois finales de Coupe du Monde sans jamais en gagner une ?",
                "a": "Les Pays-Bas",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel club détient le record de victoires consécutives en Ligue des Champions ?",
                "a": "Le Real Madrid (3 de suite)",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Comment appelle-t-il le derby entre le Celtic et les Rangers à Glasgow ?",
                "a": "Le Old Firm",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel club anglais est surnommé \"The Gunners\" ?",
                "a": "Arsenal",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel entraîneur a remporté la Ligue des Champions avec trois clubs différents ?",
                "a": "Carlo Ancelotti",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel club italien joue ses matchs à domicile au stade Luigi-Ferraris ?",
                "a": "La Sampdoria ou le Genoa",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel joueur est surnommé \"Le Hollandais Volant\" ?",
                "a": "Johan Cruyff",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel joueur a porté le numéro 7 à Manchester United juste avant Cristiano Ronaldo ?",
                "a": "David Beckham",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel joueur est le meilleur buteur de l'histoire du PSG ?",
                "a": "Kylian Mbappé",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle technologie aide l'arbitre à vérifier si le ballon a franchi la ligne ?",
                "a": "La Goal-Line Technology",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel événement historique a provoqué l'arrêt de la Coupe du Monde entre 1938 et 1950 ?",
                "a": "La Seconde Guerre mondiale",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle équipe a refusé de jouer un barrage de CDM 1974 en URSS pour protester contre le régime soviétique ?",
                "a": "Le Chili",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel pays a été le premier pays africain à se qualifier pour une phase finale de CDM (1934) ?",
                "a": "L'Égypte",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel pays accueille la finale de la Coupe du Monde 2026 (Stade MetLife) ?",
                "a": "Les États-Unis",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui est devenu le meilleur buteur de l'histoire de l'Équipe de France en 2024 ?",
                "a": "Olivier Giroud",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel jeune prodige espagnol est devenu le plus jeune buteur de l'histoire de l'Euro en 2024 ?",
                "a": "Lamine Yamal",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel entraîneur emblématique a quitté Liverpool en mai 2024 après 9 ans au club ?",
                "a": "Jürgen Klopp",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel club saoudien a recruté Neymar Jr en provenance du PSG ?",
                "a": "Al-Hilal",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel stade français a accueilli la finale de la Ligue des Champions 2022 suite au retrait de la Russie ?",
                "a": "Le Stade de France",
                "type": "text",
                "difficulty": 3
            }
        ]
    },
    {
        "id": "jeuxvideo",
        "name": "🎮 Jeux vidéo",
        "color": "#9b59b6",
        "questions": [
            {
                "q": "Quel plombier moustachu saute sur des champignons pour sauver une princesse ?",
                "a": "Mario",
                "difficulty": 1
            },
            {
                "q": "Quel hérisson bleu de chez SEGA court à la vitesse du son ?",
                "a": "Sonic",
                "difficulty": 1
            },
            {
                "q": "Dans quel jeu construit-on des structures avec des blocs de terrain cubiques ?",
                "a": "Minecraft",
                "difficulty": 2
            },
            {
                "q": "Quel jeu se déroule dans le royaume de Hyrule avec un jeune elfe en vert ?",
                "a": "The Legend of Zelda",
                "difficulty": 2
            },
            {
                "q": "Quel est le vrai nom du héros de Zelda (souvent confondu avec la princesse) ?",
                "a": "Link",
                "difficulty": 2
            },
            {
                "q": "Quel studio est à l'origine de la saga Grand Theft Auto (GTA) ?",
                "a": "Rockstar Games",
                "difficulty": 3
            },
            {
                "q": "Dans quel jeu de tir 100 joueurs sautent-ils d'un bus pour s'affronter sur une île ?",
                "a": "Fortnite",
                "difficulty": 3
            },
            {
                "q": "Qui a créé la franchise Pokémon en s'inspirant de sa passion pour la chasse aux insectes ?",
                "a": "Satoshi Tajiri",
                "difficulty": 4
            },
            {
                "q": "Quel jeu de Valve lancé en 2012 est l'un des MOBA les plus joués avec League of Legends ?",
                "a": "Dota 2",
                "difficulty": 4
            },
            {
                "q": "Quel jeu de 1972 est considéré comme le premier grand succès commercial de l'histoire du jeu vidéo ?",
                "a": "Pong",
                "difficulty": 5
            },
            {
                "q": "Quelle est la console de salon de Nintendo sortie en 2017 aussi utilisable en portable ?",
                "a": "La Nintendo Switch",
                "difficulty": 2
            },
            {
                "q": "Quel compositeur célèbre a écrit le thème musical iconique de Super Mario Bros. ?",
                "a": "Koji Kondo",
                "difficulty": 5
            },
            {
                "q": "En quelle année est sorti le premier jeu Donkey Kong en arcade (première apparition de Mario) ?",
                "a": "1981",
                "difficulty": 5
            },
            {
                "q": "Dans God of War, comment s'appelle le fils de Kratos ?",
                "a": "Atreus",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans The Last of Us, quel est le nom de famille de Joel ?",
                "a": "Miller",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans Street Fighter, de quel pays est originaire Chun-Li ?",
                "a": "Chine",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel studio a été obligé de détruire tous ses jeux suite à un procès contre Epic Games en 2012 ?",
                "a": "Silicon Knights",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "par quel nom a été remplacé Counter-Strike: Global Offensive en 2023 ?",
                "a": "Counter-Strike 2.",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel jeu consiste à empiler des blocs ?",
                "a": "Tetris",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle console est créée par Sony ?",
                "a": "PlayStation",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu se joue avec des cartes et des champions de Riot ?",
                "a": "League of Legends",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle entreprise a créé Xbox ?",
                "a": "Microsoft",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel héros utilise un bouclier dans Zelda ?",
                "a": "Link",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du frère de Mario ?",
                "a": "Luigi",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu utilise des agents comme Jett et Sage ?",
                "a": "Valorant",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel jeu mobile utilise des villageois et des clans ?",
                "a": "Clash of Clans",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu a popularisé le mode battle royale moderne ?",
                "a": "PUBG",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel jeu contient Steve comme personnage principal ?",
                "a": "Minecraft",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu est célèbre pour ses “fatalities” ?",
                "a": "Mortal Kombat",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel jeu utilise des cartes appelées Poké Balls ?",
                "a": "Pokémon",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu contient les personnages Scorpion et Sub-Zero ?",
                "a": "Mortal Kombat",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel jeu mobile utilise des cartes et des arènes ?",
                "a": "Clash Royale",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel jeu d’horreur contient Nemesis ?",
                "a": "Resident Evil 3",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel jeu a pour mascotte un hérisson bleu ?",
                "a": "Sonic",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Comment appelle-t-on trois éliminations d’affilée dans un FPS ?",
                "a": "Triple kill",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle entreprise développe League of Legends ?",
                "a": "Riot Games",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui accompagne souvent Ellie dans The Last of Us ?",
                "a": "Joel",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel métal permet de fabriquer une enclume dans Minecraft ?",
                "a": "Fer",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle série contient les personnages Ryu et Ken ?",
                "a": "Street Fighter",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle arme est souvent utilisée par les snipers dans FPS ?",
                "a": "AWP",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel jeu possède la map Summoner’s Rift ?",
                "a": "League of Legends",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel studio développe Overwatch ?",
                "a": "Blizzard",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel mode de jeu permet de créer son équipe avec des cartes dans Fifa ?",
                "a": "Ultimate Team",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans Tomb Raider, que recherche souvent Lara ?",
                "a": "Artefacts anciens",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel jeu a un personnage nommé Arthur Morgan ?",
                "a": "Red Dead Redemption 2",
                "type": "text",
                "difficulty": 4
            }
        ]
    },
    {
        "id": "musique",
        "name": "🎵 Musique",
        "color": "#e67e22",
        "questions": [
            {
                "q": "Qui est-ce ?",
                "a": "Ariana Grande",
                "type": "image",
                "file": "data/assets/images/Ariana Grande.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Aya Nakamura",
                "type": "image",
                "file": "data/assets/images/Aya Nakamura.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Benjamin Biolay",
                "type": "image",
                "file": "data/assets/images/Benjamin Biolay.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Beyonce",
                "type": "image",
                "file": "data/assets/images/Beyonce.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Bigflo",
                "type": "image",
                "file": "data/assets/images/Bigflo.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Billie Eilish",
                "type": "image",
                "file": "data/assets/images/Billie Eilish.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Britney Spears",
                "type": "image",
                "file": "data/assets/images/Britney Spears.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Camila Cabello",
                "type": "image",
                "file": "data/assets/images/Camila Cabello.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Cardi B",
                "type": "image",
                "file": "data/assets/images/Cardi B.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Celine Dion",
                "type": "image",
                "file": "data/assets/images/Celine Dion.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Christophe Maé",
                "type": "image",
                "file": "data/assets/images/Christophe Maé.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Clara Luciani",
                "type": "image",
                "file": "data/assets/images/Clara Luciani.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Dadju",
                "type": "image",
                "file": "data/assets/images/Dadju.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Dua Lipa",
                "type": "image",
                "file": "data/assets/images/Dua Lipa.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Ed Sheeran",
                "type": "image",
                "file": "data/assets/images/Ed Sheeran.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Eminem",
                "type": "image",
                "file": "data/assets/images/Eminem.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Gims",
                "type": "image",
                "file": "data/assets/images/Gims.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Harry Styles",
                "type": "image",
                "file": "data/assets/images/Harry Styles.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Julien Dore",
                "type": "image",
                "file": "data/assets/images/Julien Dore.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Juliette Armanet",
                "type": "image",
                "file": "data/assets/images/Juliette Armanet.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Justin Bieber",
                "type": "image",
                "file": "data/assets/images/Justin Bieber.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Justin Timberlake",
                "type": "image",
                "file": "data/assets/images/Justin Timberlake.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Kanye West",
                "type": "image",
                "file": "data/assets/images/Kanye West.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Katy Perry",
                "type": "image",
                "file": "data/assets/images/Katy Perry.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Kendji Girac",
                "type": "image",
                "file": "data/assets/images/Kendji Girac.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Lady Gaga",
                "type": "image",
                "file": "data/assets/images/Lady Gaga.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Miley Cyrus",
                "type": "image",
                "file": "data/assets/images/Miley Cyrus.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Nicki Minaj",
                "type": "image",
                "file": "data/assets/images/Nicki Minaj.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Ninho",
                "type": "image",
                "file": "data/assets/images/Ninho.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Pascal Obispo",
                "type": "image",
                "file": "data/assets/images/Pascal Obispo.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Patrick Bruel",
                "type": "image",
                "file": "data/assets/images/Patrick Bruel.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Post Malone",
                "type": "image",
                "file": "data/assets/images/Post Malone.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Shakira",
                "type": "image",
                "file": "data/assets/images/Shakira.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Slimane",
                "type": "image",
                "file": "data/assets/images/Slimane.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Stromae",
                "type": "image",
                "file": "data/assets/images/Stromae.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Taylor Swift",
                "type": "image",
                "file": "data/assets/images/Taylor Swift.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "The Weeknd",
                "type": "image",
                "file": "data/assets/images/The Weeknd.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Vianney",
                "type": "image",
                "file": "data/assets/images/Vianney.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Vitaa",
                "type": "image",
                "file": "data/assets/images/Vitaa.png",
                "difficulty": 1
            },
            {
                "q": "Qui est surnommé le \"King of Pop\" ?",
                "a": "Michael Jackson",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe chante \"We Will Rock You\" ?",
                "a": "Queen",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui interprète \"Allumer le feu\" ?",
                "a": "Johnny Hallyday",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle chanteuse chante \"La Vie en rose\" ?",
                "a": "Edith Piaf",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe a chanté \"Yellow Submarine\" ?",
                "a": "The Beatles",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Papaoutai\" ?",
                "a": "Stromae",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel instrument a 88 touches noires et blanches ?",
                "a": "Piano",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Single Ladies\" ?",
                "a": "Beyoncé",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel rappeur a chanté \"Lose Yourself\" ?",
                "a": "Eminem",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui est la reine de la Pop (Queen of Pop) ?",
                "a": "Madonna",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe français porte des casques de robots ?",
                "a": "Daft Punk",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel instrument joue Louis Armstrong ?",
                "a": "Trompette",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle chanteuse a interprété \"My Heart Will Go On\" ?",
                "a": "Céline Dion",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Djadja\" ?",
                "a": "Aya Nakamura",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est l'hymne national de la France ?",
                "a": "La Marseillaise",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Bohemian Rhapsody\" ?",
                "a": "Queen",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Combien de cordes a une guitare standard ?",
                "a": "6",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Hello\" (2015) ?",
                "a": "Adele",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe a chanté \"Smells Like Teen Spirit\" ?",
                "a": "Nirvana",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Les Lacs du Connemara\" ?",
                "a": "Michel Sardou",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"Thriller\" ?",
                "a": "Michael Jackson",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle chanteuse a popularisé \"Like a Virgin\" ?",
                "a": "Madonna",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel rappeur français fait le signe \"☝️👆\" avec ses mains ?",
                "a": "Jul",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"I Will Always Love You\" (Bodyguard) ?",
                "a": "Whitney Houston",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel groupe suédois a chanté \"Dancing Queen\" ?",
                "a": "ABBA",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Wannabe\" ?",
                "a": "Spice Girls",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"La Bohème\" ?",
                "a": "Charles Aznavour",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe a chanté \"Highway to Hell\" ?",
                "a": "AC/DC",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Happy\" ?",
                "a": "Pharrell Williams",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le roi du Reggae ?",
                "a": "Bob Marley",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Poker Face\" ?",
                "a": "Lady Gaga",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Alexandrie Alexandra\" ?",
                "a": "Claude François",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"Uptown Funk\" ?",
                "a": "Mark Ronson ft. Bruno Mars",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel DJ français a fait \"Titanium\" ?",
                "a": "David Guetta",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Formidable\" ?",
                "a": "Stromae",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe chante \"Wonderwall\" ?",
                "a": "Oasis",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Rehab\" ?",
                "a": "Amy Winehouse",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Sapés comme jamais\" ?",
                "a": "Maître Gims",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Imagine\" ?",
                "a": "John Lennon",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel groupe chante \"Stayin' Alive\" ?",
                "a": "Bee Gees",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Balance ton quoi\" ?",
                "a": "Angèle",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Despacito\" ?",
                "a": "Luis Fonsi",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Baby One More Time\" ?",
                "a": "Britney Spears",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe chante \"Let It Be\" ?",
                "a": "The Beatles",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui est le \"Roi du Rock'n'roll\" ?",
                "a": "Elvis Presley",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Bad Guy\" ?",
                "a": "Billie Eilish",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Gangnam Style\" ?",
                "a": "Psy",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe a chanté \"I Want to Break Free\" ?",
                "a": "Queen",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Umbrella\" ?",
                "a": "Rihanna",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Santé\" ?",
                "a": "Stromae",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de scène de Marshall Mathers ?",
                "a": "Eminem",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Shape of You\" ?",
                "a": "Ed Sheeran",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est l'instrument de Ray Charles ?",
                "a": "Piano",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"Shake It Off\" ?",
                "a": "Taylor Swift",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui a composé la musique de \"Star Wars\" ?",
                "a": "John Williams",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel instrument joue Carlos Santana ?",
                "a": "Guitare",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"Basique\" ?",
                "a": "Orelsan",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Crazy in Love\" ?",
                "a": "Beyoncé",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Rolling in the Deep\" ?",
                "a": "Adele",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est l'instrument de Slash ?",
                "a": "Guitare",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"Blinding Lights\" ?",
                "a": "The Weeknd",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Toxic\" ?",
                "a": "Britney Spears",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Je marche seul\" ?",
                "a": "Jean-Jacques Goldman",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel instrument joue Elton John ?",
                "a": "Piano",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel groupe chante \"Don't Stop Me Now\" ?",
                "a": "Queen",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Levitating\" ?",
                "a": "Dua Lipa",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Hips Don't Lie\" ?",
                "a": "Shakira",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"I Kissed a Girl\" ?",
                "a": "Katy Perry",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Color Gitano\" ?",
                "a": "Kendji Girac",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Wrecking Ball\" ?",
                "a": "Miley Cyrus",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Bad Romance\" ?",
                "a": "Lady Gaga",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe chante \"Take On Me\" ?",
                "a": "A-ha",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"Andalouse\" ?",
                "a": "Kendji Girac",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe chante \"Thunderstruck\" ?",
                "a": "AC/DC",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Watermelon Sugar\" ?",
                "a": "Harry Styles",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Someone Like You\" ?",
                "a": "Adele",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Pour que tu m'aimes encore\" ?",
                "a": "Céline Dion",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel chanteur a pour surnom \"The King of Rock and Roll\" ?",
                "a": "Elvis Presley",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Flowers\" ?",
                "a": "Miley Cyrus",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe chante \"Hey Jude\" ?",
                "a": "The Beatles",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"As It Was\" ?",
                "a": "Harry Styles",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Don't Start Now\" ?",
                "a": "Dua Lipa",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel groupe chante \"Numb\" ?",
                "a": "Linkin Park",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"Tout oublier\" ?",
                "a": "Angèle (et Roméo Elvis)",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui chante \"All I Want for Christmas Is You\" ?",
                "a": "Mariah Carey",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Get Lucky — Daft Punk",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_1/Daft_Punk_Get_Lucky.m4a",
                "difficulty": 1
            },
            {
                "q": "Quel est ce titre ?",
                "a": "ABC — Jackson 5",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_1/Jackson_5_ABC.m4a",
                "difficulty": 1
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Billie Jean — Michael Jackson",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_1/Michael_Jackson_Billie_Jean.m4a",
                "difficulty": 1
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Happy — Pharrell Williams",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_1/Pharrell_Williams_Happy.m4a",
                "difficulty": 1
            },
            {
                "q": "Quel est ce titre ?",
                "a": "We Will Rock You — Queen",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_1/Queen_We_Will_Rock_You.m4a",
                "difficulty": 1
            },
            {
                "q": "Quel chanteur américain était surnommé le « King » du Rock'n'Roll ?",
                "a": "Elvis Presley",
                "difficulty": 1
            },
            {
                "q": "Quel artiste américain est surnommé le « King of Pop » et a sorti l'album Thriller ?",
                "a": "Michael Jackson",
                "difficulty": 1
            },
            {
                "q": "Quel groupe a chanté \"Satisfaction\" ?",
                "a": "The Rolling Stones",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Joe le taxi\" ?",
                "a": "Vanessa Paradis",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"L'Aventurier\" ?",
                "a": "Indochine",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"La Boulette\" ?",
                "a": "Diam's",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"J'ai demandé à la lune\" ?",
                "a": "Indochine",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Il changeait la vie\" ?",
                "a": "Jean-Jacques Goldman",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel groupe chante \"Seven Nation Army\" ?",
                "a": "The White Stripes",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"Résiste\" ?",
                "a": "France Gall",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel groupe chante \"Radioactive\" et \"Believer\" ?",
                "a": "Imagine Dragons",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Envole-moi\" ?",
                "a": "Jean-Jacques Goldman",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"La Kiffance\" ?",
                "a": "Naps",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel rappeur est membre de la Sexion d'Assaut ?",
                "a": "Maître Gims (ou Black M)",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Tomber la chemise\" ?",
                "a": "Zebda",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"J't'emmène au vent\" ?",
                "a": "Louise Attaque",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Bad Bunny",
                "type": "image",
                "file": "data/assets/images/Bad Bunny.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Olivia Rodrigo",
                "type": "image",
                "file": "data/assets/images/Olivia Rodrigo.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Rihanna",
                "type": "image",
                "file": "data/assets/images/Rihanna.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Selena Gomez",
                "type": "image",
                "file": "data/assets/images/Selena Gomez.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Shawn Mendes",
                "type": "image",
                "file": "data/assets/images/Shawn Mendes.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Sia",
                "type": "image",
                "file": "data/assets/images/Sia.png",
                "difficulty": 2
            },
            {
                "q": "Quel est le prénom de Mozart ?",
                "a": "Wolfgang",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui a composé \"Les Quatre Saisons\" ?",
                "a": "Vivaldi",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui est le chanteur de U2 ?",
                "a": "Bono",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui a composé la \"Lettre à Élise\" ?",
                "a": "Beethoven",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du chanteur de Nirvana ?",
                "a": "Kurt Cobain",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel compositeur est sourd à la fin de sa vie ?",
                "a": "Beethoven",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel groupe chante \"Californication\" ?",
                "a": "Red Hot Chili Peppers",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Sous le vent\" avec Garou ?",
                "a": "Céline Dion",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel groupe chante \"Eye of the Tiger\" ?",
                "a": "Survivor",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Chandelier\" ?",
                "a": "Sia",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"La Grenade\" ?",
                "a": "Clara Luciani",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel groupe chante \"Zombie\" ?",
                "a": "The Cranberries",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui est le chanteur de Indochine ?",
                "a": "Nicola Sirkis",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel groupe chante \"Another Brick in the Wall\" ?",
                "a": "Pink Floyd",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel groupe chante \"Sweet Child O' Mine\" ?",
                "a": "Guns N' Roses",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Video Games\" ?",
                "a": "Lana Del Rey",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Confessions Nocturnes\" ?",
                "a": "Diam's (et Vitaa)",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du chanteur de Coldplay ?",
                "a": "Chris Martin",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui a composé \"L'Hymne à la joie\" ?",
                "a": "Beethoven",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"La Foule\" ?",
                "a": "Edith Piaf",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Amsterdam\" ?",
                "a": "Jacques Brel",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Old Town Road\" ?",
                "a": "Lil Nas X",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"Savoir aimer\" ?",
                "a": "Florent Pagny",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel groupe chante \"Should I Stay or Should I Go\" ?",
                "a": "The Clash",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"Mon manège à moi\" ?",
                "a": "Edith Piaf",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est le chanteur de \"Purple Haze\" ?",
                "a": "Jimi Hendrix",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Born to Die\" ?",
                "a": "Lana Del Rey",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui chante \"Belle\" (Notre-Dame de Paris) ?",
                "a": "Garou Lavoine Patrick Fiori",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Dancing Queen — ABBA",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_2/ABBA_Dancing_Queen.m4a",
                "difficulty": 2
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Rolling in the Deep — Adele",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_2/Adele_Rolling_in_the_Deep.m4a",
                "difficulty": 2
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Uptown Funk — Mark Ronson ft. Bruno Mars",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_2/Mark_Ronson_Uptown_Funk.m4a",
                "difficulty": 2
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Eye of the Tiger — Survivor",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_2/Survivor_Eye_of_the_Tiger.m4a",
                "difficulty": 2
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Blinding Lights — The Weeknd",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_2/The_Weeknd_Blinding_Lights.m4a",
                "difficulty": 2
            },
            {
                "q": "Qui chante 'Formidable' en 2012 ?",
                "a": "Stromae",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays est né le style musical appelé « Reggae », porté par Bob Marley ?",
                "a": "La Jamaïque",
                "difficulty": 2
            },
            {
                "q": "Quel artiste a chanté \"Purple Rain\" ?",
                "a": "Prince",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui chante \"Mistral Gagnant\" ?",
                "a": "Renaud",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel groupe a chanté \"Hotel California\" ?",
                "a": "The Eagles",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel artiste joue de la guitare à l'envers (gaucher) ?",
                "a": "Jimi Hendrix",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel rappeur américain a été tué en 1996 ?",
                "a": "Tupac (2Pac)",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Amir",
                "type": "image",
                "file": "data/assets/images/Amir.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Florent Pagny",
                "type": "image",
                "file": "data/assets/images/Florent Pagny.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Mylene Farmer",
                "type": "image",
                "file": "data/assets/images/Mylene Farmer.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Renaud",
                "type": "image",
                "file": "data/assets/images/Renaud.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Zaho",
                "type": "image",
                "file": "data/assets/images/Zaho.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Zaz",
                "type": "image",
                "file": "data/assets/images/Zaz.png",
                "difficulty": 3
            },
            {
                "q": "Quel est le prénom de Beethoven ?",
                "a": "Ludwig",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le vrai nom de Johnny Hallyday ?",
                "a": "Jean-Philippe Smet",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel instrument a 4 cordes et est plus gros qu'un violon ?",
                "a": "Violoncelle (ou Contrebasse)",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui a composé \"La Marche Turque\" ?",
                "a": "Mozart",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel rappeur chante \"Suicide Social\" ?",
                "a": "Orelsan",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel groupe chante \"Dream On\" ?",
                "a": "Aerosmith",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est ce titre ?",
                "a": "September — Earth, Wind & Fire",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_3/Earth_Wind_Fire_September.m4a",
                "difficulty": 3
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Sweet Dreams — Eurythmics",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_3/Eurythmics_Sweet_Dreams.m4a",
                "difficulty": 3
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Hey Ya! — OutKast",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_3/OutKast_Hey_Ya.m4a",
                "difficulty": 3
            },
            {
                "q": "Qui a composé la Symphonie n°9 malgré sa surdité ?",
                "a": "Ludwig van Beethoven",
                "difficulty": 3
            },
            {
                "q": "Quel groupe de rock suédois a remporté l'Eurovision en 1974 avec Waterloo ?",
                "a": "ABBA",
                "difficulty": 4
            },
            {
                "q": "Comment appelle-t-on la vitesse ou le rythme d'une pièce musicale ?",
                "a": "Le tempo",
                "difficulty": 3
            },
            {
                "q": "Qui est le chanteur de Linkin Park (décédé en 2017) ?",
                "a": "Chester Bennington",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel compositeur a écrit \"La Flûte enchantée\" ?",
                "a": "Mozart",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui a composé \"Le Lac des cygnes\" ?",
                "a": "Tchaïkovski",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Doja Cat",
                "type": "image",
                "file": "data/assets/images/Doja Cat.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Freddie Mercury",
                "type": "image",
                "file": "data/assets/images/Freddie Mercury.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Madonna",
                "type": "image",
                "file": "data/assets/images/Madonna.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Mariah Carey",
                "type": "image",
                "file": "data/assets/images/Mariah Carey.png",
                "difficulty": 4
            },
            {
                "q": "Qui a composé \"Les Noces de Figaro\" ?",
                "a": "Mozart",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui a composé \"La Chevauchée des Walkyries\" ?",
                "a": "Wagner",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui a composé \"Le Clair de lune\" ?",
                "a": "Debussy",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel est l'instrument de Stéphane Grappelli ?",
                "a": "Violon",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel groupe chante \"My Generation\" ?",
                "a": "The Who",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel groupe chante \"Buddy Holly\" ?",
                "a": "Weezer",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Enjoy the Silence — Depeche Mode",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_4/Depeche_Mode_Enjoy_the_Silence.m4a",
                "difficulty": 4
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Dreams — Fleetwood Mac",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_4/Fleetwood_Mac_Dreams.m4a",
                "difficulty": 4
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Clint Eastwood — Gorillaz",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_4/Gorillaz_Clint_Eastwood.m4a",
                "difficulty": 4
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Superstition — Stevie Wonder",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_4/Stevie_Wonder_Superstition.m4a",
                "difficulty": 4
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Friday I'm in Love — The Cure",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_4/The_Cure_Friday_Im_in_Love.m4a",
                "difficulty": 4
            },
            {
                "q": "Combien de touches (notes) possède un piano de concert standard ?",
                "a": "88",
                "difficulty": 4
            },
            {
                "q": "À quelle famille d'instruments appartiennent la trompette, le trombone et le tuba ?",
                "a": "Les cuivres",
                "difficulty": 4
            },
            {
                "q": "Quel rappeur a sorti \"L'étrange histoire de Mr. Anderson\" ?",
                "a": "Laylow",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel est l'instrument de Mstislav Rostropovitch ?",
                "a": "Violoncelle",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui a composé \"Le Messie\" (Alléluia) ?",
                "a": "Haendel",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui a composé \"Les Planètes\" ?",
                "a": "Holst",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui a composé \"La Symphonie du Nouveau Monde\" ?",
                "a": "Dvorak",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui a composé \"Gymnopédies\" ?",
                "a": "Erik Satie",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui a composé \"Rhapsody in Blue\" ?",
                "a": "Gershwin",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Song 2 — Blur",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_5/Blur_Song_2.m4a",
                "difficulty": 5
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Kids — MGMT",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_5/MGMT_Kids.m4a",
                "difficulty": 5
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Psycho Killer — Talking Heads",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_5/Talking_Heads_Psycho_Killer.m4a",
                "difficulty": 5
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Should I Stay or Should I Go — The Clash",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_5/The_Clash_Should_I_Stay_or_Should_I_Go.m4a",
                "difficulty": 5
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Every Breath You Take — The Police",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_5/The_Police_Every_Breath_You_Take.m4a",
                "difficulty": 5
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Last Nite — The Strokes",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_5/The_Strokes_Last_Nite.m4a",
                "difficulty": 5
            },
            {
                "q": "Quel est ce titre ?",
                "a": "Africa — Toto",
                "type": "sound",
                "file": "data/assets/sons/chansons/difficulte_5/Toto_Africa.m4a",
                "difficulty": 5
            },
            {
                "q": "Quel groupe de rock a été le premier à se produire sur les sept continents, y compris l'Antarctique ?",
                "a": "Metallica",
                "difficulty": 5
            },
            {
                "q": "Comment appelle-t-on le silence qui dure l'équivalent de quatre temps dans une mesure ?",
                "a": "Une pause",
                "difficulty": 5
            }
        ]
    },
    {
        "id": "geographie",
        "name": "🌍 Géographie",
        "color": "#16a085",
        "questions": [
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Algérie",
                "type": "image",
                "file": "data/assets/images/Algérie.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Allemagne",
                "type": "image",
                "file": "data/assets/images/Allemagne.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Argentine",
                "type": "image",
                "file": "data/assets/images/Argentine.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Australie",
                "type": "image",
                "file": "data/assets/images/Australie.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Brésil",
                "type": "image",
                "file": "data/assets/images/Brésil.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Canada",
                "type": "image",
                "file": "data/assets/images/Canada.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Chili",
                "type": "image",
                "file": "data/assets/images/Chili.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Chine",
                "type": "image",
                "file": "data/assets/images/Chine.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Espagne",
                "type": "image",
                "file": "data/assets/images/Espagne.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Finlande",
                "type": "image",
                "file": "data/assets/images/Finlande.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "France",
                "type": "image",
                "file": "data/assets/images/France.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Grèce",
                "type": "image",
                "file": "data/assets/images/Grèce.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Inde",
                "type": "image",
                "file": "data/assets/images/Inde.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Italie",
                "type": "image",
                "file": "data/assets/images/Italie.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Japon",
                "type": "image",
                "file": "data/assets/images/Japon.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Maroc",
                "type": "image",
                "file": "data/assets/images/Maroc.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Mexique",
                "type": "image",
                "file": "data/assets/images/Mexique.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Norvège",
                "type": "image",
                "file": "data/assets/images/Norvège.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Portugal",
                "type": "image",
                "file": "data/assets/images/Portugal.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Royaume Uni",
                "type": "image",
                "file": "data/assets/images/Royaume-Uni.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Russie",
                "type": "image",
                "file": "data/assets/images/Russie.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Suède",
                "type": "image",
                "file": "data/assets/images/Suède.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Sénégal",
                "type": "image",
                "file": "data/assets/images/Sénégal.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Tunisie",
                "type": "image",
                "file": "data/assets/images/Tunisie.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Turquie",
                "type": "image",
                "file": "data/assets/images/Turquie.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Ukraine",
                "type": "image",
                "file": "data/assets/images/Ukraine.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Égypte",
                "type": "image",
                "file": "data/assets/images/Égypte.png",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "États Unis",
                "type": "image",
                "file": "data/assets/images/États-Unis.png",
                "difficulty": 1
            },
            {
                "q": "Quel océan sépare l'Amérique de l'Europe ?",
                "a": "Atlantique",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la forme géométrique souvent utilisée pour décrire l'Italie ?",
                "a": "Botte",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Dans quel pays peut-on voir les pyramides de Gizeh ?",
                "a": "Égypte",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Dans quel pays se trouve la ville de New York ?",
                "a": "États-Unis",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Dans quel pays se trouve la ville de Venise ?",
                "a": "Italie",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel pays a la forme d'un hexagone ?",
                "a": "France",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom du fleuve qui traverse Paris ?",
                "a": "Seine",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le plus grand pays d'Amérique du Sud ?",
                "a": "Brésil",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale de l'Allemagne ?",
                "a": "Berlin",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale de la Belgique ?",
                "a": "Bruxelles",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale de la Chine ?",
                "a": "Pékin",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale de l'Espagne ?",
                "a": "Madrid",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale de la France ?",
                "a": "Paris",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale de la Grèce ?",
                "a": "Athènes",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale de l'Italie ?",
                "a": "Rome",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale du Japon ?",
                "a": "Tokyo",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale du Luxembourg ?",
                "a": "Luxembourg",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale du Portugal ?",
                "a": "Lisbonne",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la capitale du Royaume-Uni ?",
                "a": "Londres",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Autriche",
                "type": "image",
                "file": "data/assets/images/Autriche.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Belgique",
                "type": "image",
                "file": "data/assets/images/Belgique.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Bolivie",
                "type": "image",
                "file": "data/assets/images/Bolivie.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Bulgarie",
                "type": "image",
                "file": "data/assets/images/Bulgarie.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Cameroun",
                "type": "image",
                "file": "data/assets/images/Cameroun.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Colombie",
                "type": "image",
                "file": "data/assets/images/Colombie.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Danemark",
                "type": "image",
                "file": "data/assets/images/Danemark.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Ghana",
                "type": "image",
                "file": "data/assets/images/Ghana.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Hongrie",
                "type": "image",
                "file": "data/assets/images/Hongrie.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Irlande",
                "type": "image",
                "file": "data/assets/images/Irlande.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Islande",
                "type": "image",
                "file": "data/assets/images/Islande.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Kenya",
                "type": "image",
                "file": "data/assets/images/Kenya.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Nigeria",
                "type": "image",
                "file": "data/assets/images/Nigeria.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Pays Bas",
                "type": "image",
                "file": "data/assets/images/Pays-Bas.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Pologne",
                "type": "image",
                "file": "data/assets/images/Pologne.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Pérou",
                "type": "image",
                "file": "data/assets/images/Pérou.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Qatar",
                "type": "image",
                "file": "data/assets/images/Qatar.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Roumanie",
                "type": "image",
                "file": "data/assets/images/Roumanie.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Suisse",
                "type": "image",
                "file": "data/assets/images/Suisse.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Tchéquie",
                "type": "image",
                "file": "data/assets/images/Tchéquie.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Uruguay",
                "type": "image",
                "file": "data/assets/images/Uruguay.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Venezuela",
                "type": "image",
                "file": "data/assets/images/Venezuela.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Équateur",
                "type": "image",
                "file": "data/assets/images/Équateur.png",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Éthiopie",
                "type": "image",
                "file": "data/assets/images/Éthiopie.png",
                "difficulty": 2
            },
            {
                "q": "Quel est le plus grand océan du monde ?",
                "a": "Pacifique",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le plus long fleuve de France ?",
                "a": "La Loire",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle chaîne de montagnes sépare la France de l'Espagne ?",
                "a": "Pyrénées",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le plus grand désert chaud du monde ?",
                "a": "Sahara",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel pays est surnommé le pays du Soleil-Levant ?",
                "a": "Japon",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle mer sépare l'Europe de l'Afrique ?",
                "a": "Méditerranée",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le plus haut sommet du monde ?",
                "a": "Mont Everest",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays se trouve le Taj Mahal ?",
                "a": "Inde",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le plus petit pays du monde ?",
                "a": "Vatican",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle ville est surnommée la Grosse Pomme ?",
                "a": "New York",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays se trouve la ville de Marrakech ?",
                "a": "Maroc",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel fleuve traverse l'Égypte ?",
                "a": "Nil",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays se trouve la ville de Rio de Janeiro ?",
                "a": "Brésil",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le point culminant de l'Europe occidentale ?",
                "a": "Mont Blanc",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel fleuve traverse la ville de Londres ?",
                "a": "Tamise",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la langue majoritairement parlée au Mexique ?",
                "a": "Espagnol",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays se trouve la forêt amazonienne (majoritairement) ?",
                "a": "Brésil",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays se trouve la ville de Québec ?",
                "a": "Canada",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays se trouve la ville de Casablanca ?",
                "a": "Maroc",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays se trouve la ville de Genève ?",
                "a": "Suisse",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays se trouve le Mont Fuji ?",
                "a": "Japon",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays se trouve la ville de Bombay (Mumbai) ?",
                "a": "Inde",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom de la place rouge ?",
                "a": "Russie",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de l'Algérie ?",
                "a": "Alger",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de l'Argentine ?",
                "a": "Buenos Aires",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de l'Autriche ?",
                "a": "Vienne",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de la Corée du Sud ?",
                "a": "Séoul",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale du Danemark ?",
                "a": "Copenhague",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de l'Égypte ?",
                "a": "Le Caire",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale des États-Unis ?",
                "a": "Washington D.C.",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de l'Inde ?",
                "a": "New Delhi",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de l'Irlande ?",
                "a": "Dublin",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale du Mexique ?",
                "a": "Mexico",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de Monaco ?",
                "a": "Monaco",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de la Norvège ?",
                "a": "Oslo",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale des Pays-Bas ?",
                "a": "Amsterdam",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de la République tchèque ?",
                "a": "Prague",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de la Russie ?",
                "a": "Moscou",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de Singapour ?",
                "a": "Singapour",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de la Suède ?",
                "a": "Stockholm",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de la Thaïlande ?",
                "a": "Bangkok",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de la Tunisie ?",
                "a": "Tunis",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale du Vatican ?",
                "a": "Cité du Vatican",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Afghanistan",
                "type": "image",
                "file": "data/assets/images/Afghanistan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Albanie",
                "type": "image",
                "file": "data/assets/images/Albanie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Angleterre",
                "type": "image",
                "file": "data/assets/images/Angleterre.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Angola",
                "type": "image",
                "file": "data/assets/images/Angola.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Anguilla",
                "type": "image",
                "file": "data/assets/images/Anguilla.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Antarctique",
                "type": "image",
                "file": "data/assets/images/Antarctique.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Arabie Saoudite",
                "type": "image",
                "file": "data/assets/images/Arabie_Saoudite.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Arménie",
                "type": "image",
                "file": "data/assets/images/Arménie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Aruba",
                "type": "image",
                "file": "data/assets/images/Aruba.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Azerbaïdjan",
                "type": "image",
                "file": "data/assets/images/Azerbaïdjan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Bahamas",
                "type": "image",
                "file": "data/assets/images/Bahamas.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Bahreïn",
                "type": "image",
                "file": "data/assets/images/Bahreïn.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Bangladesh",
                "type": "image",
                "file": "data/assets/images/Bangladesh.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Belize",
                "type": "image",
                "file": "data/assets/images/Belize.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Bermudes",
                "type": "image",
                "file": "data/assets/images/Bermudes.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Bhoutan",
                "type": "image",
                "file": "data/assets/images/Bhoutan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Birmanie",
                "type": "image",
                "file": "data/assets/images/Birmanie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Biélorussie",
                "type": "image",
                "file": "data/assets/images/Biélorussie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Bosnie Herzégovine",
                "type": "image",
                "file": "data/assets/images/Bosnie-Herzégovine.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Botswana",
                "type": "image",
                "file": "data/assets/images/Botswana.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Brunei",
                "type": "image",
                "file": "data/assets/images/Brunei.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Burkina Faso",
                "type": "image",
                "file": "data/assets/images/Burkina_Faso.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Burundi",
                "type": "image",
                "file": "data/assets/images/Burundi.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Bénin",
                "type": "image",
                "file": "data/assets/images/Bénin.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Cambodge",
                "type": "image",
                "file": "data/assets/images/Cambodge.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Chypre",
                "type": "image",
                "file": "data/assets/images/Chypre.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Congo",
                "type": "image",
                "file": "data/assets/images/Congo.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Costa Rica",
                "type": "image",
                "file": "data/assets/images/Costa_Rica.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Croatie",
                "type": "image",
                "file": "data/assets/images/Croatie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Cuba",
                "type": "image",
                "file": "data/assets/images/Cuba.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Curaçao",
                "type": "image",
                "file": "data/assets/images/Curaçao.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Côte Divoire",
                "type": "image",
                "file": "data/assets/images/Côte_DIvoire.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Djibouti",
                "type": "image",
                "file": "data/assets/images/Djibouti.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Dominique",
                "type": "image",
                "file": "data/assets/images/Dominique.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Estonie",
                "type": "image",
                "file": "data/assets/images/Estonie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Eswatini",
                "type": "image",
                "file": "data/assets/images/Eswatini.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Fidji",
                "type": "image",
                "file": "data/assets/images/Fidji.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Gabon",
                "type": "image",
                "file": "data/assets/images/Gabon.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Gambie",
                "type": "image",
                "file": "data/assets/images/Gambie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Gibraltar",
                "type": "image",
                "file": "data/assets/images/Gibraltar.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Groenland",
                "type": "image",
                "file": "data/assets/images/Groenland.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Guadeloupe",
                "type": "image",
                "file": "data/assets/images/Guadeloupe.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Guam",
                "type": "image",
                "file": "data/assets/images/Guam.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Guatemala",
                "type": "image",
                "file": "data/assets/images/Guatemala.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Guernesey",
                "type": "image",
                "file": "data/assets/images/Guernesey.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Guinée Bissau",
                "type": "image",
                "file": "data/assets/images/Guinée-Bissau.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Guinée",
                "type": "image",
                "file": "data/assets/images/Guinée.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Guinée Équatoriale",
                "type": "image",
                "file": "data/assets/images/Guinée_Équatoriale.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Guyana",
                "type": "image",
                "file": "data/assets/images/Guyana.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Guyane",
                "type": "image",
                "file": "data/assets/images/Guyane.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Géorgie",
                "type": "image",
                "file": "data/assets/images/Géorgie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Haïti",
                "type": "image",
                "file": "data/assets/images/Haïti.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Honduras",
                "type": "image",
                "file": "data/assets/images/Honduras.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Hong Kong",
                "type": "image",
                "file": "data/assets/images/Hong_Kong.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Indonésie",
                "type": "image",
                "file": "data/assets/images/Indonésie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Irak",
                "type": "image",
                "file": "data/assets/images/Irak.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Iran",
                "type": "image",
                "file": "data/assets/images/Iran.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Jamaïque",
                "type": "image",
                "file": "data/assets/images/Jamaïque.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Jersey",
                "type": "image",
                "file": "data/assets/images/Jersey.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Jordanie",
                "type": "image",
                "file": "data/assets/images/Jordanie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Kazakhstan",
                "type": "image",
                "file": "data/assets/images/Kazakhstan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Kirghizistan",
                "type": "image",
                "file": "data/assets/images/Kirghizistan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Kosovo",
                "type": "image",
                "file": "data/assets/images/Kosovo.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Koweït",
                "type": "image",
                "file": "data/assets/images/Koweït.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Laos",
                "type": "image",
                "file": "data/assets/images/Laos.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Lesotho",
                "type": "image",
                "file": "data/assets/images/Lesotho.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Lettonie",
                "type": "image",
                "file": "data/assets/images/Lettonie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Liban",
                "type": "image",
                "file": "data/assets/images/Liban.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Liberia",
                "type": "image",
                "file": "data/assets/images/Liberia.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Libye",
                "type": "image",
                "file": "data/assets/images/Libye.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Lituanie",
                "type": "image",
                "file": "data/assets/images/Lituanie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Luxembourg",
                "type": "image",
                "file": "data/assets/images/Luxembourg.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Macao",
                "type": "image",
                "file": "data/assets/images/Macao.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Madagascar",
                "type": "image",
                "file": "data/assets/images/Madagascar.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Malaisie",
                "type": "image",
                "file": "data/assets/images/Malaisie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Malawi",
                "type": "image",
                "file": "data/assets/images/Malawi.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Maldives",
                "type": "image",
                "file": "data/assets/images/Maldives.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Mali",
                "type": "image",
                "file": "data/assets/images/Mali.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Martinique",
                "type": "image",
                "file": "data/assets/images/Martinique.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Mauritanie",
                "type": "image",
                "file": "data/assets/images/Mauritanie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Mayotte",
                "type": "image",
                "file": "data/assets/images/Mayotte.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Moldavie",
                "type": "image",
                "file": "data/assets/images/Moldavie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Mongolie",
                "type": "image",
                "file": "data/assets/images/Mongolie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Montserrat",
                "type": "image",
                "file": "data/assets/images/Montserrat.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Monténégro",
                "type": "image",
                "file": "data/assets/images/Monténégro.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Mozambique",
                "type": "image",
                "file": "data/assets/images/Mozambique.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Namibie",
                "type": "image",
                "file": "data/assets/images/Namibie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Nicaragua",
                "type": "image",
                "file": "data/assets/images/Nicaragua.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Niger",
                "type": "image",
                "file": "data/assets/images/Niger.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Niue",
                "type": "image",
                "file": "data/assets/images/Niue.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Nouvelle Calédonie",
                "type": "image",
                "file": "data/assets/images/Nouvelle-Calédonie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Nouvelle Zélande",
                "type": "image",
                "file": "data/assets/images/Nouvelle-Zélande.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Népal",
                "type": "image",
                "file": "data/assets/images/Népal.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Oman",
                "type": "image",
                "file": "data/assets/images/Oman.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Ouganda",
                "type": "image",
                "file": "data/assets/images/Ouganda.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Ouzbékistan",
                "type": "image",
                "file": "data/assets/images/Ouzbékistan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Pakistan",
                "type": "image",
                "file": "data/assets/images/Pakistan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Palestine",
                "type": "image",
                "file": "data/assets/images/Palestine.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Panama",
                "type": "image",
                "file": "data/assets/images/Panama.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Paraguay",
                "type": "image",
                "file": "data/assets/images/Paraguay.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Philippines",
                "type": "image",
                "file": "data/assets/images/Philippines.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Polynésie Française",
                "type": "image",
                "file": "data/assets/images/Polynésie_Française.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Porto Rico",
                "type": "image",
                "file": "data/assets/images/Porto_Rico.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Rwanda",
                "type": "image",
                "file": "data/assets/images/Rwanda.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Réunion",
                "type": "image",
                "file": "data/assets/images/Réunion.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Sahara Occidental",
                "type": "image",
                "file": "data/assets/images/Sahara_Occidental.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Saint Barthélemy",
                "type": "image",
                "file": "data/assets/images/Saint-Barthélemy.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Salvador",
                "type": "image",
                "file": "data/assets/images/Salvador.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Samoa",
                "type": "image",
                "file": "data/assets/images/Samoa.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Samoa Américaines",
                "type": "image",
                "file": "data/assets/images/Samoa_Américaines.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Serbie",
                "type": "image",
                "file": "data/assets/images/Serbie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Sierra Leone",
                "type": "image",
                "file": "data/assets/images/Sierra_Leone.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Singapour",
                "type": "image",
                "file": "data/assets/images/Singapour.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Slovaquie",
                "type": "image",
                "file": "data/assets/images/Slovaquie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Slovénie",
                "type": "image",
                "file": "data/assets/images/Slovénie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Somalie",
                "type": "image",
                "file": "data/assets/images/Somalie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Soudan",
                "type": "image",
                "file": "data/assets/images/Soudan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Sri Lanka",
                "type": "image",
                "file": "data/assets/images/Sri_Lanka.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Suriname",
                "type": "image",
                "file": "data/assets/images/Suriname.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Syrie",
                "type": "image",
                "file": "data/assets/images/Syrie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Tadjikistan",
                "type": "image",
                "file": "data/assets/images/Tadjikistan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Tanzanie",
                "type": "image",
                "file": "data/assets/images/Tanzanie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Taïwan",
                "type": "image",
                "file": "data/assets/images/Taïwan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Tchad",
                "type": "image",
                "file": "data/assets/images/Tchad.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Thaïlande",
                "type": "image",
                "file": "data/assets/images/Thaïlande.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Timor Oriental",
                "type": "image",
                "file": "data/assets/images/Timor_Oriental.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Togo",
                "type": "image",
                "file": "data/assets/images/Togo.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Tokelau",
                "type": "image",
                "file": "data/assets/images/Tokelau.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Tonga",
                "type": "image",
                "file": "data/assets/images/Tonga.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Turkménistan",
                "type": "image",
                "file": "data/assets/images/Turkménistan.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Vanuatu",
                "type": "image",
                "file": "data/assets/images/Vanuatu.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Vatican",
                "type": "image",
                "file": "data/assets/images/Vatican.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Viêt Nam",
                "type": "image",
                "file": "data/assets/images/Viêt_Nam.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Yémen",
                "type": "image",
                "file": "data/assets/images/Yémen.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Zambie",
                "type": "image",
                "file": "data/assets/images/Zambie.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Zimbabwe",
                "type": "image",
                "file": "data/assets/images/Zimbabwe.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Åland",
                "type": "image",
                "file": "data/assets/images/Åland.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Écosse",
                "type": "image",
                "file": "data/assets/images/Écosse.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Érythrée",
                "type": "image",
                "file": "data/assets/images/Érythrée.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Caïmans",
                "type": "image",
                "file": "data/assets/images/Îles_Caïmans.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Cocos",
                "type": "image",
                "file": "data/assets/images/Îles_Cocos.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Cook",
                "type": "image",
                "file": "data/assets/images/Îles_Cook.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Féroé",
                "type": "image",
                "file": "data/assets/images/Îles_Féroé.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Malouines",
                "type": "image",
                "file": "data/assets/images/Îles_Malouines.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Marshall",
                "type": "image",
                "file": "data/assets/images/Îles_Marshall.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Pitcairn",
                "type": "image",
                "file": "data/assets/images/Îles_Pitcairn.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Salomon",
                "type": "image",
                "file": "data/assets/images/Îles_Salomon.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Île Bouvet",
                "type": "image",
                "file": "data/assets/images/Île_Bouvet.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Île Christmas",
                "type": "image",
                "file": "data/assets/images/Île_Christmas.png",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Île Norfolk",
                "type": "image",
                "file": "data/assets/images/Île_Norfolk.png",
                "difficulty": 3
            },
            {
                "q": "Quelle est la langue officielle du Brésil ?",
                "a": "Portugais",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel canal relie la mer Méditerranée à la mer Rouge ?",
                "a": "Suez",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le plus grand état des États-Unis par la superficie ?",
                "a": "Alaska",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la monnaie utilisée au Royaume-Uni ?",
                "a": "Livre Sterling",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel pays se trouve le Machu Picchu ?",
                "a": "Pérou",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du détroit qui sépare le Royaume-Uni de la France ?",
                "a": "Pas de Calais",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel pays se trouve la Bavière ?",
                "a": "Allemagne",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel océan se trouve l'île de Madagascar ?",
                "a": "Indien",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel détroit sépare l'Espagne du Maroc ?",
                "a": "Gibraltar",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la monnaie du Japon ?",
                "a": "Yen",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle ville est construite sur deux continents (Europe et Asie) ?",
                "a": "Istanbul",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel pays se trouve le mont Kilimandjaro ?",
                "a": "Tanzanie",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle mer est connue pour sa salinité très élevée empêchant la vie ?",
                "a": "Mer Morte",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel pays se trouve la ville de Dubaï ?",
                "a": "Émirats arabes unis",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la monnaie de la Suisse ?",
                "a": "Franc suisse",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel pays se trouve la ville de Tchernobyl ?",
                "a": "Ukraine",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la plus grande île du monde (hors continents) ?",
                "a": "Groenland",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom de la mer située entre la Suède et le Royaume-Uni ?",
                "a": "Mer du Nord",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la langue officielle de l'Autriche ?",
                "a": "Allemand",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel volcan a détruit la ville de Pompéi ?",
                "a": "Vésuve",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la région française située en Amérique du Sud ?",
                "a": "Guyane",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le fleuve le plus long du monde (souvent débattu avec le Nil) ?",
                "a": "Amazone",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel pays se trouvent les chutes du Niagara (côté fer à cheval) ?",
                "a": "Canada",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le pays le plus long du monde (du nord au sud) ?",
                "a": "Chili",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel pays se trouve la ville de La Mecque ?",
                "a": "Arabie saoudite",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel pays se trouve la région de la Patagonie ?",
                "a": "Argentine",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale européenne traversée par le Danube ?",
                "a": "Vienne",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel pays se trouve l'île de Bali ?",
                "a": "Indonésie",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle chaîne de montagnes traverse l'Amérique du Nord à l'Ouest ?",
                "a": "Rocheuses",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la deuxième ville la plus peuplée de France ?",
                "a": "Marseille",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de l'Andorre ?",
                "a": "Andorre-la-Vieille",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de l'Arabie saoudite ?",
                "a": "Riyad",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de l'Australie ?",
                "a": "Canberra",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Brésil ?",
                "a": "Brasilia",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de la Bulgarie ?",
                "a": "Sofia",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Canada ?",
                "a": "Ottawa",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Chili ?",
                "a": "Santiago",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de la Colombie ?",
                "a": "Bogota",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de la Croatie ?",
                "a": "Zagreb",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de Cuba ?",
                "a": "La Havane",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de Djibouti ?",
                "a": "Djibouti",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de la Finlande ?",
                "a": "Helsinki",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de la Hongrie ?",
                "a": "Budapest",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de l'Indonésie ?",
                "a": "Jakarta",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de l'Irak ?",
                "a": "Bagdad",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de l'Iran ?",
                "a": "Téhéran",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Kenya ?",
                "a": "Nairobi",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Koweït ?",
                "a": "Koweït",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Liban ?",
                "a": "Beyrouth",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Maroc ?",
                "a": "Rabat",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Panama ?",
                "a": "Panama",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Pérou ?",
                "a": "Lima",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale des Philippines ?",
                "a": "Manille",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de la Pologne ?",
                "a": "Varsovie",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Qatar ?",
                "a": "Doha",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de la Roumanie ?",
                "a": "Bucarest",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Sénégal ?",
                "a": "Dakar",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de la Serbie ?",
                "a": "Belgrade",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de la Suisse ?",
                "a": "Berne",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de la Turquie ?",
                "a": "Ankara",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale de l'Ukraine ?",
                "a": "Kiev",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Venezuela ?",
                "a": "Caracas",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Vietnam ?",
                "a": "Hanoï",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Afrique Du Sud",
                "type": "image",
                "file": "data/assets/images/Afrique_Du_Sud.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Antigua Et Barbuda",
                "type": "image",
                "file": "data/assets/images/Antigua-Et-Barbuda.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Congo Rép Dém",
                "type": "image",
                "file": "data/assets/images/Congo_rép_Dém.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Corée Du Nord",
                "type": "image",
                "file": "data/assets/images/Corée_Du_Nord.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Corée Du Sud",
                "type": "image",
                "file": "data/assets/images/Corée_Du_Sud.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Géorgie Du Sud Et Les Îles Sandwich Du Sud",
                "type": "image",
                "file": "data/assets/images/Géorgie_Du_Sud-Et-Les_Îles_Sandwich_Du_Sud.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Irlande Du Nord",
                "type": "image",
                "file": "data/assets/images/Irlande_Du_Nord.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Macédoine Du Nord",
                "type": "image",
                "file": "data/assets/images/Macédoine_Du_Nord.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Papouasie Nouvelle Guinée",
                "type": "image",
                "file": "data/assets/images/Papouasie-Nouvelle-Guinée.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Pays Bas Caribéens",
                "type": "image",
                "file": "data/assets/images/Pays-Bas_Caribéens.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Pays De Galles",
                "type": "image",
                "file": "data/assets/images/Pays_De_Galles.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "République Centrafricaine",
                "type": "image",
                "file": "data/assets/images/République_Centrafricaine.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "République Dominicaine",
                "type": "image",
                "file": "data/assets/images/République_Dominicaine.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Saint Christophe Et Niévès",
                "type": "image",
                "file": "data/assets/images/Saint-Christophe-Et-Niévès.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Saint Martin Antilles Françaises",
                "type": "image",
                "file": "data/assets/images/Saint-Martin_antilles_Françaises.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Saint Martin Royaume Des Pays Bas",
                "type": "image",
                "file": "data/assets/images/Saint-Martin_royaume_Des_Pays-Bas.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Saint Pierre Et Miquelon",
                "type": "image",
                "file": "data/assets/images/Saint-Pierre-Et-Miquelon.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Saint Vincent Et Les Grenadines",
                "type": "image",
                "file": "data/assets/images/Saint-Vincent-Et-Les-Grenadines.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Sainte Hélène Ascension Et Tristan Da Cunha",
                "type": "image",
                "file": "data/assets/images/Sainte-Hélène-Ascension_Et_Tristan_Da_Cunha.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Sao Tomé Et Principe",
                "type": "image",
                "file": "data/assets/images/Sao_Tomé-Et-Principe.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Soudan Du Sud",
                "type": "image",
                "file": "data/assets/images/Soudan_Du_Sud.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Svalbard Et Jan Mayen",
                "type": "image",
                "file": "data/assets/images/Svalbard_Et_Jan_Mayen.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Terres Australes Et Antarctiques Françaises",
                "type": "image",
                "file": "data/assets/images/Terres_Australes_Et_Antarctiques_Françaises.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Territoire Britannique De Locéan Indien",
                "type": "image",
                "file": "data/assets/images/Territoire_Britannique_De_LOcéan_Indien.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Trinité Et Tobago",
                "type": "image",
                "file": "data/assets/images/Trinité-Et-Tobago.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Wallis Et Futuna",
                "type": "image",
                "file": "data/assets/images/Wallis-Et-Futuna.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Émirats Arabes Unis",
                "type": "image",
                "file": "data/assets/images/Émirats_Arabes_Unis.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Heard Et Macdonald",
                "type": "image",
                "file": "data/assets/images/Îles_Heard-Et-Macdonald.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Mariannes Du Nord",
                "type": "image",
                "file": "data/assets/images/Îles_Mariannes_Du_Nord.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Mineures Éloignées Des États Unis",
                "type": "image",
                "file": "data/assets/images/Îles_Mineures_Éloignées_Des_États-Unis.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Turques Et Caïques",
                "type": "image",
                "file": "data/assets/images/Îles_Turques-Et-Caïques.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Vierges Britanniques",
                "type": "image",
                "file": "data/assets/images/Îles_Vierges_Britanniques.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Îles Vierges Des États Unis",
                "type": "image",
                "file": "data/assets/images/Îles_Vierges_Des_États-Unis.png",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Île De Man",
                "type": "image",
                "file": "data/assets/images/Île_De_Man.png",
                "difficulty": 4
            },
            {
                "q": "Quel est le plus grand lac du monde (en superficie) ?",
                "a": "Mer Caspienne",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle chaîne de montagnes traverse l'Italie du nord au sud ?",
                "a": "Apennins",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le plus grand pays d'Afrique par la superficie ?",
                "a": "Algérie",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel pays est composé de plus de 17 000 îles ?",
                "a": "Indonésie",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Dans quel pays se trouve la région de la Transylvanie ?",
                "a": "Roumanie",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du supercontinent qui existait il y a 200 millions d'années ?",
                "a": "Pangée",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le fleuve le plus long d'Europe ?",
                "a": "Volga",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Dans quel pays se trouve le site de Pétra ?",
                "a": "Jordanie",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom des habitants de Madrid ?",
                "a": "Madrilènes",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle chaîne de montagnes sépare l'Europe de l'Asie ?",
                "a": "Oural",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Dans quel pays se trouve le désert d'Atacama ?",
                "a": "Chili",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la plus grande île de la Méditerranée ?",
                "a": "Sicile",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Dans quel pays se trouvent les ruines d'Angkor Wat ?",
                "a": "Cambodge",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du détroit séparant l'Alaska de la Russie ?",
                "a": "Béring",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Dans quel pays se trouve la ville de Tombouctou ?",
                "a": "Mali",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la devise monétaire de la Russie ?",
                "a": "Rouble",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du désert qui couvre une grande partie de la Mongolie ?",
                "a": "Gobi",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Dans quel pays se trouve le site historique de Carthage ?",
                "a": "Tunisie",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le seul État des USA situé dans les tropiques ?",
                "a": "Hawaï",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Dans quel pays se trouve le lac Titicaca ?",
                "a": "Pérou",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom de la péninsule où se trouvent l'Espagne et le Portugal ?",
                "a": "Ibérique",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de l'Afghanistan ?",
                "a": "Kaboul",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de l'Afrique du Sud ?",
                "a": "Pretoria",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de l'Albanie ?",
                "a": "Tirana",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de l'Azerbaïdjan ?",
                "a": "Bakou",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale des Bahamas ?",
                "a": "Nassau",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Bangladesh ?",
                "a": "Dacca",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Biélorussie ?",
                "a": "Minsk",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Bolivie ?",
                "a": "La Paz",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Bosnie-Herzégovine ?",
                "a": "Sarajevo",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Cambodge ?",
                "a": "Phnom Penh",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Cameroun ?",
                "a": "Yaoundé",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de Chypre ?",
                "a": "Nicosie",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Congo-Brazzaville ?",
                "a": "Brazzaville",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Congo-Kinshasa (RDC) ?",
                "a": "Kinshasa",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Corée du Nord ?",
                "a": "Pyongyang",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Costa Rica ?",
                "a": "San José",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale des Émirats arabes unis ?",
                "a": "Abou Dabi",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de l'Équateur ?",
                "a": "Quito",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de l'Estonie ?",
                "a": "Tallinn",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de l'Éthiopie ?",
                "a": "Addis-Abeba",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Gabon ?",
                "a": "Libreville",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Ghana ?",
                "a": "Accra",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Guatemala ?",
                "a": "Guatemala",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Guinée ?",
                "a": "Conakry",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale d'Haïti ?",
                "a": "Port-au-Prince",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de l'Islande ?",
                "a": "Reykjavik",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Jamaïque ?",
                "a": "Kingston",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Jordanie ?",
                "a": "Amman",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Kazakhstan ?",
                "a": "Astana",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Lettonie ?",
                "a": "Riga",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Libye ?",
                "a": "Tripoli",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Lituanie ?",
                "a": "Vilnius",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de Madagascar ?",
                "a": "Antananarivo",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Malaisie ?",
                "a": "Kuala Lumpur",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale des Maldives ?",
                "a": "Malé",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Mali ?",
                "a": "Bamako",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de Malte ?",
                "a": "La Valette",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Népal ?",
                "a": "Katmandou",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Nigeria ?",
                "a": "Abuja",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Nouvelle-Zélande ?",
                "a": "Wellington",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de l'Ouganda ?",
                "a": "Kampala",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Pakistan ?",
                "a": "Islamabad",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la République dominicaine ?",
                "a": "Saint-Domingue",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Rwanda ?",
                "a": "Kigali",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de Saint-Marin ?",
                "a": "Saint-Marin",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Salvador ?",
                "a": "San Salvador",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Slovaquie ?",
                "a": "Bratislava",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Slovénie ?",
                "a": "Ljubljana",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Soudan ?",
                "a": "Khartoum",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de la Syrie ?",
                "a": "Damas",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de Taïwan ?",
                "a": "Taipei",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Togo ?",
                "a": "Lomé",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale de l'Uruguay ?",
                "a": "Montevideo",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la capitale du Yémen ?",
                "a": "Sanaa",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Andorre",
                "type": "image",
                "file": "data/assets/images/Andorre.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Barbade",
                "type": "image",
                "file": "data/assets/images/Barbade.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Cap Vert",
                "type": "image",
                "file": "data/assets/images/Cap-Vert.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Comores",
                "type": "image",
                "file": "data/assets/images/Comores.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Grenade",
                "type": "image",
                "file": "data/assets/images/Grenade.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Kiribati",
                "type": "image",
                "file": "data/assets/images/Kiribati.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Liechtenstein",
                "type": "image",
                "file": "data/assets/images/Liechtenstein.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Malte",
                "type": "image",
                "file": "data/assets/images/Malte.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Maurice",
                "type": "image",
                "file": "data/assets/images/Maurice.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Micronésie",
                "type": "image",
                "file": "data/assets/images/Micronésie.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Monaco",
                "type": "image",
                "file": "data/assets/images/Monaco.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Nauru",
                "type": "image",
                "file": "data/assets/images/Nauru.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Palaos",
                "type": "image",
                "file": "data/assets/images/Palaos.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Saint Marin",
                "type": "image",
                "file": "data/assets/images/Saint-Marin.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Sainte Lucie",
                "type": "image",
                "file": "data/assets/images/Sainte-Lucie.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Seychelles",
                "type": "image",
                "file": "data/assets/images/Seychelles.png",
                "difficulty": 5
            },
            {
                "q": "Quel pays a ce drapeau ?",
                "a": "Tuvalu",
                "type": "image",
                "file": "data/assets/images/Tuvalu.png",
                "difficulty": 5
            },
            {
                "q": "Quel est le lac le plus profond du monde ?",
                "a": "Lac Baïkal",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel est le seul pays d'Amérique du Sud qui a l'anglais comme langue officielle ?",
                "a": "Guyana",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel est le nom du fleuve qui traverse Bagdad ?",
                "a": "Tigre",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel pays est entièrement enclavé dans l'Afrique du Sud ?",
                "a": "Lesotho",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel est le plus long fleuve d'Amérique du Nord ?",
                "a": "Missouri",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel est le point le plus bas de la Terre (sur la terre ferme) ?",
                "a": "Mer Morte",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel est le nom des chutes d'eau les plus hautes du monde ?",
                "a": "Salto Angel",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Dans quel pays se trouve le Salto Angel ?",
                "a": "Venezuela",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de l'Angola ?",
                "a": "Luanda",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale d'Antigua-et-Barbuda ?",
                "a": "Saint John's",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de l'Arménie ?",
                "a": "Erevan",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Bahreïn ?",
                "a": "Manama",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Barbade ?",
                "a": "Bridgetown",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Belize ?",
                "a": "Belmopan",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Bénin ?",
                "a": "Porto-Novo",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Bhoutan ?",
                "a": "Thimphou",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Birmanie (Myanmar) ?",
                "a": "Naypyidaw",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Botswana ?",
                "a": "Gaborone",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Brunei ?",
                "a": "Bandar Seri Begawan",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Burkina Faso ?",
                "a": "Ouagadougou",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Burundi ?",
                "a": "Gitega",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Cap-Vert ?",
                "a": "Praia",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Centrafrique ?",
                "a": "Bangui",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale des Comores ?",
                "a": "Moroni",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Côte d'Ivoire ?",
                "a": "Yamoussoukro",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Dominique ?",
                "a": "Roseau",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de l'Érythrée ?",
                "a": "Asmara",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale des Fidji ?",
                "a": "Suva",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Gambie ?",
                "a": "Banjul",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Géorgie ?",
                "a": "Tbilissi",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Grenade ?",
                "a": "Saint-Georges",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Guinée-Bissau ?",
                "a": "Bissau",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Guinée équatoriale ?",
                "a": "Malabo",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Guyana ?",
                "a": "Georgetown",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Honduras ?",
                "a": "Tegucigalpa",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Kirghizistan ?",
                "a": "Bichkek",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale des Kiribati ?",
                "a": "Tarawa-Sud",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Kosovo ?",
                "a": "Pristina",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Laos ?",
                "a": "Vientiane",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Lesotho ?",
                "a": "Maseru",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Liberia ?",
                "a": "Monrovia",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Liechtenstein ?",
                "a": "Vaduz",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Macédoine du Nord ?",
                "a": "Skopje",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Malawi ?",
                "a": "Lilongwe",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale des Îles Marshall ?",
                "a": "Majuro",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de Maurice ?",
                "a": "Port-Louis",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Mauritanie ?",
                "a": "Nouakchott",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Micronésie ?",
                "a": "Palikir",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Moldavie ?",
                "a": "Chisinau",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Mongolie ?",
                "a": "Oulan-Bator",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Monténégro ?",
                "a": "Podgorica",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Mozambique ?",
                "a": "Maputo",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Namibie ?",
                "a": "Windhoek",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de Nauru ?",
                "a": "Yaren",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Nicaragua ?",
                "a": "Managua",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Niger ?",
                "a": "Niamey",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale d'Oman ?",
                "a": "Mascate",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de l'Ouzbékistan ?",
                "a": "Tachkent",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale des Palaos ?",
                "a": "Ngerulmud",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Palestine ?",
                "a": "Ramallah",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Papouasie-Nouvelle-Guinée ?",
                "a": "Port Moresby",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Paraguay ?",
                "a": "Asuncion",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de Saint-Christophe-et-Niévès ?",
                "a": "Basseterre",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de Sainte-Lucie ?",
                "a": "Castries",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de Saint-Vincent-et-les-Grenadines ?",
                "a": "Kingstown",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale des Îles Salomon ?",
                "a": "Honiara",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale des Samoa ?",
                "a": "Apia",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de Sao Tomé-et-Principe ?",
                "a": "Sao Tomé",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale des Seychelles ?",
                "a": "Victoria",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Sierra Leone ?",
                "a": "Freetown",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Somalie ?",
                "a": "Mogadiscio",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Soudan du Sud ?",
                "a": "Djouba",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Sri Lanka ?",
                "a": "Sri Jayawardenepura Kotte",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Suriname ?",
                "a": "Paramaribo",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Tadjikistan ?",
                "a": "Douchanbé",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Tanzanie ?",
                "a": "Dodoma",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Tchad ?",
                "a": "N'Djaména",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Timor oriental ?",
                "a": "Dili",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale des Tonga ?",
                "a": "Nuku'alofa",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de Trinité-et-Tobago ?",
                "a": "Port-d'Espagne",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Turkménistan ?",
                "a": "Achgabat",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale des Tuvalu ?",
                "a": "Funafuti",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Vanuatu ?",
                "a": "Port-Vila",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale de la Zambie ?",
                "a": "Lusaka",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle est la capitale du Zimbabwe ?",
                "a": "Harare",
                "type": "text",
                "difficulty": 5
            }
        ]
    },
    {
        "id": "harry_potter",
        "name": "🧙 Harry Potter",
        "color": "#8e44ad",
        "questions": [
            {
                "q": "Qui est-ce ?",
                "a": "Albus Dumbledore",
                "type": "image",
                "file": "data/assets/images/Albus Dumbledore.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Draco Malfoy",
                "type": "image",
                "file": "data/assets/images/Draco Malfoy.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Ginny Weasley",
                "type": "image",
                "file": "data/assets/images/Ginny Weasley.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Harry Potter",
                "type": "image",
                "file": "data/assets/images/Harry Potter.jpg",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Hermione Granger",
                "type": "image",
                "file": "data/assets/images/Hermione Granger.jpg",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Lord Voldemort Tom Riddle",
                "type": "image",
                "file": "data/assets/images/Lord Voldemort Tom Riddle.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Ron Weasley",
                "type": "image",
                "file": "data/assets/images/Ron Weasley.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Rubeus Hagrid",
                "type": "image",
                "file": "data/assets/images/Rubeus Hagrid.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Severus Snape",
                "type": "image",
                "file": "data/assets/images/Severus Snape.png",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Sirius Black",
                "type": "image",
                "file": "data/assets/images/Sirius Black.png",
                "difficulty": 1
            },
            {
                "q": "Quel est le prénom du cousin détestable de Harry Potter ?",
                "a": "Dudley",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la maison de Harry Potter à Poudlard ?",
                "a": "Gryffondor",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de la chouette de Harry ?",
                "a": "Hedwige",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de famille de Ron ?",
                "a": "Weasley",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui est le directeur de Poudlard au début de la saga ?",
                "a": "Albus Dumbledore",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle forme a la cicatrice de Harry ?",
                "a": "Éclair",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le sport pratiqué sur des balais volants ?",
                "a": "Quidditch",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de celui qu'on ne doit pas prononcer ?",
                "a": "Voldemort",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la couleur principale de la maison Serpentard ?",
                "a": "Vert",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom du garde-chasse géant de Poudlard ?",
                "a": "Hagrid",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel objet attrapeur doit-il saisir pour finir un match de Quidditch ?",
                "a": "Vif d'or",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Comment appelle-t-on les gens sans pouvoirs magiques ?",
                "a": "Moldus",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le prénom de la mère de Harry Potter ?",
                "a": "Lily",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle plateforme de la gare King's Cross mène à Poudlard ?",
                "a": "9 3/4",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel professeur enseigne les potions au début de la saga ?",
                "a": "Severus Rogue",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui a tué les parents de Harry Potter ?",
                "a": "Voldemort",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de la banque des sorciers ?",
                "a": "Gringotts",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le prénom du père de Harry ?",
                "a": "James",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de l'elfe de maison qui se libère avec une chaussette ?",
                "a": "Dobby",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la maison de Drago Malefoy ?",
                "a": "Serpentard",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel sortilège permet de désarmer son adversaire ?",
                "a": "Expelliarmus",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui est le parrain de Harry Potter ?",
                "a": "Sirius Black",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui est \"Celui-qui-a-survécu\" ?",
                "a": "Harry Potter",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le prénom de la sœur de Ron ?",
                "a": "Ginny",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel sortilège fait léviter les objets ?",
                "a": "Wingardium Leviosa",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de la prison des sorciers ?",
                "a": "Azkaban",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui a écrit les livres Harry Potter (dans la réalité) ?",
                "a": "J.K. Rowling",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel objet magique choisit son sorcier ?",
                "a": "Baguette",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de la rue commerçante des sorciers à Londres ?",
                "a": "Chemin de Traverse",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le poste de Harry au Quidditch ?",
                "a": "Attrapeur",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Combien y a-t-il de maisons à Poudlard ?",
                "a": "4",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel sortilège produit de la lumière au bout de la baguette ?",
                "a": "Lumos",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Dans quelle coupe met-on son nom pour le Tournoi des Trois Sorciers ?",
                "a": "Coupe de Feu",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel objet rend invisible celui qui le porte ?",
                "a": "Cape d'invisibilité",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la couleur des cheveux de la famille Weasley ?",
                "a": "Roux",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la société secrète de Voldemort ?",
                "a": "Les Mangemorts",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de l'oncle de Harry ?",
                "a": "Vernon",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de la tante de Harry ?",
                "a": "Pétunia",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de la boisson populaire chez les sorciers ?",
                "a": "Bière au beurre",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de l'acteur qui joue Harry Potter ?",
                "a": "Daniel Radcliffe",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de l'actrice qui joue Hermione Granger ?",
                "a": "Emma Watson",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de l'acteur qui joue Ron Weasley ?",
                "a": "Rupert Grint",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel objet attrapeur faut-il saisir pour finir un match de Quidditch ?",
                "a": "Vif d'or",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Qui est-ce ?",
                "a": "Argus Filch",
                "type": "image",
                "file": "data/assets/images/Argus Filch.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Arthur Weasley",
                "type": "image",
                "file": "data/assets/images/Arthur Weasley.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Dobby",
                "type": "image",
                "file": "data/assets/images/Dobby.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Dudley Dursley",
                "type": "image",
                "file": "data/assets/images/Dudley Dursley.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Gilderoy Lockhart",
                "type": "image",
                "file": "data/assets/images/Gilderoy Lockhart.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Hedwig",
                "type": "image",
                "file": "data/assets/images/Hedwig.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Molly Weasley",
                "type": "image",
                "file": "data/assets/images/Molly Weasley.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Neville Longbottom",
                "type": "image",
                "file": "data/assets/images/Neville Longbottom.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Petunia Dursley",
                "type": "image",
                "file": "data/assets/images/Petunia Dursley.png",
                "difficulty": 2
            },
            {
                "q": "Qui est-ce ?",
                "a": "Vernon Dursley",
                "type": "image",
                "file": "data/assets/images/Vernon Dursley.png",
                "difficulty": 2
            },
            {
                "q": "De quel animal le professeur McGonagall peut-elle prendre la forme ?",
                "a": "Chat",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du rat de Ron ?",
                "a": "Croûtard",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du chat d'Hermione ?",
                "a": "Pattenrond",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle potion permet de changer d'apparence ?",
                "a": "Polynectar",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du village sorcier près de Poudlard ?",
                "a": "Pré-au-Lard",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom de l'hippogriffe sauvé par Harry et Hermione ?",
                "a": "Buck",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle plante crie quand on la déterre ?",
                "a": "Mandragore",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du concierge de Poudlard ?",
                "a": "Rusard",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du fantôme de Gryffondor ?",
                "a": "Nick Quasi-Sans-Tête",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le métier des parents d'Hermione ?",
                "a": "Dentistes",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le numéro de la chambre de Harry sous l'escalier ?",
                "a": "Placard sous l'escalier (Pas de numéro)",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel tournoi a lieu dans le 4ème tome ?",
                "a": "Tournoi des Trois Sorciers",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la maison de Cédric Diggory ?",
                "a": "Poufsouffle",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du journal intime détruit par Harry dans le tome 2 ?",
                "a": "Tom Jedusor",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel animal est le basilic ?",
                "a": "Un serpent géant",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui tue Albus Dumbledore ?",
                "a": "Severus Rogue",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du Seigneur des Ténèbres avant de devenir Voldemort ?",
                "a": "Tom Elvis Jedusor",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la formule du sortilège de la mort ?",
                "a": "Avada Kedavra",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel objet permet à Hermione de suivre tous ses cours en 3ème année ?",
                "a": "Retourneur de temps",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du loup-garou ami de James Potter ?",
                "a": "Remus Lupin",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel bonbon peut avoir le goût de \"crotte de nez\" ?",
                "a": "Dragées surprises de Bertie Crochue",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom de l'arbre violent dans le parc de Poudlard ?",
                "a": "Saule Cogneur",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui est la journaliste à scandale agaçante ?",
                "a": "Rita Skeeter",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du groupe de résistance fondé par Dumbledore ?",
                "a": "L'Ordre du Phénix",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui tue Sirius Black ?",
                "a": "Bellatrix Lestrange",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le patronus de Harry ?",
                "a": "Cerf",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la maison de Luna Lovegood ?",
                "a": "Serdaigle",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle créature garde la prison d'Azkaban ?",
                "a": "Détraqueurs",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui est le maître des baguettes (fabricant) le plus connu en Grande-Bretagne ?",
                "a": "Ollivander",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui est la dame rose et cruelle envoyée par le Ministère en 5ème année ?",
                "a": "Dolores Ombrage",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom de l'armée secrète formée par Harry à Poudlard ?",
                "a": "Armée de Dumbledore",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Combien de Reliques de la Mort y a-t-il ?",
                "a": "3",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui est le fidèle serpent de Voldemort ?",
                "a": "Nagini",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le mot de passe pour fermer la carte du Maraudeur ?",
                "a": "Méfait accompli",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle matière enseigne le professeur Trelawney ?",
                "a": "Divination",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui a donné la cape d'invisibilité à Harry (de la part de son père) ?",
                "a": "Dumbledore",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom de la salle qui apparaît quand on en a vraiment besoin ?",
                "a": "Salle sur Demande",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la monnaie des sorciers (pièce d'or) ?",
                "a": "Gallion",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui est le fantôme des toilettes des filles ?",
                "a": "Mimi Geignarde",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom de la maison de la famille Weasley ?",
                "a": "Le Terrier",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui a trahi les parents de Harry en les livrant à Voldemort ?",
                "a": "Peter Pettigrow",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du professeur de défense contre les forces du mal en 2ème année ?",
                "a": "Gilderoy Lockhart",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du sortilège pour déverrouiller une porte ?",
                "a": "Alohomora",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du sortilège pour faire venir un objet à soi ?",
                "a": "Accio",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du chat de Rusard ?",
                "a": "Miss Teigne",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom de la dame qui vend des friandises dans le train ?",
                "a": "La dame du chariot",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom de la baguette la plus puissante du monde ?",
                "a": "Baguette de Sureau",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom de la rue où habitent les Dursley ?",
                "a": "Privet Drive",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le numéro de la maison des Dursley ?",
                "a": "4",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la valeur du Vif d'or en points ?",
                "a": "150",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du chien à trois têtes ?",
                "a": "Touffu",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Cedric Diggory",
                "type": "image",
                "file": "data/assets/images/Cedric Diggory.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Cho Chang",
                "type": "image",
                "file": "data/assets/images/Cho Chang.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Colin Creevey",
                "type": "image",
                "file": "data/assets/images/Colin Creevey.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Fred & George Weasley ",
                "type": "image",
                "file": "data/assets/images/Fred & George Weasley .png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Lucius Malfoy",
                "type": "image",
                "file": "data/assets/images/Lucius Malfoy.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Luna Lovegood",
                "type": "image",
                "file": "data/assets/images/Luna Lovegood.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Narcissa Malfoy",
                "type": "image",
                "file": "data/assets/images/Narcissa Malfoy.png",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Seamus Finnigan",
                "type": "image",
                "file": "data/assets/images/Seamus Finnigan.png",
                "difficulty": 3
            },
            {
                "q": "Quel est le mot de passe pour ouvrir la carte du Maraudeur ?",
                "a": "Je jure solennellement que mes intentions sont mauvaises",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est le Prince de Sang-Mêlé ?",
                "a": "Severus Rogue",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Comment s'appelle le balai offert à Harry par Sirius Black ?",
                "a": "Éclair de Feu",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est la directrice de la maison Poufsouffle (prof de botanique) ?",
                "a": "Professeur Chourave",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom de l'araignée géante d'Hagrid ?",
                "a": "Aragog",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom de l'école de magie française ?",
                "a": "Beauxbâtons",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom de la gare de Poudlard ?",
                "a": "Pré-au-Lard (Hogsmeade Station)",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle créature tire les calèches de Poudlard (visible par ceux qui ont vu la mort) ?",
                "a": "Sombrals",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est le fantôme de la maison Serpentard ?",
                "a": "Le Baron Sanglant",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du miroir qui montre le désir le plus profond ?",
                "a": "Miroir du Riséd",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Combien de balles sont utilisées dans un match de Quidditch ?",
                "a": "4",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le prénom de la mère de Drago Malefoy ?",
                "a": "Narcissa",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la forme du patronus d'Hermione ?",
                "a": "Loutre",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est le capitaine de l'équipe de Quidditch de Gryffondor (tome 1 à 3) ?",
                "a": "Olivier Dubois",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du pub à Pré-au-Lard ?",
                "a": "Les Trois Balais",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le deuxième prénom de Harry ?",
                "a": "James",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du professeur de vol sur balai ?",
                "a": "Madame Bibine",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui remplace Dumbledore en tant que directeur dans le dernier tome ?",
                "a": "Severus Rogue",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle potion donne une chance incroyable ?",
                "a": "Felix Felicis",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui a créé la Pierre Philosophale ?",
                "a": "Nicolas Flamel",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du sortilège de torture (Impardonnable) ?",
                "a": "Endoloris",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du village où habitaient les parents de Harry ?",
                "a": "Godric's Hollow",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle créature est Aragog ?",
                "a": "Acromantule",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom de l'école de magie de Viktor Krum ?",
                "a": "Durmstrang",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le surnom de Peter Pettigrow ?",
                "a": "Queudver",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le surnom de Sirius Black ?",
                "a": "Patmol",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le surnom de James Potter ?",
                "a": "Cornedrue",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le surnom de Remus Lupin ?",
                "a": "Lunard",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel objet est le premier Horcruxe détruit ?",
                "a": "Le journal intime",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est la petite amie de Ron à la 6ème année (avant Hermione) ?",
                "a": "Lavande Brown",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom de l'hôpital des sorciers ?",
                "a": "Sainte-Mangouste",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est le professeur d'histoire de la magie (c'est un fantôme) ?",
                "a": "Professeur Binns",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la couleur du sortilège \"Avada Kedavra\" ?",
                "a": "Verte",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est la directrice de Beauxbâtons ?",
                "a": "Madame Maxime",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom de la tante de Harry qui gonfle comme un ballon ?",
                "a": "Tante Marge",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est le Ministre de la Magie au début de la saga ?",
                "a": "Cornelius Fudge",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la forme du patronus de Rogue ?",
                "a": "Biche",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Pourquoi le patronus de Rogue est-il une biche ?",
                "a": "Par amour pour Lily Potter",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est le commentateur des matchs de Quidditch (élève) ?",
                "a": "Lee Jordan",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du sortilège qui efface la mémoire ?",
                "a": "Oubliettes",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui a tué Bellatrix Lestrange ?",
                "a": "Molly Weasley",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle est la pierre qui permet de rappeler les morts ?",
                "a": "Pierre de Résurrection",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom de l'elfe de maison de la famille Black ?",
                "a": "Kreattur",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle matière enseigne Horace Slughorn ?",
                "a": "Potions",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Combien de buts marque-t-on en passant le Souafle dans un anneau ?",
                "a": "10 points",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du chien à trois têtes gardant la Pierre Philosophale ?",
                "a": "Touffu",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est-ce ?",
                "a": "Alastor Mad Eye Moody",
                "type": "image",
                "file": "data/assets/images/Alastor Mad Eye Moody.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Barty Crouch Jr",
                "type": "image",
                "file": "data/assets/images/Barty Crouch Jr.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Bellatrix Lestrange",
                "type": "image",
                "file": "data/assets/images/Bellatrix Lestrange.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Bill Weasley",
                "type": "image",
                "file": "data/assets/images/Bill Weasley.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Buckbeak",
                "type": "image",
                "file": "data/assets/images/Buckbeak.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Dean Thomas",
                "type": "image",
                "file": "data/assets/images/Dean Thomas.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Dolores Umbridge",
                "type": "image",
                "file": "data/assets/images/Dolores Umbridge.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Fang",
                "type": "image",
                "file": "data/assets/images/Fang.jpg",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Filius Flitwick",
                "type": "image",
                "file": "data/assets/images/Filius Flitwick.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Fleur Delacour",
                "type": "image",
                "file": "data/assets/images/Fleur Delacour.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Fluffy",
                "type": "image",
                "file": "data/assets/images/Fluffy.jpg",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Horace Slughorn",
                "type": "image",
                "file": "data/assets/images/Horace Slughorn.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Igor Karkaroff",
                "type": "image",
                "file": "data/assets/images/Igor Karkaroff.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Moaning Myrtle",
                "type": "image",
                "file": "data/assets/images/Moaning Myrtle.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Nearly Headless Nick",
                "type": "image",
                "file": "data/assets/images/Nearly Headless Nick.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Nymphadora Tonks",
                "type": "image",
                "file": "data/assets/images/Nymphadora Tonks.jpg",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Parvati Patil",
                "type": "image",
                "file": "data/assets/images/Parvati Patil.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Percy Weasley",
                "type": "image",
                "file": "data/assets/images/Percy Weasley.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Peter Pettigrew",
                "type": "image",
                "file": "data/assets/images/Peter Pettigrew.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Quirinus Quirrell",
                "type": "image",
                "file": "data/assets/images/Quirinus Quirrell.png",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Remus Lupin",
                "type": "image",
                "file": "data/assets/images/Remus Lupin.png",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du frère de Dumbledore ?",
                "a": "Abelforth",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du petit elfe de maison alcoolique (amie de Dobby) ?",
                "a": "Winky",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui a détruit la coupe de Poufsouffle (Horcruxe) ?",
                "a": "Hermione Granger",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom de l'équipe de Quidditch préférée de Ron ?",
                "a": "Canons de Chudley",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui est la seule personne que Peeves l'esprit frappeur craint ?",
                "a": "Le Baron Sanglant",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du dragon qu'affronte Harry lors du tournoi ?",
                "a": "Magyar à pointes",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui est le loup-garou qui a mordu Remus Lupin ?",
                "a": "Fenrir Greyback",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui pose l'énigme pour entrer dans la salle commune de Serdaigle ?",
                "a": "Un heurtoir en forme d'aigle",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui a mis le nom de Harry dans la Coupe de Feu ?",
                "a": "Barty Croupton Jr.",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle créature pose des énigmes (tome 4) ?",
                "a": "Sphinx",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la couleur du sortilège \"Expelliarmus\" ?",
                "a": "Rouge",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du conducteur du Magicobus ?",
                "a": "Ernie Danlmur",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du Ministre de la Magie qui succède à Fudge ?",
                "a": "Rufus Scrimgeour",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du frère géant de Hagrid ?",
                "a": "Graup",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom de la boutique de baguettes du mage noir (Allée des Embrumes) ?",
                "a": "Barjow et Beurk",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui est le fantôme de la maison Poufsouffle ?",
                "a": "Le Moine Gras",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le dernier Horcruxe à être détruit (avant Harry/Voldemort) ?",
                "a": "Nagini",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui est le maître de la Baguette de Sureau à la fin de la saga ?",
                "a": "Harry Potter",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du sortilège créé par le Prince de Sang-Mêlé (coupure) ?",
                "a": "Sectumsempra",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du sortilège créé par le Prince de Sang-Mêlé pour couper ?",
                "a": "Sectumsempra",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui est-ce ?",
                "a": "Aberforth Dumbledore",
                "type": "image",
                "file": "data/assets/images/Aberforth Dumbledore.jpg",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Arabella Figg",
                "type": "image",
                "file": "data/assets/images/Arabella Figg.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Bathilda Bagshot",
                "type": "image",
                "file": "data/assets/images/Bathilda Bagshot.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Bunty Broadacre",
                "type": "image",
                "file": "data/assets/images/Bunty Broadacre.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Cornelius Fudge",
                "type": "image",
                "file": "data/assets/images/Cornelius Fudge.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Credence",
                "type": "image",
                "file": "data/assets/images/Credence.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Fenrir Greyback",
                "type": "image",
                "file": "data/assets/images/Fenrir Greyback.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Fred Weasley",
                "type": "image",
                "file": "data/assets/images/Fred Weasley.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Garrick Ollivander",
                "type": "image",
                "file": "data/assets/images/Garrick Ollivander.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Gellert Grindelwald",
                "type": "image",
                "file": "data/assets/images/Gellert Grindelwald.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "George Weasley",
                "type": "image",
                "file": "data/assets/images/George Weasley.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Gregory Goyle",
                "type": "image",
                "file": "data/assets/images/Gregory Goyle.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Griphook",
                "type": "image",
                "file": "data/assets/images/Griphook.jpg",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Helga Hufflepuff",
                "type": "image",
                "file": "data/assets/images/Helga Hufflepuff.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Jacob Kowalski",
                "type": "image",
                "file": "data/assets/images/Jacob Kowalski.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "James Potter",
                "type": "image",
                "file": "data/assets/images/James Potter.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Kingsley Shacklebolt",
                "type": "image",
                "file": "data/assets/images/Kingsley Shacklebolt.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Lavender Brown",
                "type": "image",
                "file": "data/assets/images/Lavender Brown.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Marge Dursley",
                "type": "image",
                "file": "data/assets/images/Marge Dursley.jpg",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Minerva Mcgonagall",
                "type": "image",
                "file": "data/assets/images/Minerva Mcgonagall.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Mundungus Fletcher",
                "type": "image",
                "file": "data/assets/images/Mundungus Fletcher.jpg",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Nagini",
                "type": "image",
                "file": "data/assets/images/Nagini.jpg",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Newt Scamander",
                "type": "image",
                "file": "data/assets/images/Newt Scamander.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Nicolas Flamel",
                "type": "image",
                "file": "data/assets/images/Nicolas Flamel.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Norbert",
                "type": "image",
                "file": "data/assets/images/Norbert.jpg",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Oliver Wood",
                "type": "image",
                "file": "data/assets/images/Oliver Wood.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Olympe Maxime",
                "type": "image",
                "file": "data/assets/images/Olympe Maxime.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Padma Patil",
                "type": "image",
                "file": "data/assets/images/Padma Patil.jpg",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Peeves",
                "type": "image",
                "file": "data/assets/images/Peeves.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Pomona Sprout",
                "type": "image",
                "file": "data/assets/images/Pomona Sprout.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Poppy Pomfrey",
                "type": "image",
                "file": "data/assets/images/Poppy Pomfrey.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Queenie Goldstein",
                "type": "image",
                "file": "data/assets/images/Queenie Goldstein.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Rita Skeeter",
                "type": "image",
                "file": "data/assets/images/Rita Skeeter.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Rolanda Hooch",
                "type": "image",
                "file": "data/assets/images/Rolanda Hooch.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Rowena Ravenclaw",
                "type": "image",
                "file": "data/assets/images/Rowena Ravenclaw.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Rufus Scrimgeour",
                "type": "image",
                "file": "data/assets/images/Rufus Scrimgeour.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Salazar Slytherin",
                "type": "image",
                "file": "data/assets/images/Salazar Slytherin.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Scabbers",
                "type": "image",
                "file": "data/assets/images/Scabbers.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Stan Shunpike",
                "type": "image",
                "file": "data/assets/images/Stan Shunpike.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Sybill Trelawney",
                "type": "image",
                "file": "data/assets/images/Sybill Trelawney.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Teddy",
                "type": "image",
                "file": "data/assets/images/Teddy.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "The Bloody Baron",
                "type": "image",
                "file": "data/assets/images/The Bloody Baron.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "The Fat Friar",
                "type": "image",
                "file": "data/assets/images/The Fat Friar.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "The Grey Lady",
                "type": "image",
                "file": "data/assets/images/The Grey Lady.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Viktor Krum",
                "type": "image",
                "file": "data/assets/images/Viktor Krum.png",
                "difficulty": 5
            },
            {
                "q": "Qui est-ce ?",
                "a": "Xenophilius Lovegood",
                "type": "image",
                "file": "data/assets/images/Xenophilius Lovegood.jpg",
                "difficulty": 5
            },
            {
                "q": "Qui a coupé l'oreille de George Weasley ?",
                "a": "Severus Rogue",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui est le professeur de soins aux créatures magiques avant Hagrid ?",
                "a": "Professeur Brûlopot",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui a détruit le diadème de Serdaigle ?",
                "a": "Le Feudeymon (Invoqué par Crabbe/Goyle)",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Combien d'escaliers y a-t-il à Poudlard (environ) ?",
                "a": "142",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui est la mère de Nymphadora Tonks ?",
                "a": "Andromeda Black",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui a détruit le diadème de Serdaigle ?",
                "a": "Le Feudeymon (Crabbe/Goyle)",
                "type": "text",
                "difficulty": 5
            }
        ]
    },
    {
        "id": "mystere",
        "name": "🎭 Mystère",
        "color": "#2c2c54",
        "questions": [
            {
                "q": "Quel plombier moustachu saute sur des champignons pour sauver une princesse ?",
                "a": "Mario",
                "difficulty": 1
            },
            {
                "q": "De quelle couleur est un carton d'expulsion au football ?",
                "a": "Rouge",
                "difficulty": 1
            },
            {
                "q": "Qui chante 'Formidable' en 2012 ?",
                "a": "Stromae",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de la France ?",
                "a": "Paris",
                "difficulty": 2
            },
            {
                "q": "Combien d'heures par jour un chat dort-il en moyenne ?",
                "a": "12 à 16 heures",
                "difficulty": 2
            },
            {
                "q": "Dans les échecs, quel est le seul coup où on déplace deux pièces en même temps ?",
                "a": "Le roque",
                "difficulty": 3
            },
            {
                "q": "Comment appelle-t-on l'étude scientifique des fleurs et des plantes ?",
                "a": "La botanique",
                "difficulty": 3
            },
            {
                "q": "Quel joueur détient le record du nombre de Ballons d'Or remportés ?",
                "a": "Lionel Messi",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du chien à trois têtes qui garde la Pierre Philosophale ?",
                "a": "Touffu",
                "difficulty": 3
            },
            {
                "q": "En quelle année la règle de la passe en arrière au gardien fut-elle instaurée ?",
                "a": "1992",
                "difficulty": 5
            },
            {
                "q": "Quel hérisson bleu de chez SEGA court à la vitesse du son ?",
                "a": "Sonic",
                "difficulty": 1
            },
            {
                "q": "Comment s'appelle le bébé du chat ?",
                "a": "Le chaton",
                "difficulty": 1
            },
            {
                "q": "Quelle fleur est le symbole universel de l'amour ?",
                "a": "La rose",
                "difficulty": 1
            },
            {
                "q": "Quel groupe britannique a interprété 'Bohemian Rhapsody' ?",
                "a": "Queen",
                "difficulty": 1
            },
            {
                "q": "Dans quel jeu construit-on des structures avec des blocs cubiques ?",
                "a": "Minecraft",
                "difficulty": 2
            },
            {
                "q": "Quel pays a remporté le plus de Coupes du Monde dans l'histoire ?",
                "a": "Le Brésil (5 titres)",
                "difficulty": 2
            },
            {
                "q": "Quelle fleur carnivore referme ses mâchoires sur les insectes ?",
                "a": "La dionée (Venus flytrap)",
                "difficulty": 2
            },
            {
                "q": "Quel est le sport pratiqué sur des balais volants dans Harry Potter ?",
                "a": "Quidditch",
                "difficulty": 2
            },
            {
                "q": "Quelle est la capitale de l'Allemagne ?",
                "a": "Berlin",
                "difficulty": 2
            },
            {
                "q": "Dans quel pays est né le Reggae, porté par Bob Marley ?",
                "a": "La Jamaïque",
                "difficulty": 2
            },
            {
                "q": "Dans quel jeu de tir 100 joueurs sautent-ils d'un bus pour s'affronter sur une île ?",
                "a": "Fortnite",
                "difficulty": 3
            },
            {
                "q": "Qui a composé la Symphonie n°9 malgré sa surdité ?",
                "a": "Ludwig van Beethoven",
                "difficulty": 3
            },
            {
                "q": "Quel groupe de rock suédois a remporté l'Eurovision en 1974 avec Waterloo ?",
                "a": "ABBA",
                "difficulty": 3
            },
            {
                "q": "Quelle race de chien sauveteur est souvent représentée avec un tonneau autour du cou ?",
                "a": "Le Saint-Bernard",
                "difficulty": 3
            },
            {
                "q": "Quelle est la capitale du Japon ?",
                "a": "Tokyo",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du miroir qui montre le désir le plus profond dans Harry Potter ?",
                "a": "Miroir du Riséd",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom du dragon qu'affronte Harry Potter lors du tournoi ?",
                "a": "Magyar à pointes",
                "difficulty": 3
            },
            {
                "q": "Quel jeu de 1972 est considéré comme le premier grand succès commercial du jeu vidéo ?",
                "a": "Pong",
                "difficulty": 5
            },
            {
                "q": "Combien d'escaliers y a-t-il à Poudlard (environ) ?",
                "a": "142",
                "difficulty": 5
            },
            {
                "q": "Quel groupe de rock a été le premier à se produire sur les sept continents, y compris l'Antarctique ?",
                "a": "Metallica",
                "difficulty": 5
            },
            {
                "q": "Qui a inventé le Rubik's Cube ?",
                "a": "Ernő Rubik (en 1974)",
                "difficulty": 5
            }
        ]
    },
    {
        "id": "logo",
        "name": "🏷️ Logos & Marques",
        "color": "#2980b9",
        "questions": [
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Nike",
                "type": "image",
                "file": "data/assets/images/logos/1/Nike.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Adidas",
                "type": "image",
                "file": "data/assets/images/logos/1/Adidas.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Apple",
                "type": "image",
                "file": "data/assets/images/logos/1/Apple.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "McDonald's",
                "type": "image",
                "file": "data/assets/images/logos/1/McDonalds.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Coca-Cola",
                "type": "image",
                "file": "data/assets/images/logos/1/CocaCola.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Pepsi",
                "type": "image",
                "file": "data/assets/images/logos/1/Pepsi.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Amazon",
                "type": "image",
                "file": "data/assets/images/logos/1/Amazon.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Google",
                "type": "image",
                "file": "data/assets/images/logos/1/Google.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "YouTube",
                "type": "image",
                "file": "data/assets/images/logos/1/YouTube.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Instagram",
                "type": "image",
                "file": "data/assets/images/logos/1/Instagram.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Facebook",
                "type": "image",
                "file": "data/assets/images/logos/1/Facebook.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "TikTok",
                "type": "image",
                "file": "data/assets/images/logos/1/TikTok.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Starbucks",
                "type": "image",
                "file": "data/assets/images/logos/1/Starbucks.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Puma",
                "type": "image",
                "file": "data/assets/images/logos/1/Puma.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Burger King",
                "type": "image",
                "file": "data/assets/images/logos/1/BurgerKing.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Netflix",
                "type": "image",
                "file": "data/assets/images/logos/1/Netflix.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Samsung",
                "type": "image",
                "file": "data/assets/images/logos/1/Samsung.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Microsoft",
                "type": "image",
                "file": "data/assets/images/logos/1/Microsoft.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "PlayStation",
                "type": "image",
                "file": "data/assets/images/logos/1/PlayStation.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Xbox",
                "type": "image",
                "file": "data/assets/images/logos/1/Xbox.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Lego",
                "type": "image",
                "file": "data/assets/images/logos/1/Lego.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Disney",
                "type": "image",
                "file": "data/assets/images/logos/1/Disney.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "KFC",
                "type": "image",
                "file": "data/assets/images/logos/1/KFC.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Subway",
                "type": "image",
                "file": "data/assets/images/logos/1/Subway.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Uber",
                "type": "image",
                "file": "data/assets/images/logos/1/Uber.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "WhatsApp",
                "type": "image",
                "file": "data/assets/images/logos/1/WhatsApp.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Lacoste",
                "type": "image",
                "file": "data/assets/images/logos/1/Lacoste.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Chanel",
                "type": "image",
                "file": "data/assets/images/logos/1/Chanel.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Gucci",
                "type": "image",
                "file": "data/assets/images/logos/1/Gucci.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Louis Vuitton",
                "type": "image",
                "file": "data/assets/images/logos/1/LouisVuitton.png",
                "difficulty": 1
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Tesla",
                "type": "image",
                "file": "data/assets/images/logos/2/Tesla.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Spotify",
                "type": "image",
                "file": "data/assets/images/logos/2/Spotify.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Airbnb",
                "type": "image",
                "file": "data/assets/images/logos/2/Airbnb.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "LinkedIn",
                "type": "image",
                "file": "data/assets/images/logos/2/LinkedIn.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Dropbox",
                "type": "image",
                "file": "data/assets/images/logos/2/Dropbox.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Red Bull",
                "type": "image",
                "file": "data/assets/images/logos/2/RedBull.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Intel",
                "type": "image",
                "file": "data/assets/images/logos/2/Intel.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Asics",
                "type": "image",
                "file": "data/assets/images/logos/2/Asics.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Levi's",
                "type": "image",
                "file": "data/assets/images/logos/2/Levis.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Snapchat",
                "type": "image",
                "file": "data/assets/images/logos/2/Snapchat.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Discord",
                "type": "image",
                "file": "data/assets/images/logos/2/Discord.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Twitch",
                "type": "image",
                "file": "data/assets/images/logos/2/Twitch.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "eBay",
                "type": "image",
                "file": "data/assets/images/logos/2/eBay.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "PayPal",
                "type": "image",
                "file": "data/assets/images/logos/2/PayPal.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "FedEx",
                "type": "image",
                "file": "data/assets/images/logos/2/FedEx.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Vans",
                "type": "image",
                "file": "data/assets/images/logos/2/Vans.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Reebok",
                "type": "image",
                "file": "data/assets/images/logos/2/Reebok.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "New Balance",
                "type": "image",
                "file": "data/assets/images/logos/2/NewBalance.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Converse",
                "type": "image",
                "file": "data/assets/images/logos/2/Converse.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Fila",
                "type": "image",
                "file": "data/assets/images/logos/2/Fila.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Decathlon",
                "type": "image",
                "file": "data/assets/images/logos/2/Decathlon.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Carrefour",
                "type": "image",
                "file": "data/assets/images/logos/2/Carrefour.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Auchan",
                "type": "image",
                "file": "data/assets/images/logos/2/Auchan.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Monoprix",
                "type": "image",
                "file": "data/assets/images/logos/2/Monoprix.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Lidl",
                "type": "image",
                "file": "data/assets/images/logos/2/Lidl.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Aldi",
                "type": "image",
                "file": "data/assets/images/logos/2/Aldi.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "IKEA",
                "type": "image",
                "file": "data/assets/images/logos/2/Ikea.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Zara",
                "type": "image",
                "file": "data/assets/images/logos/2/Zara.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "H&M",
                "type": "image",
                "file": "data/assets/images/logos/2/HM.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Uniqlo",
                "type": "image",
                "file": "data/assets/images/logos/2/Uniqlo.png",
                "difficulty": 2
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Nvidia",
                "type": "image",
                "file": "data/assets/images/logos/3/Nvidia.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Salesforce",
                "type": "image",
                "file": "data/assets/images/logos/3/Salesforce.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Snowflake",
                "type": "image",
                "file": "data/assets/images/logos/3/Snowflake.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Datadog",
                "type": "image",
                "file": "data/assets/images/logos/3/Datadog.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Atlassian",
                "type": "image",
                "file": "data/assets/images/logos/3/Atlassian.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "HubSpot",
                "type": "image",
                "file": "data/assets/images/logos/3/HubSpot.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "MongoDB",
                "type": "image",
                "file": "data/assets/images/logos/3/MongoDB.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Splunk",
                "type": "image",
                "file": "data/assets/images/logos/3/Splunk.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Cloudflare",
                "type": "image",
                "file": "data/assets/images/logos/3/Cloudflare.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Palantir",
                "type": "image",
                "file": "data/assets/images/logos/3/Palantir.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Shopify",
                "type": "image",
                "file": "data/assets/images/logos/3/Shopify.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Zendesk",
                "type": "image",
                "file": "data/assets/images/logos/3/Zendesk.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "ServiceNow",
                "type": "image",
                "file": "data/assets/images/logos/3/ServiceNow.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Twilio",
                "type": "image",
                "file": "data/assets/images/logos/3/Twilio.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Okta",
                "type": "image",
                "file": "data/assets/images/logos/3/Okta.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Oracle",
                "type": "image",
                "file": "data/assets/images/logos/3/Oracle.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Cisco",
                "type": "image",
                "file": "data/assets/images/logos/3/Cisco.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "SAP",
                "type": "image",
                "file": "data/assets/images/logos/3/SAP.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Adobe",
                "type": "image",
                "file": "data/assets/images/logos/3/Adobe.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Figma",
                "type": "image",
                "file": "data/assets/images/logos/3/Figma.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Canva",
                "type": "image",
                "file": "data/assets/images/logos/3/Canva.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Notion",
                "type": "image",
                "file": "data/assets/images/logos/3/Notion.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "GitHub",
                "type": "image",
                "file": "data/assets/images/logos/3/GitHub.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "GitLab",
                "type": "image",
                "file": "data/assets/images/logos/3/GitLab.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Docker",
                "type": "image",
                "file": "data/assets/images/logos/3/Docker.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Kubernetes",
                "type": "image",
                "file": "data/assets/images/logos/3/Kubernetes.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "PostgreSQL",
                "type": "image",
                "file": "data/assets/images/logos/3/PostgreSQL.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "MySQL",
                "type": "image",
                "file": "data/assets/images/logos/3/MySQL.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Redis",
                "type": "image",
                "file": "data/assets/images/logos/3/Redis.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Elastic",
                "type": "image",
                "file": "data/assets/images/logos/3/Elastic.png",
                "difficulty": 3
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Supreme",
                "type": "image",
                "file": "data/assets/images/logos/4/Supreme.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Patagonia",
                "type": "image",
                "file": "data/assets/images/logos/4/Patagonia.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "The North Face",
                "type": "image",
                "file": "data/assets/images/logos/4/TheNorthFace.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Timberland",
                "type": "image",
                "file": "data/assets/images/logos/4/Timberland.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Under Armour",
                "type": "image",
                "file": "data/assets/images/logos/4/UnderArmour.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Quiksilver",
                "type": "image",
                "file": "data/assets/images/logos/4/Quiksilver.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Billabong",
                "type": "image",
                "file": "data/assets/images/logos/4/Billabong.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Champion",
                "type": "image",
                "file": "data/assets/images/logos/4/Champion.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Umbro",
                "type": "image",
                "file": "data/assets/images/logos/4/Umbro.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Kappa",
                "type": "image",
                "file": "data/assets/images/logos/4/Kappa.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Mizuno",
                "type": "image",
                "file": "data/assets/images/logos/4/Mizuno.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Salomon",
                "type": "image",
                "file": "data/assets/images/logos/4/Salomon.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Oakley",
                "type": "image",
                "file": "data/assets/images/logos/4/Oakley.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Ray-Ban",
                "type": "image",
                "file": "data/assets/images/logos/4/RayBan.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Seiko",
                "type": "image",
                "file": "data/assets/images/logos/4/Seiko.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Casio",
                "type": "image",
                "file": "data/assets/images/logos/4/Casio.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Garmin",
                "type": "image",
                "file": "data/assets/images/logos/4/Garmin.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "GoPro",
                "type": "image",
                "file": "data/assets/images/logos/4/GoPro.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Canon",
                "type": "image",
                "file": "data/assets/images/logos/4/Canon.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Nikon",
                "type": "image",
                "file": "data/assets/images/logos/4/Nikon.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Philips",
                "type": "image",
                "file": "data/assets/images/logos/4/Philips.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Panasonic",
                "type": "image",
                "file": "data/assets/images/logos/4/Panasonic.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Yamaha",
                "type": "image",
                "file": "data/assets/images/logos/4/Yamaha.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Kawasaki",
                "type": "image",
                "file": "data/assets/images/logos/4/Kawasaki.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Ducati",
                "type": "image",
                "file": "data/assets/images/logos/4/Ducati.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Subaru",
                "type": "image",
                "file": "data/assets/images/logos/4/Subaru.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Mazda",
                "type": "image",
                "file": "data/assets/images/logos/4/Mazda.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Volvo",
                "type": "image",
                "file": "data/assets/images/logos/4/Volvo.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Škoda",
                "type": "image",
                "file": "data/assets/images/logos/4/Skoda.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "SEAT",
                "type": "image",
                "file": "data/assets/images/logos/4/SEAT.png",
                "difficulty": 4
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Snow Peak",
                "type": "image",
                "file": "data/assets/images/logos/5/Snowpeak.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Arc'teryx",
                "type": "image",
                "file": "data/assets/images/logos/5/ArcTeryx.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Aesop",
                "type": "image",
                "file": "data/assets/images/logos/5/Aesop.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Muji",
                "type": "image",
                "file": "data/assets/images/logos/5/Muji.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Bialetti",
                "type": "image",
                "file": "data/assets/images/logos/5/Bialetti.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Bang & Olufsen",
                "type": "image",
                "file": "data/assets/images/logos/5/BangOlufsen.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Sonos",
                "type": "image",
                "file": "data/assets/images/logos/5/Sonos.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Bose",
                "type": "image",
                "file": "data/assets/images/logos/5/Bose.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Sennheiser",
                "type": "image",
                "file": "data/assets/images/logos/5/Sennheiser.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Marshall",
                "type": "image",
                "file": "data/assets/images/logos/5/Marshall.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Razer",
                "type": "image",
                "file": "data/assets/images/logos/5/Razer.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Logitech",
                "type": "image",
                "file": "data/assets/images/logos/5/Logitech.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Corsair",
                "type": "image",
                "file": "data/assets/images/logos/5/Corsair.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Alienware",
                "type": "image",
                "file": "data/assets/images/logos/5/Alienware.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "MSI",
                "type": "image",
                "file": "data/assets/images/logos/5/MSI.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Acer",
                "type": "image",
                "file": "data/assets/images/logos/5/Acer.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Lenovo",
                "type": "image",
                "file": "data/assets/images/logos/5/Lenovo.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Asus",
                "type": "image",
                "file": "data/assets/images/logos/5/Asus.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "BenQ",
                "type": "image",
                "file": "data/assets/images/logos/5/BenQ.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Synology",
                "type": "image",
                "file": "data/assets/images/logos/5/Synology.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "QNAP",
                "type": "image",
                "file": "data/assets/images/logos/5/QNAP.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Ubiquiti",
                "type": "image",
                "file": "data/assets/images/logos/5/Ubiquiti.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Fortinet",
                "type": "image",
                "file": "data/assets/images/logos/5/Fortinet.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "JetBrains",
                "type": "image",
                "file": "data/assets/images/logos/5/JetBrains.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Terraform",
                "type": "image",
                "file": "data/assets/images/logos/5/Terraform.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Grafana",
                "type": "image",
                "file": "data/assets/images/logos/5/Grafana.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Prometheus",
                "type": "image",
                "file": "data/assets/images/logos/5/Prometheus.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Ansible",
                "type": "image",
                "file": "data/assets/images/logos/5/Ansible.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "Jenkins",
                "type": "image",
                "file": "data/assets/images/logos/5/Jenkins.png",
                "difficulty": 5
            },
            {
                "q": "Reconnaissez-vous ce logo ?",
                "a": "SonarQube",
                "type": "image",
                "file": "data/assets/images/logos/5/SonarQube.png",
                "difficulty": 5
            }
        ]
    },
    {
        "id": "paris",
        "name": "🗼 Paris",
        "color": "#3498db",
        "questions": [
            {
                "q": "Quel monument a été construit pour le centenaire de la Révolution française en 1889 ?",
                "a": "La Tour Eiffel",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Combien de marches y a-t-il environ pour monter au sommet de la Tour Eiffel à pied ?",
                "a": "1 665 marches",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel célèbre monument se trouve au centre de la place Charles-de-Gaulle ?",
                "a": "L'Arc de Triomphe",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel monument blanc surplombe la butte Montmartre ?",
                "a": "Le Sacré-Cœur",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel bâtiment ultra-moderne est célèbre pour ses tuyaux colorés à l'extérieur ?",
                "a": "Le Centre Pompidou",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel pont est célèbre pour avoir été recouvert de \"cadenas d'amour\" ?",
                "a": "Le Pont des Arts",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le plus vieux pont de Paris ?",
                "a": "Le Pont Neuf",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Sur quelle avenue se juge traditionnellement l'arrivée du Tour de France ?",
                "a": "Les Champs-Élysées",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel stade est le jardin historique du club de football PSG ?",
                "a": "Le Parc des Princes",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Dans quel fleuve se sont déroulées les épreuves de triathlon des JO 2024 ?",
                "a": "La Seine",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel monument a accueilli les épreuves d'escrime sous sa verrière en 2024 ?",
                "a": "Le Grand Palais",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel tournoi de tennis du Grand Chelem se joue chaque année à la Porte d'Auteuil ?",
                "a": "Roland-Garros",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Comment s'appelle la plus grande enceinte sportive de France, située à Saint-Denis ?",
                "a": "Le Stade de France",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel était le nom de Paris à l'époque gallo-romaine ?",
                "a": "Lutèce",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel était le nom de Paris à l'époque gallo-romaine ?Lutèce1Quel roi de France a fait construire le château de Versailles pour quitter Paris ?",
                "a": "Louis XIV",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel personnage historique a été sacré empereur à Notre-Dame en 1804 ?",
                "a": "Napoléon Ier",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "En quelle année a eu lieu la grande crue de la Seine qui a inondé Paris ?",
                "a": "1910",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel ancien président a inauguré la Pyramide du Louvre en 1989 ?",
                "a": "François Mitterrand",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel saint patron (décapité) aurait marché avec sa tête sous le bras jusqu'à Saint-Denis ?",
                "a": "Saint Denis",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel pâtissier parisien est célèbre pour ses macarons et sa boutique rue Royale ?",
                "a": "Ladurée",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel gâteau en forme de couronne de vélo a été créé pour une course cycliste ?",
                "a": "Le Paris-Brest",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel sandwich chaud composé de jambon et fromage est un classique des brasseries ?",
                "a": "Le Croque-monsieur",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Combien y a-t-il d'arrondissements à Paris ?",
                "a": "20",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel quartier est célèbre pour ses cabarets comme le Moulin Rouge ?",
                "a": "Pigalle (ou Montmartre)",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel quartier historique est le centre de la communauté juive et du design ?",
                "a": "Le Marais",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Comment s'appelle le quartier où se trouve l'Université de la Sorbonne ?",
                "a": "Le Quartier Latin",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel bois se trouve à l'extrémité ouest de Paris (16e arrondissement) ?",
                "a": "Le Bois de Boulogne",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel cimetière est le plus visité de Paris ?",
                "a": "Le Père-Lachaise",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Dans quel musée peut-on admirer \"La Joconde\" de Léonard de Vinci ?",
                "a": "Le Louvre",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel sculpteur français a son propre musée dans le 7e arrondissement ?",
                "a": "Auguste Rodin",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel peintre est l'âme de Montmartre et a peint \"Le Moulin de la Galette\" ?",
                "a": "Renoir",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle ligne de métro est entièrement automatique (sans conducteur) depuis sa création en 1998 ?",
                "a": "La ligne 14",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle station de métro, aujourd'hui fermée au public, est surnommée \"station fantôme\" ?",
                "a": "Croix-Rouge",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quelle est la ligne de métro la plus longue du réseau parisien ?",
                "a": "La ligne 8 (Balard - Créteil)",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Comment appelle-t-on le transport qui fait le tour de Paris au-delà du périphérique (inauguré en 2006) ?",
                "a": "Le Tramway (T3)",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle place circulaire abrite 12 avenues qui rayonnent en forme d'étoile ?",
                "a": "Place de l'Étoile (Charles-de-Gaulle)",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du plus grand parc de Paris situé dans le 19e arrondissement ?",
                "a": "Parc de la Villette",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel passage couvert du 9e arrondissement abrite le Musée Grévin ?",
                "a": "Le Passage Jouffroy",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom de la plus grande salle de cinéma de Paris ?",
                "a": "Le Grand Rex",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel monument parisien a servi de décor pour le départ du Marathon pour Tous ?",
                "a": "L'Hôtel de Ville",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel pont de Paris, orné de statues dorées, était au cœur de la cérémonie d'ouverture des JO 2024 ?",
                "a": "Le Pont Alexandre III",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel célèbre parc parisien se trouve juste en face de l'entrée principale de la cité internationale universitaire de Paris ?",
                "a": "Le Parc Montsouris",
                "type": "text",
                "difficulty": 1
            }
        ]
    },
    {
        "id": "sport",
        "name": "🤾‍♂️ Sport",
        "color": "#3498db",
        "questions": [
            {
                "q": "Combien de joueurs y a-t-il dans une équipe de basket sur le terrain ?",
                "a": "5 joueurs",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel pays a remporté la Coupe du Monde de Rugby 2023 ?",
                "a": "L'Afrique du Sud",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "En quelle année l'équipe de France de Handball masculine a-t-elle remporté son premier titre mondial ?",
                "a": "1995",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel poste au volley-ball porte un maillot de couleur différente et ne peut pas attaquer ?",
                "a": "Le Libero",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Combien de temps dure un match de rugby à XV (hors arrêts de jeu) ?",
                "a": "80 minutes (2x40)",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Au baseball, comment appelle-t-on le fait de frapper la balle hors des limites du terrain ?",
                "a": "Un Home Run",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel joueur détient le record de victoires à Roland-Garros ?",
                "a": "Rafael Nadal (14 titres)",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Au tennis, comment appelle-t-on un service que l'adversaire ne parvient pas à toucher ?",
                "a": "Un Ace",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le score minimum pour gagner un \"Tie-break\" au tennis ?",
                "a": "7 points (avec 2 points d'écart)",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel sport de raquette se joue avec un volant et non une balle ?",
                "a": "Le Badminton",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel joueur serbe détient le record masculin de titres en Grand Chelem ?",
                "a": "Novak Djokovic",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Au tennis de table, combien de points faut-il pour gagner une manche (depuis 2001) ?",
                "a": "11 points",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel pilote de F1 détient le record de 7 titres mondiaux (à égalité avec Hamilton) ?",
                "a": "Michael Schumacher",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la couleur du maillot porté par le leader du classement général du Tour de France ?",
                "a": "Jaune",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle est la durée maximale d'un round en boxe anglaise professionnelle ?",
                "a": "3 minutes",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Dans quel art martial porte-t-on un \"judogi\" ?",
                "a": "Le Judo",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel est le nom de la cage octogonale où se déroulent les combats de l'UFC ?",
                "a": "L'Octogone",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est considéré comme \"The Greatest\" dans l'histoire de la boxe poids lourds ?",
                "a": "Mohamed Ali",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Dans quel sport de combat utilise-t-on des \"touches\" avec un fleuret ou une épée ?",
                "a": "L'Escrime",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel athlète jamaïcain détient le record du monde du 100m et 200m ?",
                "a": "Usain Bolt",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel nageur américain est l'athlète le plus médaillé de l'histoire des JO ?",
                "a": "Michael Phelps (28 médailles)",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle ville a accueilli les premiers Jeux Olympiques de l'ère moderne en 1896 ?",
                "a": "Athènes",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Dans quel sport peut-on réaliser un \"Birdie\", un \"Eagle\" ou un \"Albatros\" ?",
                "a": "Le Golf",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel est le nom du stade mythique de cricket à Londres ?",
                "a": "Lord's Cricket Ground",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Comment appelle-t-on le fait de faire tomber toutes les quilles d'un coup au bowling ?",
                "a": "Un Strike",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Dans quelle ville française ont eu lieu les premiers JO d'hiver en 1924 ?",
                "a": "Chamonix",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Combien de joueurs (gardiens inclus) composent une équipe de hockey sur glace sur la patinoire ?",
                "a": "6 joueurs",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle est la longueur d'une piste de bobsleigh (environ) ?",
                "a": "1 500 mètres",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel est le nom de la tenue portée par les pratiquants de Karaté ?",
                "a": "Un Karatégi",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel art martial afro-brésilien mélange danse et techniques de combat ?",
                "a": "La Capoeira",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Combien d'essais un sauteur en hauteur a-t-il le droit de rater à une même hauteur ?",
                "a": "3 essais",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel sport utilise le terme \"Love\" pour désigner un score de zéro ?",
                "a": "Le Tennis",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel est le nom du tournoi du Grand Chelem qui se déroule à New York ?",
                "a": "L'US Open",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "De quel pays est originaire le joueur Roger Federer ?",
                "a": "Suisse",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel tournoi du Grand Chelem impose aux joueurs de s'habiller presque entièrement en blanc ?",
                "a": "Wimbledon",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Combien de pas un joueur peut-il faire au maximum sans dribbler le ballon ?",
                "a": "3 pas",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom de la finale du championnat de football américain (NFL) ?",
                "a": "Le Super Bowl",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Dans quel sport peut-on réaliser un \"Birdie\" ?",
                "a": "Le Golf",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel joueur a disputé le match le plus long de l'histoire de tennis (11h05) contre Nicolas Mahut en 2010 ?",
                "a": "John Isner",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel club de handball détient le record de victoires en Ligue des Champions masculine ?",
                "a": "FC Barcelone",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel pays a été banni des JO pendant 28 ans (de 1964 à 1992) à cause de sa politique d'Apartheid ?",
                "a": "L'Afrique du Sud",
                "type": "text",
                "difficulty": 5
            }
        ]
    },
    {
        "id": "histoire",
        "name": "📖 Histoire",
        "color": "#3498db",
        "questions": [
            {
                "q": "Quel peuple a construit les pyramides de Gizeh ?",
                "a": "Les Égyptiens",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel général carthaginois a traversé les Alpes avec des éléphants ?",
                "a": "Hannibal Barca",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Qui est le dieu de la foudre dans la mythologie grecque ?",
                "a": "Zeus",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle cité grecque était la rivale d'Athènes lors de la guerre du Péloponnèse ?",
                "a": "Sparte",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Comment s'appelle l'écriture sacrée des Égyptiens ?",
                "a": "Les hiéroglyphes",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel pharaon dont la tombe fut découverte intacte en 1922 ?",
                "a": "Toutânkhamon",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui a conquis un immense empire allant de la Grèce à l'Inde avant ses 30 ans ?",
                "a": "Alexandre le Grand",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel philosophe grec fut le précepteur d'Alexandre le Grand ?",
                "a": "Aristote",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel peuple a inventé l'alphabet dont dérive le nôtre ?",
                "a": "Les Phéniciens",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Qui a été sacré empereur d'Occident en l'an 800 ?",
                "a": "Charlemagne",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "omment appelle-t-on l'épidémie qui a tué un tiers de l'Europe au XIVe siècle ?",
                "a": "Peste Noire",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle jeune femme a aidé à sacrer Charles VII à Reims ?",
                "a": "Jeanne d'Arc",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel est le nom de la guerre qui a opposé la France et l'Angleterre de 1337 à 1453 ?",
                "a": "La guerre de Cent Ans",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui est le prophète de l'Islam dont l'Hégire marque le début du calendrier musulman ?",
                "a": "Prophète Muhammad",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel explorateur vénitien s'est rendu à la cour de Kubilai Khan en Chine ?",
                "a": "Marco Polo",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quelle ville était la capitale de l'Empire byzantin ?",
                "a": "Constantinople",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "En quelle année Christophe Colomb atteint-il l'Amérique ?",
                "a": "1492",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel roi de France est surnommé le « Roi-Soleil » ?",
                "a": "Louis XIV",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel savant a été condamné pour avoir soutenu que la Terre tourne autour du Soleil ?",
                "a": "Galilée",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel événement marque le début de la Révolution française le 14 juillet 1789 ?",
                "a": "prise de la Bastille",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel navigateur français a découvert le Canada (Gaspé) en 1534 ?",
                "a": "Jacques Cartier",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quel général corse devient empereur des Français en 1804 ?",
                "a": "Napoléon Bonaparte",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quelle défaite marque la fin définitive du règne de Napoléon Ier en 1815 ?",
                "a": "Waterloo",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel président américain a aboli l'esclavage ?",
                "a": "Abraham Lincoln",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel naturaliste a publié L'Origine des espèces en 1859 ?",
                "a": "Charles Darwin",
                "type": "text",
                "difficulty": 5
            },
            {
                "q": "Quel officier français juif a été injustement accusé d'espionnage en 1894 ?",
                "a": "Alfred Dreyfus",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "En quelle année a commencé la Première Guerre mondiale ?",
                "a": "1914",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel traité a mis fin à la Première Guerre mondiale en 1919 ?",
                "a": "Le traité de Versailles",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Qui était le leader de l'Allemagne nazie ?",
                "a": "Adolf Hitler",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel événement déclenche la Seconde Guerre mondiale en septembre 1939 ?",
                "a": "L'invasion de la Pologne",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Comment s'appelle l'attaque japonaise qui fait entrer les USA en guerre en 1941 ?",
                "a": "Pearl Harbor",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Sur quelles villes japonaises les bombes atomiques ont-elles été lancées ? (une ville suffit)",
                "a": "Hiroshima et Nagasaki",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle organisation internationale est créée en 1945 pour maintenir la paix ?",
                "a": "L'ONU",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quelle année marque la chute du mur de Berlin ?",
                "a": "1989",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel leader indien a prôné la non-violence pour l'indépendance de son pays ?",
                "a": "Mahatma Gandhi",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "En quelle année a eu lieu le premier pas de l'homme sur la Lune ?",
                "a": "1969",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Qui a mené la lutte contre l'Apartheid en Afrique du Sud ?",
                "a": "Nelson Mandela",
                "type": "text",
                "difficulty": 2
            },
            {
                "q": "Quel était le nom du dernier dirigeant de l'URSS ?",
                "a": "Mikhaïl Gorbatchev",
                "type": "text",
                "difficulty": 3
            },
            {
                "q": "Quelle guerre a opposé le Nord communiste et le Sud soutenu par les USA (1955-1975) ?",
                "a": "La guerre du Vietnam",
                "type": "text",
                "difficulty": 4
            },
            {
                "q": "Quel événement marque la fin symbolique de la Guerre froide en 1989 ?",
                "a": "La chute du mur de Berlin",
                "type": "text",
                "difficulty": 1
            },
            {
                "q": "Quel pays a offert la Statue de la Liberté aux États-Unis ?",
                "a": "La France",
                "type": "text",
                "difficulty": 1
            }
        ]
    }
];
// ─────────────────────────────────────────────────────────────────────────
// MODE CUSTOM (chargé depuis localStorage)
(function() {
    if (localStorage.getItem('wagon_mode') === 'custom' && Array.isArray(AVAILABLE_THEMES_CUSTOM)) {
        AVAILABLE_THEMES.length = 0;
        AVAILABLE_THEMES_CUSTOM.forEach(t => AVAILABLE_THEMES.push(t));
    }
})();
function toggleDataMode() {
    const cur = localStorage.getItem('wagon_mode') || 'normal';
    localStorage.setItem('wagon_mode', cur === 'normal' ? 'custom' : 'normal');
    location.reload();
}
// ─────────────────────────────────────────────────────────────────────────
