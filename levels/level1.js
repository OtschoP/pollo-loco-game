/**
 * Creates normal-sized chicken enemies at fixed base positions with randomised offset and speed.
 * @returns {Chicken[]} Array of normal chicken enemy instances.
 */
function createChickens() {
    const basePositions = [320, 540, 760, 980, 1200, 1420, 1640, 1860];

    return basePositions.map((baseX) => {
        const xOffset = Math.random() * 80 - 40;
        const speed = 0.2 + Math.random() * 0.3;
        return new Chicken(baseX + xOffset, speed);
    });
}

/**
 * Creates small chicken enemies at fixed base positions with randomised offset and speed.
 * @returns {ChickenSmall[]} Array of small chicken enemy instances.
 */
function createSmallChickens() {
    const basePositions = [450, 890, 1330, 1770];

    return basePositions.map((baseX) => {
        const xOffset = Math.random() * 60 - 30;
        const speed = 0.25 + Math.random() * 0.35;
        return new ChickenSmall(baseX + xOffset, speed);
    });
}

/**
 * Creates the level's cloud layer.
 * @returns {Cloud[]} Array of cloud instances.
 */
function createClouds() {
    return [
        new Cloud(-250, 20, 0.1),
        new Cloud(460, 35, 0.14),
        new Cloud(1140, 25, 0.13),
        new Cloud(1820, 30, 0.1),
        new Cloud(2500, 40, 0.09)
    ];
}

/**
 * Creates all scrolling background layers.
 * @returns {BackgroundObject[]} Array of background object instances.
 */
function createBackgroundObjects() {
    return [-719, 0, 719, 719 * 2, 719 * 3].flatMap((x, index) => createBackgroundSet(x, index));
}

/**
 * Creates one parallax background set at the given x-position.
 * @param {number} x - The x-coordinate for the background set.
 * @param {number} index - Index used to alternate background image sides.
 * @returns {BackgroundObject[]} Array of background objects for the set.
 */
function createBackgroundSet(x, index) {
    const side = index % 2 === 0 ? '2' : '1';
    return [
        new BackgroundObject('img/5_background/layers/air.png', x),
        new BackgroundObject(`img/5_background/layers/3_third_layer/${side}.png`, x),
        new BackgroundObject(`img/5_background/layers/2_second_layer/${side}.png`, x),
        new BackgroundObject(`img/5_background/layers/1_first_layer/${side}.png`, x)
    ];
}

/**
 * Creates all collectible coins.
 * @returns {Coin[]} Array of collectible coin instances.
 */
function createCoins() {
    return [
        new Coin(320, 220, 0),
        new Coin(760, 180, 1),
        new Coin(1180, 220, 0),
        new Coin(1620, 180, 1),
        new Coin(2060, 220, 0)
    ];
}

/**
 * Creates all collectible bottles.
 * @returns {Bottle[]} Array of collectible bottle instances.
 */
function createBottles() {
    const positions = [300, 430, 560, 720, 860, 1010, 1160, 1310, 1460, 1610, 1760, 1910, 2020, 2085, 2140];
    return positions.map((x, index) => new Bottle(x, 340, index % 2));
}

/**
 * Factory that builds a fresh Level 1 instance with enemies, clouds,
 * background layers, coins, and bottles.
 * @returns {Level} A new Level instance.
 */
function createLevel1() {
    return new Level([
        ...createChickens(),
        ...createSmallChickens(),
        new Endboss()
    ], createClouds(), createBackgroundObjects(), createCoins(), createBottles());
}
