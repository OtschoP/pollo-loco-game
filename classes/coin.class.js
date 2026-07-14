/**
 * Represents a collectible coin in the game world.
 * @extends MoveableObject
 */
class Coin extends MoveableObject {
    height = 120;
    width = 120;
    y = 180;
    offset = {
        top: 34,
        right: 34,
        bottom: 34,
        left: 34
    };

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a new Coin.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     * @param {number} [variant=0] - Image variant index (0 or 1).
     */
    constructor(x, y, variant = 0) {
        super();
        this.x = x;
        this.y = y;

        const imageIndex = variant % this.IMAGES.length;
        this.loadImage(this.IMAGES[imageIndex]);
    }
}
