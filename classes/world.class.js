/**
 * Central game controller that manages the level, character, collisions,
 * game-loop, and restart lifecycle.
 */
class World {
    /** Player character instance. */
    character = new Character();
    /** Current level instance. */
    level;
    /** Canvas element. */
    canvas;
    /** 2D rendering context. */
    ctx;
    /** Keyboard input state. */
    keyboard;
    /** Shared sound manager. */
    soundManager;
    /** Camera x-offset for scrolling. */
    camera_x = 0;
    /** Health status bar. */
    statusBar = new StatusBar('health', 50, 0, this.character.energy);
    /** Coin status bar. */
    coinStatusBar = new StatusBar('coin', 50, 50, 0);
    /** Bottle status bar. */
    bottleStatusBar = new StatusBar('bottle', 50, 100, 0);
    /** Endboss status bar. */
    endbossStatusBar;
    /** Currently active throwable bottles. */
    throwableObjects = [];
    /** Number of coins collected by the player. */
    collectedCoins = 0;
    /** Total coins available in the level. */
    maxCoins = 0;
    /** Number of bottles collected by the player. */
    collectedBottles = 0;
    /** Total bottles available in the level. */
    maxBottles = 0;
    /** Whether the throw key was pressed in the previous tick (edge detection). */
    throwKeyPressed = false;
    /** Cooldown (ms) between taking enemy damage. */
    enemyHitCooldownMs = 600;
    /** Whether the character can currently take damage. */
    canTakeDamage = true;
    /** Whether the game is over (character dead). */
    isGameOver = false;
    /** Whether the game has been won (endboss dead). */
    isGameWon = false;
    /** Game-over screen image. */
    gameOverImage = new Image();
    /** Win screen image. */
    winImage = new Image();
    /** Previous frame's character bottom y (for stomp detection). */
    previousCharacterBottom = null;
    /** Interval ID for the game loop. */
    runIntervalId = null;
    /** requestAnimationFrame ID for the render loop. */
    rafId = null;
    /** Renderer instance handling all canvas drawing. */
    renderer;

    /**
     * Creates a new World, initialises the level, and starts the game loop.
     * @param {HTMLCanvasElement} canvas - The canvas to render onto.
     * @param {Keyboard} keyboard - Shared keyboard input state.
     * @param {SoundManager} soundManager - Shared audio controller.
     */
    constructor(canvas, keyboard, soundManager) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.soundManager = soundManager;
        this.gameOverImage.src = 'img/9_intro_outro_screens/game_over/game over.png';
        this.winImage.src = 'img/You won, you lost/You Win A.png';
        this.renderer = new WorldRenderer(this);
        this.collisions = new WorldCollisions(this);
        this.initLevelState();
        this.setWorld();
        this.draw();
        this.soundManager.playLoop('music');
        this.run()
    }

    /** (Re)initialises the level, status bars, and collection counters. */
    initLevelState() {
        this.level = createLevel1();
        this.maxCoins = this.level.coins.length;
        this.maxBottles = this.level.bottles.length;
        this.collectedCoins = 0;
        this.collectedBottles = 0;
        this.endbossStatusBar = new StatusBar('endboss', this.canvas.width - 250, 0, 100);
        this.statusBar.setPercentage(this.character.energy);
        this.coinStatusBar.setPercentage(0);
        this.bottleStatusBar.setPercentage(0);
        this.updateEndbossStatusBar();
    }

    /** Wires the world reference into the character and all endboss instances. */
    setWorld() {
        this.character.world = this;
        this.getEndbosses().forEach((endboss) => {
            endboss.world = this;
        });
    }

    /** Starts the 60 fps game loop that checks collisions, throws, and game state. */
    run() {
        this.runIntervalId = setInterval(() => {
            if (this.isGameOver || this.isGameWon) {
                return;
            }

            this.collisions.checkCollisions();
            this.checkThrowableObjects();
            this.checkGameWon();
            this.checkGameOver();
        }, 1000 / 60);
    }

    /** Stops the game loop interval and the render animation frame. */
    stop() {
        if (this.runIntervalId !== null) {
            clearInterval(this.runIntervalId);
            this.runIntervalId = null;
        }
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /** Stops all timers on the character, enemies, and throwable bottles. */
    stopAllActors() {
        this.character?.stopTimers?.();
        this.level?.enemies?.forEach((enemy) => enemy.stopTimers?.());
        this.throwableObjects.forEach((bottle) => bottle.stopTimers?.());
    }

    /** Resets the entire game state (level, character, flags) and restarts the loop without a page reload. */
    reset() {
        this.stop();
        this.stopAllActors();
        this.soundManager.stopAll();
        this.throwableObjects = [];
        this.character = new Character();
        this.initLevelState();
        this.isGameOver = false;
        this.isGameWon = false;
        this.camera_x = 0;
        this.previousCharacterBottom = null;
        this.throwKeyPressed = false;
        this.canTakeDamage = true;
        this.resetPressedKeys();
        this.setWorld();
        this.draw();
        this.soundManager.playLoop('music');
        this.run();
    }

    /** Spawns a new throwable bottle when the throw key is pressed and bottles are available. */
    checkThrowableObjects(){
        if (this.isGameOver || this.isGameWon || this.character.isRemovedFromWorld) {
            return;
        }

        if (this.keyboard.D && !this.throwKeyPressed && this.collectedBottles > 0) {
            let xOffset = this.character.otherDirection ? 0 : 50;
            let bottle = new ThrowableObject(
                this.character.x + xOffset,
                this.character.y + 100,
                this.character.otherDirection,
                this.soundManager
            );
            this.throwableObjects.push(bottle);
            this.collectedBottles--;
            this.updateBottleStatusBar();
            this.soundManager.play('bottleThrow');
        }

        this.throwKeyPressed = this.keyboard.D;
    }

    /** Sets the game-over flag and resets pressed keys when the character dies. */
    checkGameOver() {
        if (!this.isGameOver && this.character.isDead()) {
            this.isGameOver = true;
            this.resetPressedKeys();
            this.soundManager.stop('music');
            this.soundManager.stop('snore');
            this.soundManager.stop('footsteps');
            this.soundManager.play('youLose');
        }
    }

    /** Sets the game-won flag and resets pressed keys when all endbosses are dead. */
    checkGameWon() {
        if (this.isGameWon) {
            return;
        }

        const endbosses = this.getEndbosses();
        if (endbosses.length > 0 && endbosses.every((endboss) => endboss.isDead())) {
            this.isGameWon = true;
            this.resetPressedKeys();
            this.soundManager.stop('music');
            this.soundManager.stop('snore');
            this.soundManager.stop('footsteps');
            this.soundManager.play('youWin');
        }
    }

    /** Resets all keyboard flags to false. */
    resetPressedKeys() {
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.UP = false;
        this.keyboard.DOWN = false;
        this.keyboard.SPACE = false;
        this.keyboard.D = false;
    }

    /** Marks the character as removed from the world (after death animation). */
    removeCharacterFromWorld() {
        this.character.isRemovedFromWorld = true;
    }

    /** Delegates the full draw pipeline to the renderer. */
    draw() {
        this.renderer.draw();
    }

    /** Updates the coin status bar based on collected/total coins. */
    updateCoinStatusBar() {
        const percentage = (this.collectedCoins / this.maxCoins) * 100;
        this.coinStatusBar.setPercentage(percentage);
    }

    /** Updates the bottle status bar based on collected/total bottles. */
    updateBottleStatusBar() {
        const percentage = (this.collectedBottles / this.maxBottles) * 100;
        this.bottleStatusBar.setPercentage(percentage);
    }

    /**
     * Updates the endboss status bar to reflect the given (or first) endboss's energy.
     * @param {Endboss} [endboss=null] - The endboss to read energy from.
     */
    updateEndbossStatusBar(endboss = null) {
        const currentEndboss = endboss || this.getEndbosses()[0];
        const percentage = currentEndboss ? currentEndboss.energy : 0;
        this.endbossStatusBar.setPercentage(percentage);
    }

    /**
     * Returns all non-endboss enemies.
     * @returns {MoveableObject[]} Regular enemies.
     */
    getRegularEnemies() {
        return this.level.enemies.filter((enemy) => !(enemy instanceof Endboss));
    }

    /**
     * Returns all endboss instances in the level.
     * @returns {Endboss[]} Endboss instances.
     */
    getEndbosses() {
        return this.level.enemies.filter((enemy) => enemy instanceof Endboss);
    }

}
