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
/** Draw a circle */
function drawCircle(context = null, x = 0, y = 0, radius = 0, fillStyle = null, strokeStyle = null, strokeWidth = 1) {
    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
    context.lineWidth = strokeWidth;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    if (strokeStyle != null) { context.stroke(); }
    if (fillStyle != null) { context.fill(); }
    context.closePath();
}
/** Draw a bottom of a circle */
function drawBottomCircle(context = null, x = 0, y = 0, radius = 0, fillStyle = null, strokeStyle = null, strokeWidth = 1) {
    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
    context.lineWidth = strokeWidth;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI, false);
    if (strokeStyle != null) { context.stroke(); }
    if (fillStyle != null) { context.fill(); }
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
        console.debug("New GameObject with pseudo-unique identifier " + this.uid)
        this.context = context;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.bounceCount = null;
    }
    draw() {
        drawBox(
            this.context,
            this.x, this.y,
            this.width, this.height,
            null, "magenta", .5); // FIXME
    }
    getLeft() { return this.x; }
    getRight() { return this.x + this.width; }
    getTop() { return this.y; }
    getBottom() { return this.y + this.height; }
    getCenter() { return this.x + this.width / 2; }
}
class Target extends GameObject {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.bounceCount = 0;
        this.owner = null;
    }
    draw() {
        const MAX_BOUNCE_FRAMES = 60;
        this.bounceCount++ ;
        this.bounceCount = this.bounceCount%MAX_BOUNCE_FRAMES;
        let bounce = this.bounceCount/MAX_BOUNCE_FRAMES;
        let margin = this.width * .1;
        let thickness = this.width / 4;
        drawCircle(this.context,
            this.x + this.width / 2,
            this.y + this.height / 2 + Math.sin(bounce*Math.PI*2) * .5,
            this.width / 2 - thickness / 2 - margin,
            null, ALT_WHITE, thickness);
        drawCircle(this.context,
            this.x + this.width / 2,
            this.y + this.height / 2 + Math.sin(bounce*Math.PI*2) * .5,
            this.width / 2 - thickness / 2 - margin,
            null, ALT_RED, thickness * .8);
        if (DEBUG_MODE_GRAPHIC) { super.draw(); }

    }
}
class Platform extends GameObject {
    static MAX_POP_FRAMES = 20;
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.dead = false;
        // FIXME INITIALIZE TRIGGERED MEMBER
        this.color = ALT_WHITE;
        this.borderColor = null;
    }
    bounce() {
        const MAX_BOUNCE_FRAMES = 10;
        if (this.bounceCount == null) {this.bounceCount = 0;}
        if (this.bounceCount < 1) {
            this.bounceCount += 1 / MAX_BOUNCE_FRAMES;
        } else {this.bounceCount = 1;} // MAX
    }
    draw() {
        let thickness = .3;
        let bounce = 0;
        if (this.bounceCount != null) {
            bounce = Math.sin(this.bounceCount*Math.PI) * .5;
        }
        if (!this.dead) {
            drawBox(
                this.context,
                this.x + thickness,
                this.y + thickness + bounce,
                this.width - thickness*2, this.height - thickness*2,
                this.color);
        }
        else if (this.popCountDown > 0) {
                this.popCountDown--;
                let step = Platform.MAX_POP_FRAMES - this.popCountDown;
                let size = step / this.width;
                // console.log(size);

                let thickness = .1;
                drawCircle(this.context,
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    size,
                    null, this.color, thickness);

        }
        if (DEBUG_MODE_GRAPHIC) { super.draw(); }
    }
    release() {
        this.dead = true;
        this.popCountDown = Platform.MAX_POP_FRAMES;
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

        this.maxRunningSpeed = .8;
    }
    draw() {
        if (false) {}
        else { // DEFAULT STATE
            // BODY
            drawBox(this.context, this.x, this.y, this.width, this.height*.8, ALT_WHITE);
            // EYES
            let eyeHeight = this.y + this.height * .4;
            // drawCircle
            // -- LEFT EYE
            drawCircle(this.context,
                this.x + this.width / 2,
                eyeHeight,
                .5, ALT_BLACK, null, null);
            // drawBox(this.context,
            //     this.x + this.width / 2,
            //     eyeHeight,
            //     this.width * .1, this.height * .1, ALT_BLACK);
            // -- RIGHT EYE
            drawCircle(this.context,
                this.x + this.width / 2 + this.width * .3,
                eyeHeight,
                .5, ALT_BLACK, null, null);
            // drawBox(this.context,
            //     this.x + this.width / 2 + this.width / 4,
            //     eyeHeight,
            //     this.width * .1, this.height * .1, ALT_BLACK);
            // // MOUSTACHE
            // let moustacheRadius = this.width * .15;
            // let moustacheThickness = .3;
            // drawBottomCircle(this.context,
            //     this.x + this.width / 2, this.y + this.height / 2,
            //     moustacheRadius, null, ALT_BLACK, moustacheThickness);
            // drawBottomCircle(this.context,
            //     this.x + this.width / 2 + 2 * moustacheRadius, this.y + this.height / 2,
            //     moustacheRadius, null, ALT_BLACK, moustacheThickness);
        }
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
const GAME_STATE = { // USEFUL KEYS, IGNORE VALUES.
    INITIALIZATION: "INITIALIZATION",
    INITIALIZED: "INITIALIZED",
    PLAYING: "PLAYING",
    DEFAULT: "DEFAULT"
};
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        let factor = this.canvas.width / REFERENCE_SIZE;
        this.context.scale(factor, factor);

        this.state = GAME_STATE.INITIALIZATION;
        this.level = null;
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
            if (this.character.getCenter() > platform.getLeft() &&
                this.character.getCenter() < platform.getRight()) {
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
                    platform.bounce();
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
                this.endGameCycle();
        }

        if (DEBUG_MODE_CONTROL == true) {
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
    cancelControls() {for (const key in gControls) {delete gControls[key];}}
    control() {
        // FIXME CONCURENCY
        if (gControls["ArrowLeft"] == true) {
            console.log("Left pressed!");
            if (this.state == GAME_STATE.INITIALIZED) {this.setState(GAME_STATE.PLAYING);}
            this.character.dx = -this.character.maxRunningSpeed; // FIXME
        }
        if (gControls["ArrowRight"] == true) {
            console.log("Rigth pressed!");
            if (this.state == GAME_STATE.INITIALIZED) {this.setState(GAME_STATE.PLAYING);}
            this.character.dx = this.character.maxRunningSpeed; // FIXME
        }
    }
    drawLevel() {
        this.context.font = "6px Arial";
        this.context.fillStyle = ALT_WHITE;
        this.context.textAlign = "center";
        this.context.fillText("LEVEL "+ this.level, REFERENCE_SIZE / 2, REFERENCE_SIZE * .2);
    }
    drawVersion() {
        this.context.font = "4px Times";
        this.context.fillStyle = ALT_RED;
        this.context.textAlign = "left";
        this.context.fillText("version 0.c (sept. 9 12:33) ", 0, 4);
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
        if (this.state == GAME_STATE.INITIALIZATION ||
            this.state == GAME_STATE.INITIALIZED) {
            this.drawLevel();
        }
        this.drawVersion() // FIXME REMOVE
    }
    generateGrid() {
        let grid = new Array(this.gridWidth);
        for (let i = 0; i < this.gridWidth; i++) {
            grid[i] = new Array(this.gridHeight);
            for (let j = 0; j < this.gridHeight; j++) {
                if (true) { // (this.level == 1) {
                    // -- LEVEL 1
                    // FIXME PSEUDO READ GRID
                    grid[i][j] = Boolean((j) % 2);
                    if (j < 3) {
                        grid[i][j] = false;
                    }
                }
                // else {
                //     grid[i][j] = Boolean((j) % 2);
                //     if (grid[i][j] == true) {
                //         grid[i][j] = Boolean(Math.round(Math.random() - this.level/100)); // Random grid
                //     }
                //     if (j < 3) {
                //         grid[i][j] = false;
                //     }
                // }
            }
        }
        console.debug(grid);
        this.grid = grid;
    }
    initialize() {
        if (this.level == null) {
            this.level = 1;
        } else {this.level += 1;}

        console.log("Level "+ this.level); // FIXME DEBUG
        this.generateGrid(this.gridWidth, this.gridHeight);

        // Construct platforms
        this.platforms = new Array();
        for (let i = 0; i < this.gridWidth; i++) {
            for (let j = 0; j < this.gridHeight; j++) {
                if (!this.grid[i][j]) { continue; }
                this.platforms.push(
                    new Platform(
                        this.context,
                        i * this.blockWidth,
                        j * this.blockHeight,
                        this.blockWidth,
                        this.blockHeight));
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
        this.setState(GAME_STATE.INITIALIZED)
    }
    run() {
        if (this.state == GAME_STATE.INITIALIZATION) {
            console.log("Hello! Initialize!"); // FIXME REMOVE
            this.initialize();
        }
        this.collisions();
        this.character.move();
        this.control();
        this.draw();
        requestAnimationFrame(() => this.run());
    }
    setState(state) {
        this.state = state;
    }
    endGameCycle() {
        console.debug("Enter Death!");
        this.cancelControls(); // FIXME
        this.setState(GAME_STATE.INITIALIZATION);
    }
    // FIXME MAKE CONTROLLER CLASS
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
    console.debug("Key down: " + e.key);
    gControls[e.key] = true;
}

function keyUpHandler(e) {
    console.debug("Key up: " + e.key);
    gControls[e.key] = false;
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