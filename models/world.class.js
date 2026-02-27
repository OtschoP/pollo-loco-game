class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addParallaxObjectsToMap(this.level.backgroundObjects);
        this.addParallaxObjectsToMap(this.level.clouds);

        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);


        this.ctx.translate(-this.camera_x, 0);

        // draw wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    addParallaxObjectsToMap(objects) {
        const sortedObjects = objects
            .map((o, index) => ({ o, index }))
            .sort((a, b) => {
                const parallaxA = a.o.parallax || 1;
                const parallaxB = b.o.parallax || 1;
                if (parallaxA !== parallaxB) {
                    return parallaxA - parallaxB;
                }
                return a.index - b.index;
            })
            .map(entry => entry.o);

        sortedObjects.forEach(o => {
            let drawX = Math.round(o.x + this.camera_x * (o.parallax || 1));
            this.addToMap(o, drawX);
        });
    }

    addToMap(mo, drawX = mo.x) {
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            drawX = drawX * -1;
        }
        this.ctx.drawImage(mo.img, drawX, mo.y, mo.width, mo.height);
        if (mo.otherDirection) {
            this.ctx.restore();
        }
    }

}
