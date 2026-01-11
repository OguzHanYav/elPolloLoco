/**
 * Status bar that displays the collected coins.
 * @extends DrawableObject
 */
class CoinsBar extends DrawableObject {
  IMAGES_COIN = [
    `img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png`,
    `img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png`,
    `img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png`,
    `img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png`,
    `img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png`,
    `img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png`,
  ];

  /**
   * Creates the coin status bar and initializes it with 0%.
   */
  constructor() {
    super();
    this.x = 20;
    this.y = 40;
    this.width = 200;
    this.height = 60;
    this.loadImages(this.IMAGES_COIN);
    this.setPercentage(0);
  }

  /**
   * Sets the fill level of the coin bar.
   * @param {number} percentage - Value between 0 and 100
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES_COIN[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the correct image index based on the percentage.
   * @returns {number} Image index
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
