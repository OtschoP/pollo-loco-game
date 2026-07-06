/**
 * Central audio controller for music, effects, mute state, and persistence.
 */
class SoundManager {
    /** LocalStorage key for the persisted mute state. */
    storageKey = 'el-pollo-loco-muted';
    /** Audio registry keyed by logical sound name. */
    sounds = {};
    /** Names of sounds currently playing as loops. */
    activeLoops = new Set();
    /** Currently playing one-shot effect instances. */
    activeEffects = new Set();
    /** Whether all audio is currently muted. */
    muted = false;

    /** Creates and configures all game audio elements. */
    constructor() {
        this.sounds = {
            music: this.createAudio('audio/music.ogg', 0.22, true),
            jump: this.createAudio('audio/jump.ogg', 0.15),
            land: this.createAudio('audio/land.ogg', 0.15),
            footsteps: this.createAudio('audio/footsteps.ogg', 0.15, true),
            bottleThrow: this.createAudio('audio/bottle_throw.ogg', 0.5),
            bottleSplash: this.createAudio('audio/bottle_splash.ogg', 0.55),
            coinPickup: this.createAudio('audio/pickup_coin.ogg', 0.4),
            chickenDeath: this.createAudio('audio/chicken_death.ogg', 0.4),
            characterHit: this.createAudio('audio/character_hit.ogg', 0.25),
            youLose: this.createAudio('audio/you_lose.ogg', 0.5),
            youWin: this.createAudio('audio/you_win.ogg', 0.5),
            bossStart: this.createAudio('audio/boss_start.mp3', 0.2),
            bottleCollect: this.createAudio('audio/bottle_collect.ogg', 0.8),
            snore: this.createAudio('audio/snore.ogg', 0.20, true)
        };
        this.muted = this.readMutedState();
        this.applyMutedState();
    }

    /**
     * Creates one configured HTMLAudioElement.
     * @param {string} src - Audio file path.
     * @param {number} volume - Playback volume from 0 to 1.
     * @param {boolean} [loop=false] - Whether the audio should loop.
     * @returns {HTMLAudioElement} Configured audio element.
     */
    createAudio(src, volume, loop = false) {
        const audio = new Audio(src);
        audio.volume = volume;
        audio.loop = loop;
        audio.defaultPlaybackRate = 1;
        audio.playbackRate = 1;
        audio.preload = 'auto';
        return audio;
    }

    /**
     * Plays a short one-shot sound effect.
     * @param {string} name - Logical sound name.
     */
    play(name) {
        const sound = this.sounds[name];
        if (!sound || this.muted) {
            return;
        }

        const effect = sound.cloneNode();
        effect.volume = sound.volume;
        effect.muted = this.muted;
        this.activeEffects.add(effect);
        effect.addEventListener('ended', () => this.activeEffects.delete(effect), { once: true });
        effect.play().catch(() => this.activeEffects.delete(effect));
    }

    /**
     * Starts a looping sound if it is not already active.
     * @param {string} name - Logical sound name.
     */
    playLoop(name) {
        const sound = this.sounds[name];
        if (!sound || this.activeLoops.has(name)) {
            return;
        }

        this.activeLoops.add(name);
        sound.currentTime = 0;
        sound.muted = this.muted;
        if (!this.muted) {
            sound.play().catch(() => {});
        }
    }

    /**
     * Stops a single sound and removes it from the active loop set.
     * @param {string} name - Logical sound name.
     */
    stop(name) {
        const sound = this.sounds[name];
        if (!sound) {
            return;
        }

        sound.pause();
        sound.currentTime = 0;
        this.activeLoops.delete(name);
    }

    /** Stops every registered sound and clears loop state. */
    stopAll() {
        Object.keys(this.sounds).forEach((name) => this.stop(name));
        this.activeEffects.forEach((effect) => {
            effect.pause();
            effect.currentTime = 0;
        });
        this.activeEffects.clear();
    }

    /**
     * Sets and persists the mute state.
     * @param {boolean} muted - Whether audio should be muted.
     */
    setMuted(muted) {
        this.muted = muted;
        this.persistMutedState();
        this.applyMutedState();
    }

    /**
     * Toggles the mute state.
     * @returns {boolean} New mute state.
     */
    toggleMuted() {
        this.setMuted(!this.muted);
        return this.muted;
    }

    /**
     * Returns whether audio is muted.
     * @returns {boolean} Current mute state.
     */
    isMuted() {
        return this.muted;
    }

    /** Applies the mute state and resumes active loops when unmuted. */
    applyMutedState() {
        Object.values(this.sounds).forEach((sound) => {
            sound.muted = this.muted;
        });
        this.activeEffects.forEach((effect) => {
            effect.muted = this.muted;
        });

        if (!this.muted) {
            this.activeLoops.forEach((name) => {
                this.sounds[name]?.play().catch(() => {});
            });
        }
    }

    /** Persists the mute state when LocalStorage is available. */
    persistMutedState() {
        try {
            localStorage.setItem(this.storageKey, String(this.muted));
        } catch (error) {
            return;
        }
    }

    /**
     * Reads the persisted mute state.
     * @returns {boolean} Persisted mute value, or false.
     */
    readMutedState() {
        try {
            return localStorage.getItem(this.storageKey) === 'true';
        } catch (error) {
            return false;
        }
    }
}
