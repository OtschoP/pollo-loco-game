/**
 * Represents a collectible bottle lying on the ground.
 * @extends MoveableObject
 */
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

    /**
     * Creates a new Bottle.
     * @param {number} x - Horizontal position.
     * @param {number} [y=340] - Vertical position.
     * @param {number} [variant=0] - Image variant index (0 or 1).
     */
    constructor(x, y = 340, variant = 0) {
        super();
        this.x = x;
        this.y = y;

        const imageIndex = variant % this.IMAGES.length;
        this.loadImage(this.IMAGES[imageIndex]);
    }
}
