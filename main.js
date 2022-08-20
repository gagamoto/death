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

/** Draw a centered box */
function drawCenteredBox(context, x, y, width, height, fillStyle = null, strokeStyle = null, strokeWidth = 0) {
    drawBox(context, x - width / 2, y - height / 2, width, height, fillStyle, strokeStyle, strokeWidth);
}

class GameObject {
    constructor(context, x, y, width, height) {
        this.uid = String(Math.random()); // unique identifier
        console.log("New GameObject with unique identifier " + this.uid)
        this.context = context;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    // TODO VIRTUAL DRAW METHOD
}

class Platform extends GameObject {
    draw() {
        drawBox(this.context, this.x, this.y, this.width, this.height, "black");
    };
}

class GravityGameObject extends GameObject{
    GRAVITY = 1;
    constructor(context, x, y, width, height, mass = 1) {
        super(context, x, y, width, height);
        this.mass = mass;
        this.groundedOnPlatform = null; // FIXME BOOLEAN?
    }
    // TODO VIRTUAL DRAW METHOD
    move() {
        this.y += this.mass * this.GRAVITY;
        if (this.y > REFERENCE_SIZE) {
            this.death();
        }
    }
}

class MainCharacter extends GravityGameObject {
    death() {
        console.log("Death!"); // FIXME
        this.x = Math.floor(Math.random() * REFERENCE_SIZE); // FIXME STARTING POINT AS ARGUMENT
        this.y = 0;
    }
    draw() {
        drawCenteredBox(this.context, this.x, this.y, this.width, this.height, "black");
    };
    move() {
        super.move();
        if (this.groundedOnPlatform != null) {
            this.x += .5; // this.speed
        }
    }
}

REFERENCE_SIZE = 100;
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        let factor = this.canvas.width / REFERENCE_SIZE;
        this.context.scale(factor, factor);

        this.pc = null; // Playable Character
        this.npcs = null; // Non Playable Characters
        this.platforms = null;
        this.targetZone = null;
    }
    draw() {
        this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);
        drawBox(this.context, 0, 0, REFERENCE_SIZE, REFERENCE_SIZE, "white"); // FIXME REMOVE
        // FIXME DRAW PLATFORM METHOD
        for (let platform of this.platforms) {
            platform.draw();
        }
        this.pc.draw();
    }
    handleCollision() {
        // PLAYABLE CHARACTER AGAINST PLATFORMS
        let isGrounded = false;
        for (let platform of this.platforms) {
            // FIXME COLLISION METHOD BETWEEN TWO OBJECTS
            // FIXME LEFT/RIGHT/TOP/BOTTOM PROPERTY
            if (this.pc.x >= platform.x &&
                this.pc.x <= platform.x + platform.width) {
                    console.log(platform.uid);
                    if (this.pc.y + this.pc.width / 2 >= platform.y) {
                        this.pc.groundedOnPlatform = platform.uid;
                        isGrounded = true;
                        this.pc.y = platform.y - this.pc.width / 2; // FIXME METHOD/PROPERTY HALF WIDH
                    }
                    // FIXME TOP FOR JUMPS
            }
        }
        if (!isGrounded) {
            this.pc.groundedOnPlatform = null;
        }
        if (this.pc.x >= this.targetZone.x &&
            this.pc.x <= this.targetZone.x + this.targetZone.width) {
                if (this.pc.y + this.pc.width / 2 >= this.targetZone.y) {
                    this.win();
                }
                // FIXME TOP FOR JUMPS
        }
    }
    initialize() {
        this.platforms = new Array();
        // LEVEL 1
        this.targetZone = new GameObject(null, 100, 50, 20, 20);
        this.platforms.push(
            new Platform(this.context, 20, 60, 20, 20),
            new Platform(this.context, 40, 70, 20, 20),
            new Platform(this.context, 60, 70, 20, 20),
            new Platform(this.context, 80, 70, 20, 20));
        this.pc = new MainCharacter(this.context, 30, 20, 10, 10, 2);
    }
    run() {
        // console.log(Date.now()); // DEBUG
        // this.step += 1;

        // ENGINE
        // MOVE PLAYABLE CHARACTER
        this.pc.move()
        this.handleCollision();

        // DRAW
        this.draw();
        requestAnimationFrame(() => this.run());
    }
    win() {
        // FIXME GO TO NEXT LEVEL
        this.pc.death();
    }
}

async function main() {
    console.log("Hello, Death!")

    let myCanvas = document.createElement("canvas");
    let windowInnerHeight = window.innerHeight;
    let windowInnerWidth = window.innerWidth;
    let smallerWindowInnerSize = Math.min(windowInnerHeight, windowInnerWidth);
    myCanvas.height = smallerWindowInnerSize;
    myCanvas.width = smallerWindowInnerSize;
    document.body.appendChild(myCanvas);

    let game = new Game(myCanvas);
    game.initialize();
    game.run();

    console.log("Bye, Death!")
}

main();

// window_innerHeight = 627
// window_innerWidth = 1278

// MAJOR FIXME
// * ADD FAVICON
// MINOR FIXME
