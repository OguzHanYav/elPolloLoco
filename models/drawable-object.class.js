/**
 * Basisklasse für alle Objekte, die auf dem Canvas gezeichnet werden.
 */
class DrawableObject {
  x = 120;
  y = 250;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;
  offset = { left: 0, right: 0, top: 0, bottom: 0 };

  /**
   * Zeichnet das Objekt auf das Canvas
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw(ctx) {
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Optionaler Rahmen zum Debuggen
   * @param {CanvasRenderingContext2D} ctx 
   */
  drawFrame(ctx) {
    ctx.beginPath();
    ctx.stroke();
  }

  /**
   * Lädt ein einzelnes Bild
   * @param {string} path 
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Lädt mehrere Bilder und cached sie
   * @param {string[]} arr 
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
