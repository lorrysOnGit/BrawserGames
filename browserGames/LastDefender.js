//board
let boardWidth =  1280;
let boardHeight = 720;
let context;

//player
let playerWidth=40;
let playerHeight=75;
let playerX=boardWidth/2;
let platerY=0;
let playerImg;

let player = {
    x : playerX,
    y : platerY,
    width : playerWidth,
    height : playerHeight,
    vitality : 100
}
//hut
let hutWidth = 80;
let hutHeight = 150;
let hutX=600;
let hutY=525;
let hutImg;

let hut = {
    x : hutX,
    y : hutY,
    width : hutWidth,
    height : hutHeight,
    vitality : 100
}
// enemy1 elephant
let enemy1Array = [];
let enemy1Spawn=false;
let elephantCanDealDamage=false;
//projectile
let upProjectileArray = [];
let downProjectileArray = [];
let leftProjectileArray = [];
let rightProjectileArray = [];
let projectileSpeed=20;
let upProjectiles=false;
let downProjectiles=false;
let leftProjectiles=false;
let rightProjectiles=false;
let projectileDamamge=20;

//physics
let velocityY = 0;
let velocityX = 0;
let gravity = 0.4;
let friction = 1;
let stops=false;

let gameOver=false;

window.onload = function() {
    board = document.getElementById("board"); 
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //disegna giocatore
    context.fillStyle = "green";
    context.fillRect(player.x, player.y, player.width, player.height);
    requestAnimationFrame(update);
    setTimeout(enemy1,10000); //wait time for the first elephant to spawn
    setInterval(enemy1canDealDamage,1000);
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", jump);
    document.addEventListener("keyup",shoot);
}
function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    //hut
    context.fillStyle = "yellow";
    context.fillRect(hut.x,hut.y,hut.width,hut.height);
    
    if(hut.vitality<=0){
        gameOver=true;
    }

    //player movement & physics
    velocityY += gravity;
    if (stops==true){
        if(velocityX<0){
            velocityX += friction;
            }
            if(velocityX>0){
                velocityX -= friction;
            }
            if(velocityX<0.25&&velocityX>-0.25){
                velocityX=0;
                stops=false;
            }
    }
    if (player.y==600){
        if(velocityX<0){
        velocityX += friction;
        }
        if(velocityX>0){
            velocityX -= friction;
        }
        if(velocityX<1&&velocityX>-1){
            velocityX=0;
        }
    }
    player.y += velocityY;
    player.x += velocityX;
    player.y = Math.min(player.y + velocityY, 600);
    context.fillStyle = "green";
    context.fillRect(player.x, player.y, player.width, player.height);

    //enemy interaction and behavior + bullets functions
    enemyBehavior();
    if(player.vitality<=0){
        gameOver=true;
    }
    if(gameOver){
        console.log("game over");
        alert("game Over")
        player.y=platerY;
        player.x=playerX;
        enemy1Array = [];
        enemy2Array = [];
        enemy1Spawn=false;
        gameOver=false;
        hut.vitality=100;
        player.vitality=100;
        setTimeout(enemy1,10000);
        return;
        
    }
    
}
function movePlayer(e){
    if (e.key == "w" ) {
        if (player.y==600){
            //jump
            velocityY = -10;   
        }
    }
    if (e.key == "a"){
        velocityX = -7;
        friction=0;
    }
    if (e.key == "d"){
        velocityX = 7;
        friction=0; 
    }
    if (e.key == "s"){
        friction=0.4;
        if(player.y<600){   
            stops=true;     
        }
    }
}
function jump(e){
    if (e.key == "w" ) {
        if (player.y==600){
            //jump
            velocityY = -10;
        }
    }
    if(e.key == "a"){
        friction=1;
        if(player.y<600&&velocityX>-13){
            velocityX = -13;
            friction=1;
        }
    }
    if(e.key == "d"){
        friction=1;
        if(player.y<600&&velocityX<13){
            velocityX = 13;
            friction=1;
        }
    }
}
function shoot(e){
    if (e.code=="ArrowUp"){
        let projectileUp={
            x : player.x+playerWidth/2-2.5,
            y : player.y+5,
            width : 5,
            height : 10
        }
        upProjectileArray.push(projectileUp);
        upProjectiles=true;
        velocityY = 2;
    }
    if(e.code=="ArrowLeft"){
        let projectileLeft={
            x : player.x,
            y : player.y+playerHeight/3,
            width : 10,
            height :5 
        }
        leftProjectileArray.push(projectileLeft);
        leftProjectiles=true;
        velocityX =2;
        friction=0.25;
    }
    if(e.code=="ArrowRight"){
        let projectileRight={
            x : player.x+playerWidth/2,
            y : player.y+playerHeight/3,
            width : 10,
            height : 5
        }
        rightProjectileArray.push(projectileRight);
        rightProjectiles=true;
        velocityX = -2;
        friction=0.25;
    }
    if(e.code=="ArrowDown"){
        let projectileDown={
            x : player.x+playerWidth/2-5,
            y : player.y+playerHeight-10,
            width : 5,
            height : 10
        }
        downProjectileArray.push(projectileDown);
        downProjectiles=true;
        velocityY = -2;
    }
}
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
function enemy1(){
    
    if(enemy1Spawn==false){
        let enemy1 ={
        x: boardWidth,
        y: 520,
        width : 200,
        height : 170,
        damage : 10,
        vitality : 500,
        speed : -0.5
    }
    enemy1Array.push(enemy1);
    enemy1Spawn=true;
    console.log("nemico");
    }
    
    
}
function dealDamage(enemy){
    hut.vitality -= enemy.damage;
    console.log(hut.vitality);
}
function enemy1canDealDamage(){
    elephantCanDealDamage=true;
}
function playerCollision(enemy){
    if(player.x<=enemy.x+player.width){
        velocityX = -7;
    }
    else{
        velocityX = 7;
    } 
    if(player.y!=600){
        if(player.y+player.height<=enemy.y+10){
            console.log("stomp");
            enemy.vitality -=100;
            velocityX=0;
        }
            velocityY = -5;  
    }
    else{
        velocityY = -3;
    }
    if(player.y+player.height>enemy.y+20){
        player.vitality -= enemy.damage;
        console.log("hai preso danno");
    }
}
function enemyBehavior(){
    //elephant behavior
        if(enemy1Spawn==true){
            for(let i=0; i<enemy1Array.length;i++){
                let enemy = enemy1Array[i];
                if(detectCollision(hut,enemy)){
                    enemy.speed=0;
                    if(elephantCanDealDamage==true){
                        dealDamage(enemy);
                        elephantCanDealDamage=false;
                    }
                }
                if(detectCollision(player,enemy)){
                    playerCollision(enemy); 
                }
                bulletsOnEnemy(enemy);
                deadOrAlive(1,enemy);
            }
        }
        else{
            let enemy = {
                x: 0,
                y: 0,
                width : 0,
                height : 0,
                vitality : 0
            }
            bulletsOnEnemy(enemy);
        }
    }
function deadOrAlive(type,enemy){
    if(enemy.vitality>0){
        enemy.x += enemy.speed;
        context.fillStyle="red";
        context.fillRect(enemy.x,enemy.y, enemy.width, enemy.height);   
        }
    else{
        context.clearRect(enemy.x,enemy.y,enemy.width,enemy.height);
        enemy1Array.shift();
        setTimeout(enemy1,10000);
        switch (type) {
            case 1:
                enemy1Spawn=false;
                break;
        
            default:
                break;
        }
    }
}
function bulletCollision(enemy,projectile,dir){
      
    if(detectCollision(enemy,projectile)){
        switch (dir){
            case 1:
                upProjectileArray.shift();
                break;
            case 2:
                downProjectileArray.shift();
                break;
            case 3:
                leftProjectileArray.shift();
                break; 
            case 4:
                rightProjectileArray.shift();
                break;
        }
        context.clearRect(projectile.x,projectile.y, projectile.width, projectile.height);
        enemy.vitality -=projectileDamamge;
    } 
    
}
function bulletsOnEnemy(enemy){
    for(let i=0; i<4; i++){
        switch (i){
            case 0:
                bulletBehavior(1,enemy);
                break;
            case 1:
                bulletBehavior(2,enemy);
                break;
            case 2:
                bulletBehavior(3,enemy);
                break;
            case 3:
                bulletBehavior(4,enemy);
                break;
        }

    }
}
function bulletBehavior(dir,enemy){
    
    switch (dir){
        case 1:
            for(let i=0; i<upProjectileArray.length;i++){
                let projectile = upProjectileArray[i];
                bulletPhysics(projectile,dir);
                bulletCollision(enemy,projectile,dir);
                //clear upProjectiles
                while (upProjectileArray.length > 0 && upProjectileArray[0].y < 0) {
                    upProjectileArray.shift(); //removes the first element of the array
                }
                if(upProjectileArray[0]==null){
                    upProjectiles=false;
                }
            }
            break;
        case 2:
            for(let i=0; i<downProjectileArray.length;i++){
                let projectile = downProjectileArray[i];
                bulletPhysics(projectile,dir);
                bulletCollision(enemy,projectile,dir);
                //clear downProjectiles
                while (downProjectileArray.length > 0 && downProjectileArray[0].y > boardHeight) {
                    downProjectileArray.shift(); //removes the first element of the array
                }
                if(downProjectileArray[0]==null){
                    downProjectiles=false;
                }
            }
            break;
        case 3:
            //leftProjectile movement & physics
            for(let i=0; i<leftProjectileArray.length;i++){
                let projectile = leftProjectileArray[i];
                bulletPhysics(projectile,dir);
                bulletCollision(enemy,projectile,dir);
                //clear leftProjectiles
                while (leftProjectileArray.length > 0 && leftProjectileArray[0].x < 0) {
                    leftProjectileArray.shift(); //removes the first element of the array
                }
                if(leftProjectileArray[0]==null){
                    leftProjectiles=false;
                }
            }
            break; 
        case 4 :
            for(let i=0; i<rightProjectileArray.length;i++){
                let projectile = rightProjectileArray[i];
                bulletPhysics(projectile,dir);
                bulletCollision(enemy,projectile,dir);
                //clear rightProjectiles
                while (rightProjectileArray.length > 0 && rightProjectileArray[0].x > boardWidth) {
                    rightProjectileArray.shift(); //removes the first element of the array
                }
                if(rightProjectileArray[0]==null){
                    rightProjectiles=false;
                }
            }
            break;
    }

}
function bulletPhysics(projectile,dir){
    switch (dir){
        case 1:
            projectile.y -= projectileSpeed;
            context.fillStyle="red";
            context.fillRect(projectile.x,projectile.y, projectile.width, projectile.height);
            break;
        case 2:
            projectile.y += projectileSpeed;
            context.fillStyle="red";
            context.fillRect(projectile.x,projectile.y, projectile.width, projectile.height);
            break;
        case 3:
            projectile.x -= projectileSpeed;
            context.fillStyle="red";
            context.fillRect(projectile.x,projectile.y, projectile.width, projectile.height);
            break; 
        case 4:
            projectile.x += projectileSpeed;
            context.fillStyle="red";
            context.fillRect(projectile.x,projectile.y, projectile.width, projectile.height);
            break;
    }
}