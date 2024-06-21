// TASK: import helper functions from utils
// TASK: import initialData
import { initialData } from "./initialData.js";
import * as helperFunc from "./utils/taskFunctions.js"

/*************************************************************************************************************************************************
 * FIX BUGS!!!
 * **********************************************************************************************************************************************/

// Function checks if local storage already has data, if not it loads initialData to localStorage
function initializeData() {
  if (!window.localStorage.getItem('tasks')) {
    window.localStorage.setItem('tasks', JSON.stringify(initialData)); 
    localStorage.setItem('showSideBar', 'true')
  } else {
    console.log('Data already exists in localStorage');
  }
}
initializeData()

const elements = {
    'headerBoardName' : document.getElementById(''),
    'columnDivs' : document.getElementById(''),
    'filterDiv' : document.getElementById(''),
    'themeSwitch' : document.getElementById(''),
    'modalWindow' : document.getElementById(''),
    'createNewTaskBtn' : document.getElementById(''),
    'editTaskModal' : document.getElementById('')
    
    
    
    }