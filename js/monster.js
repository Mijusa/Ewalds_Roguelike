//Eine Klasse die die Monster definiert
class Monster {
    constructor(tile, sprite, hp) {
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
    }

    //Update Function
    update() {
        this.doStuff();
    }

    doStuff() {
        let neighbors = this.tile.getAdjacentPassableNeighbors();

        neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);

        if(neighbors.length) {
            neighbors.sort((a, b) => a.dist(player.tile) - b.dist(player.tile));
            let newTile = neighbors[0];
            this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
        }
    }

    //Eine Methode die die Bewegung von Monstern prüft/möglich macht
    tryMove(dx, dy){
        let newTile = this.tile.getNeighbor(dx, dy);
        if(newTile.passable){
            if(!newTile.monster) {
                this.move(newTile);
            }
            return true; 
        }
    }

    //Eine Methode die Monster bewegt und das Vorherige Feld leert
    move(tile) {
        if(this.tile) {
            this.tile.monster = null;
        }
        this.tile = tile;
        this.monster = this;
    }

    //Methode die drawSprite aufruft 
    draw() {
        drawSprite(this.sprite, this.tile.x, this.tile.y);
    }
}

//Neue Klasse für den Spieler
class Player extends Monster {
    constructor(tile) {
        super(tile, 0, 3);
        this.isPlayer = true;
    }

    //Methode die die Bewegung des Spielers prüft/möglich macht
    tryMove(dx, dy) {
        if(super.tryMove(dx, dy)) {
            tick();
        }
    }
}

//Neue Klasse für die Monster Schildkröte
class turtle extends Monster {
    constructor(tile) {
        super(tile, 5, 1);
    }
}

//Neue Klasse für die Monster Huhn
class chicken extends Monster {
    constructor(tile) {
        super(tile, 6, 1);
    }
}

//Neue Klasse für die Monster Schnecke
class snail extends Monster {
    constructor(tile) {
        super(tile, 4, 1);
    }
}