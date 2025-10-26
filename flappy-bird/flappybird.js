
//board
let board;
let boardWidth = 1500;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/16;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray= [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.18; 

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
    
    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
    birdImg = new Image();
    birdImg.src = "./Assets/Images/flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./Assets/Images/toppipe.png";

    doublePipe1Img = new Image();
    doublePipe1Img.src = "./Assets/Images/doublepipe1.png";

    doublePipe2Img = new Image();
    doublePipe2Img.src = "./Assets/Images/doublepipe2.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./Assets/Images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 2500); //every 1.5 seconds
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); // apply gravity to current bird.y, limi the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            if (pipe.img === bottomPipeImg) {
                score += 1;
            }
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

        //score
        context.fillStyle = "white";
        context.font="45px sans-serif";
        context.fillText(score, 5, 45);

        if (gameOver) {
            context.fillText("GAME OVER", 5, 90);
        }        
    }


function placePipes() {
    if(gameOver) {
        return;
    }
    //(0-1) * pipeHeight/2
    // 0 -> 128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    const openingSpace = 135; // vertical gap between each pipe segment
    const doublePipe1Height = 612 * (pipeWidth / 384); // maintain aspect ratio
    const doublePipe2Height = 612 * (pipeWidth / 384);
    const randomPipeY = pipeY - 500; // keeps all pipes fixed at same height

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let doublePipe1 = {
        img: doublePipe1Img,
        x: pipeX,
        y: topPipe.y + topPipe.height + openingSpace,
        width: pipeWidth,
        height: doublePipe1Height,
        passed: false
    };
    pipeArray.push(doublePipe1);

    let doublePipe2 = {
        img: doublePipe2Img,
        x: pipeX,
        y: doublePipe1.y + doublePipe1.height + openingSpace,
        width: pipeWidth,
        height: doublePipe2Height,
        passed: false
    };
    pipeArray.push(doublePipe2);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : doublePipe2.y + doublePipe2.height + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -4.5;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }        
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}