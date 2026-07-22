/**
 * Represents the player character "Pepe" with walking, jumping, idle, hurt,
 * and death animations.
 * @extends MoveableObject
 */
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
    /** Reference to the World instance. */
    world;
    /** Whether the character has been removed from the world after death. */
    isRemovedFromWorld = false;
    /** Whether the death animation has started. */
    deathAnimationStarted = false;
    /** Whether the death animation has finished. */
    deathAnimationFinished = false;
    /** Whether the idle intro animation has finished. */
    idleAnimationFinished = false;
    /** Current frame index within the idle animation. */
    idleImageIndex = 0;
    /** Whether the character was airborne in the previous movement tick. */
    wasAboveGround = false;
    /** Timestamp of the hit that last played the character-hit sound. */
    lastCharacterHitSoundAt = 0;

    /** Creates a new Character, preloads all images, and starts gravity + animation. */
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

    /** Registers movement (60 fps) and animation (100 ms) intervals. */
    animate() {
        this._registerInterval(() => this.updateMovement(), 1000 / 60);
        this._registerInterval(() => this.updateAnimation(), 100);
    }

    /** Handles horizontal movement, jumping, and camera tracking. */
    updateMovement() {
        if (!this.world || this.isDead() || this.isRemovedFromWorld) {
            return;
        }

        this.handleHorizontalMovement();
        this.handleJump();
        this.handleLandingSound();

        this.world.cameraX = -this.x + 100;
    }

    /** Processes left/right keyboard input and updates facing direction. */
    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
            this.moveRight();
            this.otherDirection = false;
            return;
        }

        if (this.world.keyboard.LEFT && this.x > -600) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /** Triggers a jump when the player presses space or up while grounded. */
    handleJump() {
        const jumpRequested = this.world.keyboard.SPACE || this.world.keyboard.UP;
        if (jumpRequested && !this.isAboveGround()) {
            this.jump();
            this.wasAboveGround = true;
            this.world.soundManager.play('jump');
        }
    }

    /** Plays a landing sound once when the character touches the ground after a jump. */
    handleLandingSound() {
        const isAboveGround = this.isAboveGround();
        if (this.wasAboveGround && !isAboveGround) {
            this.world.soundManager.play('land');
        }
        this.wasAboveGround = isAboveGround;
    }

    /** Selects the appropriate animation based on current state (dead, hurt, airborne, walking, idle). */
    updateAnimation() {
        if (!this.world || this.isRemovedFromWorld) {
            return;
        }

        if (this.isDead()) {
            this.markActivity();
            this.world.soundManager.stop('footsteps');
            this.playDeathAnimationOnce();
            return;
        }

        if (this.isHurt()) {
            this.markActivity();
            this.world.soundManager.stop('footsteps');
            this.playCharacterHitSoundOnce();
            this.playAnimation(this.IMAGES_HURT);
            return;
        }

        if (this.isAboveGround()) {
            this.markActivity();
            this.world.soundManager.stop('footsteps');
            this.playAnimation(this.IMAGES_JUMPING);
            return;
        }

        this.handleGroundAnimation();
    }

    /** Plays walking or idle animation while the character is on the ground. */
    handleGroundAnimation() {
        const isWalking = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;

        if (isWalking) {
            this.markActivity();
            this.world.soundManager.playLoop('footsteps');
            this.playAnimation(this.IMAGES_WALKING);
            return;
        }

        this.world.soundManager.stop('footsteps');
        this.playIdleAnimation();
    }

    /** Plays the character hit sound once for each recorded hit. */
    playCharacterHitSoundOnce() {
        if (this.lastHit <= this.lastCharacterHitSoundAt) {
            return;
        }

        this.world.soundManager.play('characterHit');
        this.lastCharacterHitSoundAt = this.lastHit;
    }

    /** Plays the idle intro once, then loops the long-idle animation. */
    playIdleAnimation() {
        if (!this.idleAnimationFinished) {
            this.playIdleAnimationOnce();
            return;
        }

        this.world.soundManager.playLoop('snore');
        this.playAnimation(this.IMAGES_LONG_IDLE);
    }

    /** Plays the idle intro (I-1 … I-10) a single time frame by frame. */
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

    /** Resets the idle animation so the intro restarts on next standstill. */
    resetIdleAnimation() {
        this.idleAnimationFinished = false;
        this.idleImageIndex = 0;
    }

    /** Marks activity (resets idle) – called on walk, jump, hurt, or death. */
    markActivity() {
        this.resetIdleAnimation();
        this.world.soundManager.stop('snore');
    }

    /** Plays the death animation once, then removes the character from the world. */
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
