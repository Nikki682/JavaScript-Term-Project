const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const mole= document.querySelectorAll('.mole');
const countdownBoard =document.querySelector('.countdown');
const startButton = document.querySelector('.startButton');

let lastHole;
let timeUp = false;
let timeLimit = 20000;
let score = 0;
let countdown;

function pickRandomHole(holes){
    const randomHole = Math.floor(Math.random() * holes.length);
    const hole = holes[randomHole];
    if(hole === lastHole){
        return pickRandomHole(holes);
    }
    lastHole = hole;
    return hole;
}
function popUp(){
    const time = Math.random() * 1300 + 400;
    const hole = pickRandomHole(holes);
    hole.classList.add('up');
    setTimeout(function(){
        hole.classList.remove('up');
        if(!timeUp) popUp();
    }, time); 
}
// popUp();

function startGame(){
    countdown = timeLimit/1000;
    scoreBoard.textContent = 0;
    scoreBoard.getElementsByClassName.display = 'block';
    timeUp = false;
    score = 0;
    popUp();
    setTimeout(function(){
        timeUp = true;
    }, timeLimit);

    let startCountdown = setInterval(function(){
        countdown -= 1;
        countdownBoard.textContent = countdown;
        if(countdown < 0 ){
            countdown = 0;
            clearInterval(startCountdown);
            countdownBoard.textContent = 'Times Up!';
        }
    }, 1000);
}
startButton.addEventListener('click', startGame);

function whack(e){
    score++;
    this.style.backgroundImage = 'url("media/peanut2.png")';
    this.style.pointerEvents = 'none';
    setTimeout(() => {   //es6 syntax to remember *this.*
        this.style.backgroundImage = 'url("media/peanut.png")';
        this.style.pointerEvents = 'all';
    }, 800);
    scoreBoard.textContent = score;
}
mole.forEach(mole => mole.addEventListener('click', whack));
