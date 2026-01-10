/**
 * Repräsentiert ein Level im Spiel
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2250;
    /**
  * @param {MovableObject[]} enemies Array von Gegnerobjekten
  * @param {MovableObject[]} clouds Array von Wolkenobjekten
  * @param {BackgroundObject[]} backgroundObjects Array von Hintergrundobjekten
  */
    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}