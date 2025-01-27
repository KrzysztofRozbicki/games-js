import { ctx, state, SIZE } from '../snake.js';

export const KEY_BINDINGS = {
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
}

export const STARTING_SPEED = 500;
export function create_arena(size) {
    const area_grid = new Array(size);
    for (let i = 0; i < area_grid.length; i++) {
        area_grid[i] = new Array(size).fill(0);
    }
    return area_grid;
}


export function draw_snake() {
    for (let i = 0; i < state.snake.length; i++) {
        if (i === 0) {
            ctx.fillStyle = 'gray';
        }
        else {
            ctx.fillStyle = 'black';
        }
        const [x, y] = state.snake[i];
        ctx.fillRect(x, y, 1, 1);
    }
}

function draw_apple() {
    const [x, y] = state.apple_position;
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, 1, 1);
}
export function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw_apple()
    draw_snake()
    state.drop_counter = 0;

}


function collide() {
    const [x, y] = state.snake[0];
    // Tylko jeśli wąż jest dłuższy niż 4 - sprawdza czy nie zjada ogona
    if (state.snake.length > 4) {
        for (let i = 4; i < state.snake.length; i++) {
            if (x === state.snake[i][0] && y === state.snake[i][1]) {
                return true;
            }
        }
    }
    eat_apple();
    return x < 0 || y < 0 || x >= SIZE || y >= SIZE;
}

function eat_apple() {
    const [x, y] = state.snake[0];
    const [apple_x, apple_y] = state.apple_position;
    if (x === apple_x && y === apple_y) {
        state.snake_apples_eaten.push([apple_x, apple_y]);
        update_score();
        generate_random_position()
    };
}

function update_score() {
    state.score += state.level * 10;
    document.getElementById('score').innerText = state.score;

    state.speed = state.speed - (Math.ceil(state.speed / 10));
}


function generate_random_position() {
    let random_x = Math.floor(Math.random() * SIZE);
    let random_y = Math.floor(Math.random() * SIZE);
    for (let i = 0; i < state.snake.length; i++) {
        if (random_x === state.snake[i][0] && random_y === state.snake[i][1]) {
            generate_random_position();
            return;
        }
    }
    state.apple_position = [random_x, random_y];
}

export function check_back(direction) {
    const [x, y] = state.snake[0];
    const [x_next, y_next] = state.snake[1];
    const new_position_x = x + direction.x;
    const new_position_y = y + direction.y;

    if (new_position_x === x_next && new_position_y === y_next) {
        return true;
    }
}

function getDirectionKey(direction) {
    return Object.keys(KEY_BINDINGS).find(
        key => KEY_BINDINGS[key].x === direction.x && KEY_BINDINGS[key].y === direction.y
    ) || null; // Return null if no match is found
}

export function move() {
    let direction = state.move;
    const key = getDirectionKey(direction);
    console.log(key);
    //Tworzymy kopię węża (głęboka kopia przez mapę, bez referencji)
    const new_snake = state.snake.map(coordinates => [...coordinates]);
    //Ruszamy głowę węża
    new_snake[0][0] += direction.x;
    new_snake[0][1] += direction.y;

    //Przepisujemy poprzednie pozycje do nowego węża
    for (let i = 1; i < state.snake.length; i++) {
        new_snake[i][0] = state.snake[i - 1][0];
        new_snake[i][1] = state.snake[i - 1][1];
        //Jeśli to ostatnia część ogona i istnieją zjedzone jabłka
        if ((i === state.snake.length - 1) && (state.snake_apples_eaten.length > 0)) {
            const tail = add_tail(new_snake[i]);
            if (tail) {
                new_snake.push(tail);
                state.level += 1;
                document.getElementById('length').innerText = state.level;
            }
        }
    }

    //Ustawiamy nowego węża i resetujemy klatki
    state.snake = new_snake;
    state.drop_counter = 0;

    if (collide()) {
        end_game();
    }

}

function add_tail(position) {
    for (let i = 0; i < state.snake_apples_eaten.length; i++) {
        let position_apple = state.snake_apples_eaten[i];
        if (position[0] === position_apple[0] && position[1] === position_apple[1]) {
            state.snake_apples_eaten.splice(i, 1);
            return position_apple;
        }
    }
    return null;
}

function end_game() {
    state.game_over = true;
    const game_over_text = document.getElementById("game_over");
    canvas.classList.add('blur');
    const start_button = document.getElementById("game_start");
    start_button.classList.remove('hidden');
    game_over_text.classList.remove("hidden");
}

export function get_initial_state() {
    const state = {
        arena: create_arena(SIZE),
        move: { x: +1, y: 0 },
        snake: [[1, 1], [0, 1]],
        snake_apples_eaten: [],
        apple_position: [(SIZE / 2), (SIZE / 2)],
        score: 0,
        game_over: true,
        speed: 1000,
        drop_counter: 0,
        level: 1,
    }
    return state;
};

