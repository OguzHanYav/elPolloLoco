class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  static nextId = 1;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  gravityInterval = null;
  constructor(groundY = 460) {
    super();
    this.id = MovableObject.nextId++;
    this.groundY = groundY;
    this.prevY = this.y;
  }


  // applyGravity() {
  //   if (!this.gravityInterval) {
  //     this.gravityInterval = setInterval(() => {
  //       if (this.isDeadCharacter) return;
  //       this.y -= this.speedY;
  //       this.speedY -= this.acceleration;
  //       if (this.y + this.height >= this.groundY) {
  //         this.y = this.groundY - this.height;
  //         this.speedY = 0;
  //       }
  //     }, 1000 / 25);
  //   }
  // }
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


  isAboveGround() {
    return this.y + this.height < this.groundY;
  }


  stopGravity() {
    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
      this.gravityInterval = null;
    }
    this.speedY = 0;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    if (!images || images.length === 0) return;
    let i = this.currentImage % images.length;
    let path = images[i];
    if (this.imageCache[path]) {
      this.img = this.imageCache[path];
    }
    this.currentImage++;
  }

  jump() {
    this.speedY = 30;
  }

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }
  hit() {
    const now = new Date().getTime();
    if (now - this.lastHit > 800) {
      this.world.playSound(this.world.hitCharacterSound);
      this.energy -= 5;
      if (this.energy < 0) this.energy = 0;
      this.lastHit = now;
    }
  }
  isDead() {
    return this.energy <= 0;
  }
  isHurt() {
    return new Date().getTime() - this.lastHit < 500;
  }

  setOnGround() {
    this.y = this.groundY - this.height;
  }
  updatePrevY() {
    this.prevY = this.y;
  }
  playAnimationTimed(images, interval) {
    const now = Date.now();
    if (!this.lastAnimationTime) {
      this.lastAnimationTime = now;
      return;
    }
    if (now - this.lastAnimationTime >= interval) {
      this.lastAnimationTime = now;
      if (this.currentImage < images.length - 1) {
        this.currentImage++;
        this.img = this.imageCache[images[this.currentImage]];
      }
    }
  }
}
