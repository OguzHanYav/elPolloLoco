/**
 * Statusleiste für die gesammelten Flaschen
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
   * Setzt den Füllstand der Flaschenleiste
   * @param {number} percentage Prozentsatz (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Berechnet den Index des Bildes, das zur aktuellen Prozentzahl passt
   * @returns {number} Index des Bildes
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
    } else if (this.percentage > 0) {
      return 1;
    } else {
      return 0;
    }
  }
}
