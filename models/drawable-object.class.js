/**
 * Base class for all objects that are drawn on the canvas.
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
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  draw(ctx) {
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Draws an optional frame around the object (used for debugging).
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  drawFrame(ctx) {
    ctx.beginPath();
    ctx.stroke();
  }

  /**
   * Loads a single image and assigns it to the object.
   * @param {string} path - Path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images and stores them in the image cache.
   * @param {string[]} arr - Array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
