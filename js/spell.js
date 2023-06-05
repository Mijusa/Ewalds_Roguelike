spells = {
    //random Teleport für den Spieler
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

        shakeAmount = 20;
    },

    //Dash läuft in die richtung in die der spieler schaut
    DASH : function() {
        let direction = player.lastMove;
        let tile = player.tile;

        while(true) {
            let nextTile = tile.getNeighbor(direction[0], direction[1]);
            if(nextTile.passable && !nextTile.monster) {
                tile = nextTile;
            }else {
                break;
            }
        }

        if(player.tile != tile) {
            player.move(tile);
            tile.getAdjacentNeighbors().forEach(t => {
                if(t.monster) {
                    t.monster.hit(1);
                    if(t.monster) {
                        t.monster.stunned = true;
                    }
                }
            });
        }

        let tiles = player.tile.getAdjacentPassableNeighbors();
        for(let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];
            if(tile.monster) {
                tile.monster.stunned = true;
            }
        }
    },

    //Feuerball für jedes monster das in laufrichtung des spielers steht bekommt es 2 schaden
    FIREBALL : function() {
        let direction = player.lastMove;

        if(direction[0] == 0) {
            if(direction[1] == -1)
                travel(direction, 2, 19); 
            if(direction[1] == 1)
                travel(direction, 2, 13);  
        }else if(direction[0] == 1) {
            travel(direction, 2, 18); 
        }else {
            travel(direction, 2, 17)
        }
    },


    //Heal für den Spieler
    HEAL : function() {
        Math.min(Math.random() < 0.2 ? player.hp += 2: player.hp++, maxHp); 

        let tiles = player.tile.getAdjacentNeighbors();
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].setEffect(21);
        }

        player.tile.setEffect(21); 
    },

    //Reset Level
    RESET : function() {
        startLevel(Math.min(maxHp, player.hp + 1));
    },

    RESPAWN : function() {
        for(let i=0;i<monsters.length;i++){
            monsters[i].move(randomPassableTile());
            monsters[i].teleportCounter = 2;
        }
    },

    //Thunder Storm für jedes monster das vertikal oder horizontal vom spieler steht bekommt es 1 schaden
    THUNDERSTORM : function() {
        let directions = [[0,1], [0,-1], [1,0], [-1,0]];

        for(let i = 0; i < directions.length; i++) {
            if(directions[i][0] == 0) {
                travel(directions[i], 2, 11);
            }else {
                travel(directions[i], 2, 12);
            }
        }
    },

    //Blitz für jedes monster das diagonal vom spieler steht bekommt es 1 schaden
    X : function() {
        let directions = [[1,1], [1,-1], [-1,1], [-1,-1]];

        for(let i = 0; i < directions.length; i++) {
            travel(directions[i], 2, 20);
        }
    },


    //Tsunami für jedes monster das auf der Unteren hälfte der map steht bekommt es 1 schaden
    TSUNAMI : function() {
        for(let i = 0; i < numTilesWidth; i++) {
            for(let j = numTilesHeight; j > (numTilesHeight - 1) / 2; j--) {
                let tile = getTile(i,j);

                if(tile.passable) {
                    tile.setEffect(16);
                }

                if(tile.monster) {
                    tile.monster.hit(2);
                }
            }
        }
    },

    //Tornado greift alle monster an die neben dem spieler stehen
    TORNADO : function() {
        let tiles = player.tile.getAdjacentPassableNeighbors();

        for(let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];

            if(tile.passable) {
                tile.setEffect(15);
            }

            if(tile.monster) {
                tile.monster.hit(1);
            }
        }
    },

    //Blizzard für jedes monster das auf der oberen hälfte der map steht bekommt es 1 schaden
    BLIZZARD : function() {
        for(let i = 0; i < numTilesWidth; i++) {
            for(let j = 0; j < numTilesHeight / 2; j++) {
                let tile = getTile(i,j);

                if(tile.passable) {
                    tile.setEffect(14);
                }
                
                if(tile.monster) {
                    tile.monster.hit(2);
                }
            }
        }
    }
}

function travel(direction, damage, effect) {
    let tile = player.tile;
    while(true) {
        let nextTile = tile.getNeighbor(direction[0], direction[1]);

        if(nextTile.passable) {
            tile = nextTile;

            if(tile.monster) {
                tile.monster.hit(damage);
            }

            tile.setEffect(effect);
        }else {
            break;
        }
    }
}