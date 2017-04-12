/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect(); // By default to localhost?

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendEgg = function(){
    Client.socket.emit('addegg');
}

Client.sendTap = function(x, y, imageUrl){
  Client.socket.emit('tap',{x:x, y:y, imageUrl: imageUrl});
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});

Client.socket.on('allwalls',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addWall(data[i].x,data[i].y);
    }
});

Client.socket.on('alleggs',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addEgg(data);
    }
});

Client.socket.on('eggsMove',function(data){
    Game.updateEggs(data);
});

Client.socket.on('move',function(data){
    Game.movePlayer(data.id, data.x, data.y, data.imageUrl);
});

Client.socket.on('addwall',function(data){
    Game.addWall(data.x, data.y);
});

Client.socket.on('addegg',function(data){
    Game.addEgg(data);
});

Client.socket.on('remove',function(id){
    Game.removePlayer(id);
});

Client.socket.on('removeWall',function(data){
    Game.removeWall(data.x, data.y);
});