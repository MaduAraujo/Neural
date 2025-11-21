const URL = "https://teachablemachine.withgoogle.com/models/MIiO01_bE/";

let model, webcam, labelContainer, maxPredictions;
let isRunning = false; 
let startBtn, stopBtn;

document.addEventListener('DOMContentLoaded', () => {
    startBtn = document.getElementById('start-btn');
    stopBtn = document.getElementById('stop-btn');

    if (stopBtn) {
        stopBtn.style.display = 'none'; 
    }

    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }

        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            
            if (body.classList.contains('light-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    function initTypewriter() {
        const textElement = document.querySelector('.typewriter-text');
        const textToType = "Decodificando o futuro, um algoritmo de cada vez.";
        let index = 0;

        function typeWriter() {
            if (textElement) {
                if (index < textToType.length) {
                    textElement.innerHTML += textToType.charAt(index);
                    index++;
                    setTimeout(typeWriter, 50);
                } else {
                    textElement.innerHTML += "<span class='dot'>_</span>";
                }
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
    initTypewriter();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const dropdownContainer = document.getElementById('games-dropdown-container');
    const dropdownBtn = document.getElementById('games-dropdown-btn');
    const dropdownContent = document.getElementById('games-dropdown-content');

    if (dropdownBtn && dropdownContent && dropdownContainer) {
        dropdownBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation(); 
            dropdownContent.classList.toggle('show-dropdown');
        });

        const dropdownLinks = dropdownContent.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                dropdownContent.classList.remove('show-dropdown');
            });
        });

        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                dropdownContent.classList.remove('show-dropdown');
            }
        });
    }
    
    function initQuiz() {
        const quizData = [
            {
                question: "Qual destas IAs é focada em gerar texto?",
                options: ["Midjourney", "ChatGPT", "DALL-E", "TensorFlow"],
                correct: 1 
            },
            {
                question: "O que significa 'Viés Algorítmico'?",
                options: ["Um vírus", "Lentidão na rede", "Preconceitos nos dados", "Cabo de rede"],
                correct: 2
            },
            {
                question: "Qual linguagem é a mais popular para IA?",
                options: ["Java", "HTML", "Python", "PHP"],
                correct: 2
            }
        ];

        let currentQuestion = 0;
        const questionEl = document.getElementById('quiz-question');
        const optionsEl = document.getElementById('quiz-options');
        const feedbackEl = document.getElementById('quiz-feedback');
        const nextBtn = document.getElementById('next-btn');

        if (!questionEl || !optionsEl || !nextBtn) return; 

        function loadQuiz() {
            const data = quizData[currentQuestion];
            questionEl.innerText = data.question;
            optionsEl.innerHTML = '';
            feedbackEl.innerText = '';
            nextBtn.style.display = 'none';

            data.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.innerText = option;
                btn.classList.add('btn-option');
                btn.onclick = () => checkAnswer(index); 
                optionsEl.appendChild(btn);
            });
        }

        function checkAnswer(selectedIndex) {
            const correctIndex = quizData[currentQuestion].correct;
            const buttons = optionsEl.querySelectorAll('button');

            buttons.forEach((btn, index) => {
                btn.disabled = true; 
                if (index === correctIndex) {
                    btn.classList.add('correct');
                } else if (index === selectedIndex) {
                    btn.classList.add('wrong');
                }
            });

            if (selectedIndex === correctIndex) {
                feedbackEl.innerText = "Resposta Correta! 🤖";
                feedbackEl.style.color = "var(--accent-primary)";
            } else {
                feedbackEl.innerText = "Resposta Errada.";
                feedbackEl.style.color = "#ff4444";
            }
            
            nextBtn.style.display = 'inline-block';
        }

        nextBtn.addEventListener('click', () => {
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuiz();
            } else {
                questionEl.innerText = "Quiz Finalizado! Você domina a IA.";
                optionsEl.innerHTML = '';
                feedbackEl.innerText = '';
                nextBtn.style.display = 'none';
            }
        });
        
        loadQuiz();
    }

    initQuiz();

    function initRPSGame() {
        const gameChoices = ['rock', 'paper', 'scissors']; 
        const outcomes = {
            rock: { beats: 'scissors', loses: 'paper' },
            paper: { beats: 'rock', loses: 'scissors' },
            scissors: { beats: 'paper', loses: 'rock' }
        };

        let playerScore = 0;
        let iaScore = 0;
        let roundsPlayed = 0;

        const playerPatterns = [ 
            [0, 0, 0], 
            [0, 0, 0], 
            [0, 0, 0] 
        ];

        let lastPlayerChoiceIndex = -1;

        const gameChoiceBtns = document.querySelectorAll('.game-choice-btn');
        const playerChoiceDisplay = document.getElementById('player-choice-display');
        const iaChoiceDisplay = document.getElementById('ia-choice-display');
        const gameResult = document.getElementById('game-result');
        const playerScoreDisplay = document.getElementById('player-score');
        const iaScoreDisplay = document.getElementById('ia-score');
        const roundsPlayedDisplay = document.getElementById('rounds-played');
        const resetGameBtn = document.getElementById('reset-game-btn');

        const choiceIcons = {
            rock: '<i class="fas fa-hand-rock"></i> Pedra',
            paper: '<i class="fas fa-hand-paper"></i> Papel',
            scissors: '<i class="fas fa-hand-scissors"></i> Tesoura'
        };

        function getIaChoice() {
            if (roundsPlayed === 0 || lastPlayerChoiceIndex === -1) {
                return gameChoices[Math.floor(Math.random() * gameChoices.length)];
            }

            const nextMovesAfterLast = playerPatterns[lastPlayerChoiceIndex];
            
            let maxCount = -1;
            let predictedPlayerMoveIndex = -1;

            for (let i = 0; i < nextMovesAfterLast.length; i++) {
                if (nextMovesAfterLast[i] > maxCount) {
                    maxCount = nextMovesAfterLast[i];
                    predictedPlayerMoveIndex = i;
                }
            }

            if (maxCount === 0 || predictedPlayerMoveIndex === -1) {
                 return gameChoices[Math.floor(Math.random() * gameChoices.length)];
            }

            const predictedPlayerMove = gameChoices[predictedPlayerMoveIndex];
            const iaCounterMove = outcomes[predictedPlayerMove].loses; 
            
            return iaCounterMove;
        }

        function playGame(playerChoice) {
            if (!playerChoiceDisplay) return;

            roundsPlayed++;
            roundsPlayedDisplay.innerText = roundsPlayed;

            const iaChoice = getIaChoice();

            playerChoiceDisplay.innerHTML = choiceIcons[playerChoice];
            iaChoiceDisplay.innerHTML = choiceIcons[iaChoice];

            let resultText = '';

            if (playerChoice === iaChoice) {
                resultText = "Empate!";
                gameResult.style.color = "#ccc";
            } else if (outcomes[playerChoice].beats === iaChoice) {
                resultText = "Você Venceu!";
                playerScore++;
                gameResult.style.color = "var(--accent-primary)";
            } else {
                resultText = "A IA Venceu!";
                iaScore++;
                gameResult.style.color = "#ff4444";
            }
            
            gameResult.innerText = resultText;
            playerScoreDisplay.innerText = playerScore;
            iaScoreDisplay.innerText = iaScore;

            if (lastPlayerChoiceIndex !== -1) {
                const currentPlayerChoiceIndex = gameChoices.indexOf(playerChoice);
                playerPatterns[lastPlayerChoiceIndex][currentPlayerChoiceIndex]++;
            }
            lastPlayerChoiceIndex = gameChoices.indexOf(playerChoice);

            resetGameBtn.style.display = 'inline-block';
        }

        function resetGame() {
            playerScore = 0;
            iaScore = 0;
            roundsPlayed = 0;
            lastPlayerChoiceIndex = -1;
            
            for (let i = 0; i < playerPatterns.length; i++) {
                for (let j = 0; j < playerPatterns[i].length; j++) {
                    playerPatterns[i][j] = 0;
                }
            }

            playerScoreDisplay.innerText = playerScore;
            iaScoreDisplay.innerText = iaScore;
            roundsPlayedDisplay.innerText = roundsPlayed;
            playerChoiceDisplay.innerText = '?';
            iaChoiceDisplay.innerText = '?';
            gameResult.innerText = "Faça sua jogada!";
            gameResult.style.color = "var(--text-color)";
            resetGameBtn.style.display = 'none';
        }

        if (gameChoiceBtns.length > 0) {
            gameChoiceBtns.forEach(button => {
                button.addEventListener('click', () => {
                    const choice = button.dataset.choice;
                    playGame(choice);
                });
            });
        }

        if (resetGameBtn) {
            resetGameBtn.addEventListener('click', resetGame);
        }
    }
    initRPSGame();
}); 

async function init() {
    if (isRunning) return;

    if (!startBtn || !stopBtn) {
        return;
    }

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();
        await webcam.play();
        isRunning = true;
        window.requestAnimationFrame(loop);

        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
        
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = ''; 
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

    } catch (error) {
        alert("Ops! O modelo de IA ao vivo não pôde ser carregado.");
        isRunning = false;
        startBtn.style.display = 'inline-block'; 
        stopBtn.style.display = 'none';
    }
}

async function loop() {
    if (isRunning) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }
}

async function predict() {
    if (!webcam || !model) return;

    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

function stop() {
    if (webcam) {
        webcam.stop(); 
    }
    isRunning = false;

    if (!startBtn || !stopBtn) {
        return;
    }

    const webcamContainer = document.getElementById("webcam-container");
    webcamContainer.innerHTML = '';
    if (labelContainer) {
        labelContainer.innerHTML = 'Teste Finalizado.';
    }

    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
}