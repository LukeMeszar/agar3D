var Player = function(userName) {
    this.name = userName;
    this.id = null;
    
    this.sayHi = function() {
        return 'My Name is: ' + this.name;
    }
}

exports.Player = Player;