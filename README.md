# Notebook To-Do – Advanced Vanilla JS App

Task manager w/ calendar, categories, due dates. 

![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6-yellow) ![Todo](https://img.shields.io/badge/ToDo-Calendar-green)

## Features
- Add/edit/delete tasks.
- Mini calendar w/ due date highlights.
- Month filter, localStorage persist.

 ## Demo Screenshots
![Home](To-do-Home.png?raw=true)
![Calendar Output](To-do-Output.png?raw=true)<!-- Add yours -->

## Real Code Snippet (addTask)
```js
function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const category = categorySelect.value;

  if (text === "") return alert("Please enter a task!");

  const task = {
    text,
    dueDate,
    category,
    completed: false,
  };

  renderTask(task);
  saveTask(task);
  taskInput.value = "";
  dueDateInput.value = "";
}
