class Character extends MoveableObject {

    height = 250;
    y = 80;
    speed = 2;
    offset = {
        top: 110,
        right: 30,
        bottom: 15,
        left: 30
    };
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    world;
    isRemovedFromWorld = false;
    deathAnimationStarted = false;
    deathAnimationFinished = false;
    idleAnimationFinished = false;
    idleImageIndex = 0;
    idleDelayMs = 2000;
    lastActiveAt = Date.now();

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
    }

    animate() {

        setInterval(() => {
            if (!this.world || this.isDead() || this.isRemovedFromWorld) {
                return;
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > -600) {
                this.moveLeft();
                this.otherDirection = true;
            }

            if (this.world.keyboard.SPACE && !this.isAboveGround() || this.world.keyboard.UP && !this.isAboveGround()) {
                this.jump();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);


        setInterval(() => {
            if (!this.world || this.isRemovedFromWorld) {
                return;
            }

            const isWalking = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
            
            if (this.isDead()) {
                this.markActivity();
                this.playDeathAnimationOnce();
            } else if (this.isHurt()) {
                this.markActivity();
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.markActivity();
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (isWalking) {
                this.markActivity();
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                const inactiveTime = Date.now() - this.lastActiveAt;
                if (inactiveTime >= this.idleDelayMs) {
                    this.playIdleAnimation();
                } else {
                    this.img = this.imageCache[this.IMAGES_WALKING[0]];
                }
            }
        }, 100);
    }

    playIdleAnimation() {
        if (!this.idleAnimationFinished) {
            this.playIdleAnimationOnce();
            return;
        }

        this.playAnimation(this.IMAGES_LONG_IDLE);
    }

    playIdleAnimationOnce() {
        if (this.currentAnimation !== this.IMAGES_IDLE) {
            this.currentAnimation = this.IMAGES_IDLE;
            this.idleImageIndex = 0;
        }

        const frameIndex = Math.min(this.idleImageIndex, this.IMAGES_IDLE.length - 1);
        const framePath = this.IMAGES_IDLE[frameIndex];
        this.img = this.imageCache[framePath];

        if (this.idleImageIndex < this.IMAGES_IDLE.length - 1) {
            this.idleImageIndex++;
            return;
        }

        this.idleAnimationFinished = true;
    }

    resetIdleAnimation() {
        this.idleAnimationFinished = false;
        this.idleImageIndex = 0;
    }

    markActivity() {
        this.lastActiveAt = Date.now();
        this.resetIdleAnimation();
    }

    playDeathAnimationOnce() {
        if (this.deathAnimationFinished) {
            return;
        }

        if (!this.deathAnimationStarted) {
            this.deathAnimationStarted = true;
            this.currentImage = 0;
        }

        const frameIndex = Math.min(this.currentImage, this.IMAGES_DEAD.length - 1);
        const framePath = this.IMAGES_DEAD[frameIndex];
        this.img = this.imageCache[framePath];
        this.currentImage++;

        if (this.currentImage >= this.IMAGES_DEAD.length) {
            this.deathAnimationFinished = true;
            this.world.removeCharacterFromWorld();
        }
    }

}
