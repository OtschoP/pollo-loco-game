class MoveableObject {
    x = 100;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    currentAnimation = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }

    isAboveGround() {
        return this.y < 180;
    }

    loadImage(path) {
        this.img = new Image(); // this,img = document.getElementById('img') <img id="image" src>
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Coin || this instanceof Endboss){
        const hitbox = this.getHitbox();
        ctx.lineWidth = '3';
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.rect(hitbox.left, hitbox.top, hitbox.right - hitbox.left, hitbox.bottom - hitbox.top);
        ctx.stroke();
        }
    }

    getHitbox() {
        const objectOffset = this.offset || {};
        return {
            left: this.x + (objectOffset.left || 0),
            top: this.y + (objectOffset.top || 0),
            right: this.x + this.width - (objectOffset.right || 0),
            bottom: this.y + this.height - (objectOffset.bottom || 0)
        };
    }

    isColliding(mo) {
        const ownHitbox = this.getHitbox();
        const otherHitbox = mo.getHitbox();

        return ownHitbox.right > otherHitbox.left &&
            ownHitbox.bottom > otherHitbox.top &&
            ownHitbox.left < otherHitbox.right &&
            ownHitbox.top < otherHitbox.bottom;
    }

    hit(){
        this.energy -= 2;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.3;
    }

    isDead(){
        return this.energy == 0;
    }
    
    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 30;
    }

    isDead(){
        return this.energy <= 0;
    }

    playAnimation(images) {
        if (this.currentAnimation !== images) {
            this.currentAnimation = images;
            this.currentImage = 0;
        }

        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
