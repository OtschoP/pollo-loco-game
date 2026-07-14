/**
 * Base class for all drawable game objects.
 * Provides image loading, drawing, and basic health properties.
 */
class DrawableObject {
    /** Current image element rendered for this object. */
    img;
    /** Cache of preloaded images keyed by file path. */
    imageCache = {};
    /** Index of the current frame in an animation sequence. */
    currentImage = 0;
    /** Horizontal position on the canvas. */
    x = 100;
    /** Vertical position on the canvas. */
    y = 280;
    /** Render height in pixels. */
    height = 150;
    /** Render width in pixels. */
    width = 100;
    /** Health/energy value (0–100). */
    energy = 100;

    /**
     * Loads a single image from the given path.
     * @param {string} path - File path of the image to load.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws this object onto the given canvas context.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /** Draws a debug hitbox frame (override in subclasses if needed). */
    drawFrame() {
    }

    /**
     * Reduces energy by 10 and records the time of the hit.
     * Energy is clamped to a minimum of 0.
     */
    hit(){
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Preloads an array of images into the image cache.
     * @param {string[]} arr - Array of image file paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

}
