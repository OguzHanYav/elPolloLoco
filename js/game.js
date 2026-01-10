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
  initMobileControls();
  AudioManager.prepare();

  const unlockBackgroundAudio = () => {
    AudioManager.unlock();
    if (!AudioManager.isMuted) AudioManager.playBackground(window.AUDIO.background);
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
    const bg = AUDIO.background;
    if (!AudioManager.isMuted && bg.paused) AudioManager.playBackground(bg);
    playBtn.style.pointerEvents = "none";
    playBtn.style.opacity = "0.6";
  });

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      gameContainer.requestFullscreen();
      fullscreenBtn.querySelector("img").src = "img/fullscreen-exit-multi-size.ico";
    } else {
      document.exitFullscreen();
      fullscreenBtn.querySelector("img").src = "img/fullScreen.png";
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) fullscreenBtn.querySelector("img").src = "img/fullScreen.png";
  });

  const bgMusic = AUDIO.background;
  bgMusic.loop = true;
  const savedMute = getSavedMuteState();
  muteBtn.src = savedMute ? "img/mute-btn-white.ico" : "img/volume-white.ico";

  muteBtn.addEventListener("click", () => {
    if (!AudioManager.unlocked) AudioManager.unlock();
    const newState = !AudioManager.isMuted;
    AudioManager.setMuted(newState);
    muteBtn.src = newState ? "img/mute-btn-white.ico" : "img/volume-white.ico";
  });

  infoBtn.addEventListener("click", (event) => {
    infoPopup.classList.remove("hidden");
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    if (!infoPopup.classList.contains("hidden")) infoPopup.classList.add("hidden");
  });

  infoPopup.querySelector(".popup-content").addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});

function initUIButtons() {
  if (window.uiInitialized) return;
  const restartBtn = document.getElementById("restart-btn");
  const homeBtn = document.getElementById("home-btn");

  if (restartBtn) restartBtn.onclick = () => { if (window.world) window.world.startNewGame(); };
  if (homeBtn) homeBtn.onclick = () => {
    if (!window.world) return;
    window.world.stopGame();
    document.body.classList.remove("game-running");
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

  window.uiInitialized = true;
}

function initMobileControls() {
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

  left.addEventListener("touchstart", (e) => { e.preventDefault(); keyboard.LEFT = true; });
  right.addEventListener("touchstart", (e) => { e.preventDefault(); keyboard.RIGHT = true; });
  jump.addEventListener("touchstart", (e) => { e.preventDefault(); keyboard.SPACE = true; });
  throwBtn.addEventListener("touchstart", (e) => { e.preventDefault(); keyboard.D = true; });

  document.addEventListener("touchend", resetMovement);
  document.addEventListener("touchcancel", resetMovement);
}

function getSavedMuteState() {
  const value = localStorage.getItem("isMuted");
  return value !== null ? value === "true" : true;
}
