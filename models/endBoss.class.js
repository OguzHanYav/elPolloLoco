/**
 * End boss enemy of the game.
 * @extends MovableObject
 */
class EndBoss extends MovableObject {

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png"
  ];

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png"
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png"
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png"
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png"
  ];
  /**
   * Creates the end boss and loads all required images.
   */
  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 2500;
    this.y = 30;
    this.isHurt = false;
    this.isDeadBoss = false;
    this.lastMove = 0;
    this.moveInterval = 200;
    this.lastAnimationTime = 0;
    this.animationInterval = 150;
  }

  /**
   * Updates the end boss animation based on its current state.
   */
  updateAnimation() {
    const now = new Date().getTime();

    if (now - this.lastAnimationTime > this.animationInterval) {
      this.lastAnimationTime = now;
      if (!this.world || !this.world.character) return;

      this.updateState();

      if (this.isDeadBoss) {
        this.handleDeathAnimation();
      } else if (this.isHurt) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACK);
        this.handleAttackMovement();
      } else if (this.isWalking) {
        this.playAnimation(this.IMAGES_WALKING);
        this.handleWalking();
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }
  }

  /**
   * Updates the current state of the end boss (walking or attacking).
   */
  updateState() {
    if (this.isDeadBoss) return;

    const charDistance = this.world.character.x - this.x;
    this.isWalking = !this.attackTriggered && Math.abs(charDistance) < this.walkDistance;
    this.isAttacking = this.attackTriggered;

    if (this.isAttacking) this.isWalking = false;

    this.otherDirection = this.world.character.x > this.x;
  }

  /**
   * Handles walking movement towards the player.
   */
  handleWalking() {
    if (!this.isWalking) return;

    const char = this.world.character;
    this.x += char.x > this.x ? 5 : -5;
    this.otherDirection = char.x > this.x;
  }

  /**
   * Triggers the attack state of the end boss.
   */
  triggerAttack() {
    this.attackTriggered = true;
  }

  /**
   * Handles movement behavior while attacking the player.
   */
  handleAttackMovement() {
    const char = this.world.character;
    const moveStep = this.isAttacking ? 40 : 5;

    if (char.x < this.x) {
      this.x -= moveStep;
      this.otherDirection = false;
    } else if (char.x > this.x) {
      this.x += moveStep;
      this.otherDirection = true;
    }
  }

  /**
   * Plays the death animation and marks it as finished.
   */
  handleDeathAnimation() {
    if (!this.deadAnimationFinished) {
      this.playAnimation(this.IMAGES_DEAD);

      if (this.currentImage >= this.IMAGES_DEAD.length - 1) {
        this.deadAnimationFinished = true;
      }
    } else {
      this.loadImage(this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]);
    }
  }

  /**
   * Reduces the end boss energy when hit.
   */
  hit() {
    if (this.isDeadBoss) return;

    this.energy -= 20;

    if (this.energy <= 0) {
      this.energy = 0;
      this.isDeadBoss = true;
      return;
    }

    this.isHurt = true;
    setTimeout(() => (this.isHurt = false), 300);
  }

  /**
   * Checks whether the end boss is dead.
   * @returns {boolean} True if energy is zero.
   */
  isDead() {
    return this.energy <= 0;
  }
}
