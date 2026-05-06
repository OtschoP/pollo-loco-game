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
    endbossStatusBar;
    throwableObjects = [];
    collectedCoins = 0;
    maxCoins = this.level.coins.length;
    collectedBottles = 0;
    maxBottles = this.level.bottles.length;
    throwKeyPressed = false;
    enemyHitCooldownMs = 600;
    canTakeDamage = true;
    isGameOver = false;
    isGameWon = false;
    gameOverImage = new Image();
    winImage = new Image();
    previousCharacterBottom = null;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.endbossStatusBar = new StatusBar('endboss', this.canvas.width - 250, 0, 100);
        this.gameOverImage.src = 'img/9_intro_outro_screens/game_over/game over.png';
        this.winImage.src = 'img/You won, you lost/You Win A.png';
        this.draw();
        this.setWorld();
        this.updateEndbossStatusBar();
        this.run()

    }

    setWorld() {
        this.character.world = this;
        this.getEndbosses().forEach((endboss) => {
            endboss.world = this;
        });
    }

    run() {
        setInterval(() => {
            if (this.isGameOver || this.isGameWon) {
                return;
            }

            this.checkCollisions();
            this.checkThrowableObjects();
            this.checkGameWon();
            this.checkGameOver();
        }, 1000 / 60);
    }

    checkThrowableObjects(){
        if (this.isGameOver || this.isGameWon || this.character.isRemovedFromWorld) {
            return;
        }

        if (this.keyboard.D && !this.throwKeyPressed && this.collectedBottles > 0) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.collectedBottles--;
            this.updateBottleStatusBar();
        }

        this.throwKeyPressed = this.keyboard.D;
    }

    checkCollisions(){
        const characterCanInteract = !this.character.isRemovedFromWorld && !this.character.isDead();
        const characterHitbox = this.character.getHitbox();
        const previousCharacterBottom = this.previousCharacterBottom ?? characterHitbox.bottom;

        this.level.enemies.forEach((enemy) => {
            const enemyCanDamage = enemy.isDefeated !== true && !enemy.isDead();
            const isCharacterCollision = characterCanInteract && enemyCanDamage && this.character.isColliding(enemy);

            if (!isCharacterCollision) {
                return;
            }

            if (isCharacterCollision && enemy instanceof Endboss) {
                enemy.startAttack();
            }

            if (this.isStompCollision(enemy, characterHitbox, previousCharacterBottom)) {
                enemy.die();
                this.bounceAfterStomp();
                return;
            }

            if (isCharacterCollision && this.canTakeDamage) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
                console.log('Collision with Character, Energy:', this.character.energy);
                this.canTakeDamage = false;
                setTimeout(() => {
                    this.canTakeDamage = true;
                }, this.enemyHitCooldownMs);
            }
        });

        this.previousCharacterBottom = characterHitbox.bottom;

        for (const bottle of this.throwableObjects) {
            if (bottle.hasSplashed || bottle.isMarkedForRemoval) {
                continue;
            }

            for (const enemy of this.level.enemies) {
                const isChickenType = enemy instanceof Chicken || enemy instanceof ChickenSmall;
                const isEndboss = enemy instanceof Endboss;

                if (isChickenType && !enemy.isDefeated && bottle.isColliding(enemy)) {
                    enemy.die();
                    bottle.startSplashAnimation();
                    break;
                }

                if (isEndboss && !enemy.isDead() && bottle.isColliding(enemy)) {
                    enemy.takeBottleHit();
                    this.updateEndbossStatusBar(enemy);
                    bottle.startSplashAnimation();
                    break;
                }
            }
        }

        if (characterCanInteract) {
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
    }

    isStompCollision(enemy, characterHitbox, previousCharacterBottom) {
        const isChickenType = enemy instanceof Chicken || enemy instanceof ChickenSmall;
        if (!isChickenType || this.character.speedY >= 0) {
            return false;
        }

        const enemyHitbox = enemy.getHitbox();
        const stompTolerance = 20;
        const crossedEnemyTop = previousCharacterBottom <= enemyHitbox.top + 5 && characterHitbox.bottom >= enemyHitbox.top;
        const inTopToleranceZone = characterHitbox.bottom <= enemyHitbox.top + stompTolerance;

        return crossedEnemyTop || inTopToleranceZone;
    }

    bounceAfterStomp() {
        this.character.speedY = 18;
    }

    checkGameOver() {
        if (!this.isGameOver && this.character.isDead()) {
            this.isGameOver = true;
            this.resetPressedKeys();
        }
    }

    checkGameWon() {
        if (this.isGameWon) {
            return;
        }

        const endbosses = this.getEndbosses();
        if (endbosses.length > 0 && endbosses.every((endboss) => endboss.isDead())) {
            this.isGameWon = true;
            this.resetPressedKeys();
        }
    }

    resetPressedKeys() {
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.UP = false;
        this.keyboard.DOWN = false;
        this.keyboard.SPACE = false;
        this.keyboard.D = false;
    }

    removeCharacterFromWorld() {
        this.character.isRemovedFromWorld = true;
    }

    drawGameOverScreen() {
        if (this.gameOverImage.complete) {
            this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawWinScreen() {
        if (this.winImage.complete) {
            this.ctx.drawImage(this.winImage, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    scheduleNextFrame() {
        requestAnimationFrame(() => {
            this.draw();
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

    updateEndbossStatusBar(endboss = null) {
        const currentEndboss = endboss || this.getEndbosses()[0];
        const percentage = currentEndboss ? currentEndboss.energy : 0;
        this.endbossStatusBar.setPercentage(percentage);
    }

    draw() {
        this.prepareFrame();
        this.drawScrollableWorld();
        this.drawFixedUi();
        this.drawEndbossInForeground();
        this.drawCharacterIfVisible();
        this.drawGameOverIfReady();
        this.drawWinIfReady();
        this.scheduleNextFrame();
    }

    prepareFrame() {
        this.checkGameOver();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.throwableObjects = this.throwableObjects.filter((obj) => !obj.isMarkedForRemoval);
    }

    drawScrollableWorld() {
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.getRegularEnemies());
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.restore();
    }

    drawFixedUi() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        if (this.getEndbosses().length > 0) {
            this.addToMap(this.endbossStatusBar);
        }
    }

    drawEndbossInForeground() {
        const endbosses = this.getEndbosses();
        if (endbosses.length === 0) {
            return;
        }

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(endbosses);
        this.ctx.restore();
    }

    drawCharacterIfVisible() {
        if (!this.character.isRemovedFromWorld) {
            this.ctx.save();
            this.ctx.translate(this.camera_x, 0);
            this.addToMap(this.character);
            this.ctx.restore();
        }
    }

    drawGameOverIfReady() {
        if (this.isGameOver && this.character.isRemovedFromWorld) {
            this.drawGameOverScreen();
        }
    }

    drawWinIfReady() {
        if (this.isGameWon) {
            this.drawWinScreen();
        }
    }

    getRegularEnemies() {
        return this.level.enemies.filter((enemy) => !(enemy instanceof Endboss));
    }

    getEndbosses() {
        return this.level.enemies.filter((enemy) => enemy instanceof Endboss);
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
