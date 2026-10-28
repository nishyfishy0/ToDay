const timerText = document.getElementById('time');
const dial = document.getElementById('dial');
const pointer = document.getElementById('pointer');
const cranksfx = new Audio("sfx/crank-tick.mp3")

cranksfx.volume = 0.75;



let initDuration = 0;                    // lots of vars just initialization
let timerLocked = false;
let duration = 30_000;
let maxTime = 60_000;
let endTime = Date.now() + duration;
let initEndTime = 0;
let remainingTime = 0;
let gameEnded = true;
let initX = 0;
let textStatus = "";
let vignetteOpacity = 0;


function updateTimer() {
    remainingTime = Math.max(0, ((endTime - Date.now()) / 1000));            // Set the remaining time left based on the difference in the time now and the end time

    const progress = 1 - (remainingTime / 60);                                // Vignette opacity based on how much time is left
    vignetteOpacity = Math.pow(progress, 3) * 0.65;
    document.body.style.setProperty("--vignette-opacity", vignetteOpacity);
                                    
    timerText.textContent = `${remainingTime.toFixed(2).padStart(5, '0')} ${textStatus}`;            // Displays time left with truncated double


    const selectedTime = Math.max(0, endTime - Date.now());             // Current time relative to timer
    const angle = (selectedTime / maxTime) * Math.PI;                // Angle at which the dial should point (radians)

    const degrees = -(angle * 180 / Math.PI);                // Converting that angle to degrees
    pointer.style.transform = `rotate(${degrees}deg)`;            // Making the pointer actually point in that direction
    
    if (remainingTime === 0 && !gameEnded) {                    // Ending game if time runs out
        gameEnded = true;
        document.dispatchEvent(new Event("endGame"));
    }
}



setInterval(updateTimer, 100);            // Keep updating timer



dial.addEventListener("pointerdown", (initPos) => {
    if (!timerLocked) {
        initX = initPos.clientX;    //  Here we're setting the initial X
        // clientX is the current mouse cursor X position
    
        initEndTime = endTime;
        initDuration = endTime - Date.now();
        
        dial.setPointerCapture(initPos.pointerId);
        dial.addEventListener('pointermove', onPointerMove);
        dial.addEventListener('pointerup', onPointerUp);
    
        document.dispatchEvent(new Event("dialTurned"));
    }
});

function onPointerMove(mousePos) {
    const deltaX = Math.abs(mousePos.clientX - initX);            // Getting distance between where the dial was pressed and how far back the cursor was moved
    cranksfx.play();

    const newDuration = Math.max(            // Setting the new remaining time left based on said distance
        0,
        Math.min(maxTime, initDuration + deltaX * 10)
    );

    endTime = Date.now() + newDuration;        // Setting the new end time based on the new duration
    };

function onPointerUp(mousePos) {
    // literally js like removing listeners or smth
    dial.releasePointerCapture(mousePos.pointerId);
    dial.removeEventListener('pointermove', onPointerMove);
    dial.removeEventListener('pointerup', onPointerUp);
};



document.addEventListener("lockTimer", () => {        // Locking the timer accordingly
    timerLocked = true;
    textStatus = "🔒";
});

document.addEventListener("unlockTimer", () => {        // Unlocking the timer accordingly
    timerLocked = false;
    textStatus = "";
});

document.addEventListener("bombModeStart", () => {           // Starting the vignette and lethal timer if the game start
    vignetteOpacity = 0;
    document.body.style.setProperty("--vignette-opacity", 0);
    endTime = Date.now() + 60_000;
    gameEnded = false;
});
