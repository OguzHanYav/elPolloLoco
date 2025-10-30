class ThrowableObject extends MovableObject {
  speedX = 10;
  rotationImages = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  constructor(x, y, throwLeft = false) {
    super();
    this.loadImage(`img/6_salsa_bottle/salsa_bottle.png`);
    this.loadImages(this.rotationImages);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.throwLeft = throwLeft;
    this.throw();
  }

  throw() {
    this.speedY = 25;
    this.applyGravity();
    this.throwInterval();
    this.throwAnimation();
  }

  throwAnimation() {
    this.rotationInvterval = setInterval(() => {
      this.playAnimation(this.rotationImages);
    }, 100);
  }

  throwInterval() {
    setInterval(() => {
      if (this.throwLeft) {
        this.x -= this.speedX;
      } else {
        this.x += this.speedX;
      }
    }, 25);
  }
}
