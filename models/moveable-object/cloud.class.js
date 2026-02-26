class Cloud extends MoveableObject {
    y = 10;
    x = 100;
    width = 700;
    height = 350;
    parallax = 0.35;

    constructor(x = 100, y = 10, speed = 0.15, parallax = 0.35) {
        super();
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.parallax = parallax;

        const cloudVariant = Math.random() < 0.5 ? '1' : '2';
        this.loadImage(`img/5_background/layers/4_clouds/${cloudVariant}.png`);
        this.animate();
    }

    animate() {
        this.moveLeft();
    }
}
