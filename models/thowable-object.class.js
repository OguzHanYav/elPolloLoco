class ThrowableObject extends MovableObject {
    speedX = 10;

    constructor(x,y){
        super();
        this.loadImage(`img/6_salsa_bottle/salsa_bottle.png`);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.throw();
    }
    throw(){
        this.speedY = 20;
        this.applyGravity();
        this.throwInterval();
    }

    throwInterval(){
        setInterval (() => {
            this.x += this.speedX;
        }, 25);
    }
    
}