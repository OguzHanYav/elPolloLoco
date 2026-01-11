/**
 * @file audio.js
 * Central audio management for El Pollo Loco.
 * Handles sound initialization, mute state and background music.
 */

/**
 * Returns the saved mute state from localStorage.
 * @returns {boolean} True if muted, otherwise false
 */
function getSavedMuteState() {
  const value = localStorage.getItem('isMuted');
  return value !== null ? value === 'true' : true;
}

window.AUDIO = {
  jump: new Audio('audio/jumping_01.wav'),
  throw: new Audio('audio/throwBottle.wav'),
  collectBottle: new Audio('audio/collectBottle.wav'),
  collectCoin: new Audio('audio/collectCoin.wav'),
  hitCharacter: new Audio('audio/hit_character.wav'),
  chickenDeath: new Audio('audio/hit_enemy.ogg'),
  smallChickenDeath: new Audio('audio/smallChickenDeathSound.wav'),
  background: new Audio('audio/intro.mp3'),
  splash: new Audio('audio/splashBottle.wav'),
  endbossAttack: new Audio('audio/endbossAttackingSound.wav'),
  endbossDeath: new Audio('audio/endbossDeathSound2.wav'),
};

window.ALL_SOUNDS = Object.values(window.AUDIO);

/**
 * Global AudioManager to control all game sounds.
 */
window.AudioManager = {
  isMuted: getSavedMuteState(),
  unlocked: false,

  /**
   * Preloads all audio files.
   */
  prepare() {
    ALL_SOUNDS.forEach(sound => sound.load());
  },

  /**
   * Unlocks audio playback after first user interaction.
   * Required for browser autoplay policies.
   */
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
   * Plays a sound effect.
   * @param {HTMLAudioElement} sound
   */
  play(sound) {
    if (!sound || this.isMuted || !this.unlocked) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  },

  /**
   * Starts looping background music.
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

  /**
   * Stops a sound immediately.
   * @param {HTMLAudioElement} sound
   */
  stop(sound) {
    if (!sound) return;
    sound.pause();
    sound.currentTime = 0;
  },

  /**
   * Sets the global mute state.
   * @param {boolean} value
   */
  setMuted(value) {
    this.isMuted = value;
    localStorage.setItem('isMuted', value);

    if (value) {
      this.stop(window.AUDIO.background);
    } else {
      this.playBackground(window.AUDIO.background);
    }
  },
};
