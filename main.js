const todoColumn = document.querySelectorAll('.column')[0]; 
const completedColumn = document.querySelectorAll('.column')[2]; 
const newTask = document.querySelector('.newTask');

let score = 0;
let gameLoop = true;
let maxTasks = 5;
let scoreText = null;

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

        if (inp.value.toLowerCase() === inp.dataset.answer) {
            completedColumn.appendChild(task.querySelector("span"));
            task.remove();

            setTimeout(() => {
                nextTask(taskID); 
            }, 500);

            score += 100;
            if (scoreText) scoreText.textContent = `Score: ${score}`;
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

function createTask(id, title, desc, btn, reqClicks, txt, reqInp) {
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
        inp.dataset.answer = reqInp.toLowerCase();
        submit.classList.add("completeTask");
        submit.style.backgroundColor = "#f2f2f2";
        submit.style.border = "0px";

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
    alert("prank'd")
    startGame();
});