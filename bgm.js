const am4 = new Audio('music/am4.mp3');                            // Importing audio files
const balcony = new Audio('music/Balcony.mp3');
const daylight_over = new Audio('music/DaylightOver.mp3');
const downtown = new Audio('music/Downtown.mp3');
const explosionsfx = new Audio("sfx/explosion.mp3")

const bgmSongs = [am4, balcony, daylight_over, downtown];         // Putting all bgm in a list to randomly choose from
let currentSong = null;
let gameLoop = false;
let vol = 0.5



function playRandomSong() {
    if (!gameLoop) return;

    const filteredSongList = bgmSongs.filter(song => song !== currentSong);        // Filtering out the list so that it never plays the same song twice

    currentSong = filteredSongList[
        Math.floor(Math.random() * filteredSongList.length)
    ];

    currentSong.currentTime = 0;
    currentSong.play();

    currentSong.onended = playRandomSong;            // Making it so that the song, once ended, will play another song
}

function fadeOut() {            // Fade out volume
    vol -= 0.05;

    am4.volume = vol;
    balcony.volume = vol;
    daylight_over.volume = vol;
    downtown.volume = vol;
}

function fadeIn() {                                // Fade in volume
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



document.addEventListener("bombModeStart", () => {            // Start BGM when game starts
    gameLoop = true;
    vol = 0;
    playRandomSong();
    fadeIn();
});

document.addEventListener("endGame", () => {                   // Stop BGM when game ends
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
