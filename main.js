// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

// This is a tiny build of zzfx with only a zzfx function to play sounds.
// You can use zzfxV to set volume.
// Feel free to minify it further for your own needs!

'use strict';let zzfx,zzfxV,zzfxX
// ZzFXMicro - Zuper Zmall Zound Zynth - v1.1.8 ~ 884 bytes minified
zzfxV=.4    // volume
zzfx=       // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0)=>{let
M=Math,R=44100,d=2*M.PI,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,g=0,H=0,a=0,n=1,I=0
,J=0,f=0,x,h;e=R*e+9;m*=R;r*=R;t*=R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;for(h=e+m+
r+t+c|0;a<h;k[a++]=f)++J%(100*F|0)||(f=q?1<q?2<q?3<q?M.sin((g%d)**3):M.max(M.min(M.tan(g),1)
,-1):1-(2*g/d%2+2)%2:1-4*M.abs(M.round(g/d)-g/d):M.sin(g),f=(l?1-B+B*M.sin(d*a/l):1)*(0<f?1:
-1)*M.abs(f)**D*p*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/
2+(c>a?0:(a<h-c?1:(h-a)/c)*k[a-c|0]/2):f),x=(b+=u+=y)*M.cos(A*H++),g+=x-x*E*(1-1E9*(M.sin(a)
+1)%2),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.createBuffer(1,h,R);p.
getChannelData(0).set(k);b=zzfxX.createBufferSource();b.buffer=p;b.connect(zzfxX.destination
);b.start();return b};zzfxX=new (window.AudioContext||webkitAudioContext) // audio context

// Death
// MIT License - Copyright 2022 Antoine Dricot
// A dumb game.

/** Draw a line */
function drawLine(context, ax, ay, bx, by, color, width) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = width;
    context.moveTo(ax, ay);
    context.lineTo(bx, by);
    context.stroke();
    context.closePath();
}

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

let DEBUG_MODE = false;
let DEBUG_MODE_GRAPHIC = false || DEBUG_MODE; // DRAW BOX
let REFERENCE_SIZE = 100;

let ALT_BLACK = "black";
let ALT_WHITE = "white";
let ALT_RED = "red";
let ALT_YELLOW = "yellow";

let SOUND_TARGET = [1.5,1,319,.03,.28,.48,1,.61,,.4,-233,.05,.11,.1,,,.07,.59,.16,.43]; // Powerup 186
let SOUND_POP = [5.25,,378,,.02,.02,3,2.6,,,-338,,,,120,,,.78,.01,.05];
let SOUND_NOPE = [.5,,37,,.05,.08,3,.92,,.1,,-0.01,.08,,-1,,.24,.97,.05]; // Shoot 199 - Mutation 2

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
    getMiddle() { return this.y + this.height / 2; }
    centerIsAlignedTo(anotherGameObject) {
        return this.getCenter() > anotherGameObject.getLeft() && this.getCenter() < anotherGameObject.getRight();
    }
    middleIsAlignedTo(anotherGameObject) {
        return this.getMiddle() > anotherGameObject.getTop() && this.getMiddle() < anotherGameObject.getBottom();
    }
    isAlignedto(anotherGameObject) {
        return this.centerIsAlignedTo(anotherGameObject) && this.middleIsAlignedTo(anotherGameObject);
    }
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
        let thickness = this.width / 6;
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
    // static MAX_POP_FRAMES = 20;
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.dead = false;
        // FIXME INITIALIZE TRIGGERED MEMBER
        this.color = ALT_WHITE;
        this.borderColor = null;
        this.MAX_POP_FRAMES = 20;
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
                let step = this.MAX_POP_FRAMES - this.popCountDown;
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
        zzfx(...SOUND_POP);
        this.dead = true;
        this.popCountDown = this.MAX_POP_FRAMES;
    }
    trigger() {
        this.triggered = true;
    }
}
let ANIMATIONS = {
    IDLE: "Idle",
    RUNNING_RIGHT: "Running right",
    RUNNING_LEFT: "Running left"
}
class MainCharacter extends GameObject {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.dx = 0;
        this.dy = 1; // FIXME GRAVITY!

        this.maxRunningSpeed = .8;
        this.animation = ANIMATIONS.IDLE;
        this.animation_step = 0;
    }
    draw() {
        let FRAMES = 2;
        this.animation_step += .1;
        this.animation_step = this.animation_step%FRAMES;
        if (this.dx > 0) {
            this.animation = ANIMATIONS.RUNNING_RIGHT;
        } else if (this.dx < 0) {
            this.animation = ANIMATIONS.RUNNING_LEFT;
        }
        // IDLE VALUES
        let legThickness = this.width * .15;
        let bodyHeight = this.height * .8;
        let bodyWidth = bodyHeight;
        let xMargin = this.width - bodyWidth;

        let eyeCenter = this.getCenter();
        let pupilCenter = eyeCenter; // FIXME PUPIL SHIFT
        let eyeMiddle = this.getMiddle() - xMargin / 2;
        let eyeRadius = this.width / 5;

        let hipSpace = this.width * .4;
        let xleftHip = this.getCenter() - hipSpace / 2;
        let yleftHip =  this.getMiddle() + xMargin / 2;
        let xleftHeel = xleftHip;
        let yleftHeel =  this.getBottom() + .5; // FIXME

        let xrightHip = this.getCenter() + hipSpace / 2;
        let yrightHip =  this.getMiddle() + xMargin / 2;
        let xrightHeel = xrightHip;
        let yrightHeel =  this.getBottom() + .5; // FIXME

        if (this.animation == ANIMATIONS.IDLE) {
            eyeCenter = eyeCenter;
            pupilCenter = eyeCenter + Math.sin(.1*this.animation_step*Math.PI) * eyeRadius / 4;
        } else if (this.animation == ANIMATIONS.RUNNING_RIGHT) {
            eyeCenter =  this.getCenter() + xMargin / 2;
            pupilCenter = eyeCenter + eyeRadius / 3;
            xleftHeel = xleftHeel - Math.sin(this.animation_step*Math.PI) * hipSpace / 2;
            xrightHeel = xrightHeel + Math.sin(this.animation_step*Math.PI) * hipSpace / 2;
            yleftHeel = yleftHeel + Math.cos(this.animation_step*Math.PI) * hipSpace /4 - hipSpace/8;
            yrightHeel = yrightHeel - Math.cos(this.animation_step*Math.PI) * hipSpace /4 - hipSpace/8;
        } else if (this.animation == ANIMATIONS.RUNNING_LEFT) {
            eyeCenter =  this.getCenter() - xMargin / 2;
            pupilCenter = eyeCenter - eyeRadius / 3;
            xleftHeel = xleftHeel + Math.sin(this.animation_step*Math.PI) * hipSpace / 2;
            xrightHeel = xrightHeel - Math.sin(this.animation_step*Math.PI) * hipSpace / 2;
            yleftHeel = yleftHeel + Math.cos(this.animation_step*Math.PI) * hipSpace /4 - hipSpace/8;
            yrightHeel = yrightHeel - Math.cos(this.animation_step*Math.PI) * hipSpace /4 - hipSpace/8;
        }

        // BODY
        drawBox(
            this.context,
            this.x + xMargin / 2, this.y + Math.sin(.1*this.animation_step*Math.PI),
            bodyWidth, bodyHeight,
            ALT_WHITE, null, null); // FIXME
        // EYE
        drawCircle(
            this.context, eyeCenter, eyeMiddle,
            eyeRadius,
            ALT_WHITE, ALT_BLACK, .3);
        drawCircle(
            this.context, pupilCenter, eyeMiddle,
            eyeRadius / 2,
            ALT_BLACK, null, null);
        // LEGS
        drawLine(this.context, xleftHip, yleftHip, xleftHeel, yleftHeel, ALT_WHITE, legThickness);
        drawLine(this.context, xrightHip, yrightHip, xrightHeel, yrightHeel, ALT_WHITE, legThickness);
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
    crashInPlatform(platform) {
        zzfx(...SOUND_NOPE);
        // FIXME PUSHED BACK BUT DOES NOT CHANGE DIRECTION?
        if (this.dx > 0) {
            this.resetCenter(platform.getLeft());
        } else if (this.dx < 0) {
            this.resetCenter(platform.getRight());
        }
        this.turnBack();
    }
    resetCenter(x) {this.x = x - Math.ceil(this.width / 2);}
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
        // Collisions between character and platforms!
        this.character.platformUid = null;
        for (let platform of this.platforms) {
            if (platform.dead) {
                continue;
            }
            let platformTriggered = platform.triggered;

            // Is character running in the platform?
            if (this.character.isAlignedto(platform)) { this.character.crashInPlatform(platform); }

            // Is character grounded on a platform?
            if (this.character.getCenter() > platform.getLeft() &&
                this.character.getCenter() < platform.getRight()) {
                // -- Horizontally aligned
                if (this.character.getBottom() >= platform.getTop() &&
                    this.character.getBottom() < platform.getBottom()) {

                    this.character.platformUid = platform.uid;
                    platform.bounce();
                    this.character.y = platform.getTop() - this.character.height;
                    platform.trigger();
                }
            }

            if (platformTriggered &&
                this.character.platformUid != platform.uid) {
                platform.release();
            }
        }
        // Is character within the target?
        // FIXME JUST TOUCH, GO INSIDE, OR GO THROUGH?
        // FIXME MARGIN
        if (this.character.isAlignedto(this.target)){this.endGameCycle(true);}

        // Is character entering Hell?
        // FIXME DRAW LAVA POP

        // Is character in Hell?
        if (this.character.getTop() > REFERENCE_SIZE) {
            console.log("Hell!");
            this.endGameCycle(false);
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
        this.context.font = "6px Helvetica";
        this.context.fillStyle = ALT_WHITE;
        this.context.textAlign = "center";
        this.context.fillText("LEVEL "+ this.level, REFERENCE_SIZE / 2, REFERENCE_SIZE * .2);
    }
    drawVersion() {
        this.context.font = "4px Times";
        this.context.fillStyle = ALT_RED;
        this.context.textAlign = "left";
        this.context.fillText("version 0.d (sept. 10 18:31) ", 0, 4);
    }
    draw() {
        this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);

        // -- Background
        drawBox(
            this.context,
            0, 0, REFERENCE_SIZE, REFERENCE_SIZE,
            "black"); // FIXME SWITCHABLE

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
                // FIXME PSEUDO READ GRID
                // -- LEVEL BASE
                if (i == 0 || i == this.gridWidth-1) {
                    grid[i][j] = true; // FULL WALLS
                    continue;
                }
                grid[i][j] = Boolean((j) % 2);
                if (j < 3) {
                    grid[i][j] = false;
                }
                // if (this.level == 1) {
                //     // -- LEVEL 1
                //     // FIXME PSEUDO READ GRID
                //     grid[i][j] = Boolean((j) % 2);
                //     if (j < 3) {
                //         grid[i][j] = false;
                //     }
                // }
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
        }

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
            this.context, 20, 10, 6, 6); // FIXME VALUES?

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
    endGameCycle(goToNextLevel) {
        zzfx(...SOUND_TARGET);
        console.debug("Enter Death!");
        this.cancelControls(); // FIXME
        if (goToNextLevel == true) {
            this.level++;
        }
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

let gControls = new Object(); // FIXME NOT GLOBAL

function keyDownHandler(e) {
    zzfxX.resume();
    console.debug("Key down: " + e.key);
    gControls[e.key] = true;
}

function keyUpHandler(e) {
    console.debug("Key up: " + e.key);
    gControls[e.key] = false;
}

function touchDownHandler(e) {
    // zzfxX.resume();
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
    let myCanvas = initializeCanvas();
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