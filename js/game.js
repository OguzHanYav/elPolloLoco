let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

window.addEventListener("load", () => {
  const startButton = document.getElementById("start-button");
  const startScreen = document.getElementById("start-screen");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const gameContainer = document.querySelector(".game-container");
  const muteBtn = document.getElementById("mute-btn");
  const infoBtn = document.getElementById("info-btn");
  const infoPopup = document.getElementById("info-popup");

  //Start Button
  startButton.addEventListener("click", () => {
    startScreen.style.display = "none";
    init();
    world.playBackgroundMusic();
  });
  //Fullscreen Button
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      gameContainer.requestFullscreen();
      fullscreenBtn.querySelector("img").src = "img/fullscreen-exit-multi-size.ico";
    } else {
      document.exitFullscreen();
      fullscreenBtn.querySelector("img").src= "img/fullScreen.png";
    }
  });
  document.addEventListener("fullscreenchange", ()=>{
    if (!document.fullscreenElement) {
      fullscreenBtn.querySelector("img").src ="img/fullScreen.png";
    }
  });
  //Mute Button
  muteBtn.addEventListener("click", () => {
    if (world) {
      world.toggleMute();
    }
  });
  //Popup Info Button
infoBtn.addEventListener ("click",(event) => {
  infoPopup.classList.remove("hidden");
  event.stopPropagation();
});

document.addEventListener("click", (event)=>{
  if (!infoPopup.classList.contains("hidden")) {
    infoPopup.classList.add("hidden");
  }
});
infoPopup.querySelector(".popup-content").addEventListener("click",(event) =>{
  event.stopPropagation();
});
});


window.addEventListener("keydown", (e) => {
  console.log(e.keyCode);
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});
