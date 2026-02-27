class Coin extends MoveableObject {
    height = 120;
    width = 120;
    y = 180;

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x, y, variant = 0) {
        super();
        this.x = x;
        this.y = y;

        const imageIndex = variant % this.IMAGES.length;
        this.loadImage(this.IMAGES[imageIndex]);
    }
}
