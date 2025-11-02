class SmallChicken extends MovableObject {
  height = 70;
  width = 70;
  IMAGES_WALKING = [
    `img/3_enemies_chicken/chicken_small/1_walk/1_w.png`,
    `img/3_enemies_chicken/chicken_small/1_walk/2_w.png`,
    `img/3_enemies_chicken/chicken_small/1_walk/3_w.png`
  ];
  offset = {
    top: 10,
    bottom: 10,
    left: 10, 
    right: 10,
  };
    constructor() {
    super().loadImage(`img/3_enemies_chicken/chicken_small/1_walk/1_w.png`);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 500 + Math.random() * 1300;
    this.y = 460 - this.height;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }
    animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60); // 60 x pro Sekunde
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}