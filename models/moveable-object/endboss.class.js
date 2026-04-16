class Endboss extends MoveableObject {
    height = 400;
    width = 250;
    y = 70;
    speed = 2.2;
    activationDistance = 450;
    isActivated = false;
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

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
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

            if (this.isActivated) {
                this.playAnimation(this.IMAGES_ALERT);
                return;
            }

            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
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
        if (!this.isActivated || !this.world || this.world.isGameOver) {
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
