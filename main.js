const todoColumn = document.querySelectorAll('.column')[0]; // Selects the FIRST element with class "column"
const completedColumn = document.querySelectorAll('.column')[2]; // Selects the THIRD element with class "column"



function complete(event) {
    const task = event.target.closest(".task-card");

    if (event.target)
    completedColumn.appendChild(task.querySelector("span"));
    
    task.remove();
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
        submit.textContent = "Submit";
        submit.classList.add("completeTask");
        submit.classList.add(reqInp);

        task.append(inp, submit);
    }

    todoColumn.append(task)
    
    const completionReq = task.querySelector(".completeTask");
    completeReq.addEventListener("click", complete);
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
createTask("t.3", "among us", "not clickbait 2026 *COPS CALLED*", undefined, "wowowow u can type here :0");
