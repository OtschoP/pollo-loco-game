class Cloud2 extends MoveableObject {
    y = 40
    x = 800
    width = 700;
    height = 350;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/2.png');
        this.animate();
    }

    animate() {
        this.moveLeft();
    }
}