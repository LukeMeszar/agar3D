var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var classes = require('./classes.js');

var playerList = [];
var loginFunc = 'login';
var listPlayersFunc = 'listPlayers';
var sendLocationFunc = 'sendLocation';

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/test.html');
});

io.on('connection', function(socket){
    console.log('user ' + socket.id + ' joined');
    var player = new classes.Player();
    player.id = socket.id;
    player.radius = 1;
    playerList.push(player);
    /*socket.on(loginFunc, function(username){
        player.name = username;
        player.id = socket.id;
        io.to(socket.id).emit(loginFunc, player.id + ' ' + player.sayHi());
        playerList.push(player);
    });*/
    socket.on(listPlayersFunc, function(){
        var players = listPlayers();
        io.to(socket.id).emit(listPlayersFunc, players);
    });
    
    socket.on('disconnect', function(){
        removePlayer(socket.id); 
        console.log('user ' + socket.id + ' left');
    });
    
    socket.on(sendLocationFunc, function(loc){
        listPlayers();
        var curPlayer = updateLocation(loc, socket.id);
        collisionChecking(curPlayer);
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
    for (var i = 0; i < playerList.length; i++){
        if (playerList[i].id === socketid){
            playerList.splice(i, 1);
        }

    }
}


function collisionChecking(curPlayer){
    console.log('Cur player id: ' + curPlayer.id);
    console.log('Current Player location:\n x: ' + JSON.stringify(curPlayer.loc));
    for (var i = 0; i < playerList.length; i++){
        if (playerList[i].id !== curPlayer.id && playerList[i].loc !== null){
            var otherPlayer = playerList[i];
            console.log('Other player id: ' + otherPlayer.id);
            console.log(i + '\'s Player location:\n x: ' + JSON.stringify(otherPlayer.loc));
            var coordCalculation = Math.pow((curPlayer.loc.x - otherPlayer.loc.y), 2) + 
            Math.pow((curPlayer.loc.y - otherPlayer.loc.y), 2) + Math.pow((curPlayer.loc.z - otherPlayer.loc.z), 2);
            var radiusCalculatoin = Math.pow((curPlayer.radius + otherPlayer.radius), 2);
            console.log('Coord Calculation: ' + coordCalculation);
            console.log('Rad Calculation' + radiusCalculatoin);
            if (coordCalculation < radiusCalculatoin){
                console.log('Collsion!');
            }
            else{
                console.log('Safe');
            }
        }
        
    }
}

function updateLocation(loc, id){
    //var randRad = Math.random() * (10 - 0);
    var randRad = 2;
    for (var i = 0; i < playerList.length; i++){
        if (playerList[i].id === id){
            playerList[i].loc = loc;
            playerList[i].radius = randRad;
            return playerList[i];
        }
    }
}