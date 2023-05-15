function tryDo(description, callback) {
    for(let timeout = 1000; timeout > 0; timeout--) {
        if(callback()) {
            return;
        }
    }
    throw 'Timeout while trying to ' + description;
}

function radnomRange(min, max) {
    return Math.floor(Math.random() * (min-max+1)) + min;
}