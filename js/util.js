function tryTo(description, callback) {
    for(let timeout = 1000; timeout > 0; timeout--) {
        if(callback()) {
            return;
        }
    }
    throw 'Timeout while trying to ' + description;
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr){
    let temp, r;
    for (let i = 1; i < arr.length; i++) {
        r = randomRange(0,i);
        temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
    }
    return arr;
}

function rightPad(arr) {
    let finalText = "";
    arr.forEach(text => {
        text += "";
        for(let i = text.length; i < 10; i++) {
            text += " ";
        }
        finalText += text;
    });
    
    return finalText;
}

function windowHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function windowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function checkForNewSpell() {
    if(score % 10 == 0 && numSpells < level + 1) {
        increaseSpell();
    }
}

function increaseSpell() {
    numSpells++;
    player.addSpell();
}

/*
score / 10 wenn modulo 0 neuen sell außer wenn das level zu niedrig ist

bei level up neuer check ob es ein neues spell gibt

also muss level mit score modulo 10 verglichen werden

also wenn level + 2 > score / 10 dann numSpells++ und player.addSpell() 

*/
