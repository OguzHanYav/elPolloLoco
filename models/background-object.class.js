/**
 * Background object of the game (e.g. ground or background layers).
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates a background object.
   * @param {string} imagePath Path to the background image
   * @param {number} x Horizontal position of the object
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.y = 480 - this.height;
    this.x = x;
  }
}
