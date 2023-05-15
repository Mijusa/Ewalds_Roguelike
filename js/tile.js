class Tile {
    constructor(x, y, sprite, passable) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.passable = passable;
    }

    getNeighbor(dx, dy) {
        return getTile(this.x + dx, this.y + dy)
    }

    getAdjacentNeighbors() {
        return shuffle([
            this.getNeighbor(0, -1),
            this.getNeighbor(0, 1),
            this.getNeighbor(-1, 0),
            this.getNeighbor(1, 0)
        ]);
    }

    draw(){
        drawSprite(this.sprite, this.x, this.y);
    }
}

class Floor extends Tile {
    constructor(x, y) {
        super(x, y, 2 , true);
    }
}

class Wall extends Tile {
    constructor(x, y) {
        super(x, y, 3, false);
    }
}