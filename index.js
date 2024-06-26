// TASK: import helper functions from utils
// TASK: import initialData
import { initialData } from "./initialData.js";
import * as helperFunc from "./utils/taskFunctions.js"

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

//window.addEventListener('DOMContentLoaded', () => {
// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
    localStorage.setItem('light-theme', 'false')
    localStorage.setItem('activeBoard', JSON.stringify('Launch Career'))
    
  }else {
    console.log('Data already exists in localStorage');
  }
  }



// TASK: Get elements from the DOM
const elements = {
'headerBoardName' : document.getElementById('header-board-name'),
'columnDivs' : document.querySelectorAll('.column-div'),
'filterDiv' : document.getElementById('filterDiv'),
'themeSwitch' : document.getElementById('switch'),
'modalWindow' : document.querySelector('.modal-window'),
'createNewTaskBtn' : document.getElementById('add-new-task-btn'),
'editTaskModal' : document.querySelector('.edit-task-modal-window'),
'sideBarDisplay' : document.getElementById('side-bar-div'),
'sideBarBtn' : document.getElementById('show-side-bar-btn'),
'themeMode' : document.body,

}
const editBnt = {
  "title" : document.getElementById('edit-task-title-input') ,
  "desc" : document.getElementById('edit-task-desc-input'),
  "status" : document.getElementById('edit-select-status'),
  
}

// //console.log((elements.columnDivs))

let colDivs = document.querySelectorAll('column-head-div')

let activeBoard = ""

// Extracts unique board names from tasks
// TASK: FIX BUGS
//Set sidebar dispay to none if board is empty
//show dislay and hide button
function fetchAndDisplayBoardsAndTasks() {

  ////console.log(localStorage)

  const tasks = helperFunc.getTasks();
  ////console.log(`tasksss ${Array.from(tasks)}`)
  const boards = [...new Set(tasks.map(task => task.board).filter(Boolean))];
  // //console.log(`boards : ${boards}`)
  displayBoards(boards);
  ////console.log(`boardsLenght: ${boards.length}`)
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"))
    ////console.log(`active board ${localStorageBoard}`)
    activeBoard = localStorageBoard ? localStorageBoard :  boards[0]; 
    ////console.log(`active board ${activeBoard}`)
    elements.headerBoardName.textContent = activeBoard
    styleActiveBoard(activeBoard)
    refreshTasksUI();
  }
}


// Creates different boards in the DOM
// TASK: Fix Bugs
function displayBoards(boards) {
  const boardsContainer = document.getElementById("boards-nav-links-div");
  boardsContainer.innerHTML = ''; // Clears the container
  //console.log(`boardsContainer: ${boardsContainer}`)
  boards.forEach(board => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    //event listener added / syntax error
    boardElement.addEventListener( 'click', () =>  { 
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board //assigns active board
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard))
      styleActiveBoard(activeBoard)
      });
    boardsContainer.appendChild(boardElement);
    //console.log(`boardsContainer: ${boardsContainer.textContent}`)
  });

}

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = helperFunc.getTasks(); // Fetch tasks from a simulated local storage function
  //console.log(`tasks ${tasks[1].status})`)
  //console.log(tasks.length)
  const filteredTasks = tasks.filter(task => task.board === boardName);
  //console.log(filteredTasks)
  //console.log(`Ftasks ${filteredTasks[1].title})`)
  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  //console.log(`colDivs ${elements.columnDivs[1]}`)
  elements.columnDivs.forEach(column => {
    const status = column.getAttribute("data-status");
    //console.log(column)
    //console.log(`status : ${status}`)
    // Reset column content while preserving the column title
    
    column.innerHTML = `<div class="column-head-div">
              <span class="dot" id="${status}-dot"></span>
              <h4 class="columnHeader">${status.toUpperCase()}</h4>
            </div>`;

    const tasksContainer = document.createElement("div");
    column.appendChild(tasksContainer);

  filteredTasks.filter(task => task.status === status).forEach(task => { 
    const taskElement = document.createElement("div");
    taskElement.classList.add("task-div");
    taskElement.textContent = task.title;
    taskElement.setAttribute('data-task-id', task.id);

    // Listen for a click event on each task and open a modal
    taskElement.addEventListener( "click" ,() => { 
    openEditTaskModal(task);
    });

    tasksContainer.appendChild(taskElement);
  });
  });
}


function refreshTasksUI() {
filterAndDisplayTasksByBoard(activeBoard);
}

// Styles the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
const boardBtnEls = document.querySelectorAll('.board-btn')
console.log(`boardBtnEl ${boardBtnEls}`)
boardBtnEls[1].classList.add('active')

for (let btn of boardBtnEls){
  //console.log(btn)
  if(btn.textContent === boardName) {
    btn.classList.add('active') 
  }
  else {
    btn.classList.remove('active'); 
  }
}
//forEach method not itterable for elements
/* boardBtnEls.foreach(btn => { 

if(btn.textContent === boardName) {
btn.classList.add('active') 
}
else {
btn.classList.remove('active'); 
}
})*/;
}


function addTaskToUI(task) {
const column = document.querySelector(`.column-div[data-status="${task.status}"]`); 
if (!column) {
  console.error(`Column not found for status: ${task.status}`);
return;
}

let tasksContainer = column.querySelector('.tasks-container');
if (!tasksContainer) {
  //console.warn(`Tasks container not found for status: ${task.status}, creating one.`);
  tasksContainer = document.createElement('div');
  tasksContainer.className = 'tasks-container';
  column.appendChild(tasksContainer);
}

const taskElement = document.createElement('div');
taskElement.className = 'task-div';
taskElement.textContent = task.title; // Modify as needed
taskElement.setAttribute('data-task-id', task.id);

tasksContainer.appendChild(taskElement); 
}



function setupEventListeners() {
// Cancel editing task event listener
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  cancelEditBtn.addEventListener('click', () => {
    document.getElementById('edit-task-form').reset()
    toggleModal(false, elements.editTaskModal)});

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById('cancel-add-task-btn');
  cancelAddTaskBtn.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none';
    document.getElementById('edit-task-form').reset() // Also hide the filter overlay
  });


  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener('click', () => {
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
  });

  // Show sidebar event listener
  const hideSideBarBtn = document.getElementById("hide-side-bar-btn")
  const showSideBarBtn = document.getElementById("show-side-bar-btn")
  hideSideBarBtn.addEventListener('click', () => toggleSidebar(false));
  showSideBarBtn.addEventListener('click', () => toggleSidebar(true));


  // Theme switch event listener
  elements.themeSwitch.addEventListener('change', toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener('click', () => {
    toggleModal(true);
    elements.filterDiv.style.display = 'block'; // Also show the filter overlay
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener('submit',  (event) => {
    addTask(event)
  });
}

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  //console.log(`modal ${modal}`)
  show ? modal.style.display='block' : modal.style.display='none'; 
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault(); 
  const task = {
    
    "title": document.getElementById('title-input').value,
    "description": document.getElementById('desc-input').value,
    "status": document.getElementById('select-status').value,
    "board" : activeBoard
    
  };
  
//Assign user input to the task object
  
  const newTask = helperFunc.createNewTask(task);
  //console.log(newTask)
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(false);
    elements.filterDiv.style.display = 'none'; // Also hide the filter overlay
    event.target.reset();
    refreshTasksUI();
  }
}


function toggleSidebar(show) {
  if (show){
    elements.sideBarDisplay.style.display = "block"
    elements.sideBarBtn.style.display =  "none"
  } else{
    elements.sideBarDisplay.style.display = "none"
    elements.sideBarBtn.style.display = "block"
  }

}

function toggleTheme() {
  elements.themeMode.classList.toggle("light-theme")
  localStorage.getItem('light-theme')=== 'true' ? localStorage.setItem('light-theme', 'false') : localStorage.setItem('light-theme', true)
  //console.log(localStorage.getItem('light-theme'))
}



function openEditTaskModal(task) {
// Set task details in modal inputs
  
  //console.log(editBnt.status)
  //console.log(`task ${task.id}`)
  editBnt.title.value = task.title
  editBnt.desc.value = task.description
  editBnt.status.value = task.status
  console.log(`editBnt:${editBnt.title.value}`)

  /*const tasks = JSON.parse(localStorage.getItem('tasks'))
  console.log(tasks)
  console.log(tasks[2].title)
  
  let taskObj = tasks.find(obj => obj.title == editBnt.title.value)
  console.log(taskObj)
  const taskObjId = taskObj.id
  console.log(taskObjId)*/
  
  

 

  
// Get button elements from the task modal
  const saveBtn = document.getElementById('save-task-changes-btn')
  saveBtn.addEventListener('click', ()=> {
    const tasks = JSON.parse(localStorage.getItem('tasks'))
    /* console.log(tasks)
     console.log(tasks[2].title)*/
     
     let taskObj = tasks.find(obj => obj.title == editBnt.title.value)
     console.log(taskObj)
     const taskObjId = taskObj.id
     //console.log(taskObjId)
    //console.log(`taskObjId : ${taskObjId}`)
    saveTaskChanges(taskObjId, task.board)
    //console.log(`taskObjId : ${taskObjId}`)
    toggleModal(false, elements.editTaskModal)
    refreshTasksUI()

  })

// Call saveTaskChanges upon click of Save Changes button

  const deleteBtn = document.getElementById('delete-task-btn')
  deleteBtn.addEventListener('click', ()=> {
    const tasks = JSON.parse(localStorage.getItem('tasks'))
    let taskObj = tasks.find(obj => obj.title == editBnt.title.value)
    //console.log(taskObj)
    const taskObjId = taskObj.id
    helperFunc.deleteTask(taskObjId)
    toggleModal(false, elements.editTaskModal)
    refreshTasksUI()
    
  })
// Delete task using a helper function and close the task modal


toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId, activeBoard) {
// Get new user inputs
  console.log(`taskssID : ${taskId}`)
  
  
// Create an object with the updated task details
  const taskUpdate =  {
    'id': taskId,
    "title" : editBnt.title.value,
    "description": editBnt.desc.value,
    "status": editBnt.status.value,
    "board" : activeBoard
  }
  console.log(taskUpdate)


// Update task using a hlper functoin
  helperFunc.patchTask(taskId,taskUpdate)
  refreshTasksUI();
  //helperFunc.putTask(taskId, taskUpdate)

// Close the modal and refresh the UI to reflect the changes

  
}

/*************************************************************************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
  init();/// init is called after the DOM is fully loaded
});
//init()
function init() {
  initializeData()
  fetchAndDisplayBoardsAndTasks()
  setupEventListeners();
  const showSidebar = localStorage.getItem('showSideBar') === 'true';
  toggleSidebar(showSidebar);
  //elements.themeMode.classList.add('light-theme')
  if (localStorage.getItem('light-theme')=== "true"){
    elements.themeMode.classList.add('light-theme')
    document.getElementById("switch").checked = true
  }else{
    document.getElementById("switch").checked = false
  }
  
  //console.log(`theme ${localStorage.getItem('light-theme')}`) ;
  //document.body.classList.toggle('light-theme', isLightTheme);
  ; // Initial display of boards and tasks
}


//localStorage.clear()


//})




