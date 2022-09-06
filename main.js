// Death
// MIT License - Copyright 2022 Antoine Dricot
// A dumb game.

/** Draw a box */
function drawBox(context, x, y, width, height, fillStyle = null, strokeStyle = null, strokeWidth = 0) {
    context.beginPath();

    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
    context.lineWidth = strokeWidth;

    context.rect(x, y, width, height);
    if (strokeStyle) { context.stroke(); }
    if (fillStyle) { context.fill(); }
    context.closePath();
}

DEBUG_MODE = false;
DEBUG_MODE_GRAPHIC = false || DEBUG_MODE; // DRAW BOX
DEBUG_MODE_CONTROL = true || DEBUG_MODE;
REFERENCE_SIZE = 100;

ALT_BLACK = "black";
ALT_WHITE = "white";
ALT_RED = "red";

class GameObject {
    constructor(context, x, y, width, height) {
        this.uid = String(Math.random()).substring(2); // unique identifier
        console.log("New GameObject with pseudo-unique identifier " + this.uid)
        this.context = context;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw() {
        drawBox(
            this.context,
            this.x, this.y,
            this.width, this.height,
            null, "magenta", .5); // FIXME
    }
    getLeft(margin = 0) { return this.x; }
    getRight(margin = 0) { return this.x + this.width; }
    getTop(margin = 0) { return this.y; }
    getBottom(margin = 0) { return this.y + this.height; }
    getCenter() {
        console.error("Not implemented yet!");
        return null;
    }
}
class Target extends GameObject {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.owner = null;
    }
    draw() {
        drawBox(
            this.context,
            this.x, this.y,
            this.width, this.height,
            "red", "white", 1); // FIXME
    }
}
class Platform extends GameObject {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.dead = false;
        // FIXME INITIALIZE TRIGGERED MEMBER IF NEEDED

        this.color = ALT_WHITE; // FIXME
        this.borderColor = ALT_BLACK; // FIXME
    }
    draw() {
        if (!this.dead) {
            drawBox(
                this.context,
                this.x, this.y, this.width, this.height,
                this.color,
                this.borderColor, .5); // FIXME
        }
        if (DEBUG_MODE_GRAPHIC) { super.draw(); }
    }
    release() {
        this.dead = true;
        if (false) {
            // FIXME INITIALIZE COUNTDOWN?
        }
        else {
            // FIXME DECREMENT COUNTDOWN?
        }
    }
    trigger() {
        this.triggered = true;
    }
}

class MainCharacter extends GameObject {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.dx = 0;
        this.dy = 1; // FIXME GRAVITY!
    }
    isFalling() {
        return (this.platformUid == null);
    }
    move() {
        // FIXME DECELERATE IF NOT GROUNDED
        this.x += this.dx; // FIXME TIMES SPEED
        if (this.isFalling()) {
            this.y += this.dy;
        }
    }
    turnBack() {
        this.dx = -this.dx;
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        let factor = this.canvas.width / REFERENCE_SIZE;
        this.context.scale(factor, factor);

        this.grid = null;
        this.gridWidth = 12;
        this.blockWidth = REFERENCE_SIZE / this.gridWidth; // Platforms
        this.gridHeight = this.gridWidth; // Square
        this.blockHeight = REFERENCE_SIZE / this.gridHeight;

        this.character = null;
        this.target = null;
    }
    collisions() {
        // Is character grounded on a platform?
        // formerPlatformUid = this.character.platformUid; // FIXME DECLARE
        this.character.platformUid = null;
        for (let platform of this.platforms) {
            if (platform.dead) {
                // console.log("ignored!");
                continue;
            }
            let platformTriggered = platform.triggered;
            // FIXME METHOD A AND B HORIZONTALLY ALIGNED?
            if (this.character.getRight() > platform.getLeft() &&
                this.character.getLeft() < platform.getRight()) {
                if (DEBUG_MODE_GRAPHIC) {
                    platform.borderColor = "cyan";
                }
                // FIXME METHOD A AND B VERTICALLY ALIGNED?
                if (this.character.getBottom() >= platform.getTop() &&
                    this.character.getBottom() < platform.getBottom()) {
                    if (DEBUG_MODE_GRAPHIC) {
                        platform.borderColor = "blue";
                    }
                    // FIXME CHARACTER GROUNDED METHOD
                    this.character.platformUid = platform.uid;
                    this.character.y = platform.getTop() - this.character.height;
                    platform.trigger();
                }
            }
            // FIXME REMOVE, USE RESET
            else if (DEBUG_MODE_GRAPHIC) {platform.borderColor = "magenta";}
            if (platformTriggered &&
                this.character.platformUid != platform.uid) {
                platform.release();
            }
        }
        // Is character within the target?
        // FIXME JUST TOUCH, GO INSIDE, OR GO THROUGH?
        // FIXME MARGIN
        if (this.character.getRight() > this.target.getLeft() &&
            this.character.getLeft() < this.target.getRight() &&
            this.character.getBottom() <= this.target.getBottom() &&
            this.character.getTop() > this.target.getTop()) {
                this.toggleGame();
        }

        if (DEBUG_MODE_CONTROL) {
            if (this.character.getRight() > REFERENCE_SIZE) {
                this.character.turnBack();
            }
            else if (this.character.getLeft() < 0) {
                this.character.turnBack();
            }
            if (this.character.getBottom() >= REFERENCE_SIZE) {
                this.character.platformUid = "debug_bottom"
                this.character.y = REFERENCE_SIZE - this.character.height;
            }
        }
    }
    control() {
        // FIXME CONCURENCY
        if (gControls["ArrowLeft"]) {
            console.log("Left pressed!");
            this.character.dx = -1; // FIXME
        }
        if (gControls["ArrowRight"]) {
            console.log("Rigth pressed!");
            this.character.dx = 1; // FIXME
        }
    }
    draw() {
        this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);

        // -- Background
        drawBox(
            this.context,
            0, 0, REFERENCE_SIZE, REFERENCE_SIZE,
            "black"); // FIXME SWITCHABLE
        if (DEBUG_MODE_GRAPHIC) {
            drawBox(
                this.context,
                0, 0, REFERENCE_SIZE, REFERENCE_SIZE,
                "yellow");
        }

        // DRAW PLATFORMS
        for (let platform of this.platforms) {
            platform.draw();
        }
        // DRAW ITEM
        this.target.draw();
        // DRAW MAIN CHARACTER
        this.character.draw();
    }
    initialize() {
        this.toggled = false;

        // FIXME REMOVE LOCAL VAR BELOW
        let gridWidth = this.gridWidth;
        let blockWidth = this.blockWidth;
        let gridHeight = this.gridHeight;
        let blockHeight = this.blockHeight;

        this.grid = generateGrid(gridWidth, gridHeight);

        // Construct platforms
        this.platforms = new Array();
        for (let i = 0; i < gridWidth; i++) {
            for (let j = 0; j < gridHeight; j++) {
                if (!this.grid[i][j]) { continue; }
                this.platforms.push(
                    new Platform(
                        this.context,
                        i * blockWidth,
                        j * blockHeight,
                        blockWidth,
                        blockHeight));
            }
        }
        // Construct main character
        this.character = new MainCharacter(
            this.context, 20, 10, 5, 5); // FIXME VALUES?

        // Set item
        this.target = new Target(
            this.context,
            3*this.blockWidth, 8*this.blockHeight,
            this.blockWidth, this.blockHeight);
    }
    run() {
        this.control();
        this.collisions();
        this.character.move();
        this.draw();
        requestAnimationFrame(() => this.run());
    }
    toggleGame() {
        console.debug("Enter Death!");
        this.character.dx = 0;
    }
    // FIXME MAKE CONTROLLER CLASS
}

function generateGrid(gridWidth, gridHeight) {
    grid = new Array(gridWidth);
    for (let i = 0; i < gridWidth; i++) {
        this.grid[i] = new Array(gridHeight);
        for (let j = 0; j < gridHeight; j++) {
            // this.grid[i][j] = Boolean(Math.round(Math.random()-.1)); // Random grid
            this.grid[i][j] = Boolean((j) % 2); // Horizontal lines
            if (j < 3) {
                this.grid[i][j] = false;
            }
        }
    }
    console.debug(grid);
    return grid;
}

function initializeCanvas() {
    let myCanvas = document.createElement("canvas");
    let windowInnerHeight = window.innerHeight;
    let windowInnerWidth = window.innerWidth;
    let smallerWindowInnerSize = Math.min(windowInnerHeight, windowInnerWidth); // FIT SQUARE
    myCanvas.height = smallerWindowInnerSize;
    myCanvas.width = smallerWindowInnerSize;
    document.body.appendChild(myCanvas);
    return myCanvas;
}

gControls = new Object(); // FIXME NOT GLOBAL

function keyDownHandler(e) {
    console.log("Key down: " + e.key);
    gControls[e.key] = true;
    console.log(gControls); // FIXME REMOVE
}

function keyUpHandler(e) {
    console.log("Key up: " + e.key);
    gControls[e.key] = false;
    console.log(gControls); // FIXME REMOVE
}

function touchDownHandler(e) {
    e.preventDefault();
    console.log(e);
    console.log(e.changedTouches[0]);
    if (e.changedTouches[0].clientX >= window.innerWidth / 2) {
        keyDownHandler({"key": "ArrowRight"});
    }
    else { keyDownHandler({"key": "ArrowLeft"});}
}

function touchUpHandler(e) {
    e.preventDefault();
    console.log(e);
    if (e.changedTouches[0].clientX >= window.innerWidth / 2) {
        keyUpHandler({"key": "ArrowRight"});
    }
    else { keyUpHandler({"key": "ArrowLeft"});}
}

function main() {
    console.log("Hello, Death!")
    // -- Canvas
    myCanvas = initializeCanvas();
    let game = new Game(myCanvas);
    game.initialize();
    game.run();
    // -- Control
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("touchstart", touchDownHandler, false);
    document.addEventListener("touchend", touchUpHandler, false);
    // --
    console.log("Bye, Death!")
}

main();