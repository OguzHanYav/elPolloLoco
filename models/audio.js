/**
 * @file audio.js
 * Zentrale Audioverwaltung für El Pollo Loco.
 * Beinhaltet Sound-Initialisierung, Mute-Handling und Background-Musik.
 */

/**
 * Gibt den gespeicherten Mute-Status aus dem LocalStorage zurück.
 * @returns {boolean} true wenn stumm, sonst false
 */
function getSavedMuteState() {
  const value = localStorage.getItem("isMuted");
  return value !== null ? value === "true" : true;
}

window.AUDIO = {
  jump: new Audio("audio/jumping_01.wav"),
  throw: new Audio("audio/throwBottle.wav"),
  collectBottle: new Audio("audio/collectBottle.wav"),
  collectCoin: new Audio("audio/collectCoin.wav"),
  hitCharacter: new Audio("audio/hit_character.wav"),
  chickenDeath: new Audio("audio/hit_enemy.ogg"),
  smallChickenDeath: new Audio("audio/smallChickenDeathSound.wav"),
  background: new Audio("audio/intro.mp3"),
  splash: new Audio("audio/splashBottle.wav"),
  endbossAttack: new Audio("audio/endbossAttackingSound.wav"),
  endbossDeath: new Audio("audio/endbossDeathSound2.wav")
};

window.ALL_SOUNDS = Object.values(window.AUDIO);

/**
 * Globaler AudioManager zur Steuerung aller Sounds.
 */
window.AudioManager = {
  isMuted: getSavedMuteState(),
  unlocked: false,

  prepare() {
    ALL_SOUNDS.forEach(sound => sound.load());
  },

  unlock() {
    if (this.unlocked) return;
    const bg = this.isMuted ? null : window.AUDIO.background;
    if (bg) {
      bg.volume = 0;
      bg.play()
        .then(() => {
          bg.pause();
          bg.currentTime = 0;
          bg.volume = 1;
        })
        .catch(() => {});
    }
    this.unlocked = true;
  },

  /**
   * Spielt einen Soundeffekt ab.
   * @param {HTMLAudioElement} sound
   */
  play(sound) {
    if (!sound || this.isMuted || !this.unlocked) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  },

  /**
   * Startet die Hintergrundmusik.
   * @param {HTMLAudioElement} sound
   */
  playBackground(sound) {
    if (!sound || this.isMuted || !this.unlocked) return;
    sound.pause();
    sound.currentTime = 0;
    sound.loop = true;
    sound.muted = false;
    setTimeout(() => {
      sound.play().catch(() => {});
    }, 50);
  },

  stop(sound) {
    if (!sound) return;
    sound.pause();
    sound.currentTime = 0;
  },

  /**
   * Setzt den Mute-Status.
   * @param {boolean} value
   */
  setMuted(value) {
    this.isMuted = value;
    localStorage.setItem("isMuted", value);
    if (value) this.stop(window.AUDIO.background);
    else this.playBackground(window.AUDIO.background);
  }
};
