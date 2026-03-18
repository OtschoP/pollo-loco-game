class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 100;
    y = 280;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image(); // this,img = document.getElementById('img') <img id="image" src>
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Coin || this instanceof Endboss) {
            const hitbox = this.getHitbox();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.rect(hitbox.left, hitbox.top, hitbox.right - hitbox.left, hitbox.bottom - hitbox.top);
            ctx.stroke();
        }
    }


    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

}