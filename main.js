const animals = [
  {
    iconName: "polarbear.png",
    habitatName: "Arctic",
    color: "#fffff",
    backgroundImage: "url('images/icebergbg.jpg')"
  },
  {
    iconName: "brownBear.png",
    habitatName: "Forest",
    color: "#fffff",
    backgroundImage: "url('images/forestbg.jpg')"
  },
  {
    iconName: "panda.png",
    habitatName: "Bamboo Forest",
    color: "#fffff",
    backgroundImage: "url('images/bamboobg.jpg')"
  }
];

let correct = 0;
let total = 0;
const totalDraggableItems = 3;
const totalMatchingPairs = 3; // Should be <= totalDraggableItems

const scoreSection = document.querySelector(".score");
const correctSpan = scoreSection.querySelector(".correct");
const totalSpan = scoreSection.querySelector(".total");
const playAgainBtn = scoreSection.querySelector("#play-again-btn");

const draggableItems = document.querySelector(".draggable-items");
const matchingPairs = document.querySelector(".matching-pairs");
let draggableElements;
let droppableElements;

initiateGame();

function initiateGame() {
  const randomDraggableAnimals = generateRandomItemsArray(totalDraggableItems, animals);
  const randomDroppableAnimals = totalMatchingPairs<totalDraggableItems ? generateRandomItemsArray(totalMatchingPairs, randomDraggableAnimals) : randomDraggableAnimals;
  const alphabeticallySortedRandomDroppableAnimals = [...randomDroppableAnimals].sort((a,b) => a.habitatName.toLowerCase().localeCompare(b.habitatName.toLowerCase()));
  
  // Create "draggable-items" and append to DOM
  for(let i=0; i<randomDraggableAnimals.length; i++) {
    draggableItems.insertAdjacentHTML("beforeend", `
    <img class="draggable" draggable="true" src="images/${randomDraggableAnimals[i].iconName}" style="border: 2px solid ${randomDraggableAnimals[i].color};" id="${randomDraggableAnimals[i].iconName}">      `);
  }
  
  // Create "matching-pairs" and append to DOM
  for(let i=0; i<alphabeticallySortedRandomDroppableAnimals.length; i++) {
      matchingPairs.insertAdjacentHTML("beforeend", `
      <div class="matching-pair">
        <span class="label">${alphabeticallySortedRandomDroppableAnimals[i].habitatName}</span>
        <span class="droppable" data-animal="${alphabeticallySortedRandomDroppableAnimals[i].iconName}" style="background-image: ${alphabeticallySortedRandomDroppableAnimals[i].backgroundImage}; background-position: center; background-size: cover;"></span>
      </div>
    `);
  }
  
  draggableElements = document.querySelectorAll(".draggable");
  droppableElements = document.querySelectorAll(".droppable");
  
  draggableElements.forEach(elem => {
    elem.addEventListener("dragstart", dragStart);
    // elem.addEventListener("drag", drag);
    // elem.addEventListener("dragend", dragEnd);
  });
  
  droppableElements.forEach(elem => {
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("dragleave", dragLeave);
    elem.addEventListener("drop", drop);
  });
}

// Drag and Drop Functions

//Events fired on the drag target

function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id); // or "text/plain"
}

//Events fired on the drop target

function dragEnter(event) {
  if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.target.classList.add("droppable-hover");
  }
}

function dragOver(event) {
  if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.preventDefault();
  }
}

function dragLeave(event) {
  if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.target.classList.remove("droppable-hover");
  }
}

function drop(event) {
  event.preventDefault();
  event.target.classList.remove("droppable-hover");
  const draggableElementAnimal = event.dataTransfer.getData("text");
  const droppableElementAnimal = event.target.getAttribute("data-animal");
  const isCorrectMatching = draggableElementAnimal === droppableElementAnimal;
  total++;
  if (isCorrectMatching) {
    const draggableElement = document.getElementById(draggableElementAnimal);
    event.target.classList.add("dropped");
    draggableElement.classList.add("dragged");
    draggableElement.classList.add("placed"); // Add the 'placed' class to the dragged image
    draggableElement.setAttribute("draggable", "false");
    // Instead of setting innerHTML, append the dragged image to the droppable element
    event.target.innerHTML = '';
    event.target.appendChild(draggableElement);
    correct++;
  }
  scoreSection.style.opacity = 0;
  setTimeout(() => {
    correctSpan.textContent = correct;
    totalSpan.textContent = total;
    scoreSection.style.opacity = 1;
  }, 200);
  if (correct === Math.min(totalMatchingPairs, totalDraggableItems)) {
    // Game Over!!
    playAgainBtn.style.display = "block";
    setTimeout(() => {
      playAgainBtn.classList.add("play-again-btn-entrance");
    }, 200);
  }
}


// Other Event Listeners
playAgainBtn.addEventListener("click", playAgainBtnClick);
function playAgainBtnClick() {
  playAgainBtn.classList.remove("play-again-btn-entrance");
  correct = 0;
  total = 0;
  draggableItems.style.opacity = 0;
  matchingPairs.style.opacity = 0;
  setTimeout(() => {
    scoreSection.style.opacity = 0;
  }, 100);
  setTimeout(() => {
    playAgainBtn.style.display = "none";
    while (draggableItems.firstChild) draggableItems.removeChild(draggableItems.firstChild);
    while (matchingPairs.firstChild) matchingPairs.removeChild(matchingPairs.firstChild);
    initiateGame();
    correctSpan.textContent = correct;
    totalSpan.textContent = total;
    draggableItems.style.opacity = 1;
    matchingPairs.style.opacity = 1;
    scoreSection.style.opacity = 1;
  }, 500);
}

// Auxiliary functions
function generateRandomItemsArray(n, originalArray) {
  let res = [];
  let clonedArray = [...originalArray];
  if(n>clonedArray.length) n=clonedArray.length;
  for(let i=1; i<=n; i++) {
    const randomIndex = Math.floor(Math.random()*clonedArray.length);
    res.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return res;
}