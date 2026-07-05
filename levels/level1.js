/** Creates normal-sized chicken enemies at fixed base positions with randomised offset and speed. */
function createChickens() {
    const basePositions = [320, 540, 760, 980, 1200, 1420, 1640, 1860];

    return basePositions.map((baseX) => {
        const xOffset = Math.random() * 80 - 40;
        const speed = 0.2 + Math.random() * 0.3;
        return new Chicken(baseX + xOffset, speed);
    });
}

/** Creates small chicken enemies at fixed base positions with randomised offset and speed. */
function createSmallChickens() {
    const basePositions = [450, 890, 1330, 1770];

    return basePositions.map((baseX) => {
        const xOffset = Math.random() * 60 - 30;
        const speed = 0.25 + Math.random() * 0.35;
        return new ChickenSmall(baseX + xOffset, speed);
    });
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
    ],
    [
        new Cloud(-250, 20, 0.1),
        new Cloud(460, 35, 0.14),
        new Cloud(1140, 25, 0.13),
        new Cloud(1820, 30, 0.1),
        new Cloud(2500, 40, 0.09)
    ],
    [   
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),     
        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0), 
        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),  
        new BackgroundObject('img/5_background/layers/air.png', 719*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2), 
        new BackgroundObject('img/5_background/layers/air.png', 719*3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3),     
    ],
    [
        new Coin(320, 220, 0),
        new Coin(760, 180, 1),
        new Coin(1180, 220, 0),
        new Coin(1620, 180, 1),
        new Coin(2060, 220, 0)
    ],
    [
        new Bottle(300, 340, 0),
        new Bottle(430, 340, 1),
        new Bottle(560, 340, 0),
        new Bottle(720, 340, 1),
        new Bottle(860, 340, 0),
        new Bottle(1010, 340, 1),
        new Bottle(1160, 340, 0),
        new Bottle(1310, 340, 1),
        new Bottle(1460, 340, 0),
        new Bottle(1610, 340, 1),
        new Bottle(1760, 340, 0),
        new Bottle(1910, 340, 1),
        new Bottle(2020, 340, 0),
        new Bottle(2085, 340, 1),
        new Bottle(2140, 340, 0)
    ]
);
}

