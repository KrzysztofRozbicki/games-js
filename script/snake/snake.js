import { KEY_BINDINGS, draw, move, get_initial_state, check_back } from "./utils/utils.js";

const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

export let SIZE = 10;
const window_height = window.innerHeight - 300;
const window_width = window.innerWidth - 300;
let canvas_size = window_height > window_width ? window_width : window_height


export const block_size = canvas_size / SIZE;

canvas.width = canvas_size;
canvas.height = canvas_size;

ctx.scale(block_size, block_size);
ctx.strokeStyle = "red"
ctx.fillStyle = "black"

let last_time = 0;

export const state = get_initial_state();
console.log(state);

function start_game() {
    canvas.classList.remove('blur');
    start_button.classList.add("hidden");
    const game_over_text = document.getElementById("game_over");
    game_over_text.classList.add("hidden");
    Object.assign(state, get_initial_state())
    document.getElementById('score').innerText = state.score;
    document.getElementById('length').innerText = state.level;
    state.game_over = false;
    game();
}


function game(time = 0) {
    const delta_time = time - last_time;
    last_time = time;
    state.drop_counter += delta_time;
    if (state.drop_counter > state.speed) {
        move();
        if (state.game_over) return;
        draw();
    }
    requestAnimationFrame(game);
}
const start_button = document.getElementById("game_start");
start_button.addEventListener('click', () => {
    start_game();
});

document.addEventListener('keydown', event => {
    const direction = KEY_BINDINGS[event.key];
    const key = getDirectionKey(direction);
    console.log(key);
    if (check_back(direction)) {
        return;
    }
    state.move = direction;
});

function getDirectionKey(direction) {
    return Object.keys(KEY_BINDINGS).find(
        key => KEY_BINDINGS[key].x === direction.x && KEY_BINDINGS[key].y === direction.y
    ) || null; // Return null if no match is found
}