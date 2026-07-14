/**
 * Represents a game level containing all enemies, clouds, background objects,
 * collectible coins, and collectible bottles.
 */
class Level {

    /** Array of enemy instances (Chicken, ChickenSmall, Endboss). */
    enemies;
    /** Array of cloud instances. */
    clouds;
    /** Array of background layer objects. */
    backgroundObjects;
    /** Array of collectible coin instances. */
    coins;
    /** Array of collectible bottle instances. */
    bottles;
    /** Rightmost x-coordinate of the level (world boundary). */
    level_end_x = 719 * 3;

    /**
     * Creates a new Level.
     * @param {MoveableObject[]} enemies - Enemy instances for this level.
     * @param {Cloud[]} clouds - Cloud instances for this level.
     * @param {BackgroundObject[]} backgroundObjects - Background layers.
     * @param {Coin[]} [coins=[]] - Collectible coins.
     * @param {Bottle[]} [bottles=[]] - Collectible bottles.
     */
    constructor(enemies, clouds, backgroundObjects, coins = [], bottles = []){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
