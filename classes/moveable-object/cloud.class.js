/**
 * Represents a moving cloud in the background.
 * @extends MoveableObject
 */
class Cloud extends MoveableObject {
    y = 10;
    x = 100;
    width = 700;
    height = 350;

    /**
     * Creates a new Cloud.
     * @param {number} [x=100] - Horizontal start position.
     * @param {number} [y=10] - Vertical position.
     * @param {number} [speed=0.15] - Horizontal drift speed.
     */
    constructor(x = 100, y = 10, speed = 0.15) {
        super();
        this.x = x;
        this.y = y;
        this.speed = speed;

        const cloudVariant = Math.random() < 0.5 ? '1' : '2';
        this.loadImage(`img/5_background/layers/4_clouds/${cloudVariant}.png`);
        this.animate();
    }

    /** Moves the cloud one step to the left. */
    animate() {
        this.moveLeft();
    }
}
