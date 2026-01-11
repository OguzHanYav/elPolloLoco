/**
 * Status bar that displays the amount of collected bottles.
 * @extends DrawableObject
 */
class BottleBar extends DrawableObject {
  IMAGES_BOTTLE = [
    `img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png`,
    `img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png`,
    `img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png`,
    `img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png`,
    `img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png`,
    `img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png`,
  ];

  /**
   * Creates the bottle status bar and initializes it with 0%.
   */
  constructor() {
    super();
    this.x = 20;
    this.y = 80;
    this.width = 200;
    this.height = 60;
    this.loadImages(this.IMAGES_BOTTLE);
    this.setPercentage(0);
  }

  /**
   * Sets the fill percentage of the bottle bar.
   * @param {number} percentage Percentage value (0–100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the image index based on the current percentage.
   * @returns {number} Index of the corresponding image
   */
  resolveImageIndex() {
    if (this.percentage === 100) return 5;
    if (this.percentage > 80) return 4;
    if (this.percentage > 60) return 3;
    if (this.percentage > 40) return 2;
    if (this.percentage > 0) return 1;
    return 0;
  }
}
