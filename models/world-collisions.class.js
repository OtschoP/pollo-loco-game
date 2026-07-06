/**
 * Handles all collision detection for the World, separated from game logic.
 * @param {World} world - The World instance providing game state.
 */
class WorldCollisions {
    world;

    constructor(world) {
        this.world = world;
    }

    /** Dispatches all collision checks (enemy, bottle, collectible). */
    checkCollisions(){
        this.checkEnemyCollisions();
        this.checkBottleCollisions();
        this.checkCollectibleCollisions();
    }

    /** Checks character-vs-enemy collisions (stomp, damage, endboss attack). */
    checkEnemyCollisions(){
        const w = this.world;
        const characterCanInteract = !w.character.isRemovedFromWorld && !w.character.isDead();
        const characterHitbox = w.character.getHitbox();
        const previousCharacterBottom = w.previousCharacterBottom ?? characterHitbox.bottom;

        w.level.enemies.forEach((enemy) => {
            this.handleEnemyCollision(enemy, characterCanInteract, characterHitbox, previousCharacterBottom);
        });

        w.previousCharacterBottom = characterHitbox.bottom;
    }

    /**
     * Handles a single enemy collision: stomp, endboss attack, or damage.
     * @param {MoveableObject} enemy - The enemy colliding with the character.
     * @param {boolean} characterCanInteract - Whether the character can interact.
     * @param {Object} characterHitbox - Character hitbox edges.
     * @param {number} previousCharacterBottom - Character bottom y in the previous frame.
     */
    handleEnemyCollision(enemy, characterCanInteract, characterHitbox, previousCharacterBottom){
        const w = this.world;
        const enemyCanDamage = enemy.isDefeated !== true && !enemy.isDead();
        const isCharacterCollision = characterCanInteract && enemyCanDamage && w.character.isColliding(enemy);

        if (!isCharacterCollision) {
            return;
        }

        if (enemy instanceof Endboss) {
            enemy.startAttack();
        }

        if (this.isStompCollision(enemy, characterHitbox, previousCharacterBottom)) {
            enemy.die();
            w.soundManager.play('chickenDeath');
            this.bounceAfterStomp();
            return;
        }

        this.handleCharacterDamage();
    }

    /** Applies damage to the character and starts the damage cooldown. */
    handleCharacterDamage(){
        const w = this.world;
        if (!w.canTakeDamage) {
            return;
        }

        w.character.hit();
        w.statusBar.setPercentage(w.character.energy);
        w.canTakeDamage = false;
        setTimeout(() => {
            w.canTakeDamage = true;
        }, w.enemyHitCooldownMs);
    }

    /** Checks all throwable bottles for enemy hits. */
    checkBottleCollisions(){
        const w = this.world;
        for (const bottle of w.throwableObjects) {
            if (bottle.hasSplashed || bottle.isMarkedForRemoval) {
                continue;
            }

            const hitEnemy = this.findBottleHitEnemy(bottle);
            if (hitEnemy) {
                this.applyBottleHit(bottle, hitEnemy);
                break;
            }
        }
    }

    /**
     * Finds the first enemy hit by a given bottle.
     * @param {ThrowableObject} bottle - The bottle to check.
     * @returns {MoveableObject|undefined} The hit enemy, or undefined.
     */
    findBottleHitEnemy(bottle){
        return this.world.level.enemies.find((enemy) => {
            const isChickenType = enemy instanceof Chicken || enemy instanceof ChickenSmall;
            const isEndboss = enemy instanceof Endboss;

            if (isChickenType && !enemy.isDefeated && bottle.isColliding(enemy)) {
                return true;
            }

            return isEndboss && !enemy.isDead() && bottle.isColliding(enemy);
        });
    }

    /**
     * Applies the bottle-hit effect to an enemy (damage or defeat) and triggers the splash.
     * @param {ThrowableObject} bottle - The bottle that hit.
     * @param {MoveableObject} enemy - The enemy that was hit.
     */
    applyBottleHit(bottle, enemy){
        const w = this.world;
        if (enemy instanceof Endboss) {
            enemy.takeBottleHit();
            w.updateEndbossStatusBar(enemy);
        } else {
            enemy.die();
            w.soundManager.play('chickenDeath');
        }

        bottle.startSplashAnimation();
    }

    /** Checks character collisions with collectible coins and bottles. */
    checkCollectibleCollisions(){
        const w = this.world;
        if (w.character.isRemovedFromWorld || w.character.isDead()) {
            return;
        }

        w.level.coins = this.collectItems(w.level.coins, 'coins');
        w.level.bottles = this.collectItems(w.level.bottles, 'bottles');
    }

    /**
     * Filters collectible items, removing those the character touches.
     * @param {MoveableObject[]} items - Items to check.
     * @param {string} type - 'coins' or 'bottles'.
     * @returns {MoveableObject[]} Remaining (uncollected) items.
     */
    collectItems(items, type){
        return items.filter((item) => {
            if (this.world.character.isColliding(item)) {
                this.increaseCollectedCount(type);
                return false;
            }

            return true;
        });
    }

    /**
     * Increments the collected counter and updates the corresponding status bar.
     * @param {string} type - 'coins' or 'bottles'.
     */
    increaseCollectedCount(type){
        const w = this.world;
        if (type === 'coins') {
            w.collectedCoins++;
            w.updateCoinStatusBar();
            w.soundManager.play('coinPickup');
            return;
        }

        w.collectedBottles++;
        w.updateBottleStatusBar();
        w.soundManager.play('bottleCollect');
    }

    /**
     * Returns whether the character is stomping the given enemy from above.
     * @param {MoveableObject} enemy - The enemy to check.
     * @param {Object} characterHitbox - Character hitbox edges.
     * @param {number} previousCharacterBottom - Character bottom y in the previous frame.
     * @returns {boolean} `true` if this is a stomp collision.
     */
    isStompCollision(enemy, characterHitbox, previousCharacterBottom) {
        const w = this.world;
        const isChickenType = enemy instanceof Chicken || enemy instanceof ChickenSmall;
        if (!isChickenType || w.character.speedY >= 0) {
            return false;
        }

        const enemyHitbox = enemy.getHitbox();
        const stompTolerance = 20;
        const crossedEnemyTop = previousCharacterBottom <= enemyHitbox.top + 5 && characterHitbox.bottom >= enemyHitbox.top;
        const inTopToleranceZone = characterHitbox.bottom <= enemyHitbox.top + stompTolerance;

        return crossedEnemyTop || inTopToleranceZone;
    }

    /** Bounces the character upward after a successful stomp. */
    bounceAfterStomp() {
        this.world.character.speedY = 18;
    }
}
