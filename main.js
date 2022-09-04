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

REFERENCE_SIZE = 100;

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        let factor = this.canvas.width / REFERENCE_SIZE;
        this.context.scale(factor, factor);
    }
    draw() {
        this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);
        drawBox(this.context, 0, 0, REFERENCE_SIZE, REFERENCE_SIZE, "yellow"); // FIXME REMOVE

        // TMP DRAW A GRID
        let gridWidth = 15;
        let gridHeight = 15;
        let myGrid = generateGrid(gridWidth, gridHeight);
        let boxWidth = REFERENCE_SIZE / gridWidth;

        for (let i = 0; i < gridWidth; i++) {
            for (let j = 0; j < gridHeight; j++) {
                drawBox(this.context, i*boxWidth, j*boxWidth, boxWidth, boxWidth, null, "blue", 1);
            }
        }
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
    game.draw();
    console.log("Bye, Death!")
}

main();