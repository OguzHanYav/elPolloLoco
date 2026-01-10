/**
 * Statusleiste für die Lebensanzeige des Charakters
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  /** Aktueller Lebens-Prozentsatz (0-100) */
  percentage = 100;

  /** Array der Bildpfade für die verschiedenen Lebensstufen */
  IMAGES = [
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png`,
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png`,
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png`,
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png`,
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png`,
    `img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png`,
  ];

  /**
   * Erstellt eine StatusBar und lädt die Bilder
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
   * Setzt den Lebensprozentsatz und aktualisiert das Bild
   * @param {number} percentage Wert zwischen 0 und 100
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Ermittelt den Index des Bildes basierend auf dem aktuellen Prozentsatz
   * @returns {number} Index des Bildes im IMAGES-Array
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
