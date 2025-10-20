const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 9;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const player = {
    x: 11,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#30ec0fff',
    speed: 3
};

const ai = {
    x: CANVAS_WIDTH - PADDLE_WIDTH - 11,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#08b4eeff',
    speed: 3
};

const ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: BALL_RADIUS,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: '#fff'
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function resetBall() {
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
}

function draw() {
    drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, '#111');
    for (let i = 0; i < CANVAS_HEIGHT; i += 20) {
        drawRect(CANVAS_WIDTH / 2 - 1, i, 2, 10, '#fff');
    }
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > CANVAS_HEIGHT) {
        ball.velocityY = -ball.velocityY;
    }

    let paddle = (ball.x < CANVAS_WIDTH / 2) ? player : ai;

    if (collision(ball, paddle)) {
        let collidePoint = (ball.y - (paddle.y + paddle.height / 2));
        collidePoint = collidePoint / (paddle.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x < CANVAS_WIDTH / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.2;
    }

    if (ai.y + ai.height / 2 < ball.y) {
        ai.y += ai.speed;
    } else if (ai.y + ai.height / 2 > ball.y) {
        ai.y -= ai.speed;
    }
    ai.y = Math.max(0, Math.min(CANVAS_HEIGHT - ai.height, ai.y));

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > CANVAS_WIDTH) {
        ball.speed = 5;
        resetBall();
    }
}

function collision(b, p) {
    return b.x + b.radius > p.x &&
           b.x - b.radius < p.x + p.width &&
           b.y + b.radius > p.y &&
           b.y - b.radius < p.y + p.height;
}

canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp paddle within canvas
    player.y = Math.max(0, Math.min(CANVAS_HEIGHT - player.height, player.y));
});

function game() {
    update();
    draw();
    requestAnimationFrame(game);
}

game();