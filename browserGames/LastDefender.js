//board
let boardWidth =  1280;
let boardHeight = 720;
let context;
let ground = 620;
let level =0;
let levelScore=1000;

//player
let playerWidth=40;
let playerHeight=80;
let playerX=boardWidth/2;
let platerY=0;
let playerImg;
let chargeDash=0;
let score = 0;

let player = {
    x : playerX,
    y : platerY,
    width : playerWidth,
    height : playerHeight,
    vitality : 100,
    healt : 100,
    speed: 7
}
//hut
let hutWidth = 80;
let hutHeight = 150;
let hutX=boardWidth/2-hutWidth;
let hutY=ground-hutHeight;
let hutImg;

let hut = {
    x : hutX,
    y : hutY,
    width : hutWidth,
    height : hutHeight,
    vitality : 100,
    healt : 100,
}
// enemy1 elephant
let enemy1Array = [];
let enemy1Spawn=false;
let elephantCanDealDamage=false;
const elephantWalk = new Image();
elephantWalk.src = "./media/immagini/elefante.png";
eleWalkFrame=0;
// enemy2 talpa
let nTalpe=0;//maximum talpe that can spawn
let enemy2Array = [];
let enemy2Count = 0;
let talpaCanDealDamage=false;
// enemy3 snakeTrower
let enemy3Array = [];
let birbAlive = false;
//enemy3.5 snake
let nSnek = 1; //maxumum snake that can spawn
let enemy4Array = [];
let snekCanSpawn = false;
let snekCount=0;
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
let time = 0.00;

let gameOver=false;

window.onload = function() {
    board = document.getElementById("board"); 
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //disegna giocatore
    context.fillStyle = "green";
    context.fillRect(player.x, player.y, player.width, player.height);
    setInterval(timer,10);
    requestAnimationFrame(update);
    setInterval(elephantGetFrame,120);
    setTimeout(enemy1,1000); //wait time for the first elephant to spawn
    setTimeout (enemy3(),30000);// wait time for the first birb to spawn
    setInterval(snekSpawn,3000);// snek spawn rate
    setInterval(enemy1canDealDamage,1000);
    setInterval(enemy2canDealDamage,500);
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);
    document.addEventListener("keyup",shoot);
}
function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    
    timer();
    
    viewScore();

    //hut
    hutAnimations();

    //player movement & physics
    playerPhysics();   

    //enemy interaction and behavior 
    enemyBehavior();

    //bullets physics
    bullets();

    //level up sistem
    levelUp();

    if(player.vitality<=0){
        gameOver=true;
    }
    if(gameOver){
        
        console.log("game over");
        alert("game Over");
        nTalpe=0;
        nSnek=1;
        level =0;
        score=0;
        levelScore=1000;
        player.y=platerY;
        player.x=playerX;
        enemy1Array = [];
        enemy2Array = [];
        enemy1Spawn=false;
        gameOver=false;
        hut.vitality=100;
        player.vitality=100;
        setTimeout(enemy1,10000);
        setTimeout(enemy2,1000);
        time = 0.00;
        return;  
    }
    
}
//per ora non molto ma giusto per la barra degli hp
function hutAnimations(){
    context.fillStyle="red";
    context.fillRect(hut.x,hut.y-40, hut.width/100*getHealtPecentage(hut), 20);
    context.fillStyle = "yellow";
    context.fillRect(hut.x,hut.y,hut.width,hut.height);
    if(hut.vitality<=0){
        gameOver=true;
    }
}
function playerPhysics(){
    context.fillStyle="red";
    context.fillRect(20,30,2*getHealtPecentage(player), 20);
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
    if (player.y==ground-playerHeight){
        chargeDash=0;
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
    player.y = Math.min(player.y + velocityY, ground-player.height);
    player.x = Math.min(player.x , boardWidth-player.width);
    player.x = Math.max(player.x , 0);
    context.fillStyle = "green";
    context.fillRect(player.x, player.y, player.width, player.height);
}
//quando il tasto viene premuto, il pesonaggio si muove.
function movePlayer(e){
    if (e.key == "w" ) {
        if (player.y==ground-playerHeight){
            //jump
            velocityY = -10;   
        }
    }
    if (e.key == "a"){
        if(player.y==ground-playerHeight){
            friction=0;
            velocityX = -player.speed;
        }
    }
    if (e.key == "d"){
        if(player.y==ground-playerHeight){
            velocityX = player.speed;
            friction=0; 
        }
    }
    //il tasto "s" di "stop" ferma il giocatore (anche in aria)
    if (e.key == "s"){
        friction=0.4;
        if(player.y<ground-playerHeight){   
            stops=true;     
        }
    }
    if(e.key == "p"){
        alert("PAUSE");
    }
}
//quando il tasto di muovimento viene rilasciato, quest'ultimo da un effentto "freno",
// che fa si che il giocatore si fermi.
//inoltre, questo freno rende il cambio di direzione meno instantaneo.
function stopPlayer(e){
    if (e.key == "w" ) {
        if (player.y==ground-playerHeight){
            //jump
            velocityY = -10;
        }
    }
    if(e.key == "a"){
        friction=1;
        if(player.y<ground-playerHeight&&velocityX>-13){
            chargeDash++;
            if(chargeDash==2){
                velocityX = -13;
                friction=1;
            }
        }
    }
    if(e.key == "d"){
        friction=1;
        if(player.y<ground-playerHeight&&velocityX<13){
            chargeDash++;
           if(chargeDash==2){
            velocityX = 13;
            friction=1;
           }
        }
    }
}
//quando il pulsante viene rilasciato, viene sparato il proiettile nella direzione voluta.
function shoot(e){
    if (e.code=="ArrowUp"){
        let projectileUp={
            x : player.x+2,
            y : player.y,
            width : 36,
            height : 36
        }
        upProjectileArray.push(projectileUp);
        upProjectiles=true;
        velocityY = 2;
    }
    if(e.code=="ArrowLeft"){
        let projectileLeft={
            x : player.x-playerWidth/2,
            y : player.y+playerHeight/3,
            width : 36,
            height :36 
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
            width : 36,
            height : 36
        }
        rightProjectileArray.push(projectileRight);
        rightProjectiles=true;
        velocityX = -2;
        friction=0.25;
    }
    if(e.code=="ArrowDown"){
        let projectileDown={
            x : player.x+2,
            y : player.y+playerHeight-20,
            width : 36,
            height : 36
        }
        downProjectileArray.push(projectileDown);
        downProjectiles=true;
        velocityY = -2;
    }
}
//funzione per la hitbox
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
//generatore di nemco1 (elefante)
function enemy1(){
    
    if(enemy1Spawn==false){
        let enemy1 ={
        x: boardWidth,
        y: ground-170,
        width : 200,
        height : 170,
        damage : 10,
        vitality : 1000,
        speed : -0.5,
        weight : 300,
        healt : 1000,
        name : "elefante"
    }
    enemy1Array.push(enemy1);
    enemy1Spawn=true;
    console.log("elefante");
    }
    
    
}
//generatore di nemico2 (talpe)
function enemy2(){
    if(enemy2Array.length==0){
        enemy2Count=0;
    }
    //vengono generate tante talpe quante il livello permette
    if(enemy2Array.length<nTalpe){
        let enemyX;
        //le talpe vengono generate in posti randomici(ovviamente non sotto la dispensa)
        do{
             enemyX = getRandomInt(9);
        }
        while(enemyX>3&&enemyX<6);
        enemyX*=boardWidth/9;

        let enemy ={
            x : enemyX,
            y : boardHeight-10,
            width : 36,
            height : 72,
            damage : 5,
            vitality : 60,
            undergroundSpeed : 0.3,
            speed : 1.5,
            velocityY : 0,
            pop : 5,
            weight : 30,
            healt : 60,
            name : "talpa"
        }
        enemy2Array.push(enemy);
        enemy2Count++;
        console.log("talpa");
        setTimeout(enemy2,1000);
    }
    else{setTimeout(enemy2,1000);}
}
//generatore di nemico3 (l'aquila)
function enemy3(){
    let enemy = {
        x : boardWidth,
        y : 36,
        height : 40,
        width : 50,
        vitality : 20,
        speed : 3,
        healt : 20,
        name : "birb"
    }
    enemy3Array.push(enemy);
    console.log("birb");
    birbAlive=true;

}
//generatore di nemico4 (serpente)
function enemy4(x,y){
    if(enemy4Array.length==0){
        snekCount=0;
    }
    if(enemy4Array.length<nSnek){
        let enemy = {
            x : x,
            y : y,
            height : 40,
            width : 50,
            vitality : 60,
            speed : 3,
            healt : 60,
            velocityY : 0,
            weight : 30,
            name : "snake"
        }
        enemy4Array.push(enemy);
        console.log("snek");
    }
}
//funzione che permette al nemico di fare danno alla dispensa
function dealDamage(enemy){
    hut.vitality -= enemy.damage;
    console.log(hut.vitality);
}
//attack speed dell'elefante
function enemy1canDealDamage(){
    elephantCanDealDamage=true;
}
//attack speed della talpa
function enemy2canDealDamage(){
    talpaCanDealDamage=true;
}
//una funziona che serve per fare in modo che non ci sia più di un serpente alla volta
function snekSpawn(){
    snekCanSpawn=true;
}
//quando ci si scontra con un nemico e non è uno stomp
//il protagonista ricevera del danno oltre a un knockback da quest'ultimo
function playerCollision(enemy){
    if(player.x<=enemy.x+player.width){
        velocityX = -7;
    }
    else{
        velocityX = 7;
    } 
    if(player.y!=ground){
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
    if (enemy2Count>0){
        for(let i=0; i<enemy2Array.length;i++){
            let enemy = enemy2Array[i];
            if(detectCollision(hut,enemy)){
                enemy.speed=0;
                if(talpaCanDealDamage==true){
                    dealDamage(enemy);
                    talpaCanDealDamage=false;
                }
            }
            if(detectCollision(player,enemy)){
                playerCollision(enemy); 
            }
            bulletsOnEnemy(enemy);
            deadOrAlive(2,enemy);
        }
    }
    if (birbAlive==true){
        for(let i=0; i<enemy3Array.length;i++){
            let enemy = enemy3Array[i];
            bulletsOnEnemy(enemy);
            deadOrAlive(3,enemy);
            if(snekCanSpawn){
                enemy4(enemy.x,enemy.y);
                snekCanSpawn=false;
            }
        }
    }
    if(enemy4Array.length>0){
        for(let i=0; i<enemy4Array.length;i++){
            let enemy = enemy4Array[i];
            bulletsOnEnemy(enemy);
            deadOrAlive(4,enemy);
            if(detectCollision(player,enemy)){
                player.speed=0;
                enemy.speed=0;
            }
            else{
                player.speed = 7;
            }
        }   
    }
}
function deadOrAlive(type,enemy){
    if(enemy.vitality>0){
        context.fillStyle="red";
        context.fillRect(enemy.x,enemy.y-40, enemy.width/100*getHealtPecentage(enemy), 20);
        switch (type) {
            case 1:
                enemy.x += enemy.speed;
                context.drawImage(elephantWalk,eleWalkFrame,0,288,288,enemy.x-30,enemy.y-35,enemy.width+35,enemy.height+35);
                break;
            case 2:
                enemy.y-=enemy.velocityY;
                if (enemy.speed<1.5){
                    enemy.speed += 0.25;
                }
                if (enemy.speed > 1.5){
                    enemy.speed -= 0.25;
                }
                if(enemy.y<ground-enemy.height){
                    enemy.velocityY-=gravity;
                    context.fillStyle="red";
                    context.fillRect(enemy.x,enemy.y, enemy.width, enemy.height);
                }
                if(enemy.y<=ground-enemy.height){
                    if(enemy.y>ground-enemy.height-1){
                        enemy.y=ground-enemy.height;
                        enemy.velocityY=0;
                    }
                    if(enemy.x>boardWidth/2){
                        enemy.x -= enemy.speed;
                    }
                    else{enemy.x += enemy.speed;}
                    
                    context.fillStyle="red";
                    context.fillRect(enemy.x,enemy.y, enemy.width, enemy.height);
                    
                }
                if(enemy.y<ground-(enemy.height)/2+1&&enemy.y>ground-(enemy.height)/2){
                        pop(enemy);
                    }
                if(enemy.y>ground-(enemy.height)/2){
                    enemy.y -= enemy.undergroundSpeed;
                    context.fillStyle="red";
                    context.fillRect(enemy.x,enemy.y, enemy.width, enemy.height);
                }
                break;
            case 3 : 
                if(enemy.x<player.x){
                    enemy.x += enemy.speed;
                }
                else if (enemy.x>player.x){
                    enemy.x -= enemy.speed;                    
                }
                context.fillRect(enemy.x,enemy.y, enemy.width, enemy.height);
                break;
            case 4 : 
                if (enemy.speed<1.5){
                    enemy.speed += 0.25;
                }
                if(enemy.y<=ground-enemy.height){
                    enemy.velocityY += gravity/3;
                    enemy.y += enemy.velocityY;
                }
                if(enemy.x<player.x){
                    enemy.x += enemy.speed;
                }
                else if (enemy.x>player.x){
                    enemy.x -= enemy.speed;                    
                }
                context.fillRect(enemy.x,enemy.y, enemy.width, enemy.height);
                break;   
                default:
                    break;
        }  
        }
    else{
        switch (type) {
            case 1:
                enemy1Spawn=false;
                score+=1000;
                enemy1Array.shift();
                setTimeout(enemy1,10000);
                break;
            case 2:
                enemy2Count--;
                score+=300;
                let position = enemy2Array.indexOf(enemy);
                enemy2Array.splice(position, 1);
                break;
            case 3:
                birbAlive = false;
                score+=250;
                enemy3Array.shift();
                setTimeout(enemy3,1000);
                break;
            case 4 : 
                let snekPosition = enemy4Array.indexOf(enemy);
                score+=150;
                enemy4Array.splice(snekPosition, 1);
                player.speed=7;
                break;
            default:
                break;
        }
    }
}
//funzione per l'animazione dell'elefante
function elephantGetFrame(){
if(eleWalkFrame!=1440-288){
    eleWalkFrame+=288;
}
else{
    eleWalkFrame=0;
}
}
//quando le talpe escono dal terreno, quest'ulme fanno un saltino 
function pop(enemy){
    enemy.y=ground-enemy.height;
    enemy.velocityY=enemy.pop;
}
//funzione per i proiettili
function bullets (){
    //controlla per ogni direzione, quanti proiettili ci sono 
    //e per ogni proiettile attiva la funziona "bulletPhisics"
    for(let i=0; i<4; i++){
        switch (i){
            case 0:
                for(let i=0; i<upProjectileArray.length;i++){
                let projectile = upProjectileArray[i];
                bulletPhysics(projectile,1);
            }
                break;
            case 1:
                for(let i=0; i<downProjectileArray.length;i++){
                let projectile = downProjectileArray[i];
                bulletPhysics(projectile,2);
            }
                break;
            case 2:
                for(let i=0; i<leftProjectileArray.length;i++){
                let projectile = leftProjectileArray[i];
                bulletPhysics(projectile,3);
            }
                break;
            case 3:
                for(let i=0; i<rightProjectileArray.length;i++){
                let projectile = rightProjectileArray[i];
                bulletPhysics(projectile,4);
            }
                break;
        }

    }
}
//disegna il proiettile e aggiorna la sua posizione
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
//quello che succede quando un proiettile colpisce un nemico
function bulletCollision(enemy,projectile,dir){
      
    if(detectCollision(enemy,projectile)){
        if (enemy.weight<100){
            if(enemy.name == "snake"){
                enemy.speed = -3;
            }
            else{
                if(player.x < enemy.x && enemy.x< hut.x){
                enemy.speed = 3;
                }else if(player.x > enemy.x && enemy.x > hut.x){
                    enemy.speed = 3;
                }
                else{
                    enemy.speed = -3;
                }
            }    
        }
        //distruzione del proiettile 
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
        //danno ricevuto dal nemico
        context.clearRect(projectile.x,projectile.y, projectile.width, projectile.height);
        enemy.vitality -=projectileDamamge;
    } 
}
//per ogni direzione, attiva il bulletBehavior. 
//così da lavorare con un vettore alla volta(per direzione).
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
//lavora sul controllare tutti i processi che un proiettile compie
//attraverso anche altre funzioni come bulletCollision;
//tra questi c'è anche il sistema per eliminare i proietttile quando esce dalla mappa.
function bulletBehavior(dir,enemy){
    
    switch (dir){
        case 1:
            for(let i=0; i<upProjectileArray.length;i++){
                let projectile = upProjectileArray[i];
                bulletCollision(enemy,projectile,dir);
                //clear upProjectiles
                while (upProjectileArray.length > 0 && upProjectileArray[0].y < 0) {
                    console.log("projectile destroyed");
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
                bulletCollision(enemy,projectile,dir);
                //clear downProjectiles
                while (downProjectileArray.length > 0 && downProjectileArray[0].y > boardHeight) {
                    console.log("projectile destroyed");
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
                bulletCollision(enemy,projectile,dir);
                //clear leftProjectiles
                while (leftProjectileArray.length > 0 && leftProjectileArray[0].x < 0) {
                    console.log("projectile destroyed");
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
                bulletCollision(enemy,projectile,dir);
                //clear rightProjectiles
                while (rightProjectileArray.length > 0 && rightProjectileArray[0].x > boardWidth) {
                    console.log("projectile destroyed");
                    rightProjectileArray.shift(); //removes the first element of the array
                }
                if(rightProjectileArray[0]==null){
                    rightProjectiles=false;
                    
                }
            }
            break;
    }

}
//funzione per il random number
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
//funzione per avere la percentuale di hp
function getHealtPecentage (enemy){
    return enemy.vitality/enemy.healt*100;
}
function timer(){
    time += 0.01;
    context.fillStyle = "white";
    context.font="60px impact";
    context.fillText(parseFloat(time.toFixed(3)), 1080,60);
}
//funzione per l'aumento di livello
function levelUp(){
    if(score>=levelScore){
        levelScore+=levelScore;
        level+=1;
        nTalpe+=1;
        nSnek+=1;
        hut.vitality+=25;
        if(hut.vitality>hut.healt){
            hut.healt=hut.vitality;
        }
        player.vitality+=25;
        if(player.vitality>player.healt){
            player.healt=player.vitality;
        }
        setTimeout(enemy2,1000);
        levelUpAnimation();
    }
}
function levelUpAnimation(){
    
    document.getElementById('levelUp').style.marginTop="150px ";
    document.getElementById('levelUp').style.opacity=1;

    setTimeout(nascondi,1500);
    
    
}
//funzione per visualizzare il punteggio
function viewScore(){
    context.fillStyle = "white";
    context.font="60px impact";
    context.fillText(parseFloat(score.toFixed(3)), 900,60);
}
function nascondi(){
        document.getElementById('levelUp').style.opacity=0;
        document.getElementById('levelUp').style.marginTop="200px";
    }