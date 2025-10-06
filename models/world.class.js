class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  //Statusbars
  statusBar = new StatusBar();
  coinBar = new CoinsBar();
  bottleBar = new BottleBar();
  //Counters
  throwableObjects = [];
  coinsCollected = 0;
  bottlesCollected = 0;
  //Sounds
  jumpSound = new Audio('audio/jumping_01.wav');
  throwSound = new Audio('audio/throwBottle.wav');
  collectBottleSound = new Audio('audio/collectBottle.wav');
  collectCoinSound = new Audio("audio/collectCoin.wav");
  hitCharacterSound = new Audio('audio/hit_character.wav');
  hitEnemySound = new Audio('audio/hit_enemy.ogg');

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
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
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCollectableCollisions();
    }, 200);
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
      new CollectableObjectBottle(1500, 360),
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
    if (this.keyboard.D && this.bottlesCollected > 0) {
      // Startpoint to throw
      let offsetX = this.character.otherDircetion ? -30 : 80;
      let offsetY = 30;
      let bottleX = this.character.x + offsetX;
      let bottleY = this.character.y + offsetY;
      // Throw dircetion
      let bottle = new ThrowableObject(
        bottleX,
        bottleY,
        this.character.otherDircetion
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
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
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

  // Eine forEach Schleife für alle Objekte
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDircetion) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDircetion) {
      this.flipImageBack(mo);
    }
  }
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0); // Spiegelverkehrt
    this.ctx.scale(-1, 1); // Verschiebung des Elements
    mo.x = mo.x * -1; // Auf der X Achse
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  playSound(sound){
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }
}

