document.addEventListener('DOMContentLoaded', function () {
    const gameContainer = document.getElementById('game-container');
    let archer = document.getElementById('archer');
    let walkers = [];
    let arrows = [];
    let score = 0;
    let isGameOver = false;

    archer.className = 'stick-figure';
    archer.style.bottom = '10px';
    gameContainer.appendChild(archer);

    function createWalker() {
        let walker = document.createElement('div');
        walker.className = 'walker stick-figure';
        walker.style.bottom = '0px';
        walker.style.left = Math.random() * (gameContainer.clientWidth - 15) + 'px';
        walkers.push(walker);
        gameContainer.appendChild(walker);
    }

    function moveWalkers() {
        if (isGameOver) return;

        walkers.forEach(walker => {
            let currentBottom = parseInt(walker.style.bottom) || 0;
            walker.style.bottom = (currentBottom + 2) + 'px';

            // Check for collision with archer
            if (checkCollision(walker, archer)) {
                endGame();
            }

            // Check for collision with arrows
            arrows.forEach(arrow => {
                if (checkCollision(walker, arrow)) {
                    // Walker hit by arrow
                    walker.remove();
                    arrows.splice(arrows.indexOf(arrow), 1);
                    score += 10;
                    updateScore();
                }
            });

            // Check if walker reaches the top
            if (currentBottom > gameContainer.clientHeight) {
                endGame();
            }
        });
    }

    function checkCollision(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        return (
            rect1.bottom > rect2.top &&
            rect1.top < rect2.bottom &&
            rect1.right > rect2.left &&
            rect1.left < rect2.right
        );
    }

    function shootArrow() {
        if (isGameOver) return;

        let arrow = document.createElement('div');
        arrow.className = 'arrow';
        arrow.style.bottom = '90px';
        arrow.style.left = (parseInt(archer.style.left) + 8) + 'px';
        arrows.push(arrow);
        gameContainer.appendChild(arrow);
    }

    function moveArrows() {
        arrows.forEach(arrow => {
            let currentBottom = parseInt(arrow.style.bottom) || 0;
            arrow.style.bottom = (currentBottom + 10) + 'px';

            // Remove arrows that go off-screen
            if (currentBottom > gameContainer.clientHeight) {
                arrow.remove();
                arrows.splice(arrows.indexOf(arrow), 1);
            }
        });
    }

    function updateScore() {
        document.getElementById('score').innerText = `Score: ${score}`;
    }

    function endGame() {
        isGameOver = true;
        alert(`Game Over! Your score is ${score}`);
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft' && parseInt(archer.style.left) > 0) {
            archer.style.left = (parseInt(archer.style.left) - 10) + 'px';
        } else if (event.key === 'ArrowRight' && parseInt(archer.style.left) < (gameContainer.clientWidth - 20)) {
            archer.style.left = (parseInt(archer.style.left) + 10) + 'px';
        } else if (event.key === 'Space') {
            shootArrow();
        }
    });

    function gameLoop() {
        moveWalkers();
        moveArrows();

        // Create walkers at a certain interval
        if (Math.random() < 0.02) {
            createWalker();
        }

        // Repeat the loop
        requestAnimationFrame(gameLoop);
    }

    // Game initialization
    createWalker();
    updateScore();
    gameLoop();
});
