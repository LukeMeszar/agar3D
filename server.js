var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var classes = require('./classes.js');

var playerList = [];
var loginFunc = 'login';
var listPlayersFunc = 'listPlayers';

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/test.html');
});

io.on('connection', function(socket){
    var player = new classes.Player();
    socket.on(loginFunc, function(username){
        player.name = username;
        player.id = socket.id;
        io.to(socket.id).emit(loginFunc, player.id + ' ' + player.sayHi());
        playerList.push(player);
    });
    socket.on(listPlayersFunc, function(){
        var players = listPlayers();
        io.to(socket.id).emit(listPlayersFunc, players);
    });
    
    socket.on('disconnect', function(){
        removePlayer(socket.id); 
        console.log('user' + socket.id + 'left');
    });
});



http.listen(8080, function(){
    console.log('listening on *:8080');
});

function listPlayers(){
    var players = '';
    for (var i = 0; i < playerList.length; i++){
        var player = playerList[i];
        players += player.name + ' ' + player.id + '<br/>';
    }
    return players;
}

function removePlayer(socketid){
    console.log('socket id pass to removePlayer() ' + socketid);
    for (var i = 0; i < playerList.length; i++){
        if (playerList[i].id === socketid){
            playerList.splice(i, 1);
        }

    }
}