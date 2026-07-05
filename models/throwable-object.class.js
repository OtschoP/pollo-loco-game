/**
 * Represents a throwable bottle object with rotation and splash animations.
 * @extends MoveableObject
 */
class ThrowableObject extends MoveableObject {
    /** Horizontal throw speed. */
    speedX = 0;
    /** Whether the splash animation has started. */
    hasSplashed = false;
    /** Whether the object should be removed from the world. */
    isMarkedForRemoval = false;
    throwInterval = null;
    splashCheckInterval = null;
    splashAnimationInterval = null;
    rotationAnimationInterval = null;
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Creates a new ThrowableObject.
     * @param {number} x - Horizontal start position.
     * @param {number} y - Vertical start position.
     * @param {boolean} [otherDirection=false] - Whether the bottle flies left.
     */
    constructor(x, y, otherDirection = false) {
        super().loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.height = 60;
        this.width = 50;
        this.throw();
    }

    /** Applies gravity, horizontal movement, splash detection, and rotation. */
    throw(){
        this.speedY = 20;
        this.speedX = 10;
        this.applyGravity();
        this.throwInterval = this._registerInterval(() => {
            if (this.hasSplashed) {
                return;
            }
            this.x += this.otherDirection ? -this.speedX : this.speedX;
        }, 25);

        this.splashCheckInterval = this._registerInterval(() => {
            if (!this.hasSplashed && !this.isAboveGround()) {
                this.startSplashAnimation();
            }
        }, 40);

        this.rotationAnimationInterval = this._registerInterval(() => {
            if (!this.hasSplashed) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 80);
    }

    /** Stops flight timers and plays the splash animation once, then marks for removal. */
    startSplashAnimation() {
        this.hasSplashed = true;
        this.y = 360;
        this.speedY = 0;
        clearInterval(this.throwInterval);
        clearInterval(this.splashCheckInterval);
        clearInterval(this.rotationAnimationInterval);

        let splashFrame = 0;
        this.splashAnimationInterval = this._registerInterval(() => {
            this.img = this.imageCache[this.IMAGES_SPLASH[splashFrame]];
            splashFrame++;

            if (splashFrame >= this.IMAGES_SPLASH.length) {
                clearInterval(this.splashAnimationInterval);
                this.isMarkedForRemoval = true;
            }
        }, 80);
    }
}
