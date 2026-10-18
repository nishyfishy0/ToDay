const timerText = document.getElementById('time');
const dial = document.getElementById('dial');
const pointer = document.getElementById('pointer');
const cranksfx = new Audio("crank-tick.mp3") 
cranksfx.volume = 0.75;



let initDuration = 0;
let duration = 30_000;
let maxTime = 60_000;
let endTime = Date.now() + duration;
let initEndTime = 0;
let remainingTime = 0;
let initX = 0;


function updateTimer() {
    remainingTime = Math.max(0, ((endTime - Date.now()) / 1000));

    console.log(remainingTime);
    timerText.textContent = remainingTime.toFixed(2).padStart(5, '0');


    const selectedTime = Math.max(0, endTime - Date.now());
    const angle = (selectedTime / maxTime) * Math.PI;

    const degrees = -(angle * 180 / Math.PI);
    pointer.style.transform = `rotate(${degrees}deg)`;
}



setInterval(updateTimer, 100);



dial.addEventListener("pointerdown", (initPos) => {
    initX = initPos.clientX;    //  Here we're setting the initial X
    // clientX is the current mouse cursor X position

    initEndTime = endTime;
    initDuration = endTime - Date.now();
    
    dial.setPointerCapture(initPos.pointerId);
    dial.addEventListener('pointermove', onPointerMove);
    dial.addEventListener('pointerup', onPointerUp);
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