/**
 * Objekte, die sich bewegen oder Gravitation haben
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
  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  /**
   * @param {number} groundY Boden-Höhe (y-Wert)
   */
  constructor(groundY = 430) {
    super();
    this.id = MovableObject.nextId++;
    this.groundY = groundY;
    this.prevY = this.y;
  }

  /**
   * Wendet Gravitation auf das Objekt an
   */
  applyGravity() {
    if (this.gravityInterval) return;
    this.gravityInterval = setInterval(() => {
      if (this.isDeadCharacter) return;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      if (this.y + this.height >= this.groundY) {
        this.y = this.groundY - this.height;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Stoppt Gravitation
   */
  stopGravity() {
    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
      this.gravityInterval = null;
    }
    this.speedY = 0;
  }

  moveRight() { this.x += this.speed; }
  moveLeft() { this.x -= this.speed; }

  /**
   * Spielt Animation aus dem übergebenen Bilder-Array ab
   * @param {string[]} images Array von Bildpfaden
   */
  playAnimation(images) {
    if (!images || images.length === 0) return;
    let i = this.currentImage % images.length;
    let path = images[i];
    if (this.imageCache[path]) this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() { this.speedY = 30; }
  isAboveGround() { return this.y + this.height < this.groundY; }
  setOnGround() { this.y = this.groundY - this.height; }
  updatePrevY() { this.prevY = this.y; }

  /**
   * Prüft Kollision mit anderem MovableObject
   * @param {MovableObject} mo
   * @returns {boolean} True, wenn eine Kollision vorliegt
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
   * Objekt nimmt Schaden
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
   * Prüft, ob Objekt tot ist
   * @returns {boolean}
   */
  isDead() { return this.energy <= 0; }

  /**
   * Prüft, ob Objekt gerade Schaden erlitten hat
   * @returns {boolean}
   */
  isHurt() { return new Date().getTime() - this.lastHit < 500; }
}
