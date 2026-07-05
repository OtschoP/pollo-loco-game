/**
 * Represents a static background layer object drawn behind the game world.
 * @extends MoveableObject
 */
class BackgroundObject extends MoveableObject {

    width = 720;
    height = 480;

    /**
     * Creates a new BackgroundObject.
     * @param {string} imagePath - Path to the background image file.
     * @param {number} x - Horizontal position of the background tile.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }

}
