/**
 * Base class for all movable game objects (character, enemies, items, bottles).
 * Adds movement, gravity, collision detection, and animation playback.
 * @extends DrawableObject
 */
class MoveableObject extends DrawableObject {
    /** Currently active animation image set. */
    currentAnimation = 0;
    /** Horizontal movement speed in px per tick. */
    speed = 0.15;
    /** Whether the object faces left (for sprite flipping). */
    otherDirection = false;
    /** Vertical velocity used by gravity. */
    speedY = 0;
    /** Gravity acceleration applied per tick. */
    acceleration = 2;
    /** Fixed y-position where this object rests on the ground. */
    groundY = 180;

    /** Timestamp of the last hit taken (ms). */
    lastHit = 0;
    /** Hitbox inset from the object's bounding box. */
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /** Internal list of active interval IDs for cleanup. */
    _timers = [];

    /**
     * Registers an interval and stores its ID for later cleanup.
     * @param {Function} callback - Callback to execute on each tick.
     * @param {number} ms - Interval in milliseconds.
     * @returns {number} The interval ID.
     */
    _registerInterval(callback, ms) {
        const id = setInterval(callback, ms);
        this._timers.push(id);
        return id;
    }

    /** Stops all registered intervals for this object. */
    stopTimers() {
        this._timers.forEach((id) => clearInterval(id));
        this._timers = [];
    }

    /** Applies gravity to the object via a 25 fps interval. */
    applyGravity() {
        this._registerInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = this.groundY;
                this.speedY = 0;
            }
        }, 1000 / 25)
    }

    /**
     * Returns whether the object is above the ground line.
     * ThrowableObjects use a different ground threshold.
     * @returns {boolean} `true` if the object is airborne.
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Computes the effective hitbox (AABB) after applying offset insets.
     * @returns {{left:number,top:number,right:number,bottom:number}} Hitbox edges.
     */
    getHitbox() {
        const objectOffset = this.offset || {};
        return {
            left: this.x + (objectOffset.left || 0),
            top: this.y + (objectOffset.top || 0),
            right: this.x + this.width - (objectOffset.right || 0),
            bottom: this.y + this.height - (objectOffset.bottom || 0)
        };
    }

    /**
     * Checks AABB collision between this object's hitbox and another.
     * @param {MoveableObject} mo - The other object.
     * @returns {boolean} `true` if the hitboxes overlap.
     */
    isColliding(mo) {
        const ownHitbox = this.getHitbox();
        const otherHitbox = mo.getHitbox();

        return ownHitbox.right > otherHitbox.left &&
            ownHitbox.bottom > otherHitbox.top &&
            ownHitbox.left < otherHitbox.right &&
            ownHitbox.top < otherHitbox.bottom;
    }

    /**
     * Returns whether the object was hit within the last 0.3 seconds.
     * @returns {boolean} `true` if currently in the hurt window.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.3;
    }

    /** Moves the object right by its speed. */
    moveRight() {
        this.x += this.speed;
    }

    /** Moves the object left by its speed. */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Sets upward velocity for a jump. */
    jump() {
        this.speedY = 30;
    }

    /**
     * Returns whether the object has zero or negative energy.
     * @returns {boolean} `true` if dead.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Plays the next frame of the given animation image set.
     * @param {string[]} images - Array of image paths to cycle through.
     */
    playAnimation(images) {
        if (this.currentAnimation !== images) {
            this.currentAnimation = images;
            this.currentImage = 0;
        }

        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
