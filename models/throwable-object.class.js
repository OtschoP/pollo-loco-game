class ThrowableObject extends MoveableObject {
    speedX = 0;
    hasSplashed = false;
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

    throw(){
        this.speedY = 20;
        this.speedX = 10;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (this.hasSplashed) {
                return;
            }
            this.x += this.otherDirection ? -this.speedX : this.speedX;
        }, 25);

        this.splashCheckInterval = setInterval(() => {
            if (!this.hasSplashed && !this.isAboveGround()) {
                this.startSplashAnimation();
            }
        }, 40);

        this.rotationAnimationInterval = setInterval(() => {
            if (!this.hasSplashed) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 80);
    }

    startSplashAnimation() {
        this.hasSplashed = true;
        this.y = 360;
        this.speedY = 0;
        clearInterval(this.throwInterval);
        clearInterval(this.splashCheckInterval);
        clearInterval(this.rotationAnimationInterval);

        let splashFrame = 0;
        this.splashAnimationInterval = setInterval(() => {
            this.img = this.imageCache[this.IMAGES_SPLASH[splashFrame]];
            splashFrame++;

            if (splashFrame >= this.IMAGES_SPLASH.length) {
                clearInterval(this.splashAnimationInterval);
                this.isMarkedForRemoval = true;
            }
        }, 80);
    }
}
