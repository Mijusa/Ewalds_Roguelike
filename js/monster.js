class Monster {
    constructor(tile, sprite, hp){
        this.tile = tile;
        this.sprite = sprite;
        this.hp = hp;
    }

    tryMove(dx, dy){
        let newTile = his.tile.getNeighbour(dx, dy);
    }

    draw() {
        drawSprite(this.sprite, this.tile.x, this.tile.y);
    }
}