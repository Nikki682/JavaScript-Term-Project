const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;



let score = 0;
let gameOver = false;
ctx.font = '50px Impact';


let timeToNextClown = 0; // milisec between frame
let clownInterval = 500; // trigger time tonextclown
let lastTime = 0; //value on previous loop


let clowns = [];
class Clown{
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;    //make diffrent sizes
        this.height = this.spriteHeight * this.sizeModifier; 
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this. height);
        this.directionX = Math.random() * 5 + 3;  // horizontal speed
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();   //start of sprite sheet animations
        this.image.src = 'media/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
       
    }
    update(deltatime){
        if (this.y < 0 || this.y > canvas.height - this.height){
            this.directionY = this.directionY * -1;     //makes enemy bounce of screen insteadof disapearing off screen
        }                                                
        this.x -= this. directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltatime;
        if (this.timeSinceFlap > this.flapInterval){
           if (this.frame > this.maxFrame) this.frame = 0;
        else this.frame++;
        this.timeSinceFlap = 0;
        }
        if(this.x < 0 - this.width) gameOver = true;
    }
    
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                      this.x, this.y, this.width, this.height);
    }
}

let explosions = [];
class Explosion {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'media/poof.png';        //+++
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'media/zap.mp3';    //+++
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }
    update(deltatime){
        if (this.frame ===0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 
                      this.x, this.y - this.size/4, this.size, this.size);
    }
}

function drawScore(){
    ctx.fillStyle = 'red';
    ctx.fillText('Score: ' + score, 50, 75); // text shadow
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 55, 80); 
}
function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER! YOUR SCORE: ' + score, canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER! YOUR SCORE: ' + score, canvas.width/2, canvas.height/2 + 5);
}

window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    clowns.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
            // collision detected on colors on col. canvas
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
            //console.log(explosions);
        }
    })
});

function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltatime = timestamp - lastTime;  //makes time the same despite computer power
    lastTime = timestamp
    //  console.log(timestamp);
    timeToNextClown += deltatime;   //deltatime is differnce between last frame and current
    if (timeToNextClown > clownInterval){
        clowns.push(new Clown());
        timeToNextClown = 0;
        clowns.sort(function(a,b){
            return a.width - b.width;  //small drawn 1st big in front
        });
    };
    drawScore();
    [...clowns, ...explosions].forEach(object => object.update(deltatime)); 
    [...clowns, ...explosions].forEach(object => object.draw()); // literal array and ...spread operator
    clowns = clowns.filter(object => !object.markedForDeletion); //fill array with markedForDeletion objects
    explosions = explosions.filter(object => !object.markedForDeletion); //fill array with markedForDeletion explosions
    if (!gameOver)requestAnimationFrame(animate);
    else drawGameOver();
}
animate(0); //timestamp to start at 0