const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 32;
const bolSize = 27;
let score = 0;
const ghostImg = new Image();
ghostImg.src = "ghost.png";
const ghostBlueImg = new Image();
ghostBlueImg.src = "ghostBlue.png";
let mouthAngle = 0.2 * Math.PI;
let mouthSpeed = 0.02 * Math.PI;

const sounds = {
    waka: new Audio('./sounds/waka.wav'),
    powerUp: new Audio('./sounds/powerup.wav'),
    death: new Audio('./sounds/death.wav'),
    intro: new Audio('./sounds/intro.wav'),
    ghosts: new Audio('./sounds/ghosts.wav'),
    police: new Audio('./sounds/police.wav')
};
sounds.waka.volume = 0.1;    
sounds.powerUp.volume = 0.1;  
sounds.death.volume = 0.1;    
sounds.intro.volume = 0.1;   
sounds.ghosts.volume = 0.1;   
sounds.police.volume = 0.1;

const pacman = {
    x: 15.5 * tileSize,
    y: 14.5 * tileSize,
    size: bolSize / 2.5,
    speed: 1,
    dx: 1,
    dy: 0,
    radius: 15,
    startAngle: 0.2 * Math.PI,
    endAngle: 1.8 * Math.PI

};

const ghosts = [
    {
        x: 15 * tileSize,
        y: 9 * tileSize,
        size: bolSize / 2.8,
        speed: 0.7,
        dx: 1,
        dy: 0,
        scared: false,
        color: "red"
    }
];


const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

console.log(map.length);

function drawMap() {
    for (let row = 0; row < map.length; row++) {

        for (let col = 0; col < map[row].length; col++) {

            if (map[row][col] === 1) {
                ctx.fillStyle = "blue";
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (map[row][col] === 2) {
                ctx.fillStyle = "yellow";
                ctx.beginPath();
                ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 4, 0, Math.PI * 2);
                ctx.fill();
            } else if (map[row][col] === 5) {
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
function drawPacMan() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    let startAngle, endAngle;

    if (pacman.dx === 1 && pacman.dy === 0) {
        // direita
        startAngle = mouthAngle;
        endAngle = 2 * Math.PI - mouthAngle;
    } else if (pacman.dx === -1 && pacman.dy === 0) {
        // esquerda
        startAngle = Math.PI + mouthAngle;
        endAngle = Math.PI - mouthAngle;
    } else if (pacman.dx === 0 && pacman.dy === -1) {
        // cima
        startAngle = 1.5 * Math.PI + mouthAngle;
        endAngle = 1.5 * Math.PI - mouthAngle;
    } else if (pacman.dx === 0 && pacman.dy === 1) {
        // baixo
        startAngle = 0.5 * Math.PI + mouthAngle;
        endAngle = 0.5 * Math.PI - mouthAngle;
    } else {

        startAngle = 0;
        endAngle = 2 * Math.PI;
    }

    ctx.moveTo(pacman.x, pacman.y);
    ctx.arc(pacman.x, pacman.y, tileSize / 2 - 5, startAngle, endAngle);


    ctx.closePath();
    ctx.fill();
}


function drawGhosts() {
    ghosts.forEach(ghost => {
        const image = ghost.scared ? ghostBlueImg : ghostImg;
        ctx.drawImage(image, ghost.x, ghost.y, tileSize, tileSize);
    });
}

function movePacMan() {
    sounds.police.play();
    
    const nextX = pacman.x + pacman.dx * pacman.speed;
    const nextY = pacman.y + pacman.dy * pacman.speed;

    const radius = tileSize / 2 - 5;


    let nextCol, nextRow;

    if (pacman.dx === 1) {
        nextCol = Math.floor((nextX + radius) / tileSize);
        nextRow = Math.floor(nextY / tileSize);
    } else if (pacman.dx === -1) {
        nextCol = Math.floor((nextX - radius) / tileSize);
        nextRow = Math.floor(nextY / tileSize);
    } else if (pacman.dy === 1) {
        nextRow = Math.floor((nextY + radius) / tileSize);
        nextCol = Math.floor(nextX / tileSize);
    } else if (pacman.dy === -1) {
        nextRow = Math.floor((nextY - radius) / tileSize);
        nextCol = Math.floor(nextX / tileSize);
    } else {
        nextCol = Math.floor(nextX / tileSize);
        nextRow = Math.floor(nextY / tileSize);
    }

    if (map[nextRow] && map[nextRow][nextCol] !== 1) {
        pacman.x = nextX;
        pacman.y = nextY;
    }
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        let bestDx = 0, bestDy = 0;
        let bestDist = ghost.scared ? -Infinity : Infinity;

        const directions = [
            { dx: -1, dy: 0 }, // esquerda
            { dx: 1, dy: 0 },  // direita
            { dx: 0, dy: -1 }, // cima
            { dx: 0, dy: 1 }   // baixo
        ];

        directions.forEach(dir => {
            const nextX = ghost.x + dir.dx * ghost.speed;
            const nextY = ghost.y + dir.dy * ghost.speed;

            const halfSize = tileSize / 2 - 2;

            const corners = [
                { x: nextX - halfSize, y: nextY - halfSize },
                { x: nextX + halfSize, y: nextY - halfSize },
                { x: nextX - halfSize, y: nextY + halfSize },
                { x: nextX + halfSize, y: nextY + halfSize }
            ];

            const isValid = corners.every(corner => {
                const col = Math.floor(corner.x / tileSize);
                const row = Math.floor(corner.y / tileSize);
                return map[row] && map[row][col] !== 1; 
            });

            if (isValid) {
                const dist = Math.hypot(nextX - pacman.x, nextY - pacman.y);

                if (ghost.scared && dist > bestDist) {
                    bestDist = dist;
                    bestDx = dir.dx;
                    bestDy = dir.dy;
                }

                if (!ghost.scared && dist < bestDist) {
                    bestDist = dist;
                    bestDx = dir.dx;
                    bestDy = dir.dy;
                }
            }
        });

        
        const newX = ghost.x + bestDx * ghost.speed;
        const newY = ghost.y + bestDy * ghost.speed;

        const halfSize = tileSize / 2 - 2;

        const corners = [
            { x: newX - halfSize, y: newY - halfSize },
            { x: newX + halfSize, y: newY - halfSize },
            { x: newX - halfSize, y: newY + halfSize },
            { x: newX + halfSize, y: newY + halfSize }
        ];

        const canMove = corners.every(corner => {
            const col = Math.floor(corner.x / tileSize);
            const row = Math.floor(corner.y / tileSize);
            return map[row] && map[row][col] !== 1; 
        });

        if (canMove) {
            ghost.x = newX;
            ghost.y = newY;
        }
    });
}


let isDead = false;

function checkCollision() {
    const col = Math.floor(pacman.x / tileSize);
    const row = Math.floor(pacman.y / tileSize);

    if (map[row][col] === 2) {
        map[row][col] = 0;
        score += 1;
        document.getElementById("score").innerText = score;
        sounds.waka.play();
    }

    ghosts.forEach(ghost => {
        let dx = pacman.x - ghost.x;
        let dy = pacman.y - ghost.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pacman.size + ghost.size) {
            if (ghost.scared) {
             
                score += 10; 
                document.getElementById("score").innerText = score;
                sounds.ghosts.play();

              
                ghost.x = 14 * tileSize;
                ghost.y = 9 * tileSize;
                ghost.scared = false; 
            } else if (!isDead) {
                
                isDead = true;
                pacman.dx = 0;
                pacman.dy = 0;
                sounds.death.play();
                setTimeout(() => location.reload(), 2000);
            }
        }
    });
}

 


function pacmanTeleports() {
    const col = Math.floor(pacman.x / tileSize);
    const row = Math.floor(pacman.y / tileSize);

    if (map[row][col] === 4) {
        //Linha 8.5, Coluna 30, Teleportando pro 6
        pacman.x = 30 * tileSize;
        pacman.y = 8.5 * tileSize;
    }
    else if (map[row][col] === 6) {
        //Linha 8.5, Coluna 1, Teleportando pro 4
        pacman.x = 1 * tileSize;
        pacman.y = 8.5 * tileSize;
    }if (map[row][col] === 4) {
        //Linha 8.5, Coluna 30, Teleportando pro 6
        ghosts.x = 30 * tileSize;
        ghosts.y = 8.5 * tileSize;
    }
    else if (map[row][col] === 6) {
        //Linha 8.5, Coluna 1, Teleportando pro 4
        ghosts.x = 1 * tileSize;
        ghosts.y = 8.5 * tileSize;
    }
}
function powerUp() {
    const col = Math.floor(pacman.x / tileSize);
    const row = Math.floor(pacman.y / tileSize);

    if (map[row][col] === 5) {
        map[row][col] = 0;
        sounds.powerUp.play();

        ghosts.forEach(ghost => {
            ghost.scared = true;
            ghost.speed = 0.5;
        });
        setTimeout(() => {
            ghosts.forEach(ghost => {
                ghost.scared = false;
                ghost.speed = 0.7; 
            });
        }, 13000);
         }
}
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pacman.dx !== 0 || pacman.dy !== 0) {
        mouthAngle += mouthSpeed;
        if (mouthAngle > 0.25 * Math.PI || mouthAngle < 0.05 * Math.PI) {
            mouthSpeed *= -1;
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    movePacMan();
    moveGhosts();
    checkCollision();
    drawPacMan();
    drawGhosts();
    powerUp();
    requestAnimationFrame(gameLoop);
    pacmanTeleports();
}
mouthAngle += mouthSpeed;
if (mouthAngle >= 0.4 * Math.PI || mouthAngle <= 0.1 * Math.PI) {
    mouthSpeed *= -1;
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === 'w') { pacman.dx = 0; pacman.dy = -pacman.speed; pacman.startAngle = 1.75 * Math.PI; pacman.endAngle = 1.25 * Math.PI; }
    if (event.key === "ArrowDown" || event.key === 's') { pacman.dx = 0; pacman.dy = pacman.speed; pacman.startAngle = 0.25 * Math.PI; pacman.endAngle = 0.75 * Math.PI; }
    if (event.key === "ArrowLeft" || event.key === 'a') { pacman.dx = -pacman.speed; pacman.dy = 0; pacman.startAngle = 1.15 * Math.PI; pacman.endAngle = 1.85 * Math.PI; }
    if (event.key === "ArrowRight" || event.key === 'd') { pacman.dx = pacman.speed; pacman.dy = 0; pacman.startAngle = 0.15 * Math.PI; pacman.endAngle = 1.85 * Math.PI; }
});

// document.addEventListener("keyup", () => { pacman.dx = 0; pacman.dy = 0; });

gameLoop();