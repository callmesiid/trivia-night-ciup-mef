// CONFIGURATION VISUELLE
const GAME_CONFIG = {
    timerDuration: 30,
    themes: [
        // ID: le nom du dossier (minuscule) | TITLE: le nom affiché (Exactement comme la Roue)
        { id: "animaux", title: "Animaux", iconFile: "animaux.png", questions: [] },
        { id: "annees_2000", title: "Années 2000", iconFile: "annee_2000.png", questions: [] },
        { id: "art", title: "Art", iconFile: "art.png", questions: [] },
        { id: "celebrites", title: "Célébrités", iconFile: "celebrites.png", questions: [] },
        { id: "cinema", title: "Cinéma", iconFile: "cinema.png", questions: [] },
        { id: "cuisine", title: "Cuisine", iconFile: "cuisine.png", questions: [] },
        { id: "disney", title: "Disney", iconFile: "disney.png", questions: [] },
        { id: "geographie", title: "Géographie", iconFile: "géographie.png", questions: [] },
        { id: "harry_potter", title: "Harry Potter", iconFile: "harry_potter.png", questions: [] },
        { id: "histoire", title: "Histoire", iconFile: "histoire.png", questions: [] },
        { id: "jeux_video", title: "Jeux Vidéo", iconFile: "jeux_video.png", questions: [] },
        { id: "litterature", title: "Littérature", iconFile: "litterature.png", questions: [] },
        { id: "musique", title: "Musique", iconFile: "musique.png", questions: [] },
        { id: "sciences", title: "Sciences", iconFile: "sciences.png", questions: [] },
        { id: "sport", title: "Sport", iconFile: "sport.png", questions: [] },

        // LE THÈME MYSTÈRE (Toujours à la fin)
        { id: "mystere", title: "MYSTÈRE", iconFile: "", questions: [] }
    ]
};

// LISTE DE LA ROUE (Doit être identique aux TITLES ci-dessus)
const WHEEL_THEMES = [
    "Animaux", "Années 2000", "Art", "Célébrités", "Cinéma", "Cuisine", 
    "Disney", "Géographie", "Harry Potter", "Histoire", "Jeux Vidéo", 
    "Littérature", "Musique", "Sciences", "Sport"
];