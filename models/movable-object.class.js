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
    console.log("Moving right");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed; // Minus 0.15 px von der x Koordinate
    }, 1000 / 60); // 60 x pro Sekunde
  }
}
