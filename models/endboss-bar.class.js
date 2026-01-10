class EndBossBar extends DrawableObject {
  IMAGES_ENDBOSSBAR = [
    `img/7_statusbars/2_statusbar_endboss/orange/orange0.png`,
    `img/7_statusbars/2_statusbar_endboss/orange/orange20.png`,
    `img/7_statusbars/2_statusbar_endboss/orange/orange40.png`,
    `img/7_statusbars/2_statusbar_endboss/orange/orange60.png`,
    `img/7_statusbars/2_statusbar_endboss/orange/orange80.png`,
    `img/7_statusbars/2_statusbar_endboss/orange/orange100.png`
  ];

  constructor() {
    super();
    this.x = 500;
    this.y = 10;
    this.width = 200;
    this.height = 60;
    this.loadImages(this.IMAGES_ENDBOSSBAR);
    this.setPercentage(100);
  }
  
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_ENDBOSSBAR[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

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
