// document.addEventListener('DOMContentLoaded', () => {
//     const circle = document.getElementById('circle');
//     const enemy = document.getElementById('enemy');
//     const overlay = document.getElementById('overlay');
    
//     let circleX = 0, circleY = 0;
//     let enemyX = window.innerWidth / 2 - 15; // Start enemy in the middle of the screen
//     let enemyY = window.innerHeight / 2 - 15;
//     let isInvulnerable = false;
//     let score = 0;
//     let isLeftMousePressed = false; // Track if the left mouse button is pressed
//     let isRightMousePressed = false; // Track if the right mouse button is pressed

//     // Initial enemy positioning
//     enemy.style.left = `${enemyX}px`;
//     enemy.style.top = `${enemyY}px`;

//     function updateCirclePosition(event) {
//         circleX = event.clientX - 15;
//         circleY = event.clientY - 15;
//         circle.style.left = `${circleX}px`;
//         circle.style.top = `${circleY}px`;
//         circle.style.display = 'block';

//         if (isLeftMousePressed) {
//             attackEnemy(); // Continuously check for attack while left mouse button is pressed
//         }

//         if (!isInvulnerable) {
//             // Check collision only if not invulnerable
//             checkCollision();
//         }
//     }

//     function moveEnemy() {
//         // Calculate the direction vector from enemy to player
//         const dx = circleX - enemyX;
//         const dy = circleY - enemyY;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance > 1) { // Avoid division by zero
//             // Normalize the direction vector
//             const moveX = (dx / distance) * 2; // Adjust speed here
//             const moveY = (dy / distance) * 2;

//             enemyX += moveX;
//             enemyY += moveY;

//             enemy.style.left = `${enemyX}px`;
//             enemy.style.top = `${enemyY}px`;
//         }

//         if (!isInvulnerable) {
//             checkCollision();
//         }
//     }

//     function checkCollision() {
//         const circleRect = circle.getBoundingClientRect();
//         const enemyRect = enemy.getBoundingClientRect();

//         if (circleRect.left < enemyRect.left + enemyRect.width &&
//             circleRect.left + circleRect.width > enemyRect.left &&
//             circleRect.top < enemyRect.top + enemyRect.height &&
//             circleRect.top + circleRect.height > enemyRect.top) {
//             if (!isInvulnerable) {
//                 showLostOverlay();
//             }
//         }
//     }

//     function attackEnemy() {
//         const circleRect = circle.getBoundingClientRect();
//         const enemyRect = enemy.getBoundingClientRect();

//         if (circleRect.left < enemyRect.left + enemyRect.width &&
//             circleRect.left + circleRect.width > enemyRect.left &&
//             circleRect.top < enemyRect.top + enemyRect.height &&
//             circleRect.top + circleRect.height > enemyRect.top) {
//             // Enemy hit
//             enemy.style.display = 'none'; // Hide the enemy
//             score++;
//             console.log(`Score: ${score}`); // Log the score for debugging
//             showWinOverlay();
//         }
//     }

//     function showWinOverlay() {
//         overlay.classList.remove('hidden');
//         overlay.querySelector('h1').textContent = 'You Win!';
//         enemy.style.display = 'none';
//         console.log(`Final Score: ${score}`);
//         setTimeout(() => {
//             overlay.classList.add('hidden');
//             resetGame();
//         }, 2000);
//     }

//     function showLostOverlay() {
//         overlay.classList.remove('hidden');
//         overlay.querySelector('h1').textContent = 'You Lost!';
//         circle.style.display = 'none'; // Hide the blue circle
//         enemy.style.display = 'block'; // Keep the enemy visible
//         console.log(`Final Score: ${score}`);
//         setTimeout(() => {
//             overlay.classList.add('hidden');
//             resetGame(); // Add a function to reset the game state
//         }, 2000);
//     }

//     function resetGame() {
//         circle.style.display = 'none';
//         enemy.style.display = 'block';
//         enemyX = window.innerWidth / 2 - 15;
//         enemyY = window.innerHeight / 2 - 15;
//         enemy.style.left = `${enemyX}px`;
//         enemy.style.top = `${enemyY}px`;
//         score = 0;
//         isInvulnerable = false;
//     }

//     document.querySelector('.game-area').addEventListener('mousemove', (event) => {
//         updateCirclePosition(event);
//     });

//     document.querySelector('.game-area').addEventListener('mouseleave', () => {
//         circle.style.display = 'none';
//     });

//     document.addEventListener('mousedown', (event) => {
//         if (event.button === 0) { // Left mouse button
//             isLeftMousePressed = true;
//         } else if (event.button === 2) { // Right mouse button
//             isRightMousePressed = true;
//             isInvulnerable = !isInvulnerable;
//             console.log(`Invulnerability: ${isInvulnerable}`); // Log invulnerability state for debugging
//         }
//     });

//     document.addEventListener('mouseup', (event) => {
//         if (event.button === 0) { // Left mouse button
//             isLeftMousePressed = false;
//         } else if (event.button === 2) { // Right mouse button
//             isRightMousePressed = false;
//         }
//     });

//     document.addEventListener('contextmenu', (event) => {
//         event.preventDefault(); // Prevent context menu from appearing on right-click
//     });

//     setInterval(moveEnemy, 20); // Move the enemy every 20 milliseconds
// });

document.addEventListener('DOMContentLoaded', () => {
    const bluePlayer = document.getElementById('blue-player');
    const redPlayer = document.getElementById('red-player');
    const overlay = document.getElementById('overlay');
    
    let playerColor = Math.random() < 0.5 ? 'blue' : 'red';
    let ws = new WebSocket('ws://localhost:8765');

    ws.onmessage = (event) => {
        const gameState = JSON.parse(event.data);
        updatePlayerPositions(gameState);
        updateScore(gameState.score);
        checkWinCondition(gameState.score);
    };

    function updatePlayerPositions(gameState) {
        bluePlayer.style.left = `${gameState.blue.x}px`;
        bluePlayer.style.top = `${gameState.blue.y}px`;
        redPlayer.style.left = `${gameState.red.x}px`;
        redPlayer.style.top = `${gameState.red.y}px`;
    }

    function updateScore(score) {
        document.getElementById('blue-score').textContent = score.blue;
        document.getElementById('red-score').textContent = score.red;
    }

    function checkWinCondition(score) {
        if (score.blue >= 5 || score.red >= 5) {
            const winner = score.blue >= 5 ? 'Blue' : 'Red';
            showWinOverlay(winner);
        }
    }

    function showWinOverlay(winner) {
        overlay.classList.remove('hidden');
        overlay.querySelector('h1').textContent = `${winner} Wins!`;
        setTimeout(() => {
            overlay.classList.add('hidden');
            resetGame();
        }, 2000);
    }

    function resetGame() {
        ws.send(JSON.stringify({type: 'reset'}));
    }

    document.addEventListener('mousemove', (event) => {
        const x = event.clientX;
        const y = event.clientY;
        ws.send(JSON.stringify({type: 'move', player: playerColor, x, y}));
    });

    document.addEventListener('click', () => {
        ws.send(JSON.stringify({type: 'score', player: playerColor}));
    });
});