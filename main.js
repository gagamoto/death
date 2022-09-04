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

DEBUG_MODE = true; // DRAW BOX
REFERENCE_SIZE = 100;

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
    draw(){
        drawBox(
            this.context,
            this.x, this.y,
            this.width, this.height,
            null, "magenta", .5); // FIXME
    }
    getLeft(margin=0) {return this.x;}
    getRight(margin=0) {return this.x + this.width;}
    getTop(margin=0) {return this.y;}
    getBottom(margin=0) {return this.y + this.height;}
    getCenter() {
        console.error("Not implemented yet!");
        return null;
    }
}

class Platform extends GameObject {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.dead = false;

        this.color = "black"; // FIXME
    }
    draw(){
        drawBox(
            this.context, this.x, this.y, this.width, this.height, this.color); // FIXME
            if (DEBUG_MODE) {super.draw();}
        }
}

class MainCharacter extends GameObject {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.dx = 1; // FIXME
        this.dy = 1; // FIXME
        this.falling = true;
    }
    move() {
        // FIXME DECELERATE IF NOT GROUNDED
        this.x += this.dx; // FIXME TIMES SPEED
        if (this.falling) {
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
        this.character = null;
    }
    collisions() {
        if (DEBUG_MODE) {
            if (this.character.getRight() > REFERENCE_SIZE) {
                this.character.turnBack();
            }
            else if (this.character.getLeft() < 0) {
                this.character.turnBack();
            }
            if (this.character.getBottom() >= REFERENCE_SIZE) {
                this.character.falling = false;
            }
        }
        // Is character grounded on a platform?
        for (let platform of this.platforms) {
            // FIXME METHOD A AND B HORIZONTALLY ALIGNED?
            if (this.character.getRight() > platform.getLeft() &&
                this.character.getLeft() < platform.getRight()) {
                platform.color = "cyan"; // FIXME REMOVE
                // FIXME METHOD A AND B HORIZONTALLY ALIGNED?
                if (this.character.getBottom() >= platform.getTop() &&
                    this.character.getBottom() < platform.getBottom()) {
                    platform.color = "blue"; // FIXME REMOVE
                }
            }
            else {
                platform.color = "black"; // FIXME REMOVE
            }
        }
    }
    draw() {
        this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);
        drawBox(this.context, 0, 0, REFERENCE_SIZE, REFERENCE_SIZE, "yellow"); // FIXME REMOVE

        // DRAW PLATFORMS
        for (let platform of this.platforms) {
            platform.draw();
        }
        // DRAW MAIN CHARACTER
        this.character.draw();

    }
    initialize() {
        let gridWidth = 15;
        let blockWidth = REFERENCE_SIZE / gridWidth;
        let gridHeight = 15;
        let blockHeight = REFERENCE_SIZE / gridHeight;

        this.grid = generateGrid(gridWidth, gridHeight);

        // Construct platforms
        this.platforms = new Array();
        for (let i = 0; i < gridWidth ; i++) {
            for (let j = 0; j < gridHeight; j++) {
                if (!this.grid[i][j]) {continue;}
                this.platforms.push(
                    new Platform(
                        this.context,
                        i*blockWidth,
                        j*blockHeight,
                        blockWidth,
                        blockHeight));
           }
        }
        // Construct main character
        this.character = new MainCharacter(
            this.context, 20, 10, 6, 6); // FIXME VALUES?
    }
    run() {
        this.character.move();
        this.collisions();
        this.draw();
        requestAnimationFrame(() => this.run());
    }
}

function generateGrid(gridWidth, gridHeight) {
    grid = new Array(gridWidth);
    for (let i = 0; i < gridWidth; i++) {
        this.grid[i] = new Array(gridHeight);
        for (let j = 0; j < gridHeight; j++) {
            // this.grid[i][j] = Boolean(Math.round(Math.random()-.1)); // Random grid
            this.grid[i][j] = Boolean((j)%2); // Horizontal lines
            if (j<3) {
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

function main() {
    // -- Canvas
    console.log("Hello, Death!")
    myCanvas = initializeCanvas();
    let game = new Game(myCanvas);
    game.initialize();
    game.run();
    console.log("Bye, Death!")
}

main();