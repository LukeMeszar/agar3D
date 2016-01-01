var Player = function() {
    this.name = "";
    this.id = null;
    this.loc = null;
    this.radius = null;
    
    this.sayHi = function() {
        return 'My Name is: ' + this.name;
    }
}

exports.Player = Player;