class Chicken extends MovableObject {
  height = 90;
  widht = 90;
  IMAGES_WALKING = [
    `img/3_enemies_chicken/chicken_normal/1_walk/1_w.png`,
    `img/3_enemies_chicken/chicken_normal/1_walk/2_w.png`,
    `img/3_enemies_chicken/chicken_normal/1_walk/3_w.png`,
  ];

  constructor() {
    super().loadImage(`img/3_enemies_chicken/chicken_normal/1_walk/1_w.png`);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 200 + Math.random() * 500;
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
