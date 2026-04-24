// Communication entre les fenêtres
const gameChannel = new BroadcastChannel('wagon_game_channel');

// Thèmes disponibles avec questions (exemples fictifs pour test)
const AVAILABLE_THEMES = [
    {
        name: '🌸 Fleurs',
        questions: [
            { q: "Quelle fleur est symbole de l'amour ?", a: "La rose" },
            { q: "De quelle couleur est le tournesol ?", a: "Jaune" },
            { q: "Quelle fleur sent très fort et pousse au printemps ?", a: "Le muguet" },
            { q: "Quelle fleur néerlandaise a causé une bulle spéculative ?", a: "La tulipe" },
            { q: "Quelle fleur bleue est rare dans la nature ?", a: "L'orchidée bleue" },
            { q: "Comment s'appelle l'étude scientifique des fleurs ?", a: "La botanique florale" },
            { q: "Quelle fleur japonaise symbolise l'éphémère ?", a: "Le cerisier (sakura)" },
            { q: "Quelle fleur carnivore piège les insectes ?", a: "La dionée" },
            { q: "Combien de pétales a généralement une marguerite ?", a: "Entre 20 et 30" },
            { q: "Quel est le nom scientifique de la rose ?", a: "Rosa" }
        ]
    },
    {
        name: '🎲 Jeux de société',
        questions: [
            { q: "Combien y a-t-il de cases sur un échiquier ?", a: "64" },
            { q: "Quel jeu utilise des petits chevaux ?", a: "Le jeu des petits chevaux" },
            { q: "Dans le Monopoly, quelle couleur est la rue de la Paix ?", a: "Bleu foncé" },
            { q: "Combien de cartes y a-t-il dans un jeu de 52 cartes ?", a: "52" },
            { q: "Quel jeu de plateau simule l'achat immobilier ?", a: "Le Monopoly" },
            { q: "Dans le Scrabble, combien vaut la lettre Z ?", a: "10 points" },
            { q: "Quel jeu de cartes se joue avec 7 familles ?", a: "Le jeu des 7 familles" },
            { q: "Qui a inventé le Rubik's Cube ?", a: "Ernő Rubik" },
            { q: "Dans les échecs, quel est le seul coup où on déplace 2 pièces ?", a: "Le roque" },
            { q: "Quel est le jeu de société le plus vendu au monde ?", a: "Le Monopoly" }
        ]
    },
    {
        name: '🐶🐱 Chiens & chats',
        questions: [
            { q: "Quel animal miaule ?", a: "Le chat" },
            { q: "Combien de pattes a un chien ?", a: "4" },
            { q: "Comment s'appelle le bébé du chat ?", a: "Le chaton" },
            { q: "Quelle race de chien a de longues oreilles tombantes ?", a: "Le basset" },
            { q: "Les chats voient-ils dans le noir ?", a: "Oui (vision nocturne)" },
            { q: "Quel est le chien le plus rapide ?", a: "Le lévrier" },
            { q: "Combien de dents a un chat adulte ?", a: "30" },
            { q: "Quelle race de chat n'a pas de poils ?", a: "Le Sphynx" },
            { q: "Quel est le plus petit chien du monde ?", a: "Le Chihuahua" },
            { q: "Combien d'heures par jour un chat dort-il en moyenne ?", a: "12 à 16 heures" }
        ]
    },
    {
        name: '⚽ Football',
        questions: [
            { q: "Combien de joueurs y a-t-il dans une équipe de foot ?", a: "11" },
            { q: "De quelle couleur est le carton pour une expulsion ?", a: "Rouge" },
            { q: "Comment s'appelle le gardien de but ?", a: "Le gardien ou goalkeeper" },
            { q: "Qui a gagné la Coupe du monde 2018 ?", a: "La France" },
            { q: "Quel pays a gagné le plus de Coupes du monde ?", a: "Le Brésil" },
            { q: "Combien dure un match de football ?", a: "90 minutes" },
            { q: "Quel joueur a le plus de Ballons d'Or ?", a: "Lionel Messi" },
            { q: "En quelle année a eu lieu la première Coupe du monde ?", a: "1930" },
            { q: "Quel club a gagné le plus de Ligues des Champions ?", a: "Le Real Madrid" },
            { q: "Qui est le meilleur buteur de l'histoire de la Coupe du monde ?", a: "Miroslav Klose" }
        ]
    },
    {
        name: '🎮 Jeux vidéo',
        questions: [
            { q: "Quel plombier saute sur des champignons ?", a: "Mario" },
            { q: "Dans quel jeu construit-on avec des blocs ?", a: "Minecraft" },
            { q: "Quel hérisson bleu court très vite ?", a: "Sonic" },
            { q: "Qui a créé Pokémon ?", a: "Satoshi Tajiri" },
            { q: "Quel jeu se passe dans la région de Hyrule ?", a: "The Legend of Zelda" },
            { q: "Quelle console a sorti la Wii ?", a: "Nintendo" },
            { q: "Quel est le jeu vidéo le plus vendu de tous les temps ?", a: "Minecraft" },
            { q: "En quelle année est sorti le premier Mario ?", a: "1981" },
            { q: "Quel jeu vidéo a créé le genre Battle Royale ?", a: "PUBG ou Fortnite" },
            { q: "Qui est le créateur de Metal Gear Solid ?", a: "Hideo Kojima" }
        ]
    },
    {
        name: '🍔 Nourriture',
        questions: [
            { q: "De quelle couleur est la tomate ?", a: "Rouge" },
            { q: "Quel fruit est jaune et courbé ?", a: "La banane" },
            { q: "Quel fromage est utilisé sur la pizza ?", a: "La mozzarella" },
            { q: "Quel pays a inventé les sushis ?", a: "Le Japon" },
            { q: "Quel est l'ingrédient principal du guacamole ?", a: "L'avocat" },
            { q: "Combien de calories dans un Big Mac environ ?", a: "Environ 500-550" },
            { q: "Quelle ville est réputée pour sa pizza ?", a: "Naples" },
            { q: "Quel chef français a 21 étoiles Michelin ?", a: "Alain Ducasse" },
            { q: "Quel est le plat national du Japon ?", a: "Le riz (ou les sushis)" },
            { q: "Quel fruit a le plus de vitamine C ?", a: "La goyave ou l'acérola" }
        ]
    },
    {
        name: '🎬 Films français',
        questions: [
            { q: "Qui joue dans 'Astérix et Obélix : Mission Cléopâtre' ?", a: "Jamel Debbouze, Gérard Depardieu" },
            { q: "Quel film parle d'une fille qui améliore la vie des gens ?", a: "Le Fabuleux Destin d'Amélie Poulain" },
            { q: "Qui a réalisé 'La Haine' ?", a: "Mathieu Kassovitz" },
            { q: "Quel acteur français a joué dans Léon ?", a: "Jean Reno" },
            { q: "Dans quel film dit-on 'La cité de la peur' ?", a: "La Cité de la peur" },
            { q: "Qui a composé la musique d'Amélie Poulain ?", a: "Yann Tiersen" },
            { q: "Quel film a gagné la Palme d'Or en 2008 ?", a: "Entre les murs" },
            { q: "Qui joue le rôle de Jean Moulin dans 'L'Armée des ombres' ?", a: "Jean-Pierre Cassel" },
            { q: "Quel réalisateur a fait 'Les Visiteurs' ?", a: "Jean-Marie Poiré" },
            { q: "Combien de César a reçu 'Intouchables' ?", a: "1 César" }
        ]
    },
    {
        name: '🎵 Musique',
        questions: [
            { q: "Combien de cordes a une guitare classique ?", a: "6" },
            { q: "Qui chante 'Formidable' ?", a: "Stromae" },
            { q: "Quel instrument a des touches blanches et noires ?", a: "Le piano" },
            { q: "Qui est le roi de la pop ?", a: "Michael Jackson" },
            { q: "Quel groupe britannique a chanté 'Bohemian Rhapsody' ?", a: "Queen" },
            { q: "Combien de notes y a-t-il dans une gamme ?", a: "7" },
            { q: "Qui a composé 'La Lettre à Elise' ?", a: "Beethoven" },
            { q: "Quel rappeur français a sorti 'Bande organisée' ?", a: "Jul, SCH, Naps, Kofs, Elams, Solda, Houari, Soso Maness" },
            { q: "Quelle chanteuse française a chanté 'La Vie en rose' ?", a: "Édith Piaf" },
            { q: "Qui a gagné l'Eurovision 2021 ?", a: "Måneskin (Italie)" }
        ]
    }
];

// 12 types de bonus différents
const BONUS_TYPES = [
    { name: "Double Points", description: "Les points de la prochaine question sont doublés !", effect: "doublePoints" },
    { name: "Bouclier", description: "Protection contre la prochaine erreur", effect: "shield" },
    { name: "Vol de Points", description: "Vole 5 points à l'équipe de votre choix", effect: "stealPoints" },
    { name: "Question Bonus", description: "Répond à une question supplémentaire immédiatement", effect: "bonusQuestion" },
    { name: "Passe ton Tour", description: "Force une autre équipe à passer son tour", effect: "skipTurn" },
    { name: "Échange", description: "Échange ton score avec une autre équipe", effect: "swapScores" },
    { name: "Révélation", description: "Révèle la réponse avant de répondre", effect: "revealAnswer" },
    { name: "Choix Multiple", description: "Transforme la question en QCM avec 3 choix", effect: "multipleChoice" },
    { name: "Temps Bonus", description: "2x plus de temps pour répondre à la prochaine question", effect: "extraTime" },
    { name: "Joker 50/50", description: "Élimine 2 mauvaises réponses (mode QCM)", effect: "fiftyFifty" },
    { name: "Sabotage", description: "Fait perdre 3 points à tous les adversaires", effect: "sabotage" },
    { name: "Jackpot", description: "Gagne instantanément 10 points", effect: "jackpot" }
];

// État global du jeu
let gameState = {
    teams: [],
    wagons: [],
    selectedThemes: [],
    currentTeamIndex: 0,
    selectedWagonIndex: null,
    currentQuestion: null,
    gameStarted: false,
    screenLaunched: false,
    wagonDepth: 10,
    qualificationThreshold: 50,
    timerDuration: 10,
    history: [],
    tempPoints: {} // Points temporaires non banqués par équipe
};

// Configuration des paliers (tiers) - CORRIGÉ
const TIER_CONFIG = [
    { points: 1 }, // Questions 0-2
    { points: 2 }, // Questions 3-5
    { points: 3 }, // Questions 6-8
    { points: 5 }  // Question 9
];

// Fonction pour calculer les points d'une question - CORRIGÉ
function getPointsForQuestion(questionIndex) {
    if (questionIndex < 3) return 1;
    if (questionIndex < 6) return 2;
    if (questionIndex < 9) return 3;
    return 5;
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('Régie initialisée');
    initEventListeners();
    renderThemes();
    updateDisplay();
    
    // Écouter les messages de l'écran de jeu
    gameChannel.addEventListener('message', handleGameMessage);
});

function handleGameMessage(event) {
    const { type } = event.data;
    
    if (type === 'REQUEST_STATE') {
        broadcastState();
    } else if (type === 'PING') {
        updateConnectionStatus(true);
    }
}

function initEventListeners() {
    // Configuration
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('launch-screen-btn').addEventListener('click', launchScreen);
    document.getElementById('wagon-depth').addEventListener('change', (e) => {
        gameState.wagonDepth = parseInt(e.target.value);
    });
    document.getElementById('qualification-threshold').addEventListener('change', (e) => {
        gameState.qualificationThreshold = parseInt(e.target.value);
    });
    document.getElementById('timer-duration').addEventListener('change', (e) => {
        gameState.timerDuration = parseInt(e.target.value);
    });
    
    // Équipes
    document.getElementById('add-team-btn').addEventListener('click', addTeam);
    document.getElementById('random-order-btn').addEventListener('click', randomizeTeamOrder);
    document.getElementById('team-name-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTeam();
    });
    
    // Thèmes
    document.getElementById('validate-themes-btn').addEventListener('click', validateThemes);
    
    // Actions de jeu
    document.getElementById('correct-btn').addEventListener('click', () => answerQuestion(true));
    document.getElementById('wrong-btn').addEventListener('click', () => answerQuestion(false));
    document.getElementById('show-answer-btn').addEventListener('click', showAnswerOnScreen);
    document.getElementById('start-timer-btn').addEventListener('click', startTimer);
    document.getElementById('skip-question-btn').addEventListener('click', skipQuestion);
    document.getElementById('close-question-btn').addEventListener('click', closeQuestion);
    document.getElementById('bank-points-btn').addEventListener('click', bankPoints);
    document.getElementById('next-team-btn').addEventListener('click', nextTeam);
    document.getElementById('reset-wagon-btn').addEventListener('click', resetSelectedWagon);
    document.getElementById('show-results-btn').addEventListener('click', showResults);
    document.getElementById('trigger-bonus-btn').addEventListener('click', triggerRandomBonus);
    document.getElementById('apply-manual-score-btn').addEventListener('click', applyManualScore);
    document.getElementById('undo-btn').addEventListener('click', undoLastAction);
}

// ===== GESTION DES ÉQUIPES =====
function addTeam() {
    const nameInput = document.getElementById('team-name-input');
    const colorInput = document.getElementById('team-color-input');
    
    const name = nameInput.value.trim();
    if (!name) {
        alert('Entrez un nom d\'équipe');
        return;
    }
    
    const team = {
        name: name,
        color: colorInput.value,
        score: 0,
        bonusCount: 3,
        qualified: false,
        activeBonus: null
    };
    
    gameState.teams.push(team);
    gameState.tempPoints[name] = 0; // Initialiser les points temporaires
    nameInput.value = '';
    colorInput.value = getRandomColor();
    
    updateTeamsList();
    updateManualTeamSelect();
    addToHistory(`Équipe "${name}" ajoutée`);
}

function removeTeam(index) {
    const team = gameState.teams[index];
    delete gameState.tempPoints[team.name];
    gameState.teams.splice(index, 1);
    updateTeamsList();
    updateManualTeamSelect();
    addToHistory(`Équipe "${team.name}" supprimée`);
}

function randomizeTeamOrder() {
    gameState.teams.sort(() => Math.random() - 0.5);
    updateTeamsList();
    addToHistory('Ordre des équipes mélangé');
}

function updateTeamsList() {
    const list = document.getElementById('teams-list');
    list.innerHTML = '';
    
    if (gameState.teams.length === 0) {
        list.innerHTML = '<em style="color: #666;">Aucune équipe ajoutée</em>';
        return;
    }
    
    gameState.teams.forEach((team, index) => {
        const teamItem = document.createElement('div');
        teamItem.className = 'team-item';
        if (index === gameState.currentTeamIndex && gameState.gameStarted) {
            teamItem.classList.add('active-turn');
        }
        
        const qualifiedText = team.qualified ? '<span class="team-qualified">✓ QUALIFIÉ</span>' : '';
        const tempPts = gameState.tempPoints[team.name] || 0;
        const tempText = tempPts > 0 ? ` (+${tempPts} en attente)` : '';
        
        teamItem.innerHTML = `
            <div class="team-color-indicator" style="background: ${team.color};"></div>
            <div class="team-info">
                <div class="team-name-display">${team.name}</div>
                <div class="team-stats">
                    <span>Score: <span class="team-score-value">${team.score}</span>${tempText}</span>
                    <span class="team-bonus-count">🎁 ${team.bonusCount}</span>
                    ${qualifiedText}
                </div>
            </div>
            <div class="team-actions">
                <button class="btn-icon btn-primary" onclick="moveTeam(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
                <button class="btn-icon btn-primary" onclick="moveTeam(${index}, 1)" ${index === gameState.teams.length - 1 ? 'disabled' : ''}>↓</button>
                <button class="btn-icon btn-danger" onclick="removeTeam(${index})">✕</button>
            </div>
        `;
        
        list.appendChild(teamItem);
    });
}

function moveTeam(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= gameState.teams.length) return;
    
    [gameState.teams[index], gameState.teams[newIndex]] = [gameState.teams[newIndex], gameState.teams[index]];
    updateTeamsList();
    addToHistory(`Ordre d'équipe modifié`);
}

// ===== GESTION DES THÈMES =====
function renderThemes() {
    const container = document.getElementById('themes-available');
    container.innerHTML = '';
    
    AVAILABLE_THEMES.forEach((theme, index) => {
        const themeDiv = document.createElement('div');
        themeDiv.className = 'theme-option';
        themeDiv.textContent = theme.name;
        themeDiv.dataset.index = index;
        
        themeDiv.addEventListener('click', () => toggleTheme(index));
        container.appendChild(themeDiv);
    });
}

function toggleTheme(index) {
    const themeIndex = gameState.selectedThemes.indexOf(index);
    
    if (themeIndex > -1) {
        gameState.selectedThemes.splice(themeIndex, 1);
    } else {
        if (gameState.selectedThemes.length >= 6) {
            alert('Maximum 6 thèmes');
            return;
        }
        gameState.selectedThemes.push(index);
    }
    
    updateThemesDisplay();
}

function updateThemesDisplay() {
    const options = document.querySelectorAll('.theme-option');
    options.forEach((opt, index) => {
        if (gameState.selectedThemes.includes(index)) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    
    const display = document.getElementById('selected-themes-display');
    if (gameState.selectedThemes.length === 0) {
        display.innerHTML = '<em>Sélectionnez 6 thèmes...</em>';
    } else {
        display.innerHTML = '';
        gameState.selectedThemes.forEach(index => {
            const tag = document.createElement('span');
            tag.className = 'selected-theme-tag';
            tag.textContent = AVAILABLE_THEMES[index].name;
            display.appendChild(tag);
        });
    }
    
    const validateBtn = document.getElementById('validate-themes-btn');
    validateBtn.disabled = gameState.selectedThemes.length !== 6;
}

function validateThemes() {
    if (gameState.selectedThemes.length !== 6) {
        alert('Sélectionnez exactement 6 thèmes');
        return;
    }
    
    createWagons();
    updateWagonsGrid();
    addToHistory('Thèmes validés et wagons créés');
    
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.add('disabled');
        opt.style.pointerEvents = 'none';
    });
}

function createWagons() {
    gameState.wagons = [];
    
    gameState.selectedThemes.forEach(themeIndex => {
        const theme = AVAILABLE_THEMES[themeIndex];
        const wagon = {
            theme: theme.name,
            questions: [...theme.questions],
            depth: gameState.wagonDepth,
            currentLevel: 0,
            bankedLevels: Array(gameState.wagonDepth).fill(false),
            bankedBy: Array(gameState.wagonDepth).fill(null),
            lastBankedTeam: null,
            tiers: TIER_CONFIG
        };
        
        gameState.wagons.push(wagon);
    });
}

// ===== DÉMARRAGE DU JEU =====
function startGame() {
    if (gameState.teams.length < 2) {
        alert('Ajoutez au moins 2 équipes');
        return;
    }
    
    if (gameState.selectedThemes.length !== 6) {
        alert('Validez d\'abord les 6 thèmes');
        return;
    }
    
    gameState.gameStarted = true;
    gameState.currentTeamIndex = 0;
    
    document.getElementById('config-panel').classList.add('disabled');
    document.getElementById('teams-panel').classList.add('disabled');
    document.getElementById('themes-panel').classList.add('disabled');
    document.getElementById('launch-screen-btn').style.display = 'block';
    
    updateDisplay();
    addToHistory('🎮 JEU DÉMARRÉ !');
    broadcastState();
    
    alert('Jeu démarré ! Cliquez sur "LANCER SUR L\'ÉCRAN" puis sélectionnez un wagon.');
}

function launchScreen() {
    gameState.screenLaunched = true;
    
    gameChannel.postMessage({
        type: 'GAME_STARTED',
        data: gameState
    });
    
    addToHistory('📺 Jeu lancé sur l\'écran');
    alert('Jeu lancé sur l\'écran ! Sélectionnez maintenant un wagon.');
}

// ===== AFFICHAGE DES WAGONS =====
function updateWagonsGrid() {
    const grid = document.getElementById('wagons-grid');
    grid.innerHTML = '';
    
    if (gameState.wagons.length === 0) {
        grid.innerHTML = '<em style="color: #666; grid-column: 1/-1;">Validez les thèmes pour créer les wagons</em>';
        return;
    }
    
    gameState.wagons.forEach((wagon, index) => {
        const card = document.createElement('div');
        card.className = 'wagon-card';
        card.dataset.wagonId = index;
        
        if (index === gameState.selectedWagonIndex) {
            card.classList.add('selected-wagon');
        }
        
        if (wagon.currentLevel >= wagon.depth) {
            card.classList.add('completed');
        }
        
        card.addEventListener('click', () => selectWagon(index));
        
        const miniWindows = document.createElement('div');
        miniWindows.className = 'wagon-windows-mini';
        for (let i = 0; i < wagon.depth; i++) {
            const mini = document.createElement('div');
            mini.className = 'mini-window';
            if (wagon.bankedLevels[i]) {
                mini.classList.add('filled');
                mini.style.background = wagon.bankedBy[i];
            }
            miniWindows.appendChild(mini);
        }
        
        card.innerHTML = `
            <div class="wagon-theme">${wagon.theme}</div>
            <div class="wagon-progress">${wagon.currentLevel}/${wagon.depth}</div>
        `;
        card.appendChild(miniWindows);
        
        grid.appendChild(card);
    });
}

function selectWagon(index) {
    if (!gameState.gameStarted) {
        alert('Démarrez d\'abord le jeu');
        return;
    }
    
    if (!gameState.screenLaunched) {
        alert('Lancez d\'abord l\'écran avec le bouton "LANCER SUR L\'ÉCRAN"');
        return;
    }
    
    gameState.selectedWagonIndex = index;
    updateWagonsGrid();
    
    const wagon = gameState.wagons[index];
    if (wagon.currentLevel < wagon.depth) {
        displayQuestion(index, wagon.currentLevel);
    } else {
        alert('Ce wagon est terminé !');
    }
}

// ===== AFFICHAGE D'UNE QUESTION =====
function displayQuestion(wagonIndex, questionIndex) {
    const wagon = gameState.wagons[wagonIndex];
    const question = wagon.questions[questionIndex];
    
    if (!question) {
        alert('Plus de questions dans ce wagon');
        return;
    }
    
    const points = getPointsForQuestion(questionIndex);
    
    gameState.currentQuestion = {
        wagonIndex,
        questionIndex,
        question: question.q,
        answer: question.a,
        points,
        answered: false
    };
    
    // Afficher dans le panel avec LA RÉPONSE VISIBLE
    document.getElementById('question-panel').classList.remove('hidden');
    document.getElementById('current-question-text').textContent = question.q;
    document.getElementById('current-answer-text').textContent = question.a;
    document.getElementById('current-points-display').textContent = `+${points} pts`;
    document.getElementById('answer-display').classList.add('visible'); // TOUJOURS VISIBLE
    
    // Broadcast à l'écran de jeu
    gameChannel.postMessage({
        type: 'SHOW_QUESTION',
        data: {
            theme: wagon.theme,
            question: question.q,
            questionNum: questionIndex + 1,
            points: points
        }
    });
    
    addToHistory(`Question posée: ${wagon.theme} - Q${questionIndex + 1} (+${points}pts)`);
}

function showAnswerOnScreen() {
    if (gameState.currentQuestion) {
        gameChannel.postMessage({
            type: 'SHOW_ANSWER',
            data: {
                answer: gameState.currentQuestion.answer
            }
        });
        addToHistory('Réponse affichée à l\'écran');
    }
}

function startTimer() {
    const duration = gameState.timerDuration;
    
    gameChannel.postMessage({
        type: 'START_TIMER',
        data: {
            seconds: duration
        }
    });
    
    addToHistory(`⏱️ Timer de ${duration}s lancé`);
}

function answerQuestion(isCorrect) {
    if (!gameState.currentQuestion || gameState.currentQuestion.answered) {
        return;
    }
    
    const { wagonIndex, questionIndex, points } = gameState.currentQuestion;
    const wagon = gameState.wagons[wagonIndex];
    const currentTeam = gameState.teams[gameState.currentTeamIndex];
    
    gameState.currentQuestion.answered = true;
    
    // Arrêter le timer
    gameChannel.postMessage({ type: 'STOP_TIMER' });
    
    if (isCorrect) {
        // Bonne réponse
        wagon.currentLevel = questionIndex + 1;
        
        // Ajouter aux points temporaires
        if (!gameState.tempPoints[currentTeam.name]) {
            gameState.tempPoints[currentTeam.name] = 0;
        }
        gameState.tempPoints[currentTeam.name] += points;
        
        addToHistory(`✓ ${currentTeam.name} répond correctement (+${points} pts temporaires)`);
        updateTeamsList();
        
        alert(`Bonne réponse ! +${points} pts temporaires pour ${currentTeam.name}\n\nVous pouvez:\n- Continuer avec une autre question\n- Cliquer sur BANQUER pour sécuriser les points`);
    } else {
        // Mauvaise réponse - perd les points temporaires
        const lostPoints = gameState.tempPoints[currentTeam.name] || 0;
        gameState.tempPoints[currentTeam.name] = 0;
        
        addToHistory(`✗ ${currentTeam.name} répond incorrectement (perd ${lostPoints} pts temporaires)`);
        updateTeamsList();
        
        alert(`Mauvaise réponse ! ${currentTeam.name} perd ${lostPoints} points temporaires.`);
        
        // Passer au joueur suivant
        nextTeam();
    }
    
    closeQuestion();
    updateWagonInGame(wagonIndex);
}

function skipQuestion() {
    closeQuestion();
    gameChannel.postMessage({ type: 'STOP_TIMER' });
    addToHistory('Question passée');
}

function closeQuestion() {
    document.getElementById('question-panel').classList.add('hidden');
    gameState.currentQuestion = null;
    
    gameChannel.postMessage({
        type: 'HIDE_QUESTION'
    });
}

// ===== BANKING DES POINTS =====
function bankPoints() {
    if (gameState.selectedWagonIndex === null) {
        alert('Sélectionnez un wagon');
        return;
    }
    
    const wagon = gameState.wagons[gameState.selectedWagonIndex];
    const currentTeam = gameState.teams[gameState.currentTeamIndex];
    
    const tempPoints = gameState.tempPoints[currentTeam.name] || 0;
    
    if (tempPoints === 0) {
        alert('Aucun point temporaire à banquer');
        return;
    }
    
    // Banquer les points
    for (let i = 0; i < wagon.currentLevel; i++) {
        if (!wagon.bankedLevels[i]) {
            wagon.bankedLevels[i] = true;
            wagon.bankedBy[i] = currentTeam.color;
        }
    }
    
    wagon.lastBankedTeam = currentTeam.name;
    currentTeam.score += tempPoints;
    gameState.tempPoints[currentTeam.name] = 0; // Réinitialiser les points temporaires
    
    // Vérifier qualification
    if (currentTeam.score >= gameState.qualificationThreshold && !currentTeam.qualified) {
        currentTeam.qualified = true;
        alert(`🎉 ${currentTeam.name} est QUALIFIÉ !`);
    }
    
    addToHistory(`💰 ${currentTeam.name} banque ${tempPoints} points (Total: ${currentTeam.score})`);
    
    updateWagonInGame(gameState.selectedWagonIndex);
    updateTeamScore(currentTeam);
    updateTeamsList();
    nextTeam();
}

// ===== ÉQUIPE SUIVANTE =====
function nextTeam() {
    // Réinitialiser les points temporaires de l'équipe actuelle
    const currentTeam = gameState.teams[gameState.currentTeamIndex];
    gameState.tempPoints[currentTeam.name] = 0;
    
    gameState.currentTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
    
    gameChannel.postMessage({
        type: 'NEXT_TURN',
        data: {
            teamIndex: gameState.currentTeamIndex
        }
    });
    
    updateDisplay();
}

// ===== RESET WAGON =====
function resetSelectedWagon() {
    if (gameState.selectedWagonIndex === null) {
        alert('Sélectionnez un wagon');
        return;
    }
    
    if (!confirm('Réinitialiser ce wagon ?')) {
        return;
    }
    
    const wagon = gameState.wagons[gameState.selectedWagonIndex];
    wagon.currentLevel = 0;
    wagon.bankedLevels = Array(wagon.depth).fill(false);
    wagon.bankedBy = Array(wagon.depth).fill(null);
    wagon.lastBankedTeam = null;
    
    updateWagonInGame(gameState.selectedWagonIndex);
    addToHistory(`Wagon "${wagon.theme}" réinitialisé`);
}

// ===== BONUS =====
function triggerRandomBonus() {
    const currentTeam = gameState.teams[gameState.currentTeamIndex];
    
    if (currentTeam.bonusCount <= 0) {
        alert('Cette équipe n\'a plus de bonus');
        return;
    }
    
    const bonus = BONUS_TYPES[Math.floor(Math.random() * BONUS_TYPES.length)];
    currentTeam.bonusCount--;
    
    gameChannel.postMessage({
        type: 'SHOW_BONUS',
        data: {
            teamName: currentTeam.name,
            bonus: bonus
        }
    });
    
    addToHistory(`🎁 Bonus "${bonus.name}" activé pour ${currentTeam.name}`);
    applyBonus(bonus, currentTeam);
    updateTeamsList();
}

function applyBonus(bonus, team) {
    switch(bonus.effect) {
        case 'jackpot':
            team.score += 10;
            updateTeamScore(team);
            break;
        case 'sabotage':
            gameState.teams.forEach(t => {
                if (t !== team) {
                    t.score = Math.max(0, t.score - 3);
                    updateTeamScore(t);
                }
            });
            break;
        default:
            alert(`Bonus "${bonus.name}" activé ! Appliquez l'effet manuellement.`);
    }
}

// ===== RÉSULTATS =====
function showResults() {
    const results = gameState.teams
        .map(team => ({ ...team }))
        .sort((a, b) => b.score - a.score)
        .map((team, index) => ({
            ...team,
            rank: index + 1,
            qualified: team.qualified,
            eliminated: index === gameState.teams.length - 1
        }));
    
    gameChannel.postMessage({
        type: 'SHOW_RESULTS',
        data: {
            results: results
        }
    });
    
    addToHistory('🏆 Résultats affichés');
}

// ===== CORRECTIONS MANUELLES =====
function updateManualTeamSelect() {
    const select = document.getElementById('manual-team-select');
    select.innerHTML = '<option>Sélectionner...</option>';
    
    gameState.teams.forEach((team, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = team.name;
        select.appendChild(option);
    });
}

function applyManualScore() {
    const select = document.getElementById('manual-team-select');
    const adjust = parseInt(document.getElementById('manual-score-adjust').value);
    
    if (select.value === 'Sélectionner...') {
        alert('Sélectionnez une équipe');
        return;
    }
    
    const teamIndex = parseInt(select.value);
    const team = gameState.teams[teamIndex];
    team.score += adjust;
    team.score = Math.max(0, team.score);
    
    updateTeamScore(team);
    updateTeamsList();
    addToHistory(`Correction manuelle: ${team.name} ${adjust > 0 ? '+' : ''}${adjust} pts`);
    
    document.getElementById('manual-score-adjust').value = 0;
}

// ===== HISTORIQUE =====
function addToHistory(action) {
    const timestamp = new Date().toLocaleTimeString();
    gameState.history.push({ action, timestamp, state: JSON.stringify(gameState) });
    
    updateHistoryDisplay();
    
    if (gameState.history.length > 50) {
        gameState.history.shift();
    }
}

function updateHistoryDisplay() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    
    if (gameState.history.length === 0) {
        list.innerHTML = '<em>Aucune action pour le moment...</em>';
        return;
    }
    
    const recentHistory = gameState.history.slice(-10).reverse();
    recentHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="history-action">${entry.action}</div>
            <div class="history-timestamp">${entry.timestamp}</div>
        `;
        list.appendChild(item);
    });
    
    document.getElementById('undo-btn').disabled = gameState.history.length === 0;
}

function undoLastAction() {
    if (gameState.history.length < 2) {
        alert('Pas d\'action à annuler');
        return;
    }
    
    gameState.history.pop();
    
    const previousState = gameState.history[gameState.history.length - 1];
    const restoredState = JSON.parse(previousState.state);
    
    const currentHistory = gameState.history;
    Object.assign(gameState, restoredState);
    gameState.history = currentHistory;
    
    updateDisplay();
    broadcastState();
    addToHistory('⟲ Action annulée');
    
    alert('Dernière action annulée');
}

// ===== BROADCAST =====
function broadcastState() {
    gameChannel.postMessage({
        type: 'STATE_UPDATE',
        data: gameState
    });
}

function updateWagonInGame(wagonIndex) {
    gameChannel.postMessage({
        type: 'WAGON_UPDATED',
        data: {
            wagonIndex: wagonIndex,
            wagon: gameState.wagons[wagonIndex]
        }
    });
}

function updateTeamScore(team) {
    gameChannel.postMessage({
        type: 'TEAM_SCORED',
        data: {
            teamName: team.name,
            score: team.score,
            qualified: team.qualified
        }
    });
}

// ===== MISE À JOUR GÉNÉRALE =====
function updateDisplay() {
    updateTeamsList();
    updateWagonsGrid();
    updateCurrentTurnDisplay();
    updateBonusList();
}

function updateCurrentTurnDisplay() {
    const display = document.getElementById('current-turn-display');
    if (gameState.gameStarted && gameState.teams.length > 0) {
        const currentTeam = gameState.teams[gameState.currentTeamIndex];
        display.innerHTML = `<strong>Tour de: <span style="color: ${currentTeam.color}">${currentTeam.name}</span></strong>`;
    } else {
        display.textContent = 'En attente...';
    }
}

function updateBonusList() {
    const list = document.getElementById('bonus-list');
    list.innerHTML = '';
    
    BONUS_TYPES.slice(0, 5).forEach(bonus => {
        const item = document.createElement('div');
        item.className = 'bonus-item';
        item.innerHTML = `
            <div>
                <div class="bonus-name">${bonus.name}</div>
                <div class="bonus-description">${bonus.description}</div>
            </div>
        `;
        list.appendChild(item);
    });
}

// ===== CONNEXION =====
function updateConnectionStatus(connected) {
    const dot = document.getElementById('connection-dot');
    const text = document.getElementById('connection-text');
    
    if (connected) {
        dot.classList.add('connected');
        text.textContent = 'Écran de jeu connecté';
    } else {
        dot.classList.remove('connected');
        text.textContent = 'Écran de jeu non connecté';
    }
}

// ===== UTILITAIRES =====
function getRandomColor() {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Rendre les fonctions globales accessibles
window.removeTeam = removeTeam;
window.moveTeam = moveTeam;
