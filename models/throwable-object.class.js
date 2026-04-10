class ThrowableObject extends MoveableObject {
    speedX = 0;

    constructor(x, y, otherDirection = false) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.height = 60;
        this.width = 50;
        this.throw();
    }

    throw(){
        this.speedY = 20;
        this.speedX = 10;
        this.applyGravity();
        setInterval(() => {
            this.x += this.otherDirection ? -this.speedX : this.speedX;
        }, 25);
    }
}
