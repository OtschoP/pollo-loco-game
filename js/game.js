/** @type {HTMLCanvasElement} */
let canvas;
/** @type {World} */
let world;
/** Shared keyboard input state. */
let keyboard = new Keyboard();
/** Whether the game has been started (prevents re-entry). */
let hasGameStarted = false;
/** Start screen background image. */
let startScreenImage = new Image();
/** Interval ID for the endscreen watcher. */
let endscreenWatcherId = null;


/** Entry point: sets up the canvas, start screen, UI, and touch controls. */
function init() {
    canvas = document.getElementById('canvas');
    startScreenImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';

    if (startScreenImage.complete) {
        drawStartScreen();
    } else {
        startScreenImage.onload = drawStartScreen;
    }

    wireUi();
    wireTouchControls();
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
    hideStartButton();
    world = new World(canvas, keyboard);
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
    hasGameStarted = false;
    showStartButton();
    drawStartScreen();
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

/** Wires all mobile touch buttons to set keyboard flags via touchstart/touchend. */
function wireTouchControls() {
    document.querySelectorAll('.touch-button').forEach((button) => {
        const key = button.dataset.key;

        button.addEventListener('touchstart', (event) => {
            event.preventDefault();
            setKey(key, true);
        }, { passive: false });

        button.addEventListener('touchend', (event) => {
            event.preventDefault();
            setKey(key, false);
        });

        button.addEventListener('touchcancel', () => setKey(key, false));

        button.addEventListener('contextmenu', (event) => event.preventDefault());
    });
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

window.addEventListener("keydown", (e) => {
    if (!world) {
        return;
    }

    if (world && (world.isGameOver || world.isGameWon)) {
        return;
    }

    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if(e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if(e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if(e.keyCode == 38) {
        keyboard.UP = true;
    }
    if(e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if(e.keyCode == 68) {
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (!world) {
        return;
    }

    if (world && (world.isGameOver || world.isGameWon)) {
        return;
    }

    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if(e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if(e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if(e.keyCode == 38) {
        keyboard.UP = false;
    }
    if(e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if(e.keyCode == 68) {
        keyboard.D = false;
    }
});
