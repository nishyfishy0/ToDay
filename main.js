const todoColumn = document.querySelectorAll('.column')[0]; 
const lockColumn = document.querySelectorAll('.column')[1]; 
const completedColumn = document.querySelectorAll('.column')[2]; 
const newTask = document.querySelector('.newTask');
const body = document.querySelector("body");
const modal = document.querySelector(".modal");
const finalScoreText = document.getElementById("finalScore");
const finalStatsText = document.getElementById("finalStats");
const restartButton = document.getElementById("restartButton");

let score = 0;                                                                                    // LOOOOOOOOOOOOOOOOOOTS OF VARSSSSSSSSSS
let lockProbability = 5;
let timerLocked = false;
let username = `user${Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000}`;
let gameLoop = true;
let timesTurned = 0;
let currentTaskNum = 0;
let totalTaskNum = 0;
let prevTaskInd = -1;
let maxTasks = 5;
let scoreText = null;
let wordSet = new Set();
let words = [];
let morphemes = [];

fetch('words.txt')                                    // Importing the dictionary (this is a jklm.fun wordbomb dictionary i found online i forgot where tho)
    .then(response => response.text())
    .then(rawText => {
        const cleanArray = rawText
            .split(/\r?\n/)
            .map(item => item.replace(/[^a-zA-Z]/g, '').trim())
            .filter(item => item.length > 0);
        wordSet = new Set(cleanArray);
        words = [...wordSet];
    });

fetch('morphemes.txt')                                    // Importing the morpheme dictionary (also wordbomb)
    .then(response => response.text())
    .then(rawText => {
        const cleanArray = rawText
            .split(/\r?\n/)
            .map(item => item.replace(/[^a-zA-Z]/g, '').trim())
            .filter(item => item.length > 0);
        const morphemesSet = new Set(cleanArray);
        morphemes = [...morphemesSet];
    });


let taskPool = [                                                    // All the tasks
    {
        title: "Click!",
        desc: "Click the button 10 times.",
        type: "button",
        buttonText: "Click! Click! Click!",
        requiredClicks: 10
    },
    {
        title: "Alphabet",
        desc: "Type the English alphabet. From A to Z. Without spaces.",
        type: "input",
        answer: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        placeholder: "Type an answer..."
    },
    {
        title: "Free Task!",
        desc: "Yeah I'm feelin' generous, here's a free task.",
        type: "button",
        buttonText: "Complete Task",
        requiredClicks: 1
    },
    {
        title: "CAPTCHA",
        desc: "Prove you are not a robot.",
        type: "button",
        buttonText: "Complete CAPTCHA",
        requiredClicks: 15
    },

    // Sequential 1 : start
    {
        title: "Are you sure?",
        desc: "Click OK if you are.",
        type: "button",
        buttonText: "OK",
        requiredClicks: 1
    },
    {
        title: "Are you REALLY sure?",
        desc: "Just... making sure.",
        type: "button",
        buttonText: "Yes, I am.",
        requiredClicks: 1
    },
    {
        title: "Sureness check :)",
        desc: "You can never be too sure. Please type \"yes\" if you're truly sure!",
        type: "input",
        answer: "Yes",
        placeholder: "Type \"yes\" here..."
    },
    // Sequential 1 : end

    {
        title: "Authorize your account.",
        desc: `Something went wrong. To continue spinning the dial, enter your username: ${username}`,
        type: "input",
        answer: `${username}`,
        placeholder: "Authorize here...",
        timerLock: true
    },
    {
        title: "Shouting",
        desc: "TYPE THE WORD \"QUIET\", PLEASE.",
        type: "input",
        answer: "QUIET",
        placeholder: "Shout..."
    },

    // Sequential 2 : start
    {
        title: "Knock Knock!",
        desc: "Hey look, someone's at your door!",
        type: "input",
        answer: "Who's There?",
        placeholder: "Type \"Who's There?\"..."
    },
    {
        title: "Orange!",
        desc: "What a weird name.",
        type: "button",
        buttonText: "Orange who?",
        requiredClicks: 1
    },
    {
        title: "Orange you glad I showed up?",
        desc: "Of course I am! Now laugh. For an extended amount of time.",
        type: "button",
        buttonText: "Haha",
        requiredClicks: 5
    },
    // Sequential 2 : end

    generateAdditionTask,
    generateMultiplicationTask,
    generateRandomWordTask,
    generateWordBombTask,
    generateSubtractionTask,
    generateReverseWordTask,
    generateRandomClicksTask,
    generateCodeTask,
    generateCountLetterTask,
    generateOddOneOutTask,
    generateVerificationTask
];



score = 0;
maxTasks = 5;                        // I was going to increase how many tasks you get at a time, only to realise it was useless. Repurposed as an upper limit

scoreText = newTask.querySelector("p");
if (scoreText) {                                                   // Setting score text 
    scoreText.textContent = `Score: ${score}`;
}



function getDifficulty() {                                    // Retrieving the difficulty
    return 1 + Math.floor(totalTaskNum / 10);
}

function complete(event) {                                    // Everything that needs to be done on task completion. Mostly copypasted from tutorial.js soo im not going to rexplain too much
    const btn = event.currentTarget;
    const task = btn.closest(".task-card");
    const span = task.querySelector("span");

    if (btn.textContent === "") {
        const inp = task.querySelector("input");
    
        if (!("answer" in inp.dataset)) {                                             // Only for tasks with text input
            const isCorrect = inp.validate
                ? inp.validate(inp.value.trim())
                : inp.value.trim().toLowerCase() === inp.dataset.answer;

            if (isCorrect) {                                                          // This particular conditional only works if the particular task doesn't have one single answer
                completedColumn.appendChild(task.querySelector("span"));
                if (task.dataset.timerLock === "true") {
                    if (lockColumn.querySelector(".task-card") === null) {
                        document.dispatchEvent(new Event("unlockTimer"));                // Unlocks timer ONLY IF THERE ARE NO TIMER-LOCKING TASKS LEFT
                        timerLocked = false;
                    }
                }

                span.classList.remove("fade-in-slide-right");                // ID animation into the completed column
                void span.offsetWidth;
                span.classList.add("fade-in-slide-right");
                
                task.classList.remove("fade-out-slide-right");                // Task animation out of to-do column (or lockColumn)
                void task.offsetWidth;
                task.classList.add("fade-out-slide-right");

                task.addEventListener("animationend", () => {
                    task.remove();
                }, { once: true })

                setTimeout(() => {
                    nextTask();                         // Generate new task
                }, 1000);

                score += 100;
                totalTaskNum++;
                if (scoreText) {
                    scoreText.textContent = `Score: ${score}`            // Update score
                };
            }
        } else if (inp.value.trim().toLowerCase() === inp.dataset.answer) {        // For text input tasks in general
            completedColumn.appendChild(task.querySelector("span"));
            if (task.dataset.timerLock === "true") {
                if (lockColumn.querySelector(".task-card") === null) {
                    document.dispatchEvent(new Event("unlockTimer"));
                    timerLocked = false;
                }
            }

            span.classList.remove("fade-in-slide-right");                // ID animation into completed column
            void span.offsetWidth;
            span.classList.add("fade-in-slide-right");

            task.classList.remove("fade-out-slide-right");                // Task animation out of to-do column (or lockColumn)
            void task.offsetWidth;
            task.classList.add("fade-out-slide-right");
            
            task.addEventListener("animationend", () => {
                task.remove();
            }, { once: true })

            setTimeout(() => {
                nextTask();                         // Generate next task
            }, 1000);

            score += 100;
            totalTaskNum++;
            if (scoreText) {                                        // update score text
                scoreText.textContent = `Score: ${score}`
            };
        }
    } else {                                                                            // Everything under here is for buttons
        const requiredClicks = parseInt(btn.dataset.requiredClicks) || 1;

        if (requiredClicks <= 1) {                                    // Check if button is clicked enough times
            completedColumn.appendChild(task.querySelector("span"));
            if (task.dataset.timerLock === "true") {
                if (lockColumn.querySelector(".task-card") === null) {
                    document.dispatchEvent(new Event("unlockTimer"));
                    timerLocked = false;
                }
            }

            span.classList.remove("fade-in-slide-right");                // ID animation into completed column
            void span.offsetWidth;
            span.classList.add("fade-in-slide-right");

            task.classList.remove("fade-out-slide-right");                // Task animation out of to do column (no button tasks for timer lock column)
            void task.offsetWidth;
            task.classList.add("fade-out-slide-right");

            task.addEventListener("animationend", () => {
                task.remove();
            }, { once: true })

            setTimeout(() => {
                nextTask();                                        // generate next task
            }, 1000);

            score += 100;
            totalTaskNum++;
            if (scoreText) {                                        // update score text
                scoreText.textContent = `Score: ${score}`;
            }
        } else {
            const btntext = btn.querySelector("p");
            btn.dataset.requiredClicks = requiredClicks - 1;
            btntext.textContent = `${btn.dataset.txt} (${btn.dataset.requiredClicks})`;
        }
    }

    if (totalTaskNum >= 200) {                                    // Update the probability of getting a timer locking task based on total number of tasks completed
        lockProbability = 50;
    } else if (totalTaskNum >= 150) {
        lockProbability = 40;
    } else if (totalTaskNum >= 100) {
        lockProbability = 30;
    } else if (totalTaskNum >= 80) {
        lockProbability = 25;
    } else if (totalTaskNum >= 60) {
        lockProbability = 20;
    } else if (totalTaskNum >= 40) {
        lockProbability = 15;
    } else if (totalTaskNum >= 20) {
        lockProbability = 10;
    }
}

function nextTask() {
    if (gameLoop) {
        chooseRandomTask();                                        // Choose a random task
        if (lockColumn.querySelector(".task-card") === null) {            // Unlock the timer if lock column is empty
            document.dispatchEvent(new Event("unlockTimer"));
            timerLocked = false;
        }
    }
}

function createTask(id, title, desc, btn, reqClicks, txt, reqInp, taskData, timerLock) {            // Everything here is for creating a task. Most of this is in tutorial.js
    const task = document.createElement("div");
    const ident = document.createElement("span");
    const head = document.createElement("h3");
    const description = document.createElement("p");
    
    ident.textContent = id;
    head.textContent = title;
    description.textContent = desc;
    
    task.classList.add("task-card");
    task.dataset.taskId = id;
    task.append(ident, head, description);
    
    if (typeof btn !== "undefined") {                        // For button tasks
        const button = document.createElement("button");
        const btntxt = document.createElement("p");

        if (reqClicks === 1) {                // Changes button text depending on num of required clicks
            btntxt.textContent = btn;
        } else {
            btntxt.textContent = `${btn} (${reqClicks})`;
        }

        button.append(btntxt);
        button.dataset.txt = btn;
        button.dataset.requiredClicks = reqClicks;
        
        button.classList.add("completeTask");
        task.append(button);
        
    } else {                                                // For  text input tasks
        const inp = document.createElement("input");
        const submit = document.createElement("button");

        inp.placeholder = txt;
        submit.textContent = "";
        submit.classList.add("completeTask");
        submit.style.backgroundColor = "#f2f2f2";
        submit.style.border = "0px";

        if (typeof taskData !== "undefined") {            // For tasks with no one concrete answer
            inp.validate = taskData.validate;
        } else {
            inp.dataset.answer = reqInp.toLowerCase();
        }

        task.append(inp, submit);

        inp.addEventListener("keydown", (event) => {            // Allow for clicking enter to submit text input
            if (event.key === "Enter") {
                submit.click();
            }
        });
    }

    task.dataset.timerLock = timerLock;
    
    if (timerLock === true) {
        document.dispatchEvent(new Event("lockTimer"));        // Lock timer accordingly
        timerLocked = true;
    }

    if (!(timerLock === true)) {            // Sends tasks to their respective columns, based on whether or not they are to lock the timer
        todoColumn.append(task);
    } else {
        lockColumn.append(task)
    }
    
    task.classList.remove("fade-slide-up");                // Fade the task in and slide upwards (polish)
    void task.offsetWidth;
    task.classList.add("fade-slide-up");

    const completionReq = task.querySelector(".completeTask");
    completionReq.addEventListener("click", complete);
}

function generateAdditionTask() {                    // Generate an addition task
    const difficulty = getDifficulty();
    const max = Math.min(50 * difficulty, 500);            // Upper limit for addends. Updates based on difficulty

    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;

    return {
        title: `What's ${a} + ${b}?`,
        desc: "Come on. It's addition. Don't get this wrong. You're (probably) not 5.",
        type: "input",
        answer: String(a + b),
        placeholder: "Type a number..."
    };
}

function generateMultiplicationTask() {                    // Generate a multiplication task
    const a = Math.floor(Math.random() * 13);
    const b = Math.floor(Math.random() * 13);

    return {
        title: `What's ${a} x ${b}?`,
        desc: "A little harder than addition, but you know your times tables, right?",
        type: "input",
        answer: String(a * b),
        placeholder: "Type a number..."
    };
}

function generateRandomWordTask() {                                        // Generate a random word task
    const randWord = words[Math.floor(Math.random() * words.length)];            // Get a random word

    return {
        title: "Random Word!",
        desc: `Type the following word: ${randWord}.`,
        type: "input",
        answer: randWord,
        placeholder: "Type the word..."
    };
}

function generateWordBombTask() {                                                // Generate a word bomb task
    const morpheme = morphemes[Math.floor(Math.random() * morphemes.length)]; 

    return {
        title: "Word Bomb (without the bomb... in a sense.)",
        desc: `Type a word containing the following: ${morpheme}.`,
        type: "input",
        placeholder: "Type a word...",
        validate: (answer) => {                            // Check if the input has both the morpheme and is a valid word
            const word = answer.toLowerCase();

            return (
                wordSet.has(word) &&
                word.includes(morpheme.toLowerCase())
            );
        }
    };
}

function generateSubtractionTask() {                    // Generate a subtraction task 
    const difficulty = getDifficulty();
    const max1 = Math.min(20 * difficulty, 200);        // Update minuend upper limit based on difficulty
    const max2 = Math.min(10 * difficulty, 100);        // Update subtrahend upper limit based on difficulty

    const a = Math.floor(Math.random() * max1) + 20;
    const b = Math.floor(Math.random() * max2) + 1;

    return {
        title: "Subtraction",
        desc: `What is ${a} - ${b}?`,
        type: "input",
        answer: `${a - b}`,
        placeholder: "Type the answer..."
    };
}

function generateReverseWordTask() {                                                                    // Generate reverse word task
    const words = ["banana", "dial", "spinner", "puzzle", "window", "rocket", "garden", "canada",            // GIANT WORD LIIST (thanks Gemini)
                   "panama", "havana", "papaya", "katana", "cabana", "savanna", "solitude", "lemonade",
                   "dominoes", "monotone", "parabola", "caramel", "macaroni", "origami", "avocado",
                   "panorama", "pelican", "mandolin", "radiant", "monument", "domino", "mementos",
                   "cardinal", "monorail", "mariner", "mirage", "talisman", "calico", "parade",
                   "monarch", "canopy", "solstice", "paradise", "dilemma", "matador", "serenata",
                   "marzipan", "monopoly", "parakeet", "calamari", "paramount", "marigold", "caravan",
                   "parable", "paladin", "maritime", "cannibal", "pantaloon", "volcano", "harmonic",
                   "velocity", "dinosaur", "parasol", "pipeline", "symphony", "operatic", "chameleon",
                   "metropolis", "tarantula", "monastery", "telephoto", "animator", "panoramic",
                   "catalyst", "cinnamon", "marathon", "metaphor", "navigator", "melodic", "serenade",
                   "horizon", "diameter"];
    const word = words[Math.floor(Math.random() * words.length)];        // Choose a random word
    return {
        title: "Reverse It",
        desc: `Type "${word}" backwards.`,
        type: "input",
        answer: word.split("").reverse().join(""),
        placeholder: "Type it backwards..."
    };
}

function generateRandomClicksTask() {                               // Generate Random Clicks Taks
    const clicks = Math.floor(Math.random() * 15) + 5;                // Yeah its really RNG what you thought I was lying?
    return {
        title: "Random Clicks",
        desc: `Click the button ${clicks} times. Blame RNG.`,
        type: "button",
        buttonText: "Click",
        requiredClicks: clicks
    };
}

function generateCodeTask() {                                        // Generate code task
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {                                    // Choose a random letter per char in code
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return {
        title: "Verification Code",
        desc: `Enter the following code: ${code}`,
        type: "input",
        answer: code,
        placeholder: "Enter the code..."
    };
}

function generateCountLetterTask() {                                                // Generate a letter count task
    const words = ["Mississippi", "bookkeeper", "strawberry", "banana", "balloon",                        // Another list of random words for letter counting (thanks Gemini)
                   "waffle", "thunder", "spatula", "galaxy", "cucumber","hologram",
                   "lighthouse", "velvet", "chimpanzee", "pancake", "squadron",
                   "subwoofer", "kaleidoscope", "biscuit", "dreadnought", "marshmallow",
                   "avocado", "vortex", "symphony", "jackrabbit", "cobweb", "scooter", "boomerang",
                   "starlight", "pretzel", "glacier", "blizzard", "armadillo", "trampoline",
                   "xylophone", "mushrooms", "porcupine", "tambourine", "cauliflower", "whippersnapper",
                   "gargoyle", "zigzag", "squeegee", "flamingo", "labyrinth", "meatball", "catapult",
                   "monocle", "peanuts", "submariner", "bagpipe", "dandelion", "hovercraft", "pajamas",
                   "cantaloupe", "microscope", "typewriter", "snowstorm", "gumball", "seashell", "blueprint",
                   "firefly", "albatross", "geode", "popcorn", "tumbleweed", "windmill", "accordion", "snickerdoodle",
                   "dinosaur", "periscope", "dragonfly", "pineapple", "scarecrow", "caterpillar", "jellybean",
                   "spacecraft", "milkshake", "astronaut", "nightingale", "chinchilla", "waterfall", "spaghetti",
                   "wheelbarrow", "woodpecker", "cheeseburger", "bobsled", "grasshopper", "kazoo", "marshland",
                   "steamboat", "sunflower", "treadmill", "whirlpool", "zucchini", "brainstorm", "butterscotch",
                   "centipede", "dustbunny", "firecracker", "gooseberry", "hummingbird", "jack-o-lantern", "kingfisher"];
    const word = words[Math.floor(Math.random() * words.length)];
    const letters = [...new Set(word.toLowerCase())];
    const letter = letters[Math.floor(Math.random() * letters.length)];                        // Choose a random letter to prompt about its count
    const count = word.toLowerCase().split(letter).length - 1;

    return {
        title: "Letter Counter",
        desc: `How many times does the letter "${letter}" appear in "${word}"?`,
        type: "input",
        answer: `${count}`,
        placeholder: "Type a number..."
    };
}

function generateOddOneOutTask() {                                    // Generate an Odd One Out task
    const sets = [
        { items: "apple, banana, carrot, grape", answer: "carrot" },                    // More prompts (thanks Gemini)
        { items: "dog, cat, hamster, table", answer: "table" },
        { items: "red, blue, square, green", answer: "square" },
        { items: "Paris, London, Tokyo, Africa", answer: "Africa" },
        { items: "piano, guitar, trumpet, easel", answer: "easel" },
        { items: "mercury, venus, moon, mars", answer: "moon" },
        { items: "run, jump, swim, fast", answer: "fast" },
        { items: "triangle, circle, cube, rectangle", answer: "cube" },
        { items: "salmon, tuna, shark, dolphin", answer: "dolphin" },
        { items: "doctor, teacher, firefighter, hospital", answer: "hospital" },
        { items: "oxygen, helium, water, nitrogen", answer: "water" },
        { items: "fork, spoon, knife, napkin", answer: "napkin" },
        { items: "dollar, euro, yen, wallet", answer: "wallet" },
        { items: "baseball, soccer, tennis, marathon", answer: "marathon" },
        { items: "winter, autumn, rain, spring", answer: "rain" },
        { items: "shirt, pants, jacket, shoes", answer: "shoes" },
        { items: "Pacific, Atlantic, Amazon, Indian", answer: "Amazon" },
        { items: "violin, cello, flute, viola", answer: "flute" },
        { items: "cherry, strawberry, watermelon, blueberry", answer: "watermelon" },
        { items: "microscope, telescope, magnifying glass, binoculars", answer: "microscope" },
        { items: "keyboard, mouse, monitor, headphone", answer: "monitor" },
        { items: "bee, butterfly, bat, dragonfly", answer: "bat" },
        { items: "cheese, butter, yogurt, bread", answer: "bread" },
        { items: "inch, meter, pound, kilometer", answer: "pound" },
        { items: "couch, bed, lamp, chair", answer: "lamp" },
        { items: "whisper, shout, talk, listen", answer: "listen" },
        { items: "oak, pine, maple, rose", answer: "rose" },
        { items: "spaghetti, lasagna, ravioli, taco", answer: "taco" }
    ];
    const set = sets[Math.floor(Math.random() * sets.length)];
    return {
        title: "Odd One Out",
        desc: `Which one doesn't belong? ${set.items}`,
        type: "input",
        answer: set.answer,
        placeholder: "Type the odd one..."
    };
}

function generateVerificationTask() {                        // Generate verification code task
    const code = Math.floor(Math.random() * 9000) + 1000;            // Choose a random number
    return {
        title: "Verification",
        desc: `Please verify your account. Use this code: ${code}`,
        type: "input",
        answer: `${code}`,
        placeholder: "Type the code...",
        timerLock: true
    };
}

function chooseRandomTask() {                                                                            // Generate a random task
    let chances = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    let lockChance = chances[Math.floor(Math.random() * chances.length)];
    let chosenTask = -1;
    let randInd;

    if (lockChance <= lockProbability) {        // Based on the probability, determine whether or not to choose a timer lock task
        randInd = Math.floor(Math.random() * 2);
        
        if (randInd === 1) {
            randInd = 7;
        } else {
            randInd = 22;
        }
    } else {
        randInd = Math.floor(Math.random() * taskPool.length);
        
        // Sequential 1
        if (prevTaskInd === 4) {                    // Preserve sequential task sequences
            randInd = 5;
        } else if (prevTaskInd === 5) {
            randInd = 6;
        } else if (randInd === 5 || randInd === 6) {
            while (randInd === 5 || randInd === 6 || randInd === 10 || randInd === 11) {
                randInd = Math.floor(Math.random() * taskPool.length);
            }
        }
    
        // Sequential 2
        if (prevTaskInd === 9) {
            randInd = 10;
        } else if (prevTaskInd === 10) {
            randInd = 11;
        } else if (randInd === 10 || randInd === 11) {
            while (randInd === 5 || randInd === 6 || randInd === 10 || randInd === 11) {
                randInd = Math.floor(Math.random() * taskPool.length);
            }
        }
    }
    
    chosenTask = taskPool[randInd];
    prevTaskInd = randInd;
   

    if (typeof chosenTask === "function") {            // If a task is a function, interpret it differently.
        chosenTask = chosenTask();
    }
    
    currentTaskNum++; 

    createTask(                                            // Create the dang thing
        `${timesTurned}.${currentTaskNum}`,
        chosenTask.title,
        chosenTask.desc,
        chosenTask.buttonText,
        chosenTask.requiredClicks,
        chosenTask.placeholder,
        chosenTask.answer,
        chosenTask.validate ? chosenTask : undefined,
        chosenTask.timerLock
    )
}

function startGame() {                                      // Start the game
    document.body.style.background = "linear-gradient(90deg,rgba(237, 109, 109, 1) 0%, rgba(237, 161, 126, 1) 50%, rgba(247, 205, 114, 1) 100%)";
    for (let i = 0; i <= maxTasks; i++)
        chooseRandomTask();
}





document.addEventListener("bombModeStart", () => {            // Initialize game (on restart)
    document.body.classList.add("bomb-mode");
    modal.classList.add("hidden");
    timesTurned = 0;
    score = 0;
    startGame();
});

document.addEventListener("dialTurned", () => {            // Subtract points if the dial is turned
    timesTurned++;
    currentTaskNum = 0;
    score -= 50;
});

document.addEventListener("endGame", () => {                // End the game, and show final score + dial turn count
    gameLoop = false;
    modal.classList.remove("hidden");
    finalScoreText.textContent = `Your final score is ${score} points.`
    finalStatsText.textContent = (`You completed ${totalTaskNum} task${totalTaskNum === 1 ? "" : "s"} and spun the dial ${timesTurned} time${timesTurned === 1 ? "" : "s"}.`)
    
    while (todoColumn.lastElementChild && todoColumn.lastElementChild.tagName !== "HR") {                // Clear todo column
        todoColumn.removeChild(todoColumn.lastElementChild);
    }

    while (lockColumn.lastElementChild && lockColumn.lastElementChild.tagName !== "HR") {                // Clear timer lock column
        lockColumn.removeChild(lockColumn.lastElementChild);
    }
});


restartButton.addEventListener("click", () => {            // Restart the game if the user decides to
    score = 0;
    lockProbability = 5;
    timesTurned = 0;
    currentTaskNum = 0;
    totalTaskNum = 0;
    prevTaskInd = -1;
    gameLoop = true;

    while (completedColumn.lastElementChild && completedColumn.lastElementChild.tagName !== "HR") {
        completedColumn.removeChild(completedColumn.lastElementChild);
    }

    if (scoreText) {
        scoreText.textContent = `Score: ${score}`;
    }

    document.dispatchEvent(new Event("bombModeStart"));
});
