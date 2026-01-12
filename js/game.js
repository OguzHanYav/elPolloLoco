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
  if (document.getElementById("impressum-popup")) return;
  const popup = document.createElement("div");
  popup.id = "impressum-popup";
  popup.className = "popup impressum-body";
  popup.innerHTML = impressumHTML;
  document.body.appendChild(popup);
  bindImpressumEvents(popup);
}

/**
 * Binds all events for the impressum popup.
 * @param {HTMLElement} popup
 */
function bindImpressumEvents(popup) {
  document.getElementById("close-impressum").onclick = (e) => {
    e.preventDefault();
    popup.remove();
  };
  popup.addEventListener("click", () => popup.remove());
  popup.querySelector(".impressum-container").addEventListener("click", (e) => e.stopPropagation());
}

/**
 * Entry point after page load.
 */
window.addEventListener("load", () => {
  initUIButtons();
  initAudio();
  initPlayButton();
  initFullscreenButton();
  initMuteButton();
  initInfoPopup();
  initImpressumButton();
});

/**
 * Initializes audio system and unlock handling.
 */
function initAudio() {
  const bgMusic = AUDIO.background;
  bgMusic.loop = true;
  AudioManager.prepare();
  initAudioUnlock();
}

/**
 * Unlocks audio on first user interaction.
 */
function initAudioUnlock() {
  const unlock = () => {
    AudioManager.unlock();
    if (!AudioManager.isMuted) {
      AudioManager.playBackground(AUDIO.background);
    }
    window.removeEventListener("click", unlock);
    window.removeEventListener("touchstart", unlock);
  };
  window.addEventListener("click", unlock);
  window.addEventListener("touchstart", unlock);
}

/**
 * Initializes the play button behavior.
 */
function initPlayButton() {
  const playBtn = document.getElementById("play-btn");
  const startScreen = document.getElementById("start-screen");
  const canvas = document.getElementById("canvas");
  playBtn.addEventListener("click", () => {
    AudioManager.unlock();
    startScreen.style.display = "none";
    canvas.style.display = "block";
    document.body.classList.add("game-running");
    init();
    initMobileControls();
    startBackgroundMusic();
    playBtn.style.pointerEvents = "none";
    playBtn.style.opacity = "0.6";
  });
}

/**
 * Starts background music if allowed.
 */
function startBackgroundMusic() {
  const bg = AUDIO.background;
  if (!AudioManager.isMuted && bg.paused) {
    AudioManager.playBackground(bg);
  }
}

/**
 * Initializes fullscreen toggle behavior.
 */
function initFullscreenButton() {
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const gameContainer = document.querySelector(".game-container");
  fullscreenBtn.addEventListener("click", () => {
    toggleFullscreen(gameContainer, fullscreenBtn);
  });
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      fullscreenBtn.querySelector("img").src = "img/fullScreen.png";
    }
  });
}

/**
 * Toggles fullscreen mode.
 * @param {HTMLElement} container
 * @param {HTMLElement} button
 */
function toggleFullscreen(container, button) {
  if (!document.fullscreenElement) {
    container.requestFullscreen();
    button.querySelector("img").src = "img/fullscreen-exit-multi-size.ico";
  } else {
    document.exitFullscreen();
    button.querySelector("img").src = "img/fullScreen.png";
  }
}

/**
 * Initializes mute button behavior.
 */
function initMuteButton() {
  const muteBtn = document.getElementById("mute-btn");
  updateMuteIcon(muteBtn);
  muteBtn.addEventListener("click", () => {
    if (!AudioManager.unlocked) AudioManager.unlock();
    AudioManager.setMuted(!AudioManager.isMuted);
    updateMuteIcon(muteBtn);
  });
}

/**
 * Updates mute button icon.
 * @param {HTMLImageElement} muteBtn
 */
function updateMuteIcon(muteBtn) {
  muteBtn.src = AudioManager.isMuted
    ? "img/mute-btn-white.ico"
    : "img/volume-white.ico";
}

/**
 * Initializes info popup behavior.
 */
function initInfoPopup() {
  const infoBtn = document.getElementById("info-btn");
  const infoPopup = document.getElementById("info-popup");

  infoBtn.addEventListener("click", (event) => {
    infoPopup.classList.remove("hidden");
    event.stopPropagation();
  });
  document.addEventListener("click", () => {
    if (!infoPopup.classList.contains("hidden")) {
      infoPopup.classList.add("hidden");
    }
  });
  infoPopup.querySelector(".popup-content").addEventListener("click", (event) => event.stopPropagation());
}

/**
 * Initializes impressum button behavior.
 */
function initImpressumButton() {
  const impressumBtn = document.getElementById("impressum-btn");
  impressumBtn.addEventListener("click", (e) => {
    e.preventDefault(); openImpressum();
  });
}

/**
 * Handles keyboard input on key press.
 * @param {KeyboardEvent} e
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode === 39) keyboard.RIGHT = true;
  if (e.keyCode === 37) keyboard.LEFT = true;
  if (e.keyCode === 38) keyboard.UP = true;
  if (e.keyCode === 40) keyboard.DOWN = true;
  if (e.keyCode === 32) keyboard.SPACE = true;
  if (e.keyCode === 68) keyboard.D = true;
});

/**
 * Handles keyboard input on key release.
 * @param {KeyboardEvent} e
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode === 39) keyboard.RIGHT = false;
  if (e.keyCode === 37) keyboard.LEFT = false;
  if (e.keyCode === 38) keyboard.UP = false;
  if (e.keyCode === 40) keyboard.DOWN = false;
  if (e.keyCode === 32) keyboard.SPACE = false;
  if (e.keyCode === 68) keyboard.D = false;
});

/**
 * Initializes UI buttons like restart and home.
 */
function initUIButtons() {
  if (window.uiInitialized) return;
  bindRestartButton();
  bindHomeButton();
  window.uiInitialized = true;
}

/**
 * Binds restart button behavior.
 */
function bindRestartButton() {
  const restartBtn = document.getElementById("restart-btn");
  if (!restartBtn) return;
  restartBtn.onclick = () => {
    if (window.world) window.world.startNewGame();
  };
}

/**
 * Binds home button behavior.
 */
function bindHomeButton() {
  const homeBtn = document.getElementById("home-btn");
  if (!homeBtn) return;
  homeBtn.onclick = () => {
    if (!window.world) return;
    window.world.stopGame();
    resetGameUI();
  };
}

/**
 * Resets UI back to start screen.
 */
function resetGameUI() {
  document.body.classList.remove("game-running");
  document.getElementById("canvas").style.display = "none";
  document.getElementById("win-screen").style.display = "none";
  document.getElementById("game-over-screen").style.display = "none";
  const startScreen = document.getElementById("start-screen");
  const playBtn = document.getElementById("play-btn");
  startScreen.style.display = "flex";
  playBtn.style.pointerEvents = "auto";
  playBtn.style.opacity = "1";
}

/**
 * Initializes mobile and tablet touch controls.
 */
function initMobileControls() {
  if (!isTabletOrMobile()) return;
  document.body.classList.add("touch-controls-active");
  const left = document.getElementById("btn-left");
  const right = document.getElementById("btn-right");
  const jump = document.getElementById("btn-jump");
  const throwBtn = document.getElementById("btn-throw");
  if (!left || !right || !jump || !throwBtn) return;
  bindTouchControls(left, right, jump, throwBtn);
}

/**
 * Binds touch control events.
 */
function bindTouchControls(left, right, jump, throwBtn) {
  const resetMovement = () => {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.SPACE = false;
    keyboard.D = false;
  };

  left.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
  });

  right.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });

  jump.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
  });

  throwBtn.addEventListener("touchstart", (e) => {
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
 * Checks whether the device supports touch input.
 * @returns {boolean}
 */
function isTabletOrMobile() {
  return (
    navigator.maxTouchPoints > 0 &&
    window.matchMedia("(pointer: coarse)").matches
  );
}
