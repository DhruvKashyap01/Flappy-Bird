const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let birdImg = new Image();
birdImg.src = 'bird.png'; // Make sure this path matches where you saved your bird image

let backgroundImg = new Image();
backgroundImg.src = 'background.png'; // Make sure this path matches where you saved your background image

let bird = { x: 100, y: 150, width: 68, height: 48, gravity: 0.3, lift: -4, velocity: 0 };
let pipes = [];
let frameCount = 0;
let score = 0;
let gameInterval;
let difficulty = {
    easy: { gap: 260, pipeSpeed: 2 },
    hard: { gap: 195, pipeSpeed: 3 },
    advanced: { gap: 130, pipeSpeed: 4 }
};
let currentDifficulty = difficulty.easy;
let gameStarted = false;
let countdown = 3;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        bird.velocity = bird.lift;
    }
});

function startGame(level) {
    currentDifficulty = difficulty[level];
    pipes = [];
    frameCount = 0;
    score = 0;
    bird.y = 150;
    bird.velocity = 0;
    countdown = 3;
    gameStarted = false;

    document.querySelector('.difficulty-buttons').style.display = 'none';

    let countdownInterval = setInterval(() => {
        if (countdown === 0) {
            clearInterval(countdownInterval);
            gameStarted = true;
            gameInterval = setInterval(updateGame, 20);
        } else {
            drawBackground();
            ctx.font = '48px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText(countdown, canvas.width / 2 - 12, canvas.height / 2 - 24);
            countdown--;
        }
    }, 1000);
}

function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        let gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        gradient.addColorStop(0, 'darkgreen');
        gradient.addColorStop(1, 'lightgreen');
        ctx.fillStyle = gradient;

        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawGameOver() {
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over', canvas.width / 2 - 140, canvas.height / 2 - 24);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }
}

function updatePipes() {
    if (frameCount % 90 === 0) {
        let topHeight = Math.random() * (canvas.height / 2);
        let bottomHeight = canvas.height - topHeight - currentDifficulty.gap;
        pipes.push({ x: canvas.width, width: 50, top: topHeight, bottom: bottomHeight });
    }

    pipes = pipes.map(pipe => {
        pipe.x -= currentDifficulty.pipeSpeed;
        return pipe;
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function detectCollisions() {
    for (let pipe of pipes) {
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            endGame();
        }
    }
}

function endGame() {
    clearInterval(gameInterval);
    drawGameOver();
    setTimeout(() => {
        document.querySelector('.difficulty-buttons').style.display = 'flex';
    }, 2000);
}

function updateGame() {
    drawBackground();
    updateBird();
    updatePipes();
    drawBird();
    drawPipes();
    drawScore();
    detectCollisions();

    frameCount++;
    if (frameCount % 90 === 0 && gameStarted) {
        score++;
    }
}
