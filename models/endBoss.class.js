class EndBoss extends MovableObject {
  height = 450;
  width = 250;
  y = 50;
  energy = 100;
  isEndboss = true;
  deadAnimationFinished = false;

  IMAGES_WALKING = [
    `img/4_enemie_boss_chicken/2_alert/G5.png`,
    `img/4_enemie_boss_chicken/2_alert/G6.png`,
    `img/4_enemie_boss_chicken/2_alert/G7.png`,
    `img/4_enemie_boss_chicken/2_alert/G8.png`,
    `img/4_enemie_boss_chicken/2_alert/G9.png`,
    `img/4_enemie_boss_chicken/2_alert/G10.png`,
    `img/4_enemie_boss_chicken/2_alert/G11.png`,
    `img/4_enemie_boss_chicken/2_alert/G12.png`,
  ];

  IMAGES_DEAD = [
    `img/4_enemie_boss_chicken/5_dead/G24.png`,
    `img/4_enemie_boss_chicken/5_dead/G25.png`,
    `img/4_enemie_boss_chicken/5_dead/G26.png`,
  ];

  IMAGES_HURT = [
    `img/4_enemie_boss_chicken/4_hurt/G21.png`,
    `img/4_enemie_boss_chicken/4_hurt/G22.png`,
    `img/4_enemie_boss_chicken/4_hurt/G23.png`,
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.x = 2500;
    this.isHurt = false;
    this.isDeadBoss = false;
    this.updateAnimation();
  }

  updateAnimation() {
      if (this.isHurt) return this.playAnimation(this.IMAGES_HURT);
      if (this.isDeadBoss) {
        if (!this.deadAnimationFinished) {
          this.playAnimation(this.IMAGES_DEAD);
          if (this.currentImage >= this.IMAGES_DEAD.length) {
            this.deadAnimationFinished = true;
          }
        } else {
          this.loadImage(this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]);
        }
        return;
      }
      this.playAnimation(this.IMAGES_WALKING);
  }
  hit() {
    if (this.isDeadBoss) return;
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
      this.isDeadBoss = true;
      return;
    }
    this.isHurt = true;
    setTimeout(() => this.isHurt = false, 300);
  }

  isDead() {
    return this.energy <= 0;
  }
}
