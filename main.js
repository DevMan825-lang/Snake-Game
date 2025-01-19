const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = 400;
const initialLength = 2;

let snake = [
  { x: 80, y: 80 },
  { x: 60, y: 80 },
  { x: 40, y: 80 },
  { x: 20, y: 80 },
  { x: 0, y: 80 }
];
let direction = 'right';
let food = generateFood();
let score = 0;
document.getElementById('leftBtn').addEventListener('click', () => changeDirection('left'));
document.getElementById('upBtn').addEventListener('click', () => changeDirection('up'));
document.getElementById('downBtn').addEventListener('click', () => changeDirection('down'));
document.getElementById('rightBtn').addEventListener('click', () => changeDirection('right'));

function gameLoop() {
    setTimeout(() => {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        checkGameOver();
        gameLoop();
    }, 350);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lime'; // Head is green, body is lime
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'right': head.x += gridSize; break;
        case 'left': head.x -= gridSize; break;
        case 'up': head.y -= gridSize; break;
        case 'down': head.y += gridSize; break;
    }

    snake.unshift(head); // Add new head to the front
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerHTML = "SCORE:" + " " + score;
        food = generateFood(); // Generate new food
    } else {
        snake.pop(); // Remove the last segment of the snake
    }
}

function generateFood() {
    let foodPosition;
    do {
        foodPosition = {
            x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
        };
    } while (isFoodOnSnake(foodPosition));
    return foodPosition;
}

function isFoodOnSnake(foodPosition) {
    return snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function changeDirection(newDirection) {
    // Prevent the snake from reversing into itself
    if (newDirection === 'left' && direction !== 'right') {
        direction = 'left';
    } else if (newDirection === 'right' && direction !== 'left') {
        direction = 'right';
    } else if (newDirection === 'up' && direction !== 'down') {
        direction = 'up';
    } else if (newDirection === 'down' && direction !== 'up') {
        direction = 'down';
    }
}

function checkGameOver() {
    const head = snake[0];
    if (
        head.x < 0 || head.x >= canvasSize || // Out of bounds
        head.y < 0 || head.y >= canvasSize || // Out of bounds
        isSnakeCollidingWithItself() // Colliding with itself
    ){
      const playerName = prompt("Enter Player Name:")
      document.getElementById("playerScore").textContent = "Game Over!" + " " + playerName + " " + "Your score is:" + score;
        resetGame();
    }
}

function isSnakeCollidingWithItself() {
    const head = snake[0];
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function resetGame() {
    snake = [
        { x: 80, y: 80 },
        { x: 60, y: 80 },
        { x: 40, y: 80 },
        { x: 20, y: 80 },
        { x: 0, y: 80 }
    ];
    direction = 'right';
    food = generateFood();
    score = 0;
    gameLoop();
}
gameLoop();
