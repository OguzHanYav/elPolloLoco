class SmallChicken extends MovableObject {
  height = 70;
  width = 70;
  IMAGES_WALKING = [
    `img/3_enemies_chicken/chicken_small/1_walk/1_w.png`,
    `img/3_enemies_chicken/chicken_small/1_walk/2_w.png`,
    `img/3_enemies_chicken/chicken_small/1_walk/3_w.png`
  ];
  IMAGES_DEAD = [
    `img/3_enemies_chicken/chicken_small/2_dead/dead.png`
  ];
    offset = {
    top: 10,
    bottom: 10,
    left: 10, 
    right: 10,
  };
  isDeadChicken = false;
  deadAnimationFinished = false;
  animationInterval = 200;
  lastAnimationTime = 0;

    constructor() {
    super().loadImage(`img/3_enemies_chicken/chicken_small/1_walk/1_w.png`);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 500 + Math.random() * 1300;
    this.y = 460 - this.height;
    this.speed = 0.15 + Math.random() * 0.5;
    this.setOnGround();
  }
updateAnimation(now) {
  if (this.isDeadChicken) {
    this.handleDeathAnimation();
  }else{
    this.moveLeft();
    if (!this.lastAnimationTime) this.lastAnimationTime = now;
    if (now - this.lastAnimationTime > this.animationInterval) {
      this.lastAnimationTime = now;
      this.playAnimation(this.IMAGES_WALKING);
    }
  }
}
  die() {
    this.isDeadChicken = true;
    this.deadAnimationFinished = false;
  }
  hit() {
    if (!this.isDeadChicken) this.die();
  }
  handleDeathAnimation() {
    if (!this.deadAnimationFinished) {
      this.playAnimation(this.IMAGES_DEAD);
      this.deadAnimationFinished = true;
      this.speed = 0;
      if (this.world) {
        setTimeout(() => this.world.removeEnemyWhenDead(this), 500);
      }
    }
  }
}
