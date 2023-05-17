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
}