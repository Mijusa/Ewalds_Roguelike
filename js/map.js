//Function die die Map generiert
function generateLevel(){
    tryTo('generate map', function() {
        return generateTiles() == randomPassableTile().getConnectedTiles().length;
    });

    generateMonsters();

    for(let i = 0; i < 3; i++) {
        tile = randomPassableTile();

        while(tile.monster || tile == Player.tile) {
            tile = randomPassableTile();
        }

        tile.treasure = true;
    }
}

//Function die die Tiles generiert/Map generiert
function generateTiles() {
    let passableTiles = 0;

    tiles = [];
    for(let i = 0; i < numTilesWidth; i++) {
        tiles[i] = [];
        for(let j = 0; j < numTilesHeight; j++) {
            if(Math.random() < 0.3 || !inBounds(i, j)) {
                tiles[i][j] = new Wall(i,j);
            }else {
                tiles[i][j] = new Floor(i,j);

                passableTiles++;
            }
        }    
    }

    return passableTiles;
}

//Function die prüft ob ein Tile in den Grenzen liegt
function inBounds(x,y){
    return x > 0 && y > 0 && x < numTilesWidth-1 && y < numTilesHeight-1;
}

//Function die einen Tile zurückgibt
function getTile(x,y) {
    if(inBounds(x,y)) {
        return tiles[x][y];
    }else {
        return new Wall(x,y);
    }
}

//Function die einen zufälligen passierbaren Tile zurückgibt
function randomPassableTile() {
    let tile;
    tryTo('get random passable tile', function() {
        let x = randomRange(0, numTilesWidth - 1);
        let y = randomRange(0, numTilesHeight - 1);
        tile = getTile(x, y);
        return tile.passable && !tile.monster;
    });
    return tile;
}

//Function die Monster generiert
function generateMonsters() {
    monsters = [];
    let numMonsters = level + 1;
    for(let i = 0; i < numMonsters; i++) {
        spawnMonster();
    } 
}

//Function die Monster spwanen lässt
function spawnMonster() {
    let monsterType = shuffle([turtle, chicken, snail])[0];
    let monster = new  monsterType(randomPassableTile());
    monsters.push(monster);
}