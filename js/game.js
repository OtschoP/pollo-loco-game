/** @type {HTMLCanvasElement} */
let canvas;
/** @type {World} */
let world;
/** Shared keyboard input state. */
let keyboard = new Keyboard();
/** Shared audio controller. */
let soundManager;
/** Whether the game has been started (prevents re-entry). */
let hasGameStarted = false;
/** Start screen background image. */
let startScreenImage = new Image();
/** Interval ID for the endscreen watcher. */
let endscreenWatcherId = null;


/** Entry point: sets up the canvas, start screen, UI, and touch controls. */
function init() {
    canvas = document.getElementById('canvas');
    soundManager = new SoundManager();
    setTouchDeviceClass();
    initStartScreen();
    wireUi();
    wireTouchControls();
}

/** Loads the start screen image and draws it once it is ready. */
function initStartScreen() {
    startScreenImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';
    if (startScreenImage.complete) {
        drawStartScreen();
        return;
    }
    startScreenImage.onload = drawStartScreen;
}

/** Draws the start screen image onto the canvas if the game hasn't started. */
function drawStartScreen() {
    if (!canvas || hasGameStarted) {
        return;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
}

/** Starts the game: hides the start button and creates a new World. */
function startGame() {
    document.getElementById('start-button').blur();

    if (hasGameStarted) {
        return;
    }

    hasGameStarted = true;
    document.body.classList.add('game-started');
    document.getElementById('mobile-controls').hidden = false;
    hideStartButton();
    world = new World(canvas, keyboard, soundManager);
    startEndscreenWatcher();
}

/** Hides the start button by setting its `hidden` attribute. */
function hideStartButton() {
    document.getElementById('start-button').hidden = true;
}

/** Shows the start button again and removes focus. */
function showStartButton() {
    const button = document.getElementById('start-button');
    button.hidden = false;
    button.blur();
}

/** Restarts the game by calling World.reset() without a page reload. */
function restartGame() {
    hideEndscreen();
    if (world) {
        world.reset();
    }
}

/** Returns to the home screen: stops the world, shows the start button and start screen. */
function backToHome() {
    hideEndscreen();
    if (world) {
        world.stop();
        world.stopAllActors();
        world = null;
    }
    soundManager.stopAll();
    hasGameStarted = false;
    document.body.classList.remove('game-started');
    document.getElementById('mobile-controls').hidden = true;
    showStartButton();
    drawStartScreen();
}

/** Marks the page when touch input is likely available. */
function setTouchDeviceClass() {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
        navigator.maxTouchPoints > 0 ||
        'ontouchstart' in window;
    document.body.classList.toggle('is-touch-device', isTouchDevice);
}

/** Starts a polling interval that shows the endscreen when the game ends. */
function startEndscreenWatcher() {
    if (endscreenWatcherId !== null) {
        return;
    }

    endscreenWatcherId = setInterval(() => {
        if (world && (world.isGameOver || world.isGameWon)) {
            showEndscreen();
        }
    }, 200);
}

/** Shows the endscreen overlay (Restart + Home buttons). */
function showEndscreen() {
    document.getElementById('endscreen').hidden = false;
}

/** Hides the endscreen overlay. */
function hideEndscreen() {
    document.getElementById('endscreen').hidden = true;
}

/** Wires all UI elements: restart/home buttons, dialogs, fullscreen. */
function wireUi() {
    document.getElementById('restart-button').addEventListener('click', restartGame);
    document.getElementById('home-button').addEventListener('click', backToHome);

    wireDialog('help-button', 'help-dialog');
    wireDialog('impressum-button', 'impressum-dialog');
    wireDialogCloseOnBackdrop();
    wireFullscreen();
    wireMuteButton();
}

/**
 * Wires a trigger button to open a <dialog> and closes it on backdrop click.
 * @param {string} triggerId - ID of the trigger button.
 * @param {string} dialogId - ID of the dialog element.
 */
function wireDialog(triggerId, dialogId) {
    const trigger = document.getElementById(triggerId);
    const dialog = document.getElementById(dialogId);

    trigger.addEventListener('click', () => dialog.showModal());

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
}

/** Wires all `[data-close]` buttons to close their nearest dialog. */
function wireDialogCloseOnBackdrop() {
    document.querySelectorAll('[data-close]').forEach((button) => {
        button.addEventListener('click', (event) => {
            const dialog = event.target.closest('dialog');
            if (dialog) {
                dialog.close();
            }
        });
    });
}

/** Wires the fullscreen toggle button. */
function wireFullscreen() {
    document.getElementById('fullscreen-button').addEventListener('click', toggleFullscreen);
}

/** Toggles between fullscreen and windowed mode using the Fullscreen API. */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
        return;
    }
    document.exitFullscreen?.();
}

/** Wires the mute toggle button and reflects the persisted sound state. */
function wireMuteButton() {
    const muteButton = document.getElementById('mute-button');
    updateMuteButton();
    muteButton.addEventListener('click', () => {
        soundManager.toggleMuted();
        updateMuteButton();
    });
}

/** Updates the mute button icon and accessible label. */
function updateMuteButton() {
    const muteButton = document.getElementById('mute-button');
    const isMuted = soundManager.isMuted();
    muteButton.textContent = isMuted ? '×' : '♪';
    muteButton.setAttribute('aria-label', isMuted ? 'Ton einschalten' : 'Ton ausschalten');
}

/** Wires all mobile touch buttons to set keyboard flags via touchstart/touchend. */
function wireTouchControls() {
    document.querySelectorAll('.touch-button').forEach(setupTouchButton);
}

/** Wires one touch button to its keyboard flag. */
function setupTouchButton(button) {
    const key = button.dataset.key;
    button.addEventListener('pointerdown', (event) => handlePointerKey(event, key, true));
    button.addEventListener('pointerup', (event) => handlePointerKey(event, key, false));
    button.addEventListener('pointerleave', () => setKey(key, false));
    button.addEventListener('pointercancel', () => setKey(key, false));
    button.addEventListener('contextmenu', (event) => event.preventDefault());
}

/** Prevents browser touch behavior and updates a keyboard flag. */
function handlePointerKey(event, key, value) {
    event.preventDefault();
    if (value) {
        event.currentTarget.setPointerCapture?.(event.pointerId);
    } else {
        event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    setKey(key, value);
}

/**
 * Sets a keyboard flag to the given value.
 * @param {string} key - Keyboard property name (e.g. 'LEFT', 'SPACE').
 * @param {boolean} value - Whether the key is pressed.
 */
function setKey(key, value) {
    if (!keyboard) {
        return;
    }
    keyboard[key] = value;
}

const KEY_MAP = {
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
    32: 'SPACE',
    68: 'D'
};

/** Returns whether keyboard input should currently affect the game. */
function canHandleKeyboardInput() {
    return world && !world.isGameOver && !world.isGameWon;
}

/** Updates a mapped keyboard flag for a key event. */
function handleKeyboardEvent(event, value) {
    if (!canHandleKeyboardInput()) {
        return;
    }
    const key = KEY_MAP[event.keyCode];
    if (key) {
        setKey(key, value);
    }
}

window.addEventListener("keydown", (event) => handleKeyboardEvent(event, true));
window.addEventListener("keyup", (event) => handleKeyboardEvent(event, false));
