/**
 * Base class for all movable objects with gravity and collision handling.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  static nextId = 1;
  gravityInterval = null;
  offset = { top: 80, bottom: 20, left: 20, right: 20 };

  /**
   * Creates a movable object.
   * @param {number} groundY - Y position of the ground.
   */
  constructor(groundY = 430) {
    super();
    this.id = MovableObject.nextId++;
    this.groundY = groundY;
    this.prevY = this.y;
  }

  /**
   * Applies gravity to the object.
   */
  applyGravity() {
    if (this.gravityInterval) return;

    this.gravityInterval = setInterval(() => {
      if (this.isDeadCharacter) return;
      this.prevY = this.y;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;

      if (this.y + this.height >= this.groundY) {
        this.y = this.groundY - this.height;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Stops gravity effect.
   */
  stopGravity() {
    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
      this.gravityInterval = null;
    }
    this.speedY = 0;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Plays an animation using the given image array.
   * @param {string[]} images - Animation image paths.
   */
  playAnimation(images) {
    if (!images || images.length === 0) return;

    let i = this.currentImage % images.length;
    let path = images[i];

    if (this.imageCache[path]) {
      this.img = this.imageCache[path];
    }

    this.currentImage++;
  }

  /**
   * Makes the object jump.
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Checks if the object is above the ground.
   * @returns {boolean}
   */
  isAboveGround() {
    return this.y + this.height < this.groundY;
  }

  /**
   * Places the object exactly on the ground.
   */
  setOnGround() {
    this.y = this.groundY - this.height;
  }

  /**
   * Stores the previous Y position.
   */
  updatePrevY() {
    this.prevY = this.y;
  }

  /**
   * Checks collision with another movable object.
   * @param {MovableObject} mo - The object to check collision with.
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Reduces energy when the object gets hit.
   */
  hit() {
    const now = new Date().getTime();

    if (now - this.lastHit > 300) {
      if (this.world) AudioManager.play(this.world.hitCharacterSound);

      this.energy -= 5;
      if (this.energy < 0) this.energy = 0;

      this.lastHit = now;
    }
  }

  /**
   * Checks whether the object is dead.
   * @returns {boolean}
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Checks whether the object is currently hurt.
   * @returns {boolean}
   */
  isHurt() {
    return new Date().getTime() - this.lastHit < 500;
  }
}
