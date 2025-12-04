class World {
  level = level1;
  character;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  lastThrow = 0;

  //Statusbars
  statusBar = new StatusBar();
  coinBar = new CoinsBar();
  bottleBar = new BottleBar();
  endbossBar = new EndBossBar();

  //Counters
  throwableObjects = [];
  coinsCollected = 0;
  bottlesCollected = 0;
  enemiesToKill = [];

  //Sounds
  jumpSound = new Audio("audio/jumping_01.wav");
  throwSound = new Audio("audio/throwBottle.wav");
  collectBottleSound = new Audio("audio/collectBottle.wav");
  collectCoinSound = new Audio("audio/collectCoin.wav");
  hitCharacterSound = new Audio("audio/hit_character.wav");
  hitEnemySound = new Audio("audio/hit_enemy.ogg");
  startScreenSound = new Audio("audio/intro.mp3");

  isMuted = false;
  allSounds = [];
  gameStopped = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.startScreenSound.loop = true;

    this.character = new Character(this);
    this.collectables = this.creatCollectables();

    this.maxCoins = this.collectables.filter(
      (c) => c instanceof CollectableObjectCoin
    ).length;
    this.maxBottles = this.collectables.filter(
      (c) => c instanceof CollectableObjectBottle
    ).length;

    this.setWorld();
    this.run();
    this.draw();

    //All Sounds in an array for mute function
    this.allSounds = [
      this.jumpSound,
      this.throwSound,
      this.collectBottleSound,
      this.collectCoinSound,
      this.hitCharacterSound,
      this.hitEnemySound,
      this.startScreenSound,
    ];
  }

  //INITIAL SETUP
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  run() {
    setInterval(() => {

      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCollectableCollisions();
      this.checkThrowCollision();
      this.checkGameEnd();
      this.character.updateAnimation();
      this.character.updatePrevY();

      const now = new Date().getTime();
      this.level.enemies.forEach((enemy) => {
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
    if (
      this.keyboard.D &&
      this.bottlesCollected > 0 &&
      now - this.lastThrow > 400
    ) {
      this.lastThrow = now;
      // Startpoint to throw
      let offsetX = this.character.otherDirection ? -30 : 80;
      let offsetY = 30;
      let bottleX = this.character.x + offsetX;
      let bottleY = this.character.y + offsetY;
      // Throw dircetion
      let bottle = new ThrowableObject(
        bottleX,
        bottleY,
        this.character.otherDirection
      );
      this.throwableObjects.push(bottle);
      this.bottlesCollected--;
      this.bottleBar.setPercentage(
        (this.bottlesCollected / this.maxBottles) * 100
      );
      this.playSound(this.throwSound);
    }
  }
  checkCollectableCollisions() {
    this.collectables.forEach((item, index) => {
      if (this.character.isColliding(item)) {
        //Coins
        if (item instanceof CollectableObjectCoin) {
          this.coinsCollected++;
          this.coinBar.setPercentage(
            (this.coinsCollected / this.maxCoins) * 100
          );
          this.playSound(this.collectCoinSound);
        }
        //Bottles
        if (item instanceof CollectableObjectBottle) {
          this.bottlesCollected++;
          this.bottleBar.setPercentage(
            (this.bottlesCollected / this.maxBottles) * 100
          );
          this.playSound(this.collectBottleSound);
        }
        this.collectables.splice(index, 1);
      }
    });
  }

  checkCollisions() {
    this.enemiesToKill = [];
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        const prevCharBottom = this.character.prevY + this.character.height;
        const charBottom = this.character.y + this.character.height;
        const minFallDistance = 20;
        const isFromAbove = charBottom - prevCharBottom >= minFallDistance;

        if (
          isFromAbove &&
          (enemy instanceof SmallChicken || enemy instanceof Chicken)
        ) {
          enemy.hit();
          enemy.HasBeenHit = true;
          this.enemiesToKill.push(enemy.id);
        } else if (!isFromAbove && !enemy.HasBeenHit) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
    this.enemiesToKill.forEach((id) => this.killEnemyById(id));
  }
  checkThrowCollision() {
    this.throwableObjects.forEach((bottle) => {
      if (!bottle || bottle.isBroken) return;

      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy)) {
          const collisionY = bottle.y;
          const collisionX = bottle.x;
          bottle.playSplashAnimation(collisionX, collisionY);
          if (enemy.isEndboss) {
            enemy.hit();
            enemy.triggerAttack();
            this.endbossBar.setPercentage(enemy.energy);
          }
        }
      });
    });
  }

  checkGameEnd() {
    const endBoss = this.level.enemies.find((enemy) => enemy.isEndboss);

    // Character is dead - Game Over
    if (this.character.isDead()) {
      if (this.character.deadAnimationFinished) {
        this.showGameOverScreen();
        this.stopGame();
      }
      return;
    }

    // EndBoss is dead - You Win
    if (endBoss && endBoss.isDead()) {
      if (endBoss.deadAnimationFinished) {
        this.showWinScreen();
        this.stopGame();
      }
    }
  }

  showGameOverScreen() {
    const gameOverScreen = document.getElementById("game-over-screen");
    const canvas = document.getElementById("canvas");
    const fullscreenBtn = document.getElementById("fullscreen-btn");

    if (gameOverScreen && gameOverScreen.style.display === "none") {
      canvas.style.display = "flex";
      gameOverScreen.style.display = "flex";

      document.getElementById("restart-button").onclick = () =>
        location.reload();
    }
  }

  showWinScreen() {
    const winScreen = document.getElementById("win-screen");
    const canvas = document.getElementById("canvas");
    const fullscreenBtn = document.getElementById("fullscreen-btn");

    if (winScreen && winScreen.style.display === "none") {
      canvas.style.display = "flex";
      winScreen.style.display = "flex";

      document.getElementById("restart-button-win").onclick = () =>
        location.reload();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    //Space for fixed object
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.endbossBar);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.collectables);
    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
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
  playSound(sound) {
    if (this.isMuted) return;
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }
  killEnemyById(id) {
    const enemy = this.level.enemies.find((e) => e.id === id);
    if (enemy && !enemy.isDeadChicken && typeof enemy.die === "function") {
      enemy.die();
    }
  }

  removeEnemyWhenDead(enemy) {
    const index = this.level.enemies.findIndex((e) => e.id === enemy.id);
    if (index !== -1) this.level.enemies.splice(index, 1);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.allSounds.forEach((sound) => sound.pause());
    } else{
      this.playBackgroundMusic();
    }

    const btn = document.getElementById("mute-btn");
    if (btn) {
      btn.src = this.isMuted
        ? "img/mute-2-multi-size.ico"
        : "img/volume-up-4-multi-size.ico";
    }
  }

  playBackgroundMusic() {
    if (this.isMuted) return;
    this.startScreenSound.currentTime = 0;
    this.startScreenSound.play().catch(() => {});
  }
  stopGame(){
  this.gameStopped = true;

  this.character.speed = 0;
  this.character.stopGravity();
  this.character.velocityY = 0;
  this.level.enemies.forEach((enemy) => {
    if (!enemy.isEndboss){
      enemy.speed = 0;
      enemy.stopGravity();
      enemy.velocityY = 0;
    }
});
}
}

