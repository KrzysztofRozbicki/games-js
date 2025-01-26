import { collide, drop_shape, rotate_shape, create_arena, random_color, new_shape, draw_next_shape, draw_shape, draw_arena } from './utils/utils.js';

const canvas = document.querySelector('.tetris_canvas');
const canvas_next_shape = document.querySelector('.tetris_canvas--next_shape');
export const ctx = canvas.getContext('2d');
export const ctx_next_shape = canvas_next_shape.getContext('2d');

export let WIDTH = 10;
export let HEIGHT = 20;
export let WIDTH_NEXT_SHAPE = 4;
export let HEIGHT_NEXT_SHAPE = 3;

// Canvas declaration;
const screen_proportion = window.innerWidth / window.innerHeight;
let canvas_width = window.innerWidth - 300;
let canvas_height = canvas_width * 2;
if (screen_proportion > 0.6) {
    canvas_height = window.innerHeight - 300;
    canvas_width = canvas_height / 2;
}
export const block_size = canvas_width / WIDTH;

canvas.width = canvas_width;
canvas.height = canvas_height;

canvas_next_shape.width = block_size * WIDTH_NEXT_SHAPE;
canvas_next_shape.height = block_size * HEIGHT_NEXT_SHAPE;

ctx.scale(block_size, block_size);
ctx_next_shape.scale(block_size, block_size);
ctx.strokeStyle = "black";
ctx_next_shape.strokeStyle = "black";

// button to start game
const start_button = document.getElementById("game_start");
start_button.addEventListener('click', () => {
    start_game();
});

// Global variables and state

let last_time = 0;

export const state = {
    position: { x: 0, y: 0 },
    shape: null,
    next_shape: null,
    score: 0,
    game_over: true,
    speed: 1000,
    arena: null,
    arena_next_shape: null,
    drop_counter: 0,
    lines: 0,
    color: random_color(),
}




function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = state.color;
    ctx_next_shape.fillStyle = 'black';
    ctx_next_shape.fillRect(0, 0, canvas_next_shape.width, canvas_next_shape.height);
    ctx_next_shape.fillStyle = state.color;
    draw_arena(state);
    draw_shape(state);
    draw_next_shape(state);
}



function game(time = 0) {
    const delta_time = time - last_time;
    last_time = time;
    state.drop_counter += delta_time;
    if (state.drop_counter > state.speed) {
        drop_shape(state);
        if (state.game_over) return;
    }
    draw();
    requestAnimationFrame(game);
}

export function end_game() {
    state.game_over = true;
    const game_over_text = document.getElementById("game_over");
    canvas.classList.add('blur');
    start_button.classList.remove('hidden');
    game_over_text.classList.remove("hidden");
}

function start_game() {
    canvas.classList.remove('blur');
    start_button.classList.add("hidden");
    const game_over_text = document.getElementById("game_over");
    game_over_text.classList.add("hidden");
    state.game_over = false;
    state.score = 0;
    state.lines = 0;
    state.color = random_color();
    ctx.fillStyle = state.color;
    ctx_next_shape.fillStyle = state.color;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = state.color;
    ctx_next_shape.fillStyle = 'black';
    ctx_next_shape.fillRect(0, 0, canvas_next_shape.width, canvas_next_shape.height);
    ctx_next_shape.fillStyle = state.color;
    state.arena = create_arena(WIDTH, HEIGHT);
    state.arena_next_shape = create_arena(WIDTH_NEXT_SHAPE, HEIGHT_NEXT_SHAPE);
    document.getElementById('score').innerText = `${state.score}`;
    document.getElementById('lines').innerText = `${state.lines}`;
    new_shape(state);
    game();
}

document.addEventListener('keydown', event => {
    if (state.game_over) return;
    const key = event.key;
    if (key === 'ArrowLeft') {
        state.position.x--;
        if (collide(state.shape, state)) {
            state.position.x++;
        };
    }
    if (key === 'ArrowRight') {
        state.position.x++;
        if (collide(state.shape, state)) {
            state.position.x--;
        };
    }
    if (key === "ArrowUp") {
        rotate_shape(state);
    }
    if (key === 'ArrowDown') {
        drop_shape(state)
    }
});



