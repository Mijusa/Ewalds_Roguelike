//Eltern-Klasse für den Hintergrund
class Tile {
    constructor(x, y, sprite, passable) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
    }

    replace(newTileType){
        tiles[this.x][this.y] = new newTileType(this.x, this.y);
        return tiles[this.x][this.y];
    }

    //Manhatten Distance Funktion
    //Damit die Monster wissen, wie weit sie vom Spieler entfernt sind
    dist(other){
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    //Gibt das Tile zurück, das sich in der angegebenen Richtung befindet
    getNeighbor(dx, dy) {
        return getTile(this.x + dx, this.y + dy)
    }

    //Gibt ein Array mit allen Nachbarn zurück
    //Die Reihenfolge ist zufällig
    getAdjacentNeighbors() {
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0)
        ]);
    }

    //Gibt ein Array mit allen Nachbarn zurück, die passierbar sind
    getAdjacentPassableNeighbors(){
        return this.getAdjacentNeighbors().filter(t => t.passable);
    }

    //Gibt ein Array mit allen Tiles zurück, die mit diesem Tile verbunden sind
    getConnectedTiles() {
        let connectedTiles = [this];
        let frontier = [this];
        while(frontier.length){
            let neighbors = frontier.pop()
                                .getAdjacentPassableNeighbors()
                                .filter(t => !connectedTiles.includes(t));
            connectedTiles = connectedTiles.concat(neighbors);
            frontier = frontier.concat(neighbors);
        }
        
        return connectedTiles;
    }

    //Zeichnet das Tile
    draw(){
        drawSprite(this.sprite, this.x, this.y);

        if(this.treasure){
            drawSprite(10, this.x, this.y);
        }

        if(this.effectCounter) {
            this.effectCounter--;
            ctx.globalAlpha = this.effectCounter / 30;
            drawSprite(this.effect, this.x, this.y);
            ctx.globalAlpha = 1;
        }
    }

    setEffect(effectSprite) {
        this.effect = effectSprite;
        this.effectCounter = 60;
    }
}

class Floor extends Tile {
    constructor(x, y) {
        super(x, y, 2 , true);
    }

    stepOn(monster) {
        if(monster.isPlayer && this.treasure) {
            this.treasure = false;
            score++;
            spawnMonster();

            checkForNewSpell();
        }
    }
}

class Wall extends Tile {
    constructor(x, y) {
        super(x, y, 3, false);
    }
}

class Exit extends Tile {
    constructor(x, y) {
        super(x, y, 9, true);
    }

    stepOn(monster) {
        if(monster.isPlayer) {
            if(level == numLevels) {
                addScore(score, true);
                    
                showTitle();
            }else {
                increaseLevel();

                setupCanvas();
                startLevel(Math.min(maxHp, player.hp + 1));
            }
        }
    }
}

class SporeFloor extends Tile {
    constructor(x, y) {
        super(x, y, 21 , true);
        this.spores = 3;
    }

    stepOn(monster) {
        if(monster.isPlayer && this.treasure) {
            this.treasure = false;
            score++;
            spawnMonster();

            checkForNewSpell();
        }

        if(monster) {
            monster.stunned = true;
            monster.hit(1);
        }
    }
}
