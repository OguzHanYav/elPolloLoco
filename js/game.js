let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  window.world = world;
}


window.addEventListener("load", () => {
  const playBtn = document.getElementById("play-btn");
  const startScreen = document.getElementById("start-screen");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const gameContainer = document.querySelector(".game-container");
  const muteBtn = document.getElementById("mute-btn");
  const infoBtn = document.getElementById("info-btn");
  const infoPopup = document.getElementById("info-popup");
  const canvas = document.getElementById("canvas");

  initUIButtons();
  //Start Button
  playBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    canvas.style.display = "block";
    init();
    world.playBackgroundMusic();

    playBtn.style.pointerEvents = "none";
    playBtn.style.opacity = "0.6";
  });
  //Fullscreen Button
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      gameContainer.requestFullscreen();
      fullscreenBtn.querySelector("img").src =
        "img/fullscreen-exit-multi-size.ico";
    } else {
      document.exitFullscreen();
      fullscreenBtn.querySelector("img").src = "img/fullScreen.png";
    }
  });
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      fullscreenBtn.querySelector("img").src = "img/fullScreen.png";
    }
  });
  //Mute Button
  muteBtn.addEventListener("click", () => {
    if (world) {
      world.toggleMute();
    }
  });
  //Popup Info Button
  infoBtn.addEventListener("click", (event) => {
    infoPopup.classList.remove("hidden");
    event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
    if (!infoPopup.classList.contains("hidden")) {
      infoPopup.classList.add("hidden");
    }
  });
  infoPopup
    .querySelector(".popup-content")
    .addEventListener("click", (event) => {
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

function initUIButtons() {
  if (window.uiInitialized) return;

  const restartBtn = document.getElementById("restart-btn");
  const homeBtn = document.getElementById("home-btn");

  //Restart Button
  if (restartBtn) {
    restartBtn.onclick = () => {
      if (window.world) {
        window.world.startNewGame();
      }
    };
  }

  //Home Button
  if (homeBtn) {
    homeBtn.onclick = () => {
      if (!window.world) return;
      window.world.stopGame();
      const canvas = document.getElementById("canvas");
      canvas.style.display = "none";

      document.getElementById("win-screen").style.display = "none";
      document.getElementById("game-over-screen").style.display = "none";

      const startScreen = document.getElementById("start-screen");
      const playBtn = document.getElementById("play-btn");

      startScreen.style.display = "flex";
      playBtn.style.pointerEvents = "auto";
      playBtn.style.opacity = "1";
    };
  }
  window.uiInitialized = true;
}


