const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");

const windowWidth = 400;
const windowHeight = 350;

const button = document.querySelector(".re-start");

canvas.width = windowWidth;
canvas.height = windowHeight;

class partOfSnake {
    constructor() {
        //Each part of the snake is initialized with the same values for width and height and also de dx and dy
        this.width = 15;
        this.height = 15;
        this.position = [{ 
            x: 20, 
            y: canvas.height / 2,
        }];
        this.dx = 0;
        this.dy = 0;
    }

    draw() {
        //For each part of the array of position we'll do a fillRect that will draw in the canvas the square that represents the snake
        this.position.forEach(part => {
            context.fillStyle = 'lightgreen';
            context.fillRect(part.x, part.y, this.width, this.height);
        });
    }

    direction(v) {
        if (v === 'w') { //Up
            this.dx = 0;
            this.dy = -5;
        } else if (v === 's') { //Down
            this.dx = 0;
            this.dy = 5;
        } else if (v === 'a') { //Left
            this.dx = -5;
            this.dy = 0;
        } else if (v === 'd') { //Right
            this.dx = 5;
            this.dy = 0;
        }
    }

    movement() {
        for (let i = this.position.length - 1; i > 0; i--) {
            this.position[i].x = this.position[i - 1].x;
            this.position[i].y = this.position[i - 1].y;
        }

        this.position[0].x += this.dx;
        this.position[0].y += this.dy;
    }

    collision() {
        const head = this.position[0];
        if (head.x < 0 || head.x + this.width > windowWidth || head.y < 0 || head.y + this.height > windowHeight) {
            return true;
        } else {
            return false;
        }
    }

    selfCollision() {
        const head = this.position[0];
        for (let i = 1; i < this.position.length; i++) {
            if (head.x === this.position[i].x && head.y === this.position[i].y) {
                return true;
            }
        }
        return false;
    }

    grow() {
        const tail = this.position[this.position.length - 1];
        this.position.push({ x: tail.x, y: tail.y});
    }
}

class apple {
    constructor() {
        this.width = 15;
        this.height = 15;
        //The apple position will always be random
        this.x = Math.random() * ((windowWidth - this.width) - 1) + 1;
        this.y = Math.random() * ((windowHeight - this.height) - 1) + 1;
    }

    draw() {
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

const winOrLose = () => {
    //In case is detected a collision with the canvas limits, It'll return true, that means the player have lost
    if (snake.collision() || snake.selfCollision() ) {
        return true;
    } else {
        return false;
    }
}

const checkCollisionWithApple = () => {
    const head = snake.position[0];
    if (food.x <= head.x + snake.width && food.x + food.width >= head.x && food.y <= head.y + snake.height && food.y + food.height >= head.y) {
        snake.grow();
        //Make a new food in a random position
        food.x = Math.random() * ((windowWidth - food.width) - 1) + 1;
        food.y = Math.random() * ((windowHeight - food.height) - 1) + 1;
        points += 10;
    };
};

const keydown = (e) => {
    snake.direction(e.key);
};

const restartGame = () => {
    canvas.style.background = "black";
    snake = new partOfSnake();
    food = new apple();
    points = 0;
    game();
};

const score = ()=> {

    let scoreText = `<h3 class="points" >Puntaje : ${points}</h3><br>
                     <h4 class="max-points">Máximo puntaje alcanzado : ${maxPoints}</h4>`;
    scorePoints.innerHTML = scoreText;
};

document.addEventListener('keydown', keydown);

button.addEventListener('click', restartGame);

let snake = new partOfSnake();
let food = new apple();

let scorePoints = document.querySelector(".score");

let points = 0;

let maxPoints = 0;

function game() {
    let status = winOrLose();

    if (status == false) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        score();
        checkCollisionWithApple();
        snake.draw();
        snake.movement();
        food.draw();
        requestAnimationFrame(game);
    } else {
        //if the maxPoints is less than the actual points, maxPoints will take that value, in other case that won't happen
        if(maxPoints < points){
            maxPoints = points;
        }
        canvas.style.background = "red";
        let scoreText = `<h3 class="loser">Maldito perdedor</h3><br>
                         <h4 class="final-score">Maximo puntaje obtenido: ${maxPoints}</h4>`;
        scorePoints.innerHTML = scoreText
    };
};

game();
