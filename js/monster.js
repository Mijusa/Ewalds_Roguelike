//Eine Klasse die die Monster definiert
class Monster {
    constructor(tile, sprite, hp) {
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
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
}