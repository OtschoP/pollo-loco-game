/**
 * Represents a status bar (health, coins, bottles, or endboss) drawn on the canvas.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {

    HEALTH_IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    COIN_IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    BOTTLE_IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    ENDBOSS_IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];

    IMAGES = [];
    percentage = 100;

    /**
     * Creates a new StatusBar.
     * @param {string} [type='health'] - Bar type: 'health', 'coin', 'bottle', or 'endboss'.
     * @param {number} [x=50] - Horizontal position on the canvas.
     * @param {number} [y=20] - Vertical position on the canvas.
     * @param {number} [percentage=100] - Initial fill percentage (0–100).
     */
    constructor(type = 'health', x = 50, y = 20, percentage = 100) {
        super();
        this.IMAGES = this.getImagesByType(type);
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setPercentage(percentage);

    }

    /**
     * Returns the image set for the given bar type.
     * @param {string} type - One of 'health', 'coin', 'bottle', 'endboss'.
     * @returns {string[]} Array of image paths.
     */
    getImagesByType(type) {
        if (type == 'coin') {
            return this.COIN_IMAGES;
        } else if (type == 'bottle') {
            return this.BOTTLE_IMAGES;
        } else if (type == 'endboss') {
            return this.ENDBOSS_IMAGES;
        } else {
            return this.HEALTH_IMAGES;
        }
    }

    /**
     * Sets the fill percentage and updates the displayed image.
     * @param {number} percentage - Fill value (clamped to 0–100).
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the image index (0–5) for the current percentage.
     * @returns {number} Index into the IMAGES array.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
