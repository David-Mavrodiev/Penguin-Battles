//TODO: add package.json
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

let walls = [];
let eggs = [];

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;
server.lastEggID = 0;
server.playersList = [];

server.listen(process.env.PORT || 3001,function(){
    console.log('Listening on '+server.address().port);
});

function collisionDetection(x1, y1, w1, h1, x2, y2, w2, h2){
    if(x1 + w1 >= x2 && x1 <= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2){
        return true;
    }else{
        return false;
    }
}

function wallCollision(x, y, width, height){
    for(let i = 0; i < walls.length; i++){
        if(collisionDetection(x, y, width, height, walls[i].x * 30, walls[i].y * 30, 30, 30)){
            return true;
        }
    }
    return false;
}

io.on('connection', function(socket){

    socket.join("Default room");

    socket.on('newplayer',function(){
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(0, 27) * 30,
            y: randomInt(0, 19) * 30
        };
        socket.emit('allplayers',getAllPlayers());
        socket.emit('allwalls', getAllWalls());
        socket.emit('alleggs', getAllEggs());
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('tap',function(data){
            console.log('move '+data.x+', '+data.y);
            if(!wallCollision(socket.player.x + data.x, socket.player.y + data.y, 25, 25)){
                socket.player.x += data.x;
                socket.player.y += data.y;
                socket.player.imageUrl = data.imageUrl;
                io.sockets.in("Default room").emit('move',socket.player);
            }
        });

        socket.on('addegg', function(){
            let egg = {};
            egg.id = server.lastEggID++;
            if(socket.player.imageUrl.indexOf("left") != -1){
                egg.x = socket.player.x - 30;
                egg.y = socket.player.y + 10;
                egg.deltaX = -1;
                egg.deltaY = 0;
            }
            if(socket.player.imageUrl.indexOf("right") != -1){
                egg.x = socket.player.x + 30;
                egg.y = socket.player.y + 10;
                egg.deltaX = 1;
                egg.deltaY = 0;
            }
            if(socket.player.imageUrl.indexOf("back") != -1){
                egg.x = socket.player.x + 10;
                egg.y = socket.player.y - 30;
                egg.deltaX = 0;
                egg.deltaY = -1;
            }
            if(socket.player.imageUrl.indexOf("front") != -1){
                egg.x = socket.player.x + 10;
                egg.y = socket.player.y + 30;
                egg.deltaX = 0;
                egg.deltaY = 1;
            }
            eggs.push(egg);
            io.sockets.in("Default room").emit('addegg', egg);
        });

        socket.on('disconnect',function(){
            io.sockets.in("Default room").emit('remove',socket.player.id);
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });
});

function update(){
    let wall = {
        x: randomInt(0, 27),
        y: randomInt(0, 19)
    }
    walls.push(wall)
    io.sockets.in("Default room").emit('addwall', wall)
    setTimeout(update, 5000)
}

function updateEggsPosition(){
    for(let i = 0; i < eggs.length; i++){
        eggs[i].x += eggs[i].deltaX * 5;
        eggs[i].y += eggs[i].deltaY * 5;

        for(let j = 0; j < walls.length; j++){
           if(collisionDetection(eggs[i].x, eggs[i].y, 15, 15, walls[j].x * 30, walls[j].y * 30, 30, 30)){
             io.sockets.in("Default room").emit('removeWall', walls[j]);
             walls.splice(j, 1);
             eggs.splice(i, 1);
             break;
           }
        }
    }

    io.sockets.in("Default room").emit('eggsMove', eggs);
    setTimeout(updateEggsPosition, 10)
}

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function getAllWalls(){
    return walls;
}

function getAllEggs(){
    return eggs;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

update();
updateEggsPosition();