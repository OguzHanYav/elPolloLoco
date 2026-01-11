/**
 * Represents a game level.
 * Holds all enemies, clouds and background objects of the level.
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  level_end_x = 2250;

  /**
   * Creates a new level instance.
   * @param {MovableObject[]} enemies Array of enemy objects
   * @param {MovableObject[]} clouds Array of cloud objects
   * @param {BackgroundObject[]} backgroundObjects Array of background objects
   */
  constructor(enemies, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
  }
}
