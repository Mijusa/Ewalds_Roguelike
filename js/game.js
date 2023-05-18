//Function die den Canvas initialisiert
function setupCanvas() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = tileSize * (numTiles + uiWidth);
    canvas.height = tileSize * numTiles;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";    

    ctx.imageSmoothingEnabled = false;
}

//Function die die Sprites initialisiert/zeichnet
function drawSprite(sprite, x, y) {
    ctx.drawImage(
        spritesheet,
        sprite*16,
        0,
        16,
        16,
        x*tileSize,
        y*tileSize,
        tileSize,
        tileSize
    );
}

//Function die den Canvas cleart und neu zeichnet
function draw() {
    if(gameState == "running" || gameState == "dead") {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for(let i = 0; i < numTiles; i++) {
            for(let j = 0; j < numTiles; j++) {
                getTile(i, j).draw();
            }
        }

        for(let i = 0; i < monsters.length; i++) {
            monsters[i].draw();
        }

        player.draw();

        drawText("Level: " + level, 30, false, 40, "violet");
    }
}

//Function die ticks zählt
function tick() {
    for(let k = monsters.length - 1; k >= 0; k--) {
        if(!monsters[k].dead) {
            monsters[k].update();
        } else {
            monsters.splice(k, 1);
        }
    }

    if(player.dead) {
        gameState = "dead";
    }

    spawnCounter--;
    if(spawnCounter <= 0) {
        spawnMonster();
        spawnCounter = spawnRate;
        spawnRate--;
    }
}

function showTitle() {
    ctx.fillSytle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    gameState = "title";

    drawText("Dungeon Crawler", 30, true, 200, "white");
    drawText("Press any key to start", 30, true, 300, "white");
}

function startGame() {
    level = 1;
    startLevel(startingHp);

    gameState = "running";
}

function startLevel(playerHp) {
    spawnRate = 15;
    spawnCounter = spawnRate;

    generateLevel();

    player = new Player(randomPassableTile());
    player.hp = playerHp;

    randomPassableTile().replace(Exit);
}

function drawText(text, size, centered, textY, color) {
    ctx.fillStyle = color;
    ctx.font = size + "px monospace";
    let textX;
    if(centered) {
        textX = (canvas.width - ctx.measureText(text).width) / 2;
    }else {
        textX = canvas.width - uiWidth * tileSize + 25;
    }

    ctx.fillText(text, textX, textY);
}