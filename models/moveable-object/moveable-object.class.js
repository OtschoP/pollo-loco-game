class MoveableObject extends DrawableObject {
    currentAnimation = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    
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
        if(this instanceof ThrowableObject){
            return true;
        } else {
            return this.y < 180;
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
