class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
  }

    checkCollisions(){
      setInterval(() => {
        this.level.enemies.forEach((enemy) => {
          if (this.character.isColliding(enemy)) {
            console.log('Collision with Character',enemy)
          }
        });
      }, 200);
    }


  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
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
   flipImage(mo){
    this.ctx.save();
      this.ctx.translate(mo.widht, 0); // Spiegelverkehrt
      this.ctx.scale(-1, 1); // Verschiebung des Elements
      mo.x = mo.x * -1; // Auf der X Achse
  }

  flipImageBack(mo){
     mo.x = mo.x * -1;
      this.ctx.restore();
  }
}
