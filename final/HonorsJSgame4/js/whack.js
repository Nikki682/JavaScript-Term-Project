const holes = document.querySelectorAll('.hole');  //make node list
const scoreBoard = document.querySelector('.score');
const moles= document.querySelectorAll('.mole');
const countdownBoard =document.querySelector('.countdown');
const startButton = document.querySelector('.startButton');

let lastHole;   
let timeUp = false;
let timeLimit = 20000; // 20secs
let score = 0;
let countdown;

function pickRandomHole(holes){
    const randomHole = Math.floor(Math.random() * holes.length); //# betwen 0-5
    const hole = holes[randomHole];
    if(hole === lastHole){
        return pickRandomHole(holes); // end and pick new hole
    }
    lastHole = hole;
    return hole;
}
function popUp(){
    const time = Math.random() * 1300 + 500; // time mole peeks out, random time
    const hole = pickRandomHole(holes);  // new hole const, random hole
    hole.classList.add('up');  // changes css .mole top
    setTimeout(function(){
        hole.classList.remove('up'); //slide down
        if(!timeUp) popUp(); 
    }, time); 
}
// popUp();

function startGame(){
    countdown = timeLimit/1000;  // in case I want to change time limit later
    scoreBoard.textContent = 0;
    scoreBoard.style.display = 'block';
    countdownBoard.textContent = countdown;
    timeUp = false;
    score = 0;
    popUp();
    setTimeout(function(){
        timeUp = true; // cause line 28 to fail
    }, timeLimit); // wait 20sec

    let startCountdown = setInterval(function(){
        countdown -= 1; // countdown from 20sec
        countdownBoard.textContent = countdown;
        if(countdown < 0 ){
            countdown = 0;
            clearInterval(startCountdown); //stops 
            countdownBoard.textContent = 'Times Up!';
        }
    }, 1000); // run function every 1 sec
}
startButton.addEventListener('click', startGame); // run startGame function when button clicked

function whack(e){  // event object conected to listener
    score++;
    this.style.backgroundImage = 'url("../media/peanut2.png")';
    this.style.pointerEvents = 'none'; // so only one click is counted
    setTimeout(() => {   //es6 arrow syntax to remember *this.* (simpler bind)
        this.style.backgroundImage = 'url("../media/peanut.png")';
        this.style.pointerEvents = 'all';
    }, 800);
    scoreBoard.textContent = score;
}
moles.forEach(mole => mole.addEventListener('click', whack)); // cycle thru node lisrt and attatch eventListeners to each then run whack
