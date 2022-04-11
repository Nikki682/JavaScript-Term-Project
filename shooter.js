const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timeToNextClown = 0;
let clownInterval = 500;
let lastTime = 0;

let clowns = [];
class Clown{
    constructor(){
        this.width = 100;
        this.height = 50;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this. height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
    }
    update(){
        this.x -= this. directionX;
    }
    draw(){
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}



function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deltatime = timestamp - lastTime;  //makes time the same despite computer power
    lastTime = timestamp
    //  console.log(timestamp);
    timeToNextClown += deltatime;
    if (timeToNextClown > clownInterval){
        clowns.push(new Clown());
        timeToNextClown = 0;
    };
    [...clowns].forEach(object => object.update()); 
    [...clowns].forEach(object => object.update()); // literal array and ...spread operator
    requestAnimationFrame(animate);
}
animate(0); //timestamp to start at 0