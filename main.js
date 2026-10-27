const todoColumn = document.querySelectorAll('.column')[0]; 
const lockColumn = document.querySelectorAll('.column')[1]; 
const completedColumn = document.querySelectorAll('.column')[2]; 
const newTask = document.querySelector('.newTask');
const body = document.querySelector("body");
const modal = document.querySelector(".modal");
const finalScoreText = document.getElementById("finalScore");
const finalStatsText = document.getElementById("finalStats");
const restartButton = document.getElementById("restartButton");

let score = 0;
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

fetch('words.txt')
    .then(response => response.text())
    .then(rawText => {
        const cleanArray = rawText
            .split(/\r?\n/)
            .map(item => item.replace(/[^a-zA-Z]/g, '').trim())
            .filter(item => item.length > 0);
        wordSet = new Set(cleanArray);
        words = [...wordSet];
    });

fetch('morphemes.txt')
    .then(response => response.text())
    .then(rawText => {
        const cleanArray = rawText
            .split(/\r?\n/)
            .map(item => item.replace(/[^a-zA-Z]/g, '').trim())
            .filter(item => item.length > 0);
        const morphemesSet = new Set(cleanArray);
        morphemes = [...morphemesSet];
    });


let taskPool = [
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
maxTasks = 5;

scoreText = newTask.querySelector("p");
if (scoreText) {
    scoreText.textContent = `Score: ${score}`;
}



function getDifficulty() {
    return 1 + Math.floor(totalTaskNum / 10);
}

function complete(event) {
    const btn = event.currentTarget;
    const task = btn.closest(".task-card");
    const span = task.querySelector("span");

    if (btn.textContent === "") {
        const inp = task.querySelector("input");
    
        if (!("answer" in inp.dataset)) {
            const isCorrect = inp.validate
                ? inp.validate(inp.value.trim())
                : inp.value.trim().toLowerCase() === inp.dataset.answer;

            if (isCorrect) {
                completedColumn.appendChild(task.querySelector("span"));
                if (task.dataset.timerLock === "true") {
                    if (lockColumn.querySelector(".task-card") === null) {
                        document.dispatchEvent(new Event("unlockTimer"));
                        timerLocked = false;
                    }
                }

                span.classList.remove("fade-in-slide-right");
                void span.offsetWidth;
                span.classList.add("fade-in-slide-right");
                
                task.classList.remove("fade-out-slide-right");
                void task.offsetWidth;
                task.classList.add("fade-out-slide-right");

                task.addEventListener("animationend", () => {
                    task.remove();
                }, { once: true })

                setTimeout(() => {
                    nextTask(); 
                }, 1000);

                score += 100;
                totalTaskNum++;
                if (scoreText) {
                    scoreText.textContent = `Score: ${score}`
                };
            }
        } else if (inp.value.trim().toLowerCase() === inp.dataset.answer) {
            completedColumn.appendChild(task.querySelector("span"));
            if (task.dataset.timerLock === "true") {
                if (lockColumn.querySelector(".task-card") === null) {
                    document.dispatchEvent(new Event("unlockTimer"));
                    timerLocked = false;
                }
            }

            span.classList.remove("fade-in-slide-right");
            void span.offsetWidth;
            span.classList.add("fade-in-slide-right");

            task.classList.remove("fade-out-slide-right");
            void task.offsetWidth;
            task.classList.add("fade-out-slide-right");
            
            task.addEventListener("animationend", () => {
                task.remove();
            }, { once: true })

            setTimeout(() => {
                nextTask(); 
            }, 1000);

            score += 100;
            totalTaskNum++;
            if (scoreText) {
                scoreText.textContent = `Score: ${score}`
            };
        }
    } else {
        const requiredClicks = parseInt(btn.dataset.requiredClicks) || 1;

        if (requiredClicks <= 1) {
            completedColumn.appendChild(task.querySelector("span"));
            if (task.dataset.timerLock === "true") {
                if (lockColumn.querySelector(".task-card") === null) {
                    document.dispatchEvent(new Event("unlockTimer"));
                    timerLocked = false;
                }
            }

            span.classList.remove("fade-in-slide-right");
            void span.offsetWidth;
            span.classList.add("fade-in-slide-right");

            task.classList.remove("fade-out-slide-right");
            void task.offsetWidth;
            task.classList.add("fade-out-slide-right");

            task.addEventListener("animationend", () => {
                task.remove();
            }, { once: true })

            setTimeout(() => {
                nextTask();
            }, 1000);

            score += 100;
            totalTaskNum++;
            if (scoreText) {
                scoreText.textContent = `Score: ${score}`;
            }
        } else {
            const btntext = btn.querySelector("p");
            btn.dataset.requiredClicks = requiredClicks - 1;
            btntext.textContent = `${btn.dataset.txt} (${btn.dataset.requiredClicks})`;
        }
    }

    if (totalTaskNum >= 200) {
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
        chooseRandomTask();
        if (lockColumn.querySelector(".task-card") === null) {
            document.dispatchEvent(new Event("unlockTimer"));
            timerLocked = false;
        }
    }
}

function createTask(id, title, desc, btn, reqClicks, txt, reqInp, taskData, timerLock) {
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
    
    if (typeof btn !== "undefined") {
        const button = document.createElement("button");
        const btntxt = document.createElement("p");

        if (reqClicks === 1) {
            btntxt.textContent = btn;
        } else {
            btntxt.textContent = `${btn} (${reqClicks})`;
        }

        button.append(btntxt);
        button.dataset.txt = btn;
        button.dataset.requiredClicks = reqClicks;
        
        button.classList.add("completeTask");
        task.append(button);
        
    } else {
        const inp = document.createElement("input");
        const submit = document.createElement("button");

        inp.placeholder = txt;
        submit.textContent = "";
        submit.classList.add("completeTask");
        submit.style.backgroundColor = "#f2f2f2";
        submit.style.border = "0px";

        if (typeof taskData !== "undefined") {
            inp.validate = taskData.validate;
        } else {
            inp.dataset.answer = reqInp.toLowerCase();
        }

        task.append(inp, submit);

        inp.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                submit.click();
            }
        });
    }

    task.dataset.timerLock = timerLock;
    
    if (timerLock === true) {
        document.dispatchEvent(new Event("lockTimer"));
        timerLocked = true;
    }

    if (!(timerLock === true)) {
        todoColumn.append(task);
    } else {
        lockColumn.append(task)
    }
    
    task.classList.remove("fade-slide-up");
    void task.offsetWidth;
    task.classList.add("fade-slide-up");

    const completionReq = task.querySelector(".completeTask");
    completionReq.addEventListener("click", complete);
}

function generateAdditionTask() {
    const difficulty = getDifficulty();
    const max = Math.min(50 * difficulty, 500);

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

function generateMultiplicationTask() {
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

function generateRandomWordTask() {
    const randWord = words[Math.floor(Math.random() * words.length)]; 

    return {
        title: "Random Word!",
        desc: `Type the following word: ${randWord}.`,
        type: "input",
        answer: randWord,
        placeholder: "Type the word..."
    };
}

function generateWordBombTask() {
    const morpheme = morphemes[Math.floor(Math.random() * morphemes.length)]; 

    return {
        title: "Word Bomb (without the bomb... in a sense.)",
        desc: `Type a word containing the following: ${morpheme}.`,
        type: "input",
        placeholder: "Type a word...",
        validate: (answer) => {
            const word = answer.toLowerCase();

            return (
                wordSet.has(word) &&
                word.includes(morpheme.toLowerCase())
            );
        }
    };
}

function generateSubtractionTask() {
    const difficulty = getDifficulty();
    const max1 = Math.min(20 * difficulty, 200);
    const max2 = Math.min(10 * difficulty, 100);

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

function generateReverseWordTask() {
    const words = ["banana", "dial", "spinner", "puzzle", "window", "rocket", "garden"];
    const word = words[Math.floor(Math.random() * words.length)];
    return {
        title: "Reverse It",
        desc: `Type "${word}" backwards.`,
        type: "input",
        answer: word.split("").reverse().join(""),
        placeholder: "Type it backwards..."
    };
}

function generateRandomClicksTask() {
    const clicks = Math.floor(Math.random() * 15) + 5;
    return {
        title: "Random Clicks",
        desc: `Click the button ${clicks} times. Blame RNG.`,
        type: "button",
        buttonText: "Click",
        requiredClicks: clicks
    };
}

function generateCodeTask() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
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

function generateCountLetterTask() {
    const words = ["Mississippi", "bookkeeper", "strawberry", "banana", "balloon"];
    const word = words[Math.floor(Math.random() * words.length)];
    const letters = [...new Set(word.toLowerCase())];
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const count = word.toLowerCase().split(letter).length - 1;

    return {
        title: "Letter Counter",
        desc: `How many times does the letter "${letter}" appear in "${word}"?`,
        type: "input",
        answer: `${count}`,
        placeholder: "Type a number..."
    };
}

function generateOddOneOutTask() {
    const sets = [
        { items: "apple, banana, carrot, grape", answer: "carrot" },
        { items: "dog, cat, hamster, table", answer: "table" },
        { items: "red, blue, square, green", answer: "square" },
        { items: "Paris, London, Tokyo, Africa", answer: "Africa" }
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

function generateVerificationTask() {
    const code = Math.floor(Math.random() * 9000) + 1000;
    return {
        title: "Verification",
        desc: `Please verify your account. Use this code: ${code}`,
        type: "input",
        answer: `${code}`,
        placeholder: "Type the code...",
        timerLock: true
    };
}

function chooseRandomTask() {
    let chances = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    let lockChance = chances[Math.floor(Math.random() * chances.length)];
    let chosenTask = -1;
    let randInd;

    if (lockChance <= lockProbability) {
        randInd = Math.floor(Math.random() * 2);
        
        if (randInd === 1) {
            randInd = 7;
        } else {
            randInd = 22;
        }
    } else {
        randInd = Math.floor(Math.random() * taskPool.length);
        
        // Sequential 1
        if (prevTaskInd === 4) {
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
   

    if (typeof chosenTask === "function") {
        chosenTask = chosenTask();
    }
    
    currentTaskNum++; 

    createTask(
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

function startGame() {
    document.body.style.background = "linear-gradient(90deg,rgba(237, 109, 109, 1) 0%, rgba(237, 161, 126, 1) 50%, rgba(247, 205, 114, 1) 100%)";
    for (let i = 0; i <= maxTasks; i++)
        chooseRandomTask();
}





document.addEventListener("bombModeStart", () => {
    document.body.classList.add("bomb-mode");
    modal.classList.add("hidden");
    timesTurned = 0;
    score = 0;
    startGame();
});

document.addEventListener("dialTurned", () => {
    timesTurned++;
    currentTaskNum = 0;
    score -= 50;
});

document.addEventListener("endGame", () => {
    gameLoop = false;
    modal.classList.remove("hidden");
    finalScoreText.textContent = `Your final score is ${score} points.`
    finalStatsText.textContent = (`You completed ${totalTaskNum} task${totalTaskNum === 1 ? "" : "s"} and spun the dial ${timesTurned} time${timesTurned === 1 ? "" : "s"}.`)
    
    while (todoColumn.lastElementChild && todoColumn.lastElementChild.tagName !== "HR") {
        todoColumn.removeChild(todoColumn.lastElementChild);
    }

    while (lockColumn.lastElementChild && lockColumn.lastElementChild.tagName !== "HR") {
        lockColumn.removeChild(lockColumn.lastElementChild);
    }
});


restartButton.addEventListener("click", () => {
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
