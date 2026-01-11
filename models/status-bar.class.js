/**
 * Status bar that displays the character's health.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  /** Current health percentage (0–100) */
  percentage = 100;

  /** Image paths for different health levels */
  IMAGES = [
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png`,
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png`,
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png`,
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png`,
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png`,
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png`,
  ];

  /**
   * Creates a new status bar and loads all health images.
   */
  constructor() {
    super();
    this.x = 20;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  /**
   * Sets the current health percentage and updates the displayed image.
   * @param {number} percentage Value between 0 and 100
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the image index based on the current percentage value.
   * @returns {number} Index of the image in the IMAGES array
   */
  resolveImageIndex() {
    if (this.percentage === 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
