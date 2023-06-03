//TODO Spells 
//TODO 

spells = {
    WOOP : function() {
        player.move(randomPassableTile())
    },

    NOTHING : function() {
        // do nothing
    },

    //Erdebeben für jede wand an der ein monster sthet bekommt es 2 schaden
    Erdbeben : function() {
        for(let i = 0; i < numTilesWidth; i++) {
            for(let j = 0; j < numTilesHeight; j++) {
                let tile = getTile(i,j);
                if(tile.monster) {
                    let numWalls = 4 - tile.getAdjacentPassableNeighbors().length;
                    tile.monster.hit(numWalls * 2);
                }
            }
        }

        shakeAmnount = 10;
    },

    //Heal für den Spieler
    HEAL : function() {
        Math.random() < 0.2 ? player.hp += 2: player.hp++;
    },

    //Reset Level
    RESET : function() {
        startLevel(Math.min(maxHp, player.hp + 1));
    },

    //Thunder Storm für jedes monster das vertikal oder horizontal vom spieler steht bekommt es 1 schaden
    THUNDERSTORM : function() {
        let directions = [[0,1], [0,-1], [1,0], [-1,0]];

        for(let i = 0; i < directions.length; i++) {
            travel(directions[i], 1);
        }
    },

    //Tsunami

    //Tornado
    TORNADO : function() {
        let tiles = player.tile.getAdjacentPassableNeighbors();

        for(let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];

            if(tile.monster) {
                tile.monster.hit(1);
            }
        }
    },

}

function travel(direction, damage) {
    let tile = player.tile;
    while(true) {
        let nextTile = tile.getNeighbor(direction[0], direction[1]);

        if(nextTile.passable) {
            tile = nextTile;

            if(tile.monster) {
                tile.monster.hit(damage);
            }
        }else {
            break;
        }
    }
}