let canvas;
let world;
let keyboard = new Keyboard();
let hasGameStarted = false;
let startScreenImage = new Image();


function init() {
    canvas = document.getElementById('canvas');
    startScreenImage.src = 'img/9_intro_outro_screens/start/startscreen_1.png';

    if (startScreenImage.complete) {
        drawStartScreen();
    } else {
        startScreenImage.onload = drawStartScreen;
    }
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
    if (hasGameStarted) {
        window.location.reload();
        return;
    }

    hasGameStarted = true;
    world = new World(canvas, keyboard);
    console.log('My Character is', world.character);
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
})
