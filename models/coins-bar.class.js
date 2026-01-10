/**
 * Statusleiste für gesammelte Münzen
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
   * Setzt den Fortschritt der Münzenleiste
   * @param {number} percentage - Wert zwischen 0 und 100
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_COIN[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Wählt das passende Bild basierend auf dem Prozentsatz
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
