import keyData from "./data.js";

const listener = window.addEventListener("keyup", playGame);
let numCorrect = 0;
let highScore = 0;
let lives = 3;
const scoreboardCorrect = document.querySelector(".scoreboard .correct");
const scoreboardHighScore = document.querySelector(".scoreboard .high-score");
const scoreboardLives = document.querySelector(".scoreboard .lives");
const keyboard = document.querySelector(".keyboard");

(function createKeyboard() {
  keyData.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    row.forEach((key) => createKey(key, rowDiv));
    keyboard.appendChild(rowDiv);
  });
})();

function createKey(key, rowDiv) {
  const keyButton = document.createElement("button");
  keyButton.classList.add("key");
  keyButton.dataset.key = key.dataKey;
  if (isUtilityKey(key.dataKey)) {
    keyButton.classList.add("utility");
  }
  keyButton.innerText = key?.label?.toUpperCase() ?? key.dataKey.toUpperCase();
  rowDiv.appendChild(keyButton);
}

function leadingZero(num) {
  return num < 10 ? "0" + num : num;
}

function updateScoreboard() {
  scoreboardCorrect.innerText = "👌 Correct : " + leadingZero(numCorrect);
  scoreboardHighScore.innerText = "⚡ High score : " + leadingZero(highScore);
  scoreboardLives.innerText = "💖 Lives : " + leadingZero(lives);

  if (lives === 0) {
    keyboard.style.opacity = "0.5";
    scoreboardLives.innerText = "💀 Game over!";
    setTimeout(() => {
      lives = 3;
      keyboard.style.opacity = "1";
      updateScoreboard();
    }, 2000);
  }
}

function isUtilityKey(key) {
  return ["Backspace", "Enter", "Shift", "Tab", "CapsLock"].includes(key);
}

const allKeys = document.querySelectorAll(".key");

function selectRandomKey() {
  // filter out the keys that we don't want to jiggle
  const filteredKeys = [...allKeys].filter((key) => !isUtilityKey(key.dataset.key));
  const randomKey = filteredKeys[Math.floor(Math.random() * filteredKeys.length)];

  return randomKey;
}

function jiggleKey(key) {
  key.classList.add("jiggle");
}

function playSoundCorrect() {
  let audio = new Audio("./ding-36029.mp3");
  audio.play();
}

function playSoundIncorrect() {
  let audio = new Audio("./wrong-answer-126515.mp3");
  audio.play();
}

function handleCorrect(jiggledKey) {
  numCorrect++;
  if (numCorrect > highScore) {
    highScore = numCorrect;
  }
  updateScoreboard();
  playSoundCorrect();
  cleanUp(jiggledKey);
}

function handleIncorrect(jiggledKey) {
  lives--;
  if (lives === 0) {
    numCorrect = 0;
  }
  updateScoreboard();
  playSoundIncorrect();
  cleanUp(jiggledKey);
}

function cleanUp(jiggledKey) {
  window.removeEventListener("keyup", listener); // remove the event listener
  jiggledKey.classList.remove("jiggle"); // remove the class
  jiggleKey(selectRandomKey()); // call the function again
}

function playGame(event) {
  const jiggledKey = document.querySelector(".jiggle");
  let match = event.key.toLowerCase() === jiggledKey.dataset.key.toLowerCase();

  if (isUtilityKey(event.key)) {
    return;
  }

  if (match) {
    handleCorrect(jiggledKey);
  }

  if (!match) {
    handleIncorrect(jiggledKey);
  }
}

jiggleKey(selectRandomKey()); // call the function for the first time
updateScoreboard();
