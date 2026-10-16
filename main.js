const todoColumn = document.querySelectorAll('.column')[0]; // Selects the FIRST element with class "column"
const completedColumn = document.querySelectorAll('.column')[2]; // Selects the THIRD element with class "column"



function complete(event) {
    const btn = event.target;
    const task = btn.closest(".task-card");

    if (btn.textContent === "") {
        const inp = task.querySelector("input");

        if (inp.classList.contains(inp.value.toLowerCase())) {
            completedColumn.appendChild(task.querySelector("span"));
            task.remove();
        }
    } else {
        completedColumn.appendChild(task.querySelector("span"));
        task.remove();
    }
}



function createTask(id, title, desc, btn, txt, reqInp) {
    const task = document.createElement("div");
    const ident = document.createElement("span");
    const head = document.createElement("h3");
    const description = document.createElement("p");
    
    ident.textContent = id;
    head.textContent = title;
    description.textContent = desc;
    
    task.classList.add("task-card");
    task.append(ident, head, description);
    

    if (typeof btn !== "undefined") {
        const button = document.createElement("button");
        const btntxt = document.createElement("p");

        btntxt.textContent = btn;
        button.append(btntxt);
        
        button.classList.add("completeTask");
        task.append(button);
        
    } else {
        const inp = document.createElement("input");
        const submit = document.createElement("button");

        inp.placeholder = txt;
        submit.textContent = "";
        inp.classList.add(reqInp.toLowerCase());
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

    todoColumn.append(task)
    
    const completionReq = task.querySelector(".completeTask");

    completionReq.addEventListener("click", complete);
}



createTask(
    "t.1",
    "Your first task",
    `Welcome to ToDay, your modern to-do list—specializing in time management!
    Normally, in place of this task's title would be the actual task, but we wanted to welcome you!
    To start, mark this task as completed.`,
    "Complete Task",
    undefined,
    undefined
);

createTask("t.2", "deez", "nuts", "gottem", undefined, undefined);
createTask("t.3", "among us", "not clickbait 2026 *COPS CALLED*", undefined, "wowowow u can type here :0", "clickbait");