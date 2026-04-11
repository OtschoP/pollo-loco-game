class Chicken extends MoveableObject {
    y = 350;
    height = 80;
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
    

    constructor(x = null, speed = null) {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.DEAD_IMAGE]);

        this.x = x !== null ? x : 200 + Math.random() * 500;
        this.speed = speed !== null ? speed : 0.15 + Math.random() * 0.5;
        this.animate();
    }

    die() {
        if (this.isDefeated) {
            return;
        }

        this.isDefeated = true;
        this.speed = 0;
        this.img = this.imageCache[this.DEAD_IMAGE];
    }

    animate() {
        setInterval(() => {
            if (!this.isDefeated) {
                this.moveLeft();
            }
        }, 1000 / 60);
        setInterval(() => {
            if (!this.isDefeated) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}
