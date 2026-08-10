/**
 * Represents a throwable bottle object with rotation and splash animations.
 * @extends MoveableObject
 */
class ThrowableObject extends MoveableObject {
    /** Fixed y-position where the bottle hits the ground. */
    groundY = 360;
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
    /** Shared audio controller. */
    soundManager = null;
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
     * @param {SoundManager|null} [soundManager=null] - Shared audio controller.
     */
    constructor(x, y, otherDirection = false, soundManager = null) {
        super().loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.soundManager = soundManager;
        this.height = 60;
        this.width = 50;
        this.throw();
    }

    /** Applies gravity, horizontal movement, splash detection, and rotation. */
    throw() {
        this.speedY = 20;
        this.speedX = 10;
        this.applyGravity();
        this.startFlight();
        this.startSplashCheck();
        this.startRotationAnimation();
    }

    /** Starts horizontal bottle flight. */
    startFlight() {
        this.throwInterval = this._registerInterval(() => {
            if (this.hasSplashed) {
                return;
            }
            this.x += this.otherDirection ? -this.speedX : this.speedX;
        }, 25);
    }

    /** Starts checking for ground contact. */
    startSplashCheck() {
        this.splashCheckInterval = this._registerInterval(() => {
            if (!this.hasSplashed && !this.isAboveGround()) {
                this.startSplashAnimation();
            }
        }, 40);
    }

    /** Starts bottle rotation during flight. */
    startRotationAnimation() {
        this.rotationAnimationInterval = this._registerInterval(() => {
            if (!this.hasSplashed) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 80);
    }

    /** Stops flight timers and plays the splash animation once, then marks for removal. */
    startSplashAnimation(x = this.x, y = this.y) {
        if (this.hasSplashed) {
            return;
        }
        this.prepareSplashAnimation(x, y);
        let splashFrame = 0;
        this.splashAnimationInterval = this._registerInterval(() => {
            splashFrame = this.playSplashFrame(splashFrame);
        }, 80);
    }

    /** Stops flight and positions the bottle for splash frames. */
    prepareSplashAnimation(x, y) {
        this.hasSplashed = true;
        this.soundManager?.play('bottleSplash');
        this.x = x;
        this.y = Math.min(y, 360);
        this.speedY = 0;
        this.stopTimers();
    }

    /**
     * Plays one splash frame and returns the next frame index.
     * @param {number} splashFrame - Current splash animation frame index.
     * @returns {number} Next splash animation frame index.
     */
    playSplashFrame(splashFrame) {
        this.img = this.imageCache[this.IMAGES_SPLASH[splashFrame]];
        const nextFrame = splashFrame + 1;
        if (nextFrame >= this.IMAGES_SPLASH.length) {
            this.finishSplashAnimation();
        }
        return nextFrame;
    }

    /** Cleans up after the splash animation. */
    finishSplashAnimation() {
        clearInterval(this.splashAnimationInterval);
        this.isMarkedForRemoval = true;
    }
}
