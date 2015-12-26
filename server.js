var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var classes = require('./classes.js');

var playerList = [];
var loginFunc = 'login';
var listPlayersFunc = 'listPlayers';

app.get('/', function(req, res){
    res.sendFile(__dirname + '/test.html');
});

io.on('connection', function(socket){
    socket.on(loginFunc, function(username){
        var userid = guid();
        var player = new classes.Player(username);
        player.id = userid;
        io.emit(loginFunc, player.id + ' ' + player.sayHi());
        playerList.push(player);
    });
    socket.on(listPlayersFunc, function(){
        var players = listPlayers();
        io.emit(listPlayersFunc, players);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function listPlayers(){
    var players = '';
    for (var i = 0; i < playerList.length; i++){
        var player = playerList[i];
        players += player.name + ' ' + player.id + '<br/>';
    }
    return players;
}