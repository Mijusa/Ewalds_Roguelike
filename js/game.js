//Function die den Canvas initialisiert
function setupCanvas() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = tileSize * (numTilesWidth + uiWidth);
    canvas.height = tileSize * numTilesHeight;

    if(canvas.width > windowWidth()) {
        numTilesWidth--;
        canvas.width = tileSize * (numTilesWidth + uiWidth);
    }
    if(canvas.height > windowHeight() - 10) {
        numTilesHeight--;
        canvas.height = tileSize * numTilesHeight;
    }

    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";    
    ctx.imageSmoothingEnabled = false;
}

//Function die die Sprites initialisiert/zeichnet
function drawSprite(sprite, x, y) {
    ctx.drawImage(
        spritesheet,
        sprite * 16,
        0,
        16,
        16,
        x * tileSize + shakeX,
        y * tileSize + shakeY,
        tileSize,
        tileSize
    );
}

//Function die den Canvas cleart und neu zeichnet
function draw() {
    if(gameState == "running" || gameState == "dead") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        screenshake();

        for(let i = 0; i < numTilesWidth; i++) {
            for(let j = 0; j < numTilesHeight; j++) {
                getTile(i, j).draw();
            }
        }

        for(let i = 0; i < monsters.length; i++) {
            monsters[i].draw();
        }

        player.draw();

        drawText("Level: " + level, 30, false, 40, "violet");
        drawText("Score: " + score, 30, false, 70, "violet");

        for(let i = 0; i < player.spells.length; i++) {
            let spellText = i + 1 + ") " + (player.spells[i] || "");
            drawText(spellText, 20, false, 110 + i * 40, "aqua");
        }
    }
}

//Function die ticks zählt
function tick() {
    for(let k = monsters.length - 1; k >= 0; k--) {
        if(!monsters[k].dead) {
            monsters[k].update();
        }else {
            monsters.splice(k, 1);
        }
    }

    if(player.dead) {
        addScore(score, false);
        gameState = "dead";
    }

    spawnCounter--;
    if(spawnCounter <= 0) {
        spawnMonster();
        spawnCounter = spawnRate;
        spawnRate--;
    }
}

//Function die den Title zeigt
function showTitle() {
    //Resets the game size
    numTilesWidth = 9;
    numTilesHeight = 9;
    setupCanvas();

    ctx.fillSytle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    gameState = "title";

    drawText("Dungeon Crawler", 40, canvas.height / 2 - 110, "white");
    drawText("Press any key to start", 60, true, canvas.height / 2 - 50, "white");

    drawScores();
}

//Function die das game Startet und den gamestate auf running setzt
function startGame() {
    level = 1;
    score = 0;
    numSpells = 1;
    startLevel(startingHp);

    gameState = "running";
}

//Function die das Level generiert
function startLevel(playerHp) {
    spawnRate = 15;
    spawnCounter = spawnRate;

    generateLevel();

    player = new Player(randomPassableTile());
    player.hp = playerHp;

    randomPassableTile().replace(Exit);
}

//
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

//Function die Scores abruft
function getScore() {
    if(localStorage["scores"]) {
        return JSON.parse(localStorage["scores"]);
    }else {
        return [];
    }
}

//Function die Scores hinzufügt
function addScore(score, won) {
    let scores = getScore();
    let scoresObj = {score: score, run: 1, totalScore: score, active: won};
    let lastScore = scores.pop();

    if(lastScore) {
        if(lastScore.active) {
            scoresObj.run = lastScore.run + 1;
            scoresObj.totalScore += lastScore.totalScore;
        }else {
            scores.push(lastScore);
        }
    }
    scores.push(scoresObj);

    localStorage["scores"] = JSON.stringify(scores);
}

//Function die die Scores anzeigt
function drawScores() {
    let scores = getScore();
    if(scores.length) {
        drawText(
            rightPad(["RUN", "SCORES", "TOTAL"]),
            18,
            true,
            canvas.height / 2,
            "white"
        );

        let newestScore = scores.pop();
        scores.sort(function(a, b) {
            return b.totalScore - a.totalScore;
        });
        scores.unshift(newestScore);

        for(let i = 0; i < Math.min(10, scores.length); i++) {
            let scoreText = rightPad([scores[i].run, scores[i].score, scores[i].totalScore]);
            drawText(  
                scoreText,
                18,
                true,
                canvas.height / 2 + 24 + i * 24,
                i == 0 ? "aqua" : "violet"
            );
        }
    }
}

//Function die den Screenshake macht
function screenshake() {
    if(shakeAmount) {
        shakeAmount--;
    }
    let shakeAngle = Math.random() * Math.PI * 2;
    shakeX = Math.round(Math.cos(shakeAngle) * shakeAmount);
    shakeY = Math.round(Math.sin(shakeAngle) * shakeAmount);
}

function increaseLevel() {
    level++;
    numTilesWidth++;
    numTilesHeight++;

    console.log(numSpells < level + 1);
    console.log(score > level * 10);
    
    if(numSpells < level + 1 && score > level * 10) {
        increaseSpell();
    }

    console.log(Object.keys(spells).length <= level + 1 && score > level * 10);

    if(Object.keys(spells).length <= level + 1) {
        player.addSpell();
    }
}