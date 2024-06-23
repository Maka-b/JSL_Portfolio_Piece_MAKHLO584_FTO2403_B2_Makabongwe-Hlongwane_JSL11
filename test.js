/*let tasks = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true }
  ];
  
  let taskIndex = 1; // Index of the task to update
  
  let updates = { completed: false, notes: 'Needs review' };
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  
  console.log(tasks);*/

  // Example Title: Finding Index of a Modified Object

// Array of objects representing fruits
let fruits = [
    { name: 'apple', color: 'red' },
    { name: 'banana', color: 'yellow' },
    { name: 'orange', color: 'orange' }
];

let banana = { name: 'banana', color: 'yellow' };

// Finding the index of an object after modifying it
fruits.push(banana); // Adding the modified object to the array
let index = fruits.indexOf({name: 'apple', color : 'red'});
console.log(fruits)
console.log(index); // Output: 3