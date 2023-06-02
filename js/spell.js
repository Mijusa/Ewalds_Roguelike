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
    EARTHQUAKE : function() {
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
        Math.min(Math.random() < 0.2 ? player.hp += 2: player.hp++, maxHp);
    },

    //Reset Level
    RESET : function() {
        startLevel(Math.min(maxHp, player.hp + 1));
    },

    //Thunder Storm

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