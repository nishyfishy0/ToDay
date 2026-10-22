const timerText = document.getElementById('time');
const dial = document.getElementById('dial');
const pointer = document.getElementById('pointer');
const cranksfx = new Audio("crank-tick.mp3") 
cranksfx.volume = 0.75;



let initDuration = 0;
let timerLocked = false;
let vignetteOpacity = 0;
let duration = 30_000;
let maxTime = 60_000;
let endTime = Date.now() + duration;
let initEndTime = 0;
let remainingTime = 0;
let gameEnded = false;
let initX = 0;
let textStatus = "";


function updateTimer() {
    remainingTime = Math.max(0, ((endTime - Date.now()) / 1000));

    timerText.textContent = `${remainingTime.toFixed(2).padStart(5, '0')} ${textStatus}`;


    const selectedTime = Math.max(0, endTime - Date.now());
    const angle = (selectedTime / maxTime) * Math.PI;

    const degrees = -(angle * 180 / Math.PI);
    pointer.style.transform = `rotate(${degrees}deg)`;
    
    if (remainingTime === 0 && !gameEnded) {
        gameEnded = true;
        document.dispatchEvent(new Event("endGame"));
    }
}



setInterval(updateTimer, 100);



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
    const deltaX = Math.abs(mousePos.clientX - initX);
    cranksfx.play();

    const newDuration = Math.max(
        0,
        Math.min(maxTime, initDuration + deltaX * 10)
    );

    endTime = Date.now() + newDuration;
    };

function onPointerUp(mousePos) {
    // literally js like removing listeners or smth
    dial.releasePointerCapture(mousePos.pointerId);
    dial.removeEventListener('pointermove', onPointerMove);
    dial.removeEventListener('pointerup', onPointerUp);
};



document.addEventListener("lockTimer", () => {
    timerLocked = true;
    textStatus = "🔒";
});

document.addEventListener("unlockTimer", () => {
    timerLocked = false;
    textStatus = "";
});

document.addEventListener("bombModeStart", () => {
    endTime = Date.now() + 30_000;
    gameEnded = false;
});
