class Todo {
    //Properties
    InputField = null;
    AddButton = null;
    TaskList = null;
    SaveList = null;
    DeleteList = null;
    CompletedList = null;
    ListElement = null;
    StorageKey_todo = "_tasksTodo";
    StorageKey_done = "_tasksDone";

    constructor(root) {
        this.initDOM(root);
        this.initElements();
        this.initEventListeners();
        this.checkStorage();
    }
    //Creating required DOM elements:
    initDOM = (root) => {
        const rootElement = document.querySelector(root);
        const todoDOM = `
            <section id="taskListSection" class="listContainer">
                <h1>Tasks</h1>
                <ul id="taskList"></ul>
            </section>
            <section id="inputSection">
                <div id="input">
                    <input type="text" id="inputField" placeholder="Enter your task here">
                    <button type="button" id="addButton">ADD</button>
                </div>
                <button type="button" id="deleteButton" class="button">Clear current lists</button>
                <div>
                    <p>Memory:</p>
                    <button type="button" id="saveButton" class="button">Save list</button>
                    <button type="button" id="clearSavedListButton" class="button">Delete saved list</button>
                </div>
            </section>
            <section id="completedSection" class="listContainer">
                <h1>Completed Tasks</h1>
                <ul id="completedList"></ul>
            </section>
            `;
        rootElement.innerHTML = todoDOM;
    };
    initElements = () => {
        this.InputField = document.querySelector("#inputField");
        this.AddButton = document.querySelector("#addButton");
        this.TaskList = document.querySelector("#taskList");
        this.SaveList = document.querySelector("#saveButton");
        this.DeleteList = document.querySelector("#deleteButton");
        this.CompletedList = document.querySelector("#completedList");
        this.ClearSavedList = document.querySelector("#clearSavedListButton");
    };

    //EVENT LISTENERS
    initEventListeners = () => {
        this.AddButton.addEventListener("click", this.addListElement);
        this.InputField.addEventListener("keyup", this.createTaskOnEnter);
        this.DeleteList.addEventListener("click", this.deleteList);
        this.SaveList.addEventListener("click", this.saveList);
        this.ClearSavedList.addEventListener("click",this.clearSavedList);
    };

    checkStorage = () =>{
        if (window.localStorage === undefined){
            alert("Your browser does not support Local Storage !")
            return;
        }
        const storageData_todo = localStorage.getItem(this.StorageKey_todo);
        if (storageData_todo != null) {
            const tasksTodo = JSON.parse(decodeURIComponent(atob(storageData_todo)));
            
            for (const task of tasksTodo) {
                this.createListElement(task.text,task.isDone)
            }
        }
        const storageData_done = localStorage.getItem(this.StorageKey_done);
        if (storageData_done != null) {
            const tasksDone = JSON.parse(decodeURIComponent(atob(storageData_done)));
            
            for (const task of tasksDone) {
                this.createListElement(task.text,task.isDone)
            }
        }
    }
    createListElement = (data,isDone) => {
        let text="";
        if(data){
            text=data;
        } else{
            text = this.InputField.value.trim();
        }
        if (!text) {
            alert("Nothing to add. Input field is empty!");
            return;
        }
        const listElement = document.createElement("li");
        listElement.innerHTML = text;

        //CHECKBOX
        const cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.addEventListener("change", this.check_uncheck);
        listElement.prepend(cb);
        //END CHECKBOX

        //X BUTTON
        const xButton = document.createElement("button");
        xButton.setAttribute("type", "button");
        xButton.classList.add("deleteElement");
        xButton.addEventListener("click", this.deleteListItem);
        xButton.innerHTML = "X";
        listElement.append(xButton);
        //END X BUTTON

        if (isDone){
            listElement.firstChild.checked = true;
            this.CompletedList.append(listElement);
        } else {
            this.TaskList.append(listElement);
        }
        this.resetInputField();
    };

    addListElement = () =>{
        this.createListElement();
    }

    createTaskOnEnter = (e) => {
        if (e.key === "Enter") {
            this.createListElement();
        }
    };

    check_uncheck = (e) => {
        const item = e.target.parentNode;
        if (e.target.checked) {
            this.CompletedList.append(item);
        } else {
            this.TaskList.append(item);
        }
    };

    deleteListItem = (e) => {
        const item = e.target.parentNode;
        item.remove();
    };

    deleteList = () => {
        if (confirm("Are you sure you want to delete list?")) {
            this.TaskList.innerHTML = ``;
            this.CompletedList.innerHTML = ``;
        }
    };

    saveList = () => {
        if (window.localStorage === undefined){
            alert("Your browser does not support Local Storage !")
            return;
        }
        const tasks = this.TaskList.childNodes;
        const completedTasks = this.CompletedList.childNodes;

         if (tasks.length == 0 && completedTasks.length ==0){
            alert("Your list is empty, there is no point in saving it!");
            return;
         }
         
        const itemsToDO = [];
        const itemsDone = [];

        for (const task of tasks) {
            itemsToDO.push({
                isDone : task.querySelector("input[type=checkbox]").checked,
                text : task.childNodes[1].data
            })
        }
        for (const task of completedTasks) {
            itemsDone.push({
                isDone : task.querySelector("input[type=checkbox]").checked,
                text : task.childNodes[1].data
            })
        }
        localStorage.setItem(
            this.StorageKey_todo,
            btoa(encodeURIComponent(JSON.stringify(itemsToDO)))
        );
        localStorage.setItem(
            this.StorageKey_done,
            btoa(encodeURIComponent(JSON.stringify(itemsDone)))
        );
    }
    
    clearSavedList = () => {
        if(confirm("Do you want to delete saved list?")){
            localStorage.clear();
        }
    }
    
    //HELPERS:

    resetInputField = () => {
        this.InputField.value = "";
        this.InputField.focus();
    };
}

(() => {
    const todo = new Todo("#todo");
})();