class Cloud extends MovableObject {
    widht = 500;
    height = 250;
    y = 20;

    constructor(){
        super().loadImage(`img/5_background/layers/4_clouds/1.png`);
        this.x = Math.random() * 500;
        this.animate();
    }
    animate(){
     this.moveLeft();
    }
}
