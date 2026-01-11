/**
 * Cloud object displayed in the background.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  width = 500;
  height = 250;
  y = 20;

  /**
   * Creates a cloud object at a random X position
   * and starts its movement animation.
   */
  constructor() {
    super().loadImage(`img/5_background/layers/4_clouds/1.png`);
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Continuously moves the cloud to the left.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
