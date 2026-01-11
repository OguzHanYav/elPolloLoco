let canvas;
let world;
let keyboard = new Keyboard();

/**
 * Initializes the game world and canvas.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  window.world = world;
}

/**
 * Opens the legal notice (Impressum) popup.
 */
function openImpressum() {
  if (document.getElementById('impressum-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'impressum-popup';
  popup.className = 'popup impressum-body';

  popup.innerHTML = impressumHTML;
  document.body.appendChild(popup);

  document.getElementById('close-impressum').onclick = (e) => {
    e.preventDefault();
    popup.remove();
  };

  popup.addEventListener('click', () => popup.remove());
  popup.querySelector('.impressum-container')
    .addEventListener('click', e => e.stopPropagation());
}

/**
 * Handles initial UI setup and event listeners after page load.
 */
window.addEventListener("load", () => {
  const playBtn = document.getElementById("play-btn");
  const startScreen = document.getElementById("start-screen");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const gameContainer = document.querySelector(".game-container");
  const muteBtn = document.getElementById("mute-btn");
  const infoBtn = document.getElementById("info-btn");
  const infoPopup = document.getElementById("info-popup");
  const canvas = document.getElementById("canvas");
  const impressum = document.getElementById("impressum-btn");
  const bgMusic = AUDIO.background;

  bgMusic.loop = true;
  const savedMute = getSavedMuteState();

  initUIButtons();
  AudioManager.prepare();

  const unlockBackgroundAudio = () => {
    AudioManager.unlock();
    if (!AudioManager.isMuted) {
      AudioManager.playBackground(window.AUDIO.background);
    }
    window.removeEventListener("click", unlockBackgroundAudio);
    window.removeEventListener("touchstart", unlockBackgroundAudio);
  };

  window.addEventListener("click", unlockBackgroundAudio);
  window.addEventListener("touchstart", unlockBackgroundAudio);

  playBtn.addEventListener("click", () => {
    AudioManager.unlock();
    startScreen.style.display = "none";
    canvas.style.display = "block";
    document.body.classList.add("game-running");
    init();
    initMobileControls();

    const bg = AUDIO.background;
    if (!AudioManager.isMuted && bg.paused) {
      AudioManager.playBackground(bg);
    }

    playBtn.style.pointerEvents = "none";
    playBtn.style.opacity = "0.6";
  });

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

  muteBtn.src = savedMute
    ? "img/mute-btn-white.ico"
    : "img/volume-white.ico";

  muteBtn.addEventListener("click", () => {
    if (!AudioManager.unlocked) AudioManager.unlock();
    const newState = !AudioManager.isMuted;
    AudioManager.setMuted(newState);
    muteBtn.src = newState
      ? "img/mute-btn-white.ico"
      : "img/volume-white.ico";
  });

  infoBtn.addEventListener("click", (event) => {
    infoPopup.classList.remove("hidden");
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    if (!infoPopup.classList.contains("hidden")) {
      infoPopup.classList.add("hidden");
    }
  });

  infoPopup.querySelector(".popup-content")
    .addEventListener("click", event => event.stopPropagation());

  impressum.addEventListener('click', (e) => {
    e.preventDefault();
    openImpressum();
  });
});

/**
 * Handles keyboard input on key press.
 * @param {KeyboardEvent} e
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
});

/**
 * Handles keyboard input on key release.
 * @param {KeyboardEvent} e
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});

/**
 * Initializes UI buttons like restart and home.
 */
function initUIButtons() {
  if (window.uiInitialized) return;

  const restartBtn = document.getElementById("restart-btn");
  const homeBtn = document.getElementById("home-btn");

  if (restartBtn) {
    restartBtn.onclick = () => {
      if (window.world) window.world.startNewGame();
    };
  }

  if (homeBtn) {
    homeBtn.onclick = () => {
      if (!window.world) return;

      window.world.stopGame();
      document.body.classList.remove("game-running");
      document.getElementById("canvas").style.display = "none";
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

/**
 * Initializes mobile and tablet touch controls
 */
function initMobileControls() {
  if (!isTabletOrMobile()) return;

  document.body.classList.add("touch-controls-active");

  const left = document.getElementById("btn-left");
  const right = document.getElementById("btn-right");
  const jump = document.getElementById("btn-jump");
  const throwBtn = document.getElementById("btn-throw");

  if (!left || !right || !jump || !throwBtn) return;

  const resetMovement = () => {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.SPACE = false;
    keyboard.D = false;
  };

  left.addEventListener("touchstart", e => {
    e.preventDefault();
    keyboard.LEFT = true;
  });

  right.addEventListener("touchstart", e => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });

  jump.addEventListener("touchstart", e => {
    e.preventDefault();
    keyboard.SPACE = true;
  });

  throwBtn.addEventListener("touchstart", e => {
    e.preventDefault();
    keyboard.D = true;
  });

  document.addEventListener("touchend", resetMovement);
  document.addEventListener("touchcancel", resetMovement);
}



/**
 * Returns the saved mute state from localStorage.
 * @returns {boolean}
 */
function getSavedMuteState() {
  const value = localStorage.getItem("isMuted");
  return value !== null ? value === "true" : true;
}

/**
 * Checks whether the device is a desktop.
 * @returns {boolean}
 */
function isDesktop() {
  return navigator.maxTouchPoints === 0;
}

/**
 * Checks whether the device supports touch input
 * @returns {boolean}
 */
function isTabletOrMobile() {
  return (
    navigator.maxTouchPoints > 0 &&
    window.matchMedia("(pointer: coarse)").matches
  );
}


