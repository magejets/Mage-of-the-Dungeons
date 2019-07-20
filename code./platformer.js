/****************************************
*      COPYRIGHT 2019 MAGE J LEWIS      *
****************************************/

//Canvas setup
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Keyboard variables
var up = false;
var right = false;
var left = false;
var space = false;

//How fast the player is traveling in the y direction
var speedY = 0;
//X speed
var speedX = 1;
//If the player was recently touching the ground
var falling = 0;
//To prevent the player from bouncing when the up key is held down
var jumpKey = 0;
//To make the player lose control in the air after wall jumping
var wallJump = 0;

//Decides which of the platforms to draw depending on the level
var level = 1;

//If the key has been found yet during the level
var keyFound = false;

//Moves with the player
var cameraY = 0;
var cameraX = 0;

//Where the player is in the level (for debugging purposes)
var realX;
var realY;

//Stores the codes of levers, so type 3 blocks disapear when their corresponding lever is pushed
var leverCodes = [];

//Player dictionary
var player = {
    x:10,
    y:310,
    width:20,
    height:30,
    direction: 1,
    lives: 3
};

//Dictionary for the player's bullet
var playerBullet = {
    x:levelDimensions.right+500,
    y:levelDimensions.right+500,
    width: 5,
    height: 5,
    direction: 1,
    firing: false
}


//Keyboard functions
function keyDownHandler(e){
    if(e.key == "Up" || e.key == "ArrowUp" || e.key == "w"){
        up = true;
    }
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d"){
        right = true;
    }
    if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a"){
        left = true;
    }
    if(e.key == " "){
        space = true;
    }
}
function keyUpHandler(e){
    if(e.key == "Up" || e.key == "ArrowUp" || e.key == "w"){
        up = false;
    }
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d"){
        right = false;
    }
    if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a"){
        left = false;
    }
    if(e.key == " " /*space bar*/){
        space = false;
    }
}

//Draw the player
function drawPlayer(){
    ctx.beginPath();
    ctx.rect(player.x,player.y,player.width,player.height);
    ctx.fillStyle = "#391c7c";
    ctx.fill();
    ctx.closePath();
}

//Draws the platforms based on the data in the levels.js file
function drawPlatforms(){
    for(var i = 0; i<platforms.length; i++){
        var p = platforms[i];
        if((p.level == level || p.level == 0) && (p.status == 1 || p.status == undefined)){
            ctx.beginPath();
            ctx.rect(p.x-cameraX,p.y-cameraY,p.width,p.height);
            if(p.type==1 || p.type == undefined){
                ctx.fillStyle = "#000000";
            }else if(p.type == 2){
                ctx.fillStyle = "#FF0000";
            }else if(p.type==3){
                ctx.fillStyle = "#ff00ff"
            }else if(p.type==4){
                if(p.active == false || p.active == undefined){
                    ctx.fillStyle = "#00ff00";
                }else{
                    ctx.fillStyle = "#550032"
                }
            }else if(p.type ==5){
                ctx.fillStyle = "#AA8800";
            }else{
                if(p.open == false){
                    ctx.fillStyle = "#2266CC";
                }else{
                    ctx.fillStyle = "#8844FF";
                }
            }
            ctx.fill();
            ctx.closePath();
        }
    }
}
//Collision detection, takes in 2 bodies and sees if they are touching
function collisionDetection(body1, body2){
    if(body1.x+body1.width > body2.x-cameraX && body1.x < body2.x+body2.width-cameraX && 
       body1.y+body1.height > body2.y-cameraY && body1.y < body2.y+body2.height-cameraY){
        return true;
    }else{
        return false;
    }
}

//Moves the player out of the ground when he hits it
function touchGround(up){
    falling += 1;
    for(var i =0; i<platforms.length;i++){
        var p = platforms[i];
        if((p.level == level || p.level == 0) && (p.status == 1 || p.status == undefined || p.status == 4)){
            while(collisionDetection(player,p)==true){
                if(up){
                    player.y += .5
                }else {
                    player.y -= .5; //this number must be equal to what speedY changes each time
                    falling = 0;
                }
                speedY = 0;

            }
        }
    }
}

//If you touch a lever, activate it
function touchLever(){
    for(var i =0; i<platforms.length;i++){
        var p = platforms[i];
        if((p.level == level || p.level == 0) && (p.status == 1 || p.status == undefined)){
            if(collisionDetection(player,p)==true && p.type == 4){
                if(p.active != undefined){
                    platforms[i].active = true;
                    leverCodes.push(p.code);
                    processLever();
                }
            }
        }
    }   
}

//If you are touching lava, return to the start of the level
function touchLava(){
    for(var i =0; i<platforms.length;i++){
        var p = platforms[i];
        if((p.level == level || p.level == 0) && (p.status == 1 || p.status == undefined)){
            if(collisionDetection(player,p)==true){
                if(p.type == 2){
                    teleport(10,310);
                }
            }
        }
    }
}

//If you touch the key, set keyFound to true
function touchKey(){
    for(var i = 0; i<platforms.length;i++){
        var p = platforms[i];
        if((p.level == level || p.level == 0)&& (p.status == 1 || p.status == undefined)){
            if(collisionDetection(player,p)==true){
                if(p.type == 5){
                    keyFound = true;
                    platforms[i].status = 0;
                    processKey();
                }
            }
        }
    }
}

//If the player touches the door after the key has been found, advance the level, and move the player to the begining
function touchDoor(){
    for(var i = 0; i<platforms.length;i++){
        var p = platforms[i];
        if((p.level == level || p.level == 0)&& (p.status == 1 || p.status == undefined)){
            if(collisionDetection(player,p)==true){
                if(p.type == 6){
                    teleport(10,310);
                    level++;
                }
            }
        }
    }
}

//Makes platforms disapear when the lever is pushed
function processLever(){
    for(var i = 0; i<platforms.length; i++){
        var p = platforms[i];
        if(p.type == 3){
            for(var j = 0; j<leverCodes.length; j++){
                if(p.code == leverCodes[i]){
                    platforms[i].status = 0; 
                }
            }
        }
    }
}

//If the key has been found, open the door
function processKey(){
    for(var i = 0; i<platforms.length; i++){
        var p = platforms[i];
        if(p.type == 6){
            if(keyFound){
                platforms[i].open = true;
            }
        }
    }
}

//Moves the monsters and checks collision detection
function updateMonsters(){
    for(var i = 0; i<monsters.length; i++){
        if(monsters[i].level == level){
            var m = monsters[i];
            if(m.x<m.xMin || m.x>m.xMax){
                monsters[i].direction*=-1;
            }
            monsters[i].x += m.direction;
            //console.log(collisionDetection(playerBullet,monsters[i]))
            if(playerBullet.x+playerBullet.width>monsters[i].x && playerBullet.x<monsters[i].x+monsters[i].width &&
               playerBullet.y+playerBullet.height>monsters[i].y && playerBullet.y<monsters[i].y+monsters[i].height){
                //console.log("true");
                monsters[i].lives-=1;
                playerBullet.firing = false;
                playerBullet.x = levelDimensions.right+500;
                playerBullet.y = levelDimensions.right+500;
            }
            if(collisionDetection(player,m)&&m.lives>0){
                teleport(10,310);
            }
            m = monsters[i]
            if(m.lives>0){
                ctx.beginPath();
                ctx.rect(m.x-cameraX,m.y-cameraY,m.width,m.height);
                if(m.type==1){
                    ctx.fillStyle = "#558800";
                }else if(m.type == 2){
                    ctx.fillStyle = "#AA0000";
                }else if(m.type==3){
                    ctx.fillStyle = "#332299"
                }else if(m.type==4){
                        ctx.fillStyle = "#AABBCC";
                }else if(m.type ==5){
                    ctx.fillStyle = "#AA1166";
                }else if(m.type == 6){
                    ctx.fillStyle = "#100120";
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//Draws and moves the bullet
function drawBullet(){
    if(playerBullet.firing){
        playerBullet.x+=playerBullet.direction*5;
    }
    //console.log(playerBullet.firing);
    for(var i = 0; i<platforms.length; i++){
        if(playerBullet.x+playerBullet.width>platforms[i].x && playerBullet.x<platforms[i].x+platforms[i].width &&
           playerBullet.y+playerBullet.height>platforms[i].y && playerBullet.y<platforms[i].y+platforms[i].height){
            console.log(platforms[i]);
            playerBullet.firing = false;
            playerBullet.x = levelDimensions.right+500;
            playerBullet.y = levelDimensions.right+500;
        }
    }
    ctx.beginPath();
    ctx.rect(playerBullet.x-cameraX,playerBullet.y-cameraY,playerBullet.width,playerBullet.height);
    ctx.fillStyle = "#FF00FF";
    ctx.fill();
    ctx.closePath();  
}

//Transports the player to a certain x and y. For debugging. Maybe feature in future
function teleport(x,y){
    player.x = x;
    player.y = y;
    cameraX = 0;
    cameraY = 0;
    speedY = 0;
    speedX = 0;
}
//Moves the player left and right, and detects walls
function walk(speed){
    player.x += speed;
    var slope;
    for(var i=0; i<platforms.length;i++){
        var p = platforms[i];
        if((p.level == level || p.level == 0) && (p.status == 1 || p.status == undefined)){
            slope = 0;
            while(slope < 8 && collisionDetection(player,p) == true){
                player.y -= 1;
                slope +=1;
            }
            //Touch functions that the player needs to be able to touch from the side go here
            touchLava();
            touchKey();
            touchDoor();
            
            if(slope >= 8){
                player.x -= speed;
                player.y += slope;
                if(up==true && Math.abs(speed)>2.3){
                    if(wallJump == 0){
                        speedX *= -1.2;
                        speedY = 9;
                        falling = 6;
                        wallJump = 15;
                    }
                }else{
                    speedX = 0;
                }
            }
        }
    }
}

//Moves the camera based on where the player is
function updateCamera(x,y){
    cameraX += x-canvas.width/2;
    cameraY += y-canvas.height/2;
}
//Main game loop
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(wallJump>0){
        wallJump -= 1;
    }else{
        speedX*=.8;
        if(left==true){
            speedX-=0.5;
            player.direction = -1
        }
        if(right==true){
            speedX+=0.5;
            player.direction = 1;
        }
    }
    if(Math.abs(speedX)>0.2){
        walk(speedX);
    }
    if(up == true){
        if(falling<3 && jumpKey==0){
            speedY = 10;
            jumpKey = 1;
        }
    } else {
        jumpKey = 0;
    }
    player.y -= speedY;
    if(speedY<4 || up== true){
        speedY -= .5;
    } else {
        speedY -= 1;
    }
    if(space == true && playerBullet.firing == false){
            playerBullet.firing = true;
            playerBullet.x = realX;
            playerBullet.y = realY+player.height/2;
            playerBullet.direction = player.direction;
    }
    if(playerBullet.firing == false){
        playerBullet.x = levelDimensions.right+500;
        playerBullet.y = levelDimensions.right+500;
    }
    touchLava();
    touchLever();
    touchKey();
    touchDoor();
    updateMonsters();
    drawBullet();
    touchGround(speedY>0);
    updateCamera(player.x,player.y);
    player.x = canvas.width/2;
    player.y = canvas.height/2;
    realX = cameraX+player.x;
    realY = cameraY+player.y;
    drawPlayer();
    drawPlatforms();
}

//Keyboard event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//Make the game loop actualy loop
setInterval(main, 10);
