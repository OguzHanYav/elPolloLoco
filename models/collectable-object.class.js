class CollectableObject extends MovableObject {
       constructor(x,y){
        super();
        this.loadImage(`img/6_salsa_bottle/1_salsa_bottle_on_ground.png`);
        this.x =x;
        this.y =y;
        this.width = 50;
        this.height = 60;
    }
}