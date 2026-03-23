class Bottle extends MoveableObject {
    height = 80;
    width = 70;
    y = 340;
    offset = {
        top: 10,
        right: 20,
        bottom: 10,
        left: 20
    };

    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x, y = 340, variant = 0) {
        super();
        this.x = x;
        this.y = y;

        const imageIndex = variant % this.IMAGES.length;
        this.loadImage(this.IMAGES[imageIndex]);
    }
}
