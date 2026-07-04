let canvas;
let world;
let keyboard = new Keyboard();
let hasGameStarted = false;
let startScreenImage = new Image();
let endscreenWatcherId = null;


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

function drawStartScreen() {
    if (!canvas || hasGameStarted) {
        return;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
}

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

function hideStartButton() {
    document.getElementById('start-button').hidden = true;
}

function showStartButton() {
    const button = document.getElementById('start-button');
    button.hidden = false;
    button.blur();
}

function restartGame() {
    hideEndscreen();
    if (world) {
        world.reset();
    }
}

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

function showEndscreen() {
    document.getElementById('endscreen').hidden = false;
}

function hideEndscreen() {
    document.getElementById('endscreen').hidden = true;
}

function wireUi() {
    document.getElementById('restart-button').addEventListener('click', restartGame);
    document.getElementById('home-button').addEventListener('click', backToHome);

    wireDialog('help-button', 'help-dialog');
    wireDialog('impressum-button', 'impressum-dialog');
    wireDialogCloseOnBackdrop();
    wireFullscreen();
}

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

function wireFullscreen() {
    document.getElementById('fullscreen-button').addEventListener('click', toggleFullscreen);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
        return;
    }
    document.exitFullscreen?.();
}

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
