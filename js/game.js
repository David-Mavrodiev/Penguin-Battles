var requestAnimationFrame = window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) { setTimeout (callback, 1000 / 30); };

var canvas = document.getElementById("canvas-id");
canvas.width = 800;
canvas.height = 570;
var context = canvas.getContext("2d");

var desertTextureImage = new Image();
desertTextureImage.src = "http://media.moddb.com/images/groups/1/4/3338/grass2_hsvnoise.jpg"

var spriteImagesUrls = {
    front: "./assets/sprites/sprite-front.png",
    back: "./assets/sprites/sprite-back.png",
    left: "./assets/sprites/sprite-left.png",
    right: "./assets/sprites/sprite-right.png"
}

var wallImage = new Image();
wallImage.src = "http://creativenerds.co.uk/wp-content/uploads/2013/11/brick-illustrations_thumb.jpg"

var eggImage = new Image();
eggImage.src = "http://images.clipartpanda.com/egg-clip-art-RcdK8EB9i.png"

var players = [];
var walls = [];
var eggs = [];
var Game = {};

Game.create = function(){    
    Client.askNewPlayer();
};

Game.getCoordinates = function(x, y, imageUrl){
    Client.sendTap(x, y, imageUrl);
};

Game.addNewPlayer = function(id,x,y){
    players.push({
        id: id,
        x: x,
        y: y,
        imageUrl: spriteImagesUrls.front
    });
};

Game.movePlayer = function(id, x, y, imageUrl){
    for(let i = 0; i < players.length; i++){
        if(players[i].id == id){
            players[i].x = x;
            players[i].y = y;
            players[i].imageUrl = imageUrl
        }
    }
};

Game.removePlayer = function(id){
    for(let i = 0; i < players.length; i++){
        if(players[i].id == id){
            players.splice(i, 1);
            break;
        }
    }
};

Game.removeWall = function(x, y){
    for(let i = 0; i < walls.length; i++){
        if(walls[i].x == x && walls[i].y == y){
            walls.splice(i, 1);
            break;
        }
    }
};

Game.addWall = function(x, y){
    walls.push({
        x: x,
        y: y,
        display: 0       
    });
}

Game.sendEgg = function(){
    Client.sendEgg();
}

Game.addEgg = function(egg){
    eggs.push(egg);
}

Game.updateEggs = function(data){
    eggs = data.slice(0);
}

Game.create();

function setupArgs(args){
    if(args.keyCode == 37){
        Game.getCoordinates(-5, 0, spriteImagesUrls.left);
    }
    if(args.keyCode == 38){
        Game.getCoordinates(0, -5, spriteImagesUrls.back);
    }
    if(args.keyCode == 39){
        Game.getCoordinates(5, 0, spriteImagesUrls.right);
    }
    if(args.keyCode == 40){
        Game.getCoordinates(0, 5, spriteImagesUrls.front);
    }
}

window.addEventListener("keydown", function (args) {  
    setupArgs(args)
}, false);

window.addEventListener("keyup", function (args) {  
    setupArgs(args)
    if(args.keyCode == 32){
        Game.sendEgg();
    }
}, false);

function update() {
    for(let i = 0; i < walls.length; i++){
        if(walls[i].display < 1){
            walls[i].display += 0.05
        }
    }
    setTimeout(update, 10); 
}

function draw() {      
    context.clearRect(0, 0, canvas.width, canvas.height);      
    context.globalAlpha = 1;                                    

    //Draw terrain
    for(let y = 0; y < 19; y++){
        for(let x = 0; x < 27; x++){
            context.drawImage(desertTextureImage, x * 30, y * 30, 30, 30)
        }
    }

    //Draw players
    for(let i = 0; i < players.length; i++){
        let playersImage = new Image();
        playersImage.src = players[i].imageUrl || spriteImagesUrls.front
        context.drawImage(playersImage, players[i].x, players[i].y, 30, 30)
    }

    //Draw walls
    for(let i = 0; i < walls.length; i++){
        context.globalAlpha = walls[i].display
        context.drawImage(wallImage, walls[i].x * 30, walls[i].y * 30, 30, 30)
    }

    //Draw eggs
    for(let i = 0; i < eggs.length; i++){
        context.drawImage(eggImage, eggs[i].x, eggs[i].y, 15, 15)
    }

    requestAnimationFrame(draw);      
}
update();     
draw(); 