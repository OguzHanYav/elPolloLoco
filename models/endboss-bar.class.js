/**
 * Status bar that displays the End Boss health.
 * @extends DrawableObject
 */
class EndBossBar extends DrawableObject {
  IMAGES_ENDBOSSBAR = [
    `img/7_statusbars/2_statusbar_endboss/orange/orange0.png`,
    `img/7_statusbars/2_statusbar_endboss/orange/orange20.png`,
    `img/7_statusbars/2_statusbar_endboss/orange/orange40.png`,
    `img/7_statusbars/2_statusbar_endboss/orange/orange60.png`,
    `img/7_statusbars/2_statusbar_endboss/orange/orange80.png`,
    `img/7_statusbars/2_statusbar_endboss/orange/orange100.png`
  ];

  /**
   * Creates the End Boss status bar and initializes it with 100%.
   */
  constructor() {
    super();
    this.x = 500;
    this.y = 10;
    this.width = 200;
    this.height = 60;
    this.loadImages(this.IMAGES_ENDBOSSBAR);
    this.setPercentage(100);
  }

  /**
   * Sets the current percentage value of the End Boss bar.
   * @param {number} percentage - Value between 0 and 100
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES_ENDBOSSBAR[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the image index based on the current percentage.
   * @returns {number} Image index
   */
  resolveImageIndex() {
    if (this.percentage === 100) return 5;
    if (this.percentage > 80) return 4;
    if (this.percentage > 60) return 3;
    if (this.percentage > 40) return 2;
    if (this.percentage > 20) return 1;
    return 0;
  }
}
