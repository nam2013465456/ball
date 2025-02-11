const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 320;

let score = 0;
let bubbleRadius = 15;
let bubbles = [];
let currentBubble = { x: 240, y: 300, color: randomColor() };

// Render the game screen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    
    // Draw current bubble
    ctx.beginPath();
    ctx.arc(currentBubble.x, currentBubble.y, bubbleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = currentBubble.color;
    ctx.fill();
    ctx.closePath();

    // Draw all bubbles
    for (let i = 0; i < bubbles.length; i++) {
        let bubble = bubbles[i];
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubbleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.closePath();
    }

    // Draw score
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Create random color for the bubble
function randomColor() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Move the current bubble
function shootBubble() {
    let dx = mouseX - currentBubble.x;
    let dy = mouseY - currentBubble.y;
    let angle = Math.atan2(dy, dx);
    let speed = 5;

    currentBubble.x += Math.cos(angle) * speed;
    currentBubble.y += Math.sin(angle) * speed;

    if (currentBubble.x < 0 || currentBubble.x > canvas.width || currentBubble.y < 0 || currentBubble.y > canvas.height) {
        resetBubble();
    }

    checkCollision();
}

// Reset current bubble position
function resetBubble() {
    currentBubble = { x: 240, y: 300, color: randomColor() };
}

// Check for collision with other bubbles
function checkCollision() {
    for (let i = 0; i < bubbles.length; i++) {
        let bubble = bubbles[i];
        let dx = currentBubble.x - bubble.x;
        let dy = currentBubble.y - bubble.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bubbleRadius * 2) {
            // Merge bubbles if colors match
            if (currentBubble.color === bubble.color) {
                score += 10;
                bubbles.splice(i, 1); // Remove matched bubble
                resetBubble();
                break;
            }
        }
    }
}

// Handle mouse click event to shoot the bubble
let mouseX = 0;
let mouseY = 0;
canvas.addEventListener('mousemove', function(event) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
});
canvas.addEventListener('click', function() {
    shootBubble();
});

// Spawn new bubbles
setInterval(() => {
    let bubble = {
        x: Math.random() * (canvas.width - bubbleRadius * 2) + bubbleRadius,
        y: Math.random() * (canvas.height - bubbleRadius * 2) + bubbleRadius,
        color: randomColor(),
    };
    bubbles.push(bubble);
}, 1000);

// Game loop
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}
