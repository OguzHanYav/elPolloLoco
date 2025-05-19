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
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0 );
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.ctx.translate(-this.camera_x,0);


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
      this.ctx.save();
      this.ctx.translate(mo.widht, 0); // Spiegelverkehrt
      this.ctx.scale(-1,1); // Verschiebung des Elements
      mo.x = mo.x * -1; // Auf der X Achse
    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.widht, mo.height);
    if (mo.otherDircetion) {
      mo.x= mo.x * -1;
      this.ctx.restore();
    }
  }
}
