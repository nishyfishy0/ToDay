const todoColumn = document.querySelectorAll('.column')[0]; 
const completedColumn = document.querySelectorAll('.column')[2]; 
const newTask = document.querySelector('.newTask');

let score = 0;
let gameLoop = true;
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
    {
        title: "Beta Feature?",
        desc: "Test out our Password Generator, please. Password: x8VLPo$M",
        type: "input",
        answer: "x8VLPo$M",
        placeholder: "Type the password :)"
    },

    // These next 3 tasks will have some extra code so that they always come one after another
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
        title: "Final sure-ness check <:)",
        desc: "You can never be too sure. Please type \"yes\" if you're truly sure!",
        type: "input",
        answer: "Yes",
        placeholder: "Type \"yes\" here..."
    },
    generateAdditionTask,
    generateMultiplicationTask,
    generateRandomWordTask,
    generateWordBombTask
];



score = 0;
maxTasks = 5;

scoreText = newTask.querySelector("p");
if (scoreText) {
    scoreText.textContent = `Score: ${score}`;
}

function complete(event) {
    const btn = event.currentTarget;
    const task = btn.closest(".task-card");
    const taskID = task.dataset.taskId;

    if (btn.textContent === "") {
        const inp = task.querySelector("input");

        if (!("answer" in inp.dataset)) {
            const isCorrect = inp.validate
                ? inp.validate(inp.value.trim())
                : inp.value.trim().toLowerCase() === inp.dataset.answer;

            if (isCorrect) {
                completedColumn.appendChild(task.querySelector("span"));
                task.remove();

                setTimeout(() => {
                    nextTask(taskID); 
                }, 500);

                score += 100;
                if (scoreText) {
                    scoreText.textContent = `Score: ${score}`
                };
            }
        } else if (inp.value.toLowerCase() === inp.dataset.answer) {
            completedColumn.appendChild(task.querySelector("span"));
            task.remove();

            setTimeout(() => {
                nextTask(taskID); 
            }, 500);

            score += 100;
            if (scoreText) {
                scoreText.textContent = `Score: ${score}`
            };
        }
    } else {
        const requiredClicks = parseInt(btn.dataset.requiredClicks) || 1;

        if (requiredClicks <= 1) {
            completedColumn.appendChild(task.querySelector("span"));
            task.remove();

            setTimeout(() => {
                nextTask(taskID);
            }, 500);

            score += 100;
            if (scoreText) scoreText.textContent = `Score: ${score}`;
        } else {
            const btntext = btn.querySelector("p");
            btn.dataset.requiredClicks = requiredClicks - 1;
            btntext.textContent = `${btn.dataset.txt} (${btn.dataset.requiredClicks})`;
        }
    }
}

function nextTask(id) {
    if (id === "0.1") {
        createTask(
            "0.2",
            "What color is a carrot?",
            "I think it's a... I think it's a carrot... uhhh... carrots... idk abt that....",
            undefined, undefined,
            "Type a color...",
            "Orange"
        );
    } else if (id === "0.2") {
        createTask(
            "0.3",
            "Click!",
            "Click the button 10 times.",
            "Click! Click! Click!",
            10,
            undefined, undefined
        );
    } else if (id === "0.3") {
        createTask(
            "0.4",
            "What's 14 x 2?",
            "Oooh bit of a harder one but no biggie... right...?",
            undefined, undefined,
            "Type a number...",
            "28"
        );
    }
}

function createTask(id, title, desc, btn, reqClicks, txt, reqInp, taskData) {
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

    todoColumn.append(task);
    
    const completionReq = task.querySelector(".completeTask");
    completionReq.addEventListener("click", complete);
}

function generateAdditionTask() {
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;

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

function startGame() {
    createTask(
        "0.1",
        "What's 1 + 1?",
        "Easy question. Hopefully.",
        undefined, undefined,
        "Type your answer here...",
        "2"
    );
}





document.addEventListener("bombModeStart", () => {
    alert("prank'd lmao this isn't a productivity website 😛😛😛")
    startGame();
});