const THEMES_DATA = [
    {
        id: 'ciup',
        title: "MAISONS CIUP",
        icon: "icons/celebrites.png", // Icone générique ou spécifique si tu as
        question: "Combien de maisons de la Cité Internationale pouvez-vous citer ?",
        answers: [
            "Fondation Deutsch", "Maison des Étudiants de la Francophonie", "Maison Internationale", "Maison des Provinces", 
            "Maison du Maroc", "Maison de la Tunisie", "Maison du Cambodge", "Maison du Liban", 
            "Maison de l'Inde", "Maison du Japon", "Maison du Brésil", "Maison de la Suède", 
            "Maison de la Suisse", "Maison de la Norvège", "Maison du Portugal", "Collège Néerlandais",
            "Maison des États-Unis", "Maison de l'Allemagne", "Maison de l'Italie", "Maison de la Corée",
            "Maison de l'Argentine", "Maison du Mexique", "Maison du Canada", "Maison de l'Île-de-France"
        ]
    },
    {
        id: 'afrique',
        title: "PAYS D'AFRIQUE",
        icon: "icons/géographie.png",
        question: "Combien de pays du continent africain pouvez-vous citer ?",
        answers: [
            "Afrique du Sud", "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso", "Burundi", 
            "Cameroun", "Cap-Vert", "Centrafrique", "Comores", "Congo", "RDC", "Côte d'Ivoire", 
            "Djibouti", "Égypte", "Érythrée", "Éthiopie", "Gabon", "Gambie", "Ghana", "Guinée", 
            "Kenya", "Libye", "Madagascar", "Mali", "Maroc", "Maurice", "Mauritanie", "Mozambique", 
            "Namibie", "Niger", "Nigeria", "Ouganda", "Rwanda", "Sénégal", "Seychelles", "Somalie", 
            "Soudan", "Tanzanie", "Tchad", "Togo", "Tunisie", "Zambie", "Zimbabwe"
        ]
    },
    {
        id: 'parcs',
        title: "PARCS PARISIENS",
        icon: "icons/nature.png", // Utilise un icon dispo
        question: "Combien de parcs ou jardins parisiens pouvez-vous citer ?",
        answers: [
            "Jardin du Luxembourg", "Jardin des Tuileries", "Parc des Buttes-Chaumont", "Parc Monceau", 
            "Parc Montsouris", "Champ de Mars", "Jardin des Plantes", "Parc de la Villette", 
            "Parc André Citroën", "Bois de Boulogne", "Bois de Vincennes", "Parc de Bercy", 
            "Jardin du Palais Royal", "Parc de Belleville", "Square des Batignolles", "Jardin d'Acclimatation",
            "Promenade Plantée", "Parc Kellermann", "Parc Georges-Brassens", "Jardin Tino Rossi"
        ]
    },
    {
        id: 'ligne8',
        title: "LIGNE 8",
        icon: "icons/transport.png",
        question: "Combien d'arrêts de la ligne 8 (Balard - Créteil) pouvez-vous citer ?",
        answers: [
            "Balard", "Lourmel", "Boucicaut", "Félix Faure", "Commerce", "La Motte-Picquet Grenelle", 
            "École Militaire", "La Tour-Maubourg", "Invalides", "Concorde", "Madeleine", "Opéra", 
            "Richelieu-Drouot", "Grands Boulevards", "Bonne Nouvelle", "Strasbourg-Saint-Denis", 
            "République", "Filles du Calvaire", "Saint-Sébastien Froissart", "Chemin Vert", "Bastille", 
            "Ledru-Rollin", "Faidherbe-Chaligny", "Reuilly-Diderot", "Montgallet", "Daumesnil", 
            "Michel Bizot", "Porte Dorée", "Porte de Charenton", "Liberté", "Charenton-Écoles", 
            "École Vétérinaire", "Maisons-Alfort", "Créteil-Université", "Créteil-L'Échat", "Créteil-Préfecture", "Pointe du Lac"
        ]
    },
    {
        id: 'departements',
        title: "DÉPARTEMENTS",
        icon: "icons/histoire.png",
        question: "Combien de départements français (noms) pouvez-vous citer ?",
        answers: [
            "Ain", "Aisne", "Allier", "Alpes-Maritimes", "Ardèche", "Ardennes", "Ariège", "Aube", "Aude", "Aveyron",
            "Bouches-du-Rhône", "Calvados", "Cantal", "Charente", "Cher", "Corrèze", "Corse", "Côte-d'Or", 
            "Côtes-d'Armor", "Creuse", "Dordogne", "Doubs", "Drôme", "Essonne", "Eure", "Finistère", "Gard", 
            "Gers", "Gironde", "Hérault", "Ille-et-Vilaine", "Indre", "Isère", "Jura", "Landes", "Loire", 
            "Haute-Loire", "Loire-Atlantique", "Loiret", "Lot", "Lozère", "Maine-et-Loire", "Manche", "Marne", 
            "Mayenne", "Meurthe-et-Moselle", "Meuse", "Morbihan", "Moselle", "Nièvre", "Nord", "Oise", "Orne", 
            "Pas-de-Calais", "Puy-de-Dôme", "Pyrénées", "Rhône", "Saône-et-Loire", "Sarthe", "Savoie", "Paris", 
            "Seine-Maritime", "Seine-et-Marne", "Yvelines", "Somme", "Tarn", "Var", "Vaucluse", "Vendée", 
            "Vienne", "Vosges", "Yonne", "Territoire de Belfort", "Essonne", "Hauts-de-Seine", "Seine-Saint-Denis", "Val-de-Marne", "Val-d'Oise"
        ]
    }
];