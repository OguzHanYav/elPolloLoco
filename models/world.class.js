class World {
  level;
  character;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  lastThrow = 0;
  intervalId = null;
  animationFrameId = null;

  statusBar = new StatusBar();
  coinBar = new CoinsBar();
  bottleBar = new BottleBar();
  endbossBar = new EndBossBar();

  throwableObjects = [];
  coinsCollected = 0;
  bottlesCollected = 0;
  enemiesToKill = [];

  jumpSound = window.AUDIO.jump;
  throwSound = window.AUDIO.throw;
  collectBottleSound = window.AUDIO.collectBottle;
  collectCoinSound = window.AUDIO.collectCoin;
  hitCharacterSound = window.AUDIO.hitCharacter;
  chickenDeathSound = window.AUDIO.chickenDeath;
  smallChickenDeathSound = window.AUDIO.smallChickenDeath;
  backgroundSound = window.AUDIO.background;
  splashSound = window.AUDIO.splash;
  endbossAttackSound = window.AUDIO.endbossAttack;
  endbossDeathSound = window.AUDIO.endbossDeath;

  gameStopped = false;
  endbossDeathSoundPlayed = false;

  /**
   * @param {HTMLCanvasElement} canvas 
   * @param {Keyboard} keyboard 
   */
  constructor(canvas, keyboard) {
    this.level = createLevel1();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character(this);
    this.collectables = this.creatCollectables();
    this.maxCoins = this.collectables.filter(c => c instanceof CollectableObjectCoin).length;
    this.maxBottles = this.collectables.filter(c => c instanceof CollectableObjectBottle).length;
    this.setWorld();
    this.run();
    this.draw();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  stopGame() {
    this.gameStopped = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => {
      enemy.world = this;
    });
  }

  run() {
    this.intervalId = setInterval(() => {
      if (this.gameStopped) return;

      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCollectableCollisions();
      this.checkThrowCollision();
      this.checkGameEnd();
      this.character.updateAnimation();
      this.character.updatePrevY();

      const now = new Date().getTime();
      this.level.enemies.forEach(enemy => {
        if (enemy.updateAnimation) enemy.updateAnimation(now);
      });
    }, 1000 / 60);
  }

  creatCollectables() {
    return [
      new CollectableObjectBottle(300, 360),
      new CollectableObjectBottle(600, 360),
      new CollectableObjectBottle(900, 360),
      new CollectableObjectBottle(1000, 360),
      new CollectableObjectBottle(1050, 360),
      new CollectableObjectBottle(1100, 360),
      new CollectableObjectBottle(1200, 360),
      new CollectableObjectBottle(1300, 360),
      new CollectableObjectBottle(1400, 360),
      new CollectableObjectBottle(1600, 360),
      new CollectableObjectBottle(1680, 360),
      new CollectableObjectBottle(1800, 360),
      new CollectableObjectCoin(400, 360),
      new CollectableObjectCoin(500, 260),
      new CollectableObjectCoin(600, 160),
      new CollectableObjectCoin(800, 150),
      new CollectableObjectCoin(1000, 360),
      new CollectableObjectCoin(1150, 360),
      new CollectableObjectCoin(1300, 360),
      new CollectableObjectCoin(1400, 360),
      new CollectableObjectCoin(1500, 360),
      new CollectableObjectCoin(1600, 360),
    ];
  }

  checkThrowObjects() {
    if (this.gameStopped) return;
    const now = new Date().getTime();
    if (this.keyboard.D && this.bottlesCollected > 0 && now - this.lastThrow > 1000) {
      this.lastThrow = now;
      let offsetX = this.character.otherDirection ? -30 : 80;
      let offsetY = 30;
      let bottleX = this.character.x + offsetX;
      let bottleY = this.character.y + offsetY;
      let bottle = new ThrowableObject(bottleX, bottleY, this.character.otherDirection);
      this.throwableObjects.push(bottle);
      this.bottlesCollected--;
      this.bottleBar.setPercentage((this.bottlesCollected / this.maxBottles) * 100);
      AudioManager.play(this.throwSound);
    }
  }

  checkCollectableCollisions() {
    this.collectables.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        if (item instanceof CollectableObjectCoin) {
          this.coinsCollected++;
          this.coinBar.setPercentage((this.coinsCollected / this.maxCoins) * 100);
          AudioManager.play(this.collectCoinSound);
        }
        if (item instanceof CollectableObjectBottle) {
          this.bottlesCollected++;
          this.bottleBar.setPercentage((this.bottlesCollected / this.maxBottles) * 100);
          AudioManager.play(this.collectBottleSound);
        }
        this.collectables.splice(index, 1);
      }
    });
  }

  checkCollisions() {
    this.enemiesToKill = [];
    this.level.enemies.forEach(enemy => {
      if (this.character.isColliding(enemy)) {
        const prevCharBottom = this.character.prevY + this.character.height;
        const charBottom = this.character.y + this.character.height;
        const minFallDistance = 20;
        const isFromAbove = charBottom - prevCharBottom >= minFallDistance;

        if (isFromAbove && (enemy instanceof SmallChicken || enemy instanceof Chicken)) {
          this.playEnemyDeathSound(enemy);
          enemy.hit();
          enemy.HasBeenHit = true;
          this.enemiesToKill.push(enemy.id);
        } else if (!isFromAbove && !enemy.HasBeenHit) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
    this.enemiesToKill.forEach(id => this.killEnemyById(id));
  }

  checkThrowCollision() {
    this.throwableObjects.forEach(bottle => {
      if (!bottle || bottle.isBroken) return;

      this.level.enemies.forEach(enemy => {
        if (bottle.isColliding(enemy)) {
          const collisionY = bottle.y;
          const collisionX = bottle.x;
          AudioManager.play(this.splashSound);
          bottle.playSplashAnimation(collisionX, collisionY);
          if (enemy.isEndboss) {
            this.playEnemyDeathSound(enemy);
            enemy.hit();
            enemy.triggerAttack();
            this.endbossBar.setPercentage(enemy.energy);
          }
        }
      });
    });
  }

  checkGameEnd() {
    const endBoss = this.level.enemies.find(enemy => enemy.isEndboss);

    if (this.character.isDead()) {
      if (this.character.deadAnimationFinished && !this.gameStopped) {
        setTimeout(() => {
          this.stopGame();
          this.showGameOverScreen();
        }, 300);
      }
      return;
    }

    if (endBoss && endBoss.isDead()) {
      if (endBoss.deadAnimationFinished && !this.gameStopped) {
        setTimeout(() => {
          this.stopGame();
          this.showWinScreen();
        }, 300);
      }
    }
  }

  showGameOverScreen() {
    document.body.classList.remove("game-running");
    document.getElementById("game-over-screen").style.display = "flex";
  }

  showWinScreen() {
    document.body.classList.remove("game-running");
    document.getElementById("win-screen").style.display = "flex";
  }

  draw() {
    this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.markedForRemoval);
    if (this.gameStopped) return;

    this.clearCanvas();
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.endbossBar);
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.collectables);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    objects.forEach(o => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.x + mo.width, mo.y);
    this.ctx.scale(-1, 1);
    this.ctx.translate(-mo.x, -mo.y);
  }

  flipImageBack(mo) {
    this.ctx.restore();
  }

  playEnemyDeathSound(enemy) {
    if (enemy.isEndboss) {
      if (enemy.isDead()) {
        if (!this.endbossDeathSoundPlayed) {
          this.endbossDeathSoundPlayed = true;
          AudioManager.play(this.endbossDeathSound);
        }
        return;
      }
      if (this.endbossDeathSoundPlayed) return;
      AudioManager.play(this.endbossAttackSound);
      return;
    }
    if (enemy instanceof SmallChicken && this.smallChickenDeathSound) {
      AudioManager.play(this.smallChickenDeathSound);
    }
    if (enemy instanceof Chicken && this.chickenDeathSound) {
      AudioManager.play(this.chickenDeathSound);
    }
  }

  killEnemyById(id) {
    const enemy = this.level.enemies.find(e => e.id === id);
    if (enemy && !enemy.isDeadChicken && typeof enemy.die === "function") {
      if (enemy.isEndboss && this.endbossDeathSound) AudioManager.play(this.endbossDeathSound);
      enemy.die();
    }
  }

  removeEnemyWhenDead(enemy) {
    if (enemy.isEndboss) return;
    const index = this.level.enemies.findIndex(e => e.id === enemy.id);
    if (index !== -1) this.level.enemies.splice(index, 1);
  }

  startNewGame() {
    if (window.world) window.world.stopGame();
    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById("win-screen").style.display = "none";
    document.getElementById("canvas").style.display = "block";
    document.body.classList.add("game-running");
    const newWorld = new World(this.canvas, this.keyboard);
    window.world = newWorld;
    world = newWorld;
  }
}
