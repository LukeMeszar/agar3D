var Player = function() {
    this.name = "";
    this.id = null;
    
    this.sayHi = function() {
        return 'My Name is: ' + this.name;
    }
}

exports.Player = Player;