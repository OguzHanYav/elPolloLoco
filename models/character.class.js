/**
 * Represents the main playable character of the game.
 * Handles movement, animations, states and interactions.
 * @extends MovableObject
 */
class Character extends MovableObject {

  height = 250;
  width = 120;
  world;
  speed = 10;
  lastHit = 0;
  deadAnimationFinished = false;
  isDeadCharacter = false;
  idleStarttime = 0;
  isLongIdle = false;
  jumpKeyPressed = false;
  isJumpingAnimationPlaying = false;
  wasInAir = false;
  currentAnimation = null;
  currentImage = 0;
  lastIdleAnimationTime = 0;
  lastLongIdleAnimationTime = 0;
  lastWalkAnimationTime = 0;
  lastJumpAnimationTime = 0;
  lastHurtAnimationTime = 0;
  deadAnimationTime = 0;
  animationIntervalIdle = 300;
  animationIntervalLongIdle = 400;
  jumpAnimationInterval = 100;
  hurtAnimationInterval = 150;
  hurtAnimationDuration = 500;
  hurtStartTime = 0;
  offset = { top: 100, bottom: 10, left: 30, right: 20 };

  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png'
  ];

  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png'
  ];

  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png'
  ];

  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png'
  ];

  IMAGES_IDLE = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png'
  ];

  IMAGES_LONG_IDLE = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png'
  ];

  /**
   * Creates the main character instance.
   * @param {World} world - The game world the character belongs to.
   */
  constructor(world) {
    super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
    this.world = world;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
    this.setOnGround();
  }

  /**
   * Starts the movement update loop.
   */
  animate() {
    setInterval(() => {
      if (this.world.gameStopped || this.isDead()) return;
      this.handleHorizontalMovement();
      this.handleJumpInput();
      this.updateCamera();
    }, 1000 / 60);
  }

  /**
   * Handles left and right movement input.
   */
  handleHorizontalMovement() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
    }
  }

  /**
   * Handles jump input and jump initiation.
   */
  handleJumpInput() {
    if (
      this.world.keyboard.SPACE &&
      !this.jumpKeyPressed &&
      !this.isAboveGround()
    ) {
      this.jumpKeyPressed = true;
      this.isJumpingAnimationPlaying = true;
      this.currentAnimation = this.IMAGES_JUMPING;
      this.currentImage = 0;
      this.lastJumpAnimationTime = 0;
      if (this.world?.jumpSound) AudioManager.play(this.world.jumpSound);
      this.jump();
    }
    if (!this.world.keyboard.SPACE) this.jumpKeyPressed = false;
  }

  /**
   * Updates the camera position based on character position.
   */
  updateCamera() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Updates the current animation based on character state.
   */
  updateAnimation() {
    if (this.world.gameStopped) return;

    const now = Date.now();
    const onGround = !this.isAboveGround();
    const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;

    this.handleLandingReset(onGround);
    if (this.handleDeathState()) return;
    if (this.isHurt()) this.playHurtAnimation();
    if (this.handleAirborneState()) return;
    if (this.handleMovementState(isMoving)) return;
    this.handleIdleState(now);
  }

  /**
   * Resets animation frame after landing.
   * @param {boolean} onGround
   */
  handleLandingReset(onGround) {
    if (onGround && this.wasInAir) this.currentImage = 0;
    this.wasInAir = !onGround;
  }

  /**
   * Handles death state and animation.
   * @returns {boolean} true if character is dead
   */
  handleDeathState() {
    if (!this.isDead()) return false;

    if (!this.isDeadCharacter) {
      this.isDeadCharacter = true;
      this.currentImage = 0;
      this.deadAnimationTime = 0;
      this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }

    if (!this.deadAnimationFinished) this.playDeadAnimation();
    return true;
  }

  /**
   * Handles airborne animation state.
   * @returns {boolean}
   */
  handleAirborneState() {
    if (!this.isAboveGround()) return false;
    this.playJumpAnimation();
    return true;
  }

  /**
   * Handles walking animation state.
   * @param {boolean} isMoving
   * @returns {boolean}
   */
  handleMovementState(isMoving) {
    if (!isMoving) return false;
    this.playWalkAnimation();
    this.resetIdleState();
    return true;
  }

  /**
   * Handles idle and long idle animations.
   * @param {number} now
   */
  handleIdleState(now) {
    if (!this.idleStarttime) {
      this.idleStarttime = now;
      this.isLongIdle = false;
      this.currentImage = 0;
    }

    const idleDuration = now - this.idleStarttime;
    if (idleDuration > 4000 && !this.isLongIdle) this.isLongIdle = true;

    if (this.isLongIdle) this.playLongIdleAnimation();
    else this.playIdleAnimation();
  }

  /**
   * Resets idle timers and states.
   */
  resetIdleState() {
    this.idleStarttime = null;
    this.isLongIdle = false;
  }

  /**
   * Plays the death animation.
   */
  playDeadAnimation() {
    const now = Date.now();
    if (now - this.deadAnimationTime < 300) return;
    this.deadAnimationTime = now;
    if (this.currentImage < this.IMAGES_DEAD.length - 1) this.currentImage++;
    this.img = this.imageCache[this.IMAGES_DEAD[this.currentImage]];
    this.deadAnimationFinished =
      this.currentImage === this.IMAGES_DEAD.length - 1;
  }

  /**
   * Plays the jump animation.
   */
  playJumpAnimation() {
    const now = Date.now();
    if (!this.lastJumpAnimationTime) this.lastJumpAnimationTime = now;
    if (now - this.lastJumpAnimationTime < this.jumpAnimationInterval) return;
    this.lastJumpAnimationTime = now;
    if (this.currentImage < this.IMAGES_JUMPING.length - 1) this.currentImage++;
    this.img = this.imageCache[this.IMAGES_JUMPING[this.currentImage]];
  }

  /**
   * Plays the walking animation.
   */
  playWalkAnimation() {
    const now = Date.now();
    if (!this.lastWalkAnimationTime) this.lastWalkAnimationTime = now;
    if (now - this.lastWalkAnimationTime < 1000 / 30) return;
    this.lastWalkAnimationTime = now;
    this.currentImage =
      (this.currentImage + 1) % this.IMAGES_WALKING.length;
    this.img = this.imageCache[this.IMAGES_WALKING[this.currentImage]];
  }

  /**
   * Plays the idle animation.
   */
  playIdleAnimation() {
    const now = Date.now();
    if (!this.lastIdleAnimationTime) this.lastIdleAnimationTime = now;
    if (now - this.lastIdleAnimationTime < this.animationIntervalIdle) return;
    this.lastIdleAnimationTime = now;
    this.currentImage =
      (this.currentImage + 1) % this.IMAGES_IDLE.length;
    this.img = this.imageCache[this.IMAGES_IDLE[this.currentImage]];
  }

  /**
   * Plays the long idle animation.
   */
  playLongIdleAnimation() {
    const now = Date.now();
    if (!this.lastLongIdleAnimationTime)
      this.lastLongIdleAnimationTime = now;
    if (
      now - this.lastLongIdleAnimationTime <
      this.animationIntervalLongIdle
    )
      return;
    this.lastLongIdleAnimationTime = now;
    this.currentImage =
      (this.currentImage + 1) % this.IMAGES_LONG_IDLE.length;
    this.img = this.imageCache[this.IMAGES_LONG_IDLE[this.currentImage]];
  }

  /**
   * Plays the hurt animation.
   */
  playHurtAnimation() {
    const now = Date.now();
    if (!this.hurtStartTime) this.hurtStartTime = now;
    if (!this.lastHurtAnimationTime)
      this.lastHurtAnimationTime = now;
    if (
      now - this.lastHurtAnimationTime <
      this.hurtAnimationInterval
    )
      return;
    this.lastHurtAnimationTime = now;
    if (now - this.hurtStartTime > this.hurtAnimationDuration) {
      this.hurtStartTime = 0;
      this.currentImage = 0;
      return;
    }
    this.currentImage =
      (this.currentImage + 1) % this.IMAGES_HURT.length;
    this.img = this.imageCache[this.IMAGES_HURT[this.currentImage]];
  }
}
