class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar('health', 50, 0, this.character.energy);
    coinStatusBar = new StatusBar('coin', 50, 50, 0);
    bottleStatusBar = new StatusBar('bottle', 50, 100, 0);
    throwableObjects = [];
    collectedCoins = 0;
    maxCoins = this.level.coins.length;
    collectedBottles = 0;
    maxBottles = this.level.bottles.length;
    throwKeyPressed = false;
    enemyHitCooldownMs = 600;
    canTakeDamage = true;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run()

    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {

            this.checkCollisions();
            this.checkThrowableObjects();
        }, 1000 / 60);
    }

    checkThrowableObjects(){
        if (this.keyboard.D && !this.throwKeyPressed && this.collectedBottles > 0) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.collectedBottles--;
            this.updateBottleStatusBar();
        }

        this.throwKeyPressed = this.keyboard.D;
    }

    checkCollisions(){
        this.level.enemies.forEach((enemy) => {
            const enemyCanDamage = enemy.isDefeated !== true;
            if (enemyCanDamage && this.character.isColliding(enemy) && this.canTakeDamage) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
                console.log('Collision with Character, Energy:', this.character.energy);
                this.canTakeDamage = false;
                setTimeout(() => {
                    this.canTakeDamage = true;
                }, this.enemyHitCooldownMs);
            }
        });

        for (const bottle of this.throwableObjects) {
            if (bottle.hasSplashed || bottle.isMarkedForRemoval) {
                continue;
            }

            for (const enemy of this.level.enemies) {
                if (enemy instanceof Chicken && !enemy.isDefeated && bottle.isColliding(enemy)) {
                    enemy.die();
                    bottle.startSplashAnimation();
                    break;
                }
            }
        }

        this.level.coins = this.level.coins.filter((coin) => {
            if (this.character.isColliding(coin)) {
                this.collectedCoins++;
                this.updateCoinStatusBar();
                return false;
            }

            return true;
        });

        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.collectedBottles++;
                this.updateBottleStatusBar();
                return false;
            }

            return true;
        });
    }

    updateCoinStatusBar() {
        const percentage = (this.collectedCoins / this.maxCoins) * 100;
        this.coinStatusBar.setPercentage(percentage);
    }
    
    updateBottleStatusBar() {
        const percentage = (this.collectedBottles / this.maxBottles) * 100;
        this.bottleStatusBar.setPercentage(percentage);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.throwableObjects = this.throwableObjects.filter((obj) => !obj.isMarkedForRemoval);

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.restore();

        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.ctx.restore();

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

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}
