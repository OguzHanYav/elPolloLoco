/**
 * Werfbares Objekt (z.B. Flasche)
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  speedX = 10;
  splashActive = false;
  rotationImages = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  splashImages = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * @param {number} x Startposition X
   * @param {number} y Startposition Y
   * @param {boolean} [throwLeft=false] Richtung links werfen
   */
  constructor(x, y, throwLeft = false) {
    super();
    this.loadImage(`img/6_salsa_bottle/salsa_bottle.png`);
    this.loadImages(this.rotationImages);
    this.loadImages(this.splashImages);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.throwLeft = throwLeft;
    this.isBroken = false;
    this.throw();
  }

  /**
   * Startet den Wurf und Animationen
   */
  throw() {
    this.speedY = 25;
    this.applyGravity();
    this.throwInterval();
    this.throwAnimation();
    this.splashCheckInterval = setInterval(() => {
      this.checkSplash();
    }, 50);
  }

  /** Spielt Rotationsanimation ab */
  throwAnimation() {
    this.rotationInvterval = setInterval(() => {
      this.playAnimation(this.rotationImages);
    }, 100);
  }

  /** Bewegt das Objekt nach links oder rechts */
  throwInterval() {
    this.moveInterval = setInterval(() => {
      if (!this.isBroken) {
        this.x += this.throwLeft ? - this.speedX : this.speedX;
      }
    }, 25);
  }

  /** Prüft, ob das Objekt den Boden erreicht */
  checkSplash() {
    const groundY = 400;
    if (this.y > groundY && !this.isBroken) {
      this.playSplashAnimation();
    }
  }

  /**
   * Spielt die Splash-/Zerbruchsanimation ab
   * @param {number} [collisionX] Optional X-Koordinate des Aufpralls
   * @param {number} [collisionY] Optional Y-Koordinate des Aufpralls
   */
  playSplashAnimation(collisionX, collisionY) {
    this.isBroken = true;
    this.splashActive = true;
    this.markedForRemoval = false;

    clearInterval(this.rotationInvterval);
    clearInterval(this.moveInterval);
    clearInterval(this.splashCheckInterval);
    this.stopGravity();
    if (collisionY) this.y = collisionY;
    if (collisionX) this.x = collisionX;

    let i = 0;
    const splashInterval = setInterval(() => {
      if (i < this.splashImages.length) {
        this.loadImage(this.splashImages[i]);
        i++;
      } else {
        clearInterval(splashInterval);
        setTimeout(() => {
          this.splashActive = false;
          this.isBroken = true;
          this.markedForRemoval = true;
        }, 1000);
      }
    }, 100);
  }
}
