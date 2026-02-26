
class BackgroundObject extends MoveableObject {

    width = 720;
    height = 480;
    parallax = 1;

    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
        this.parallax = this.getParallaxFactor(imagePath);
    }

    getParallaxFactor(imagePath) {
        if (imagePath.includes('/1_first_layer/')) {
            return 1;
        }
        if (imagePath.includes('/2_second_layer/')) {
            return 0.5;
        }
        if (imagePath.includes('/3_third_layer/')) {
            return 0.25;
        }
        if (imagePath.includes('/air.png')) {
            return 0.1;
        }
        return 1;
    }

}
