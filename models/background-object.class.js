/**
 * Hintergrundobjekt des Spiels (z.B. Boden, Layer)
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * @param {string} imagePath Pfad zum Bild des Hintergrundobjekts
     * @param {number} x X-Position des Objekts
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.y = 480 - this.height;
        this.x = x;
    }
}
