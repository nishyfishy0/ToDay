const am4 = new Audio('music/am 4_00.mp3');
const balcony = new Audio('music/Balcony.mp3');
const daylight_over = new Audio('music/Daylight Over.mp3');
const downtown = new Audio('music/Downtown.mp3');
const explosionsfx = new Audio("explosion.mp3")

const bgmSongs = [am4, balcony, daylight_over, downtown];
let currentSong = null;
let gameLoop = false;
let vol = 0.5



function playRandomSong() {
    if (!gameLoop) return;

    const filteredSongList = bgmSongs.filter(song => song !== currentSong);

    currentSong = filteredSongList[
        Math.floor(Math.random() * filteredSongList.length)
    ];

    currentSong.currentTime = 0;
    currentSong.play();

    currentSong.onended = playRandomSong;
}

function fadeOut() {
    vol -= 0.05;

    am4.volume = vol;
    balcony.volume = vol;
    daylight_over.volume = vol;
    downtown.volume = vol;
}

function fadeIn() {
    const fadeInterval = setInterval(() => {
        vol = Math.min(0.5, vol + 0.05);

        bgmSongs.forEach(song => {
            song.volume = vol;
        });

        if (vol >= 0.5) {
            clearInterval(fadeInterval);
        }
    }, 100);
}



document.addEventListener("bombModeStart", () => {
    gameLoop = true;
    vol = 0;
    playRandomSong();
    fadeIn();
});

document.addEventListener("endGame", () => {
    gameLoop = false;
    explosionsfx.play();

    const fadeInterval = setInterval(() => {
        vol = Math.max(0, vol - 0.05);

        bgmSongs.forEach(song => {
            song.volume = vol;
        });

        if (vol <= 0) {
            clearInterval(fadeInterval);

            bgmSongs.forEach(song => {
                song.pause();
                song.currentTime = 0;
            });
        }
    }, 100);
});
