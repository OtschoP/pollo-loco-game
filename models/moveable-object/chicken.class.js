/**
 * Represents a normal-sized chicken enemy that walks left.
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {
    y = 350;
    height = 80;
    /** Whether the chicken has been defeated (stops movement/animation). */
    isDefeated = false;
    offset = {
        top: 8,
        right: 10,
        bottom: 6,
        left: 10
    };
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    DEAD_IMAGE = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    /**
     * Creates a new Chicken.
     * @param {number|null} [x=null] - Horizontal position (random if null).
     * @param {number|null} [speed=null] - Movement speed (random if null).
     */
    constructor(x = null, speed = null) {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.DEAD_IMAGE]);

        this.x = x !== null ? x : 200 + Math.random() * 500;
        this.speed = speed !== null ? speed : 0.15 + Math.random() * 0.5;
        this.animate();
    }

    /** Marks the chicken as defeated and shows the dead image. */
    die() {
        if (this.isDefeated) {
            return;
        }

        this.isDefeated = true;
        this.speed = 0;
        this.img = this.imageCache[this.DEAD_IMAGE];
    }

    /** Starts movement and walking-animation intervals. */
    animate() {
        this._registerInterval(() => {
            if (!this.isDefeated) {
                this.moveLeft();
            }
        }, 1000 / 60);
        this._registerInterval(() => {
            if (!this.isDefeated) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}
