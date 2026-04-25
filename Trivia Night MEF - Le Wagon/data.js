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
        "id": 6,
        "name": "PREMIÈRE CLASSE",
        "emoji": "👑",
        "type": "AUTO",
        "timing": "POST_CORRECT",
        "desc": "Si la réponse est juste, la question suivante est validée automatiquement.",
        "how": "Activez avant la question. Si correct, la Q suivante est gagnée d'office."
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
        "timing": "IMMEDIATE",
        "desc": "Revient d'une question en arrière dans le wagon actuel — la question ratée peut être retentée.",
        "how": "Activez depuis votre wagon en cours. Vous reculez d'une case et retentez la question précédente."
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

// --- THÈMES & QUESTIONS (8 thèmes x 10 questions) ---
const AVAILABLE_THEMES = [
    {
        "id": "fleurs",
        "name": "🌸 Fleurs",
        "color": "#e84393",
        "questions": [
            {
                "q": "Quelle fleur est le symbole universel de l'amour ?",
                "a": "La rose"
            },
            {
                "q": "De quelle couleur est le tournesol ?",
                "a": "Jaune"
            },
            {
                "q": "Quelle fleur blanche de mai sent très fort et porte bonheur ?",
                "a": "Le muguet"
            },
            {
                "q": "Quelle fleur néerlandaise a causé une bulle spéculative au XVIIe siècle ?",
                "a": "La tulipe"
            },
            {
                "q": "Quelle fleur carnivore referme ses mâchoires sur les insectes ?",
                "a": "La dionée (Venus flytrap)"
            },
            {
                "q": "Comment appelle-t-on l'étude scientifique des fleurs et des plantes ?",
                "a": "La botanique"
            },
            {
                "q": "Quelle fleur japonaise symbolise la beauté éphémère du printemps ?",
                "a": "Le cerisier (sakura)"
            },
            {
                "q": "Quelle fleur produit l'opium quand on en incise la capsule ?",
                "a": "Le pavot"
            },
            {
                "q": "Quelle plante fleurit une fois tous les 100 ans selon la légende ?",
                "a": "L'agave (century plant)"
            },
            {
                "q": "Quel est le nom scientifique de la famille des roses ?",
                "a": "Les Rosacées"
            }
        ]
    },
    {
        "id": "jeux",
        "name": "🎲 Jeux de société",
        "color": "#3498db",
        "questions": [
            {
                "q": "Combien y a-t-il de cases sur un échiquier ?",
                "a": "64"
            },
            {
                "q": "Quel jeu de société fait jouer de petits chevaux colorés ?",
                "a": "Le jeu des petits chevaux"
            },
            {
                "q": "Dans le Monopoly, quelle est la rue la plus chère en version française ?",
                "a": "La Rue de la Paix"
            },
            {
                "q": "Dans le Scrabble, combien vaut la lettre Z ?",
                "a": "10 points"
            },
            {
                "q": "Qui a inventé le Rubik's Cube ?",
                "a": "Ernő Rubik (en 1974)"
            },
            {
                "q": "Dans les échecs, quel est le seul coup où on déplace deux pièces simultanément ?",
                "a": "Le roque"
            },
            {
                "q": "Quel jeu de société coopératif médical vous demande d'opérer un patient ?",
                "a": "Docteur Maboul"
            },
            {
                "q": "Combien de propriétés y a-t-il dans un Monopoly standard ?",
                "a": "28"
            },
            {
                "q": "Dans quel jeu cherche-t-on à faire couler les bateaux adverses ?",
                "a": "La Bataille navale"
            },
            {
                "q": "Quel jeu de plateau lancé en 1995 se joue sur une île avec des routes et des villes ?",
                "a": "Les Colons de Catane"
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
                "a": "Le chaton"
            },
            {
                "q": "Quelle race de chien de chasse a de très longues oreilles tombantes ?",
                "a": "Le basset hound"
            },
            {
                "q": "Les chats voient-ils les couleurs comme les humains ?",
                "a": "Non, ils voient en nuances limitées (dichromates)"
            },
            {
                "q": "Quel est le chien de course le plus rapide au monde ?",
                "a": "Le lévrier (greyhound)"
            },
            {
                "q": "Combien de dents a un chat adulte ?",
                "a": "30 dents"
            },
            {
                "q": "Quelle race de chat n'a pas de poils ?",
                "a": "Le Sphynx"
            },
            {
                "q": "Combien d'heures par jour un chat dort-il en moyenne ?",
                "a": "12 à 16 heures"
            },
            {
                "q": "Quelle race de chien est connue pour son pelage 'dreadlock' appelé corded ?",
                "a": "Le Komondor ou le Puli"
            },
            {
                "q": "Quel organe unique les chats ont-ils dans la gorge qui leur permet de ronronner ?",
                "a": "Le larynx (muscles laryngés)"
            },
            {
                "q": "Quel chien de berger australien est souvent confondu avec le Colley mais est d'origine américaine ?",
                "a": "L'Australian Shepherd (Berger australien)"
            }
        ]
    },
    {
        "id": "football",
        "name": "⚽ Football",
        "color": "#27ae60",
        "questions": [
            {
                "q": "Combien de joueurs y a-t-il dans une équipe de football sur le terrain ?",
                "a": "11 joueurs"
            },
            {
                "q": "De quelle couleur est un carton d'expulsion ?",
                "a": "Rouge"
            },
            {
                "q": "Qui a gagné la Coupe du Monde 2018 ?",
                "a": "La France"
            },
            {
                "q": "Quel pays a remporté le plus de Coupes du Monde ?",
                "a": "Le Brésil (5 titres)"
            },
            {
                "q": "Combien de temps dure un match de football réglementaire ?",
                "a": "90 minutes (2×45)"
            },
            {
                "q": "Quel joueur détient le record du nombre de Ballons d'Or ?",
                "a": "Lionel Messi (8 Ballons d'Or)"
            },
            {
                "q": "En quelle année a eu lieu la première Coupe du Monde de football ?",
                "a": "1930 (en Uruguay)"
            },
            {
                "q": "Quel club a remporté le plus de Ligues des Champions ?",
                "a": "Le Real Madrid"
            },
            {
                "q": "Quel est le record de buts marqués lors d'une seule Coupe du Monde par un joueur ?",
                "a": "Miroslav Klose (16 buts, 4 éditions)"
            },
            {
                "q": "Dans quelle ville s'est déroulée la finale de la Coupe du Monde 2006 remportée par l'Italie ?",
                "a": "Berlin (Olympiastadion)"
            }
        ]
    },
    {
        "id": "jeuxvideo",
        "name": "🎮 Jeux vidéo",
        "color": "#9b59b6",
        "questions": [
            {
                "q": "Quel plombier moustachu saute sur des champignons ?",
                "a": "Mario"
            },
            {
                "q": "Dans quel jeu construit-on des structures avec des blocs de terrain cubiques ?",
                "a": "Minecraft"
            },
            {
                "q": "Quel hérisson bleu court à la vitesse du son ?",
                "a": "Sonic"
            },
            {
                "q": "Qui a créé la franchise Pokémon ?",
                "a": "Satoshi Tajiri (Nintendo/Game Freak)"
            },
            {
                "q": "Quel jeu se déroule dans le royaume de Hyrule avec une jeune elfe en vert ?",
                "a": "The Legend of Zelda"
            },
            {
                "q": "Quel est le jeu vidéo le plus vendu de tous les temps (toutes plateformes) ?",
                "a": "Minecraft"
            },
            {
                "q": "En quelle année est sorti le premier jeu Donkey Kong, premier apparition de Mario ?",
                "a": "1981"
            },
            {
                "q": "Quel studio a développé la saga Grand Theft Auto ?",
                "a": "Rockstar Games"
            },
            {
                "q": "Qui est le créateur de la saga Metal Gear Solid ?",
                "a": "Hideo Kojima"
            },
            {
                "q": "Quel jeu de Valve lancé en 2012 est considéré comme le MOBA le plus joué au monde ?",
                "a": "Dota 2"
            }
        ]
    },
    {
        "id": "nourriture",
        "name": "🍔 Nourriture",
        "color": "#e74c3c",
        "questions": [
            {
                "q": "Quel fromage est typiquement fondu sur une pizza italienne traditionnelle ?",
                "a": "La mozzarella"
            },
            {
                "q": "Quel pays a inventé les sushis ?",
                "a": "Le Japon"
            },
            {
                "q": "Quel est l'ingrédient principal du guacamole ?",
                "a": "L'avocat"
            },
            {
                "q": "Quelle ville italienne est le berceau de la pizza ?",
                "a": "Naples"
            },
            {
                "q": "Quel chef français cumule le plus d'étoiles Michelin au monde ?",
                "a": "Alain Ducasse (20+ étoiles)"
            },
            {
                "q": "Quel est le fromage français qui sent le plus fort et est protégé par une AOC ?",
                "a": "Le Munster (ou l'Époisses)"
            },
            {
                "q": "Quelle épice est extraite du crocus et est la plus chère du monde au kilo ?",
                "a": "Le safran"
            },
            {
                "q": "Dans quel pays mange-t-on du 'injera', une galette fermentée acide ?",
                "a": "L'Éthiopie"
            },
            {
                "q": "Combien de litres de lait faut-il environ pour faire 1 kilo de fromage ?",
                "a": "Environ 10 litres"
            },
            {
                "q": "Quel fruit tropical contient une enzyme (bromélaïne) qui empêche la gélatine de prendre ?",
                "a": "L'ananas"
            }
        ]
    },
    {
        "id": "filmsfrancais",
        "name": "🎬 Films français",
        "color": "#1abc9c",
        "questions": [
            {
                "q": "Quel film parle d'une serveuse timide qui améliore la vie de ses voisins à Montmartre ?",
                "a": "Le Fabuleux Destin d'Amélie Poulain"
            },
            {
                "q": "Qui a réalisé 'La Haine' en 1995 ?",
                "a": "Mathieu Kassovitz"
            },
            {
                "q": "Quel acteur français joue le tueur à gages dans 'Léon' de Luc Besson ?",
                "a": "Jean Reno"
            },
            {
                "q": "Qui a composé la bande originale du Fabuleux Destin d'Amélie Poulain ?",
                "a": "Yann Tiersen"
            },
            {
                "q": "Dans quel film de 2011 un riche tétraplégique engage un homme de banlieue pour le soigner ?",
                "a": "Intouchables"
            },
            {
                "q": "Quel film de Jean-Marie Poiré met en scène un chevalier medieval transporté de nos jours ?",
                "a": "Les Visiteurs"
            },
            {
                "q": "Quelle Palme d'Or française de 2008 se déroule dans un collège difficile de Paris ?",
                "a": "Entre les murs"
            },
            {
                "q": "Quel film de 1985 avec Depardieu et Anémone raconte une histoire de bébé échangé ?",
                "a": "Le Père Noël est une ordure (1982) ou Trois hommes et un couffin"
            },
            {
                "q": "Quel acteur incarne Astérix dans 'Mission Cléopâtre' aux côtés de Jamel Debbouze ?",
                "a": "Christian Clavier"
            },
            {
                "q": "Quel film de François Truffaut, sorti en 1959, marque le début de la Nouvelle Vague ?",
                "a": "Les Quatre Cents Coups"
            }
        ]
    },
    {
        "id": "musique",
        "name": "🎵 Musique",
        "color": "#e67e22",
        "questions": [
            {
                "q": "Combien de cordes a une guitare classique standard ?",
                "a": "6 cordes"
            },
            {
                "q": "Qui chante 'Formidable' en 2012 ?",
                "a": "Stromae"
            },
            {
                "q": "Quel groupe britannique a interprété 'Bohemian Rhapsody' ?",
                "a": "Queen"
            },
            {
                "q": "Qui a composé la Symphonie n°9 malgré sa surdité ?",
                "a": "Ludwig van Beethoven"
            },
            {
                "q": "Quel rappeur français a sorti 'Bande Organisée' avec Jul, SCH, Naps et autres ?",
                "a": "SCH, Jul, Naps, Kofs, Elams, Solda, Houari, Soso Maness"
            },
            {
                "q": "Quelle chanteuse française a popularisé 'La Vie en rose' dans les années 40 ?",
                "a": "Édith Piaf"
            },
            {
                "q": "Qui a gagné l'Eurovision 2021 pour l'Italie ?",
                "a": "Måneskin"
            },
            {
                "q": "Quel instrument à cordes pincées est associé au flamenco espagnol ?",
                "a": "La guitare flamenca"
            },
            {
                "q": "Combien de touches (notes) possède un piano de concert standard ?",
                "a": "88 touches"
            },
            {
                "q": "Quel est le vrai nom du chanteur Stromae ?",
                "a": "Paul Van Haver"
            }
        ]
    }
];
