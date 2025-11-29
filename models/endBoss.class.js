class EndBoss extends MovableObject {
  height = 450;
  width = 250;
  y = 50;
  energy = 100;
  isEndboss = true;
  deadAnimationFinished = false;
  isWalking = false;
  isAttacking = false;
  attackTriggered = false;
  walkDistance = 800;
  animationInterval = 150;
  lastAnimationTime = 0;

  IMAGES_ALERT = [
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

  IMAGES_WALKING = [
    `img/4_enemie_boss_chicken/1_walk/G1.png`,
    `img/4_enemie_boss_chicken/1_walk/G2.png`,
    `img/4_enemie_boss_chicken/1_walk/G3.png`,
    `img/4_enemie_boss_chicken/1_walk/G4.png`,
  ];

  IMAGES_ATTACK = [
    `img/4_enemie_boss_chicken/3_attack/G13.png`,
    `img/4_enemie_boss_chicken/3_attack/G14.png`,
    `img/4_enemie_boss_chicken/3_attack/G15.png`,
    `img/4_enemie_boss_chicken/3_attack/G16.png`,
    `img/4_enemie_boss_chicken/3_attack/G17.png`,
    `img/4_enemie_boss_chicken/3_attack/G18.png`,
    `img/4_enemie_boss_chicken/3_attack/G19.png`,
    `img/4_enemie_boss_chicken/3_attack/G20.png`,
  ];

  constructor() {
    super();
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 2500;
    this.isHurt = false;
    this.isDeadBoss = false;
    this.lastMove = 0;
    this.moveInterval = 200;
    this.lastAnimationTime = 0;
    this.animationInterval = 150;
  }
  updateAnimation() {
    const now = new Date().getTime();

    if (now - this.lastAnimationTime > this.animationInterval) {
      this.lastAnimationTime = now;
      if (!this.world || !this.world.character) return;
      this.updateState();
      if (this.isDeadBoss) this.handleDeathAnimation();
      else if (this.isHurt)this.playAnimation(this.IMAGES_HURT);
      else if (this.isAttacking){
        this.playAnimation(this.IMAGES_ATTACK);
        this.handleAttackMovement();
      } 
      else if (this.isWalking) {
        this.playAnimation(this.IMAGES_WALKING);
        this.handleWalking();
      }
      else this.playAnimation(this.IMAGES_ALERT);
    }
  }

  updateState(){
    if (this.isDeadBoss) return;
    const charDistance = this.world.character.x - this.x;
    this.isWalking = !this.attackTriggered && Math.abs(charDistance) < this.walkDistance;
    this.isAttacking = this.attackTriggered;
    if (this.isAttacking) this.isWalking = false;
  }

  handleWalking(){
    if (!this.isWalking) return;
    const char = this.world.character;
    this.x += char.x > this.x ? 5 : -5;
    this.otherDirection = char.x < this.x;
  }

  triggerAttack(){
    this.attackTriggered = true;
  }
  handleAttackMovement(){
    const char = this.world.character;
    if (char.x < this.x){
      this.x -= 15;
      this.otherDirection = true;
    }else if (char.x > this.x){
      this.x += 15;
      this.otherDirection = false;
    }
  }
  handleDeathAnimation() {
    if (!this.deadAnimationFinished) {
      this.playAnimation(this.IMAGES_DEAD);
      if (this.currentImage >= this.IMAGES_DEAD.length) {
        this.deadAnimationFinished = true;
        this.currentImage = this.IMAGES_DEAD.length - 1;
      }
    } else {
      this.loadImage(this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]);
    }
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
    setTimeout(() => (this.isHurt = false), 300);
  }

  isDead() {
    return this.energy <= 0;
  }
}
