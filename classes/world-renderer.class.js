/**
 * Handles all canvas rendering for the World, separated from game logic.
 * Delegates to the World instance for state access.
 */
class WorldRenderer {
    /** Reference to the World instance providing game state. */
    world;
    /** The 2D canvas rendering context. */
    ctx;

    /**
     * Creates a new WorldRenderer bound to the given World.
     * @param {World} world - The World instance to render.
     */
    constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
    }

    /** Executes the full draw pipeline and schedules the next animation frame. */
    draw() {
        this.prepareFrame();
        this.drawScrollableWorld();
        this.drawEndbossInForeground();
        this.drawCharacterIfVisible();
        this.drawFixedUi();
        this.drawGameOverIfReady();
        this.drawWinIfReady();
        this.scheduleNextFrame();
    }

    /** Clears the canvas, checks game-over, and removes spent throwable objects. */
    prepareFrame() {
        this.world.checkGameOver();
        this.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.world.throwableObjects = this.world.throwableObjects.filter((obj) => !obj.isMarkedForRemoval);
    }

    /** Draws all camera-scrolled world layers (background, clouds, items, enemies, bottles). */
    drawScrollableWorld() {
        this.ctx.save();
        this.ctx.translate(this.world.cameraX, 0);
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.addObjectsToMap(this.world.level.clouds);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.level.bottles);
        this.addObjectsToMap(this.world.getRegularEnemies());
        this.addObjectsToMap(this.world.throwableObjects);
        this.ctx.restore();
    }

    /** Draws the fixed UI status bars (health, coins, bottles, endboss). */
    drawFixedUi() {
        this.addToMap(this.world.statusBar);
        this.addToMap(this.world.coinStatusBar);
        this.addToMap(this.world.bottleStatusBar);
        if (this.world.getEndbosses().length > 0) {
            this.addToMap(this.world.endbossStatusBar);
        }
    }

    /** Draws the endboss in a dedicated foreground pass so UI does not cover it. */
    drawEndbossInForeground() {
        const endbosses = this.world.getEndbosses();
        if (endbosses.length === 0) {
            return;
        }

        this.ctx.save();
        this.ctx.translate(this.world.cameraX, 0);
        this.addObjectsToMap(endbosses);
        this.ctx.restore();
    }

    /** Draws the player character if it has not been removed after death. */
    drawCharacterIfVisible() {
        if (this.world.character.isRemovedFromWorld) {
            return;
        }

        this.ctx.save();
        this.ctx.translate(this.world.cameraX, 0);
        this.addToMap(this.world.character);
        this.ctx.restore();
    }

    /** Draws the game-over screen once the character has been removed. */
    drawGameOverIfReady() {
        if (this.world.isGameOver && this.world.character.isRemovedFromWorld) {
            this.drawFullScreenImage(this.world.gameOverImage);
        }
    }

    /** Draws the win screen when the game has been won. */
    drawWinIfReady() {
        if (this.world.isGameWon) {
            this.drawFullScreenImage(this.world.winImage);
        }
    }

    /**
     * Draws an image filling the entire canvas if it has finished loading.
     * @param {HTMLImageElement} image - The image to draw.
     */
    drawFullScreenImage(image) {
        if (image.complete) {
            this.ctx.drawImage(image, 0, 0, this.world.canvas.width, this.world.canvas.height);
        }
    }

    /** Schedules the next animation frame via requestAnimationFrame. */
    scheduleNextFrame() {
        this.world.rafId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Adds an array of objects to the map.
     * @param {DrawableObject[]} objects - Objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

    /**
     * Draws a single object, flipping its sprite horizontally if facing left.
     * @param {DrawableObject} mo - The object to draw.
     */
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

    /**
     * Flips the canvas context horizontally for left-facing sprites.
     * @param {DrawableObject} mo - The object being flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas context after a horizontal flip.
     * @param {DrawableObject} mo - The object that was flipped.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
