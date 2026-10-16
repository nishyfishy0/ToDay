const todoColumn = document.querySelectorAll('.column')[0]; // Selects the FIRST element with class "column"
const completedColumn = document.querySelectorAll('.column')[2]; // Selects the THIRD element with class "column"



function complete(event) {
    const task = event.target.closest(".task-card");
    completedColumn.appendChild(task.querySelector("span"));
    
    task.remove();
}



function createTask(id, title, desc, btn) {
    const task = document.createElement("div");
    const ident = document.createElement("span");
    const head = document.createElement("h3");
    const description = document.createElement("p");
    const button = document.createElement("button");
    const btntxt = document.createElement("p");
    
    
    ident.textContent = id;
    head.textContent = title;
    description.textContent = desc;
    btntxt.textContent = btn;
    button.append(btntxt);
    
    task.classList.add("task-card");
    button.classList.add("completeTask")
    task.append(ident, head, description, button);

    todoColumn.append(task)

    const completeButton = task.querySelector(".completeTask");
    completeButton.addEventListener("click", complete)
}

createTask(
    "t.1",
    "Your first task",
    `Welcome to ToDay, your modern to-do list—specializing in time management!
    Normally, in place of this task's title would be the actual task, but we wanted to welcome you!
    To start, mark this task as completed.`,
    "Complete Task"
);
createTask("t.2", "deez", "nuts", "gottem");
