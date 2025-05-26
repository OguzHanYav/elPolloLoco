class MovableObject {
  x = 120;
  y = 250;
  img;
  height = 150;
  widht = 100;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;
  otherDircetion;
  speedY = 0;
  acceleration = 2.5;

  applyGravity() {
    //Falling/Jumping function
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.widht, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "4";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.widht, this.height);
      ctx.stroke();
    }
  }

  isAboveGround() {
    return this.y < 180;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    this.speedY = 30;
  }
}
