// Communication entre les fenêtres
const gameChannel = new BroadcastChannel('wagon_game_channel');

// Effets sonores
const sfxTimer = document.getElementById('sfx-timer');
const sfxSelected = document.getElementById('sfx-selected');

// État du jeu
let gameState = {
    teams: [],
    wagons: [],
    currentTeamIndex: 0,
    currentQuestion: null,
    gameStarted: false
};

// Timer
let timerInterval = null;
let timerSeconds = 10;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('Écran de jeu initialisé');
    updateConnectionStatus(false);
    
    // Demander l'état initial
    gameChannel.postMessage({ type: 'REQUEST_STATE' });
});

// Écouter les messages de la régie
gameChannel.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    console.log('Message reçu:', type, data);
    
    switch(type) {
        case 'STATE_UPDATE':
            gameState = data;
            updateDisplay();
            updateConnectionStatus(true);
            break;
            
        case 'GAME_STARTED':
            gameState = data;
            gameState.gameStarted = true;
            updateDisplay();
            playSound(sfxSelected);
            break;
            
        case 'SHOW_QUESTION':
            showQuestion(data);
            break;
            
        case 'SHOW_ANSWER':
            showAnswer(data.answer);
            break;
            
        case 'HIDE_QUESTION':
            hideQuestion();
            break;
            
        case 'WAGON_UPDATED':
            updateWagon(data);
            break;
            
        case 'TEAM_SCORED':
            updateTeamScore(data);
            break;
            
        case 'SHOW_BONUS':
            showBonus(data);
            break;
            
        case 'SHOW_RESULTS':
            showResults(data);
            break;
            
        case 'NEXT_TURN':
            gameState.currentTeamIndex = data.teamIndex;
            updateDisplay();
            playSound(sfxSelected);
            break;
            
        case 'START_TIMER':
            startTimer(data.seconds || 10);
            break;
            
        case 'STOP_TIMER':
            stopTimer();
            break;
    }
});

// Sons
function playSound(audio) {
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Erreur lecture audio:', e));
    }
}

function stopSound(audio) {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

// Timer
function startTimer(seconds) {
    stopTimer(); // Arrêter le timer précédent
    
    timerSeconds = seconds;
    const timerOverlay = document.getElementById('timer-overlay');
    const timerNumber = document.getElementById('timer-number');
    const timerProgress = document.getElementById('timer-progress');
    
    timerOverlay.classList.add('show');
    timerNumber.textContent = timerSeconds;
    
    // Jouer le son du timer
    playSound(sfxTimer);
    
    const circumference = 2 * Math.PI * 90; // rayon = 90
    timerProgress.style.strokeDasharray = circumference;
    timerProgress.style.strokeDashoffset = 0;
    
    timerInterval = setInterval(() => {
        timerSeconds--;
        timerNumber.textContent = timerSeconds;
        
        // Mise à jour du cercle
        const offset = circumference * (1 - timerSeconds / seconds);
        timerProgress.style.strokeDashoffset = offset;
        
        // Changer la couleur quand il reste 3 secondes
        if (timerSeconds <= 3) {
            timerProgress.classList.add('warning');
        }
        
        if (timerSeconds <= 0) {
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    const timerOverlay = document.getElementById('timer-overlay');
    const timerProgress = document.getElementById('timer-progress');
    
    timerOverlay.classList.remove('show');
    timerProgress.classList.remove('warning');
    
    // Arrêter le son du timer
    stopSound(sfxTimer);
}

// Mettre à jour l'affichage complet
function updateDisplay() {
    updateTeamsScoreboard();
    updateWagonsGrid();
}

// Mettre à jour le tableau des scores
function updateTeamsScoreboard() {
    const scoreboard = document.getElementById('teams-scoreboard');
    scoreboard.innerHTML = '';
    
    gameState.teams.forEach((team, index) => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-score-display';
        if (index === gameState.currentTeamIndex) {
            teamDiv.classList.add('active');
        }
        
        teamDiv.style.borderColor = team.color;
        
        let qualifiedText = '';
        if (team.qualified) {
            qualifiedText = '<div class="team-score-qualified">✓ QUALIFIÉ</div>';
        }
        
        teamDiv.innerHTML = `
            <div class="team-score-name" style="color: ${team.color}">${team.name}</div>
            <div class="team-score-points">${team.score} pts</div>
            ${qualifiedText}
        `;
        
        scoreboard.appendChild(teamDiv);
    });
}

// Mettre à jour la grille des wagons
function updateWagonsGrid() {
    const grid = document.getElementById('wagons-grid');
    grid.innerHTML = '';
    
    if (gameState.wagons.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #666; font-size: 1.5rem;">En attente des wagons...</div>';
        return;
    }
    
    gameState.wagons.forEach((wagon, wagonIndex) => {
        const wagonDiv = document.createElement('div');
        wagonDiv.className = 'wagon';
        wagonDiv.dataset.wagonId = wagonIndex;
        
        // Header du wagon
        const header = document.createElement('div');
        header.className = 'wagon-header';
        header.textContent = wagon.theme;
        wagonDiv.appendChild(header);
        
        // Fenêtres du wagon
        const windowsContainer = document.createElement('div');
        windowsContainer.className = 'wagon-windows';
        
        for (let i = 0; i < wagon.depth; i++) {
            const window = document.createElement('div');
            window.className = 'window';
            
            // Calculer les points pour cette fenêtre
            const tierIndex = Math.floor(i / 3);
            const tier = wagon.tiers[tierIndex] || wagon.tiers[wagon.tiers.length - 1];
            
            if (wagon.bankedLevels[i]) {
                // Fenêtre banquée
                window.classList.add('banked');
                window.style.background = wagon.bankedBy[i];
                window.style.borderColor = wagon.bankedBy[i];
                window.style.boxShadow = `0 0 20px ${wagon.bankedBy[i]}`;
                window.textContent = tier.points;
            } else if (wagon.currentLevel > i) {
                // Fenêtre en cours (jaune)
                window.classList.add('active');
                window.textContent = tier.points;
            } else {
                // Fenêtre vide
                window.textContent = tier.points;
            }
            
            windowsContainer.appendChild(window);
        }
        wagonDiv.appendChild(windowsContainer);
        
        // Info du wagon
        const info = document.createElement('div');
        info.className = 'wagon-info';
        
        const progress = document.createElement('div');
        progress.className = 'wagon-progress';
        progress.textContent = `Progression: ${wagon.currentLevel}/${wagon.depth}`;
        info.appendChild(progress);
        
        if (wagon.lastBankedTeam) {
            const bankedBy = document.createElement('div');
            bankedBy.className = 'wagon-banked-by';
            bankedBy.textContent = `Dernier: ${wagon.lastBankedTeam}`;
            info.appendChild(bankedBy);
        }
        
        wagonDiv.appendChild(info);
        grid.appendChild(wagonDiv);
    });
}

// Afficher une question
function showQuestion(data) {
    const overlay = document.getElementById('question-overlay');
    const questionText = document.getElementById('question-text');
    const currentTheme = document.getElementById('current-theme');
    const currentQuestionNum = document.getElementById('current-question-num');
    const currentPoints = document.getElementById('current-points');
    const answerReveal = document.getElementById('answer-reveal');
    
    currentTheme.textContent = data.theme;
    questionText.textContent = data.question;
    currentQuestionNum.textContent = `Question ${data.questionNum}`;
    currentPoints.textContent = `+${data.points} pt${data.points > 1 ? 's' : ''}`;
    
    answerReveal.classList.remove('show');
    overlay.classList.add('show');
    
    playSound(sfxSelected);
}

// Afficher la réponse
function showAnswer(answer) {
    const answerText = document.getElementById('answer-text');
    const answerReveal = document.getElementById('answer-reveal');
    
    answerText.textContent = answer;
    answerReveal.classList.add('show');
}

// Masquer la question
function hideQuestion() {
    const overlay = document.getElementById('question-overlay');
    overlay.classList.remove('show');
    stopTimer();
}

// Mettre à jour un wagon spécifique
function updateWagon(data) {
    const wagonIndex = data.wagonIndex;
    if (gameState.wagons[wagonIndex]) {
        gameState.wagons[wagonIndex] = data.wagon;
        updateWagonsGrid();
    }
}

// Mettre à jour le score d'une équipe
function updateTeamScore(data) {
    const team = gameState.teams.find(t => t.name === data.teamName);
    if (team) {
        team.score = data.score;
        team.qualified = data.qualified;
        updateTeamsScoreboard();
    }
}

// Afficher un bonus
function showBonus(data) {
    const bonusNotif = document.getElementById('bonus-notification');
    const bonusDesc = document.getElementById('bonus-description');
    
    bonusDesc.innerHTML = `
        <strong>${data.bonus.name}</strong><br>
        ${data.bonus.description}<br>
        <em>Pour: ${data.teamName}</em>
    `;
    
    bonusNotif.classList.add('show');
    playSound(sfxSelected);
    
    setTimeout(() => {
        bonusNotif.classList.remove('show');
    }, 4000);
}

// Afficher les résultats finaux
function showResults(data) {
    const resultsScreen = document.getElementById('results-screen');
    const resultsList = document.getElementById('results-list');
    
    resultsList.innerHTML = '';
    
    data.results.forEach((result, index) => {
        setTimeout(() => {
            const row = document.createElement('div');
            row.className = 'result-row';
            
            if (result.qualified) {
                row.classList.add('qualified');
            } else if (result.eliminated) {
                row.classList.add('eliminated');
            }
            
            const statusText = result.qualified ? 'QUALIFIÉ' : (result.eliminated ? 'ÉLIMINÉ' : '');
            const statusClass = result.qualified ? 'qualified' : 'eliminated';
            
            row.innerHTML = `
                <div class="result-rank">#${index + 1}</div>
                <div class="result-team" style="color: ${result.color}">${result.name}</div>
                <div class="result-score">${result.score} pts</div>
                ${statusText ? `<div class="result-status ${statusClass}">${statusText}</div>` : ''}
            `;
            
            resultsList.appendChild(row);
            
            setTimeout(() => {
                row.classList.add('animate');
                playSound(sfxSelected);
            }, 50);
        }, index * 300);
    });
    
    resultsScreen.classList.add('show');
}

// Mettre à jour l'indicateur de connexion
function updateConnectionStatus(connected) {
    const status = document.getElementById('connection-status');
    if (connected) {
        status.classList.add('connected');
    } else {
        status.classList.remove('connected');
    }
}

// Ping périodique pour vérifier la connexion
setInterval(() => {
    gameChannel.postMessage({ type: 'PING' });
}, 5000);
