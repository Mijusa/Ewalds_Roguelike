//Eine Klasse die die Monster definiert
class Monster{
    constructor(tile, sprite, hp){
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
        this.dmg = 1;
        this.teleportCounter = (level === 1) ? 2 : 3;
        this.offsetX = 0;
        this.offsetY = 0;
        this.lastMove = [-1, 0];
    }

    heal(damage){
        this.hp = Math.min(maxHp, this.hp+damage);
    }

    update(){
        this.teleportCounter--;

        if(this.stunned || this.teleportCounter > 0){
            this.stunned = false;
            return;
        }

        this.doStuff();
    }

    doStuff(){
       let neighbors = this.tile.getAdjacentPassableNeighbors();
       
       neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);

       if(neighbors.length){
           neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
           let newTile = neighbors[0];
           this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
       }
    }

    getDisplayX(){
        return this.tile.x + this.offsetX;
    }

    getDisplayY(){
        return this.tile.y + this.offsetY;
    }

    draw(){
        if(this.teleportCounter > 0){
            drawSprite(8, this.getDisplayX(), this.getDisplayY())
        }else{
            drawSprite(this.sprite, this.getDisplayX(), this.getDisplayY());
            this.drawHp();
        }

        this.offsetX -= Math.sign(this.offsetX) * (1 / 8);
        this.offsetY -= Math.sign(this.offsetY) * (1 / 8);
    }

    drawHp(){
        for(let i=0; i<this.hp; i++){
            drawSprite(
                7,
                this.getDisplayX() + (i%3)*(5/16),
                this.getDisplayY() - Math.floor(i/3)*(5/16)
            );
        }
    }   

    tryMove(dx, dy){
        let newTile = this.tile.getNeighbor(dx,dy);
        if(newTile.passable){
            this.lastMove = [dx,dy];
            if(!newTile.monster){
                this.move(newTile);
            }else{
                if(this.isPlayer != newTile.monster.isPlayer){
                    this.attackedThisTurn = true;
                    newTile.monster.stunned = true;
                    newTile.monster.hit(this.dmg);

                    shakeAmount = 5;

                    this.offsetX = (newTile.x - this.tile.x) / 2;
                    this.offsetY = (newTile.y - this.tile.y) / 2;
                }
            }
            return true;
        }
    }

    hit(damage){
        this.hp -= damage;
        if(this.hp <= 0){
            this.die();
        }
    }

    die(){
        this.dead = true;
        this.tile.monster = null;
        this.sprite = 1;

        score++;
        kills++;

        checkForNewSpell();
    }

    move(tile){
        if(this.tile){
            this.tile.monster = null;

            this.offsetX = this.tile.x - tile.x;
            this.offsetY = this.tile.y - tile.y;
        }
        this.tile = tile;
        tile.monster = this;

        tile.stepOn(this);
    }
}

//Neue Klasse für den Spieler
class Player extends Monster {
    constructor(tile) {
        super(tile, 0, 3);
        this.isPlayer = true;
        this.teleportCounter = 0;
        this.spells = shuffle(Object.keys(spells)).splice(0, numSpells);
    }

    //Methode die die Bewegung des Spielers prüft/möglich macht
    tryMove(dx, dy) {
        if(super.tryMove(dx, dy)) {
            tick();
        }
    }

    addSpell() {
        let newSpell = shuffle(Object.keys(spells))[0];
        this.spells.push(newSpell);
    }

    castSpell(index) {
        let spell = this.spells[index];
        if(spell) {
            delete this.spells[index];
            spells[spell]();
            tick();
        }
    }
}

//Neue Klasse für die Monster Schildkröte
class Turtle extends Monster {
    constructor(tile) {
        super(tile, 5, 3);
    }

    update() {
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned) {
            this.stunned = true;
        }
    }
}

//Neue Klasse für die Monster Huhn
class Chicken extends Monster {
    constructor(tile) {
        super(tile, 6, 1);
    }
}

//Neue Klasse für die Monster Schnecke
class Snail extends Monster {
    constructor(tile) {
        super(tile, 4, 2);
    }
}

class Snake extends Monster {
    constructor(tile) {
        super(tile, 22, 1);
    }

    doStuff(){
		this.attackedThisTurn = false;
		super.doStuff();

		if(!this.attackedThisTurn){
			super.doStuff();
		}
	}
}

class Farmer extends Monster {
    constructor(tile) {
        super(tile, 23, 2);
        this.dmg = Math.round(Math.sqrt(Math.round(Math.sqrt(kills))));
    }
}

class Shroom extends Monster {
    constructor(tile) {
        super(tile, 24, 3);
    }
}
