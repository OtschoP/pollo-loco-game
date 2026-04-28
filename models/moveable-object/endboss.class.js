class Endboss extends MoveableObject {

    height = 400;
    width = 250;
    y = 70;
    speed = 2.2;
    activationDistance = 450;
    isActivated = false;
    isAttacking = false;
    attackCooldownUntil = 0;
    world;
    offset = {
        top: 70,
        right: 30,
        bottom: 35,
        left: 30
    };

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2200;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.updateActivation();
            this.updateChaseMovement();
        }, 1000 / 60);

        setInterval(() => {
            if (this.world?.isGameOver) {
                return;
            }

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                return;
            }

            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                return;
            }

            if (this.isAttacking) {
                this.playAttackAnimationOnce();
                return;
            }

            if (this.isActivated) {
                this.playAnimation(this.IMAGES_ALERT);
                return;
            }

            this.playAnimation(this.IMAGES_WALKING);
        }, 120);
    }

    takeBottleHit() {
        if (this.isDead()) {
            return;
        }

        this.hit();
        this.isActivated = true;
    }

    startAttack() {
        if (this.isDead() || this.isMovementLocked()) {
            return;
        }

        this.isActivated = true;
        this.isAttacking = true;
        this.currentAnimation = this.IMAGES_ATTACK;
        this.currentImage = 0;
    }

    playAttackAnimationOnce() {
        const frameIndex = Math.min(this.currentImage, this.IMAGES_ATTACK.length - 1);
        const framePath = this.IMAGES_ATTACK[frameIndex];
        this.img = this.imageCache[framePath];
        this.currentImage++;

        if (this.currentImage >= this.IMAGES_ATTACK.length) {
            this.isAttacking = false;
            this.attackCooldownUntil = Date.now() + 1000;
        }
    }

    isMovementLocked() {
        return this.isAttacking || Date.now() < this.attackCooldownUntil;
    }

    updateActivation() {
        if (this.isActivated || !this.world || this.world.isGameOver) {
            return;
        }

        const characterDistance = Math.abs(this.world.character.x - this.x);
        if (characterDistance <= this.activationDistance) {
            this.isActivated = true;
        }
    }

    updateChaseMovement() {
        if (!this.isActivated || !this.world || this.world.isGameOver || this.isDead() || this.isMovementLocked()) {
            return;
        }

        if (this.world.character.x < this.x) {
            this.moveLeft();
            this.otherDirection = false;
            return;
        }

        if (this.world.character.x > this.x) {
            this.moveRight();
            this.otherDirection = true;
        }
    }
}
