import { WIDTH, HEIGHT, end_game, ctx, ctx_next_shape, block_size } from '../tetris.js';
import shapes_array from './blocks.js';

export function drop_shape(state) {
    state.position.y++;
    if (collide(state.shape, state)) {
        state.position.y--;
        if (state.position.y === 0) {
            end_game()
            return;
        }
        merge_shape_to_area(state);
        new_shape(state);
    }
    state.drop_counter = 0;
}
export function collide(shape, state) {
    const { position } = state;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                if (y + position.y >= HEIGHT) {
                    return true;
                }
                if (state.arena[y + position.y][x + position.x]) {
                    return true;
                }
                if (x + position.x < 0 || x + position.x >= WIDTH) {
                    return true;
                }

            }
        }
    }
    return false;
}

export function rotate_shape(state) {
    const { shape, position } = state;
    let columns = shape.length - 1;
    let rotated_shape = create_arena(shape.length, shape[0].length);
    if (shape === shapes_array[6]) {
        return;
    }

    for (let y = 0; y < rotated_shape.length; y++) {
        if (columns < 0) {
            columns = shape.length - 1;
        }
        for (let x = 0; x < rotated_shape[y].length; x++) {
            rotated_shape[y][x] = shape[columns][y];
            if (state.arena[y + position.y][x + position.x]) {
                position.y--;
            }
            if (x + position.x >= WIDTH) {
                position.x--;
            }
            columns--;
        }
    }
    if (collide(rotated_shape, state)) {
        return;
    }
    state.shape = rotated_shape;
    return;
}

export function create_arena(width, height) {
    const area_grid = new Array(height);
    for (let i = 0; i < area_grid.length; i++) {
        area_grid[i] = new Array(width).fill(0);
    }
    return area_grid;
}

export function random_color() {
    const min = 127;
    const max = 191;
    const green = Math.floor(Math.random() * (max - min) + min);
    const blue = Math.floor(Math.random() * (max - min) + min);
    const red = Math.floor(Math.random() * (max - min) + min);
    return `rgb(${red}, ${green}, ${blue})`
}

export function new_shape(state) {
    const start_position = 4;
    const random_next_shape_index = Math.floor(Math.random() * shapes_array.length);
    const shape = shapes_array[random_next_shape_index]
    if (!state.next_shape) {
        state.shape = shape;
    } else {
        state.shape = state.next_shape;
    }

    state.next_shape = shape;
    state.position.x = start_position;
    state.position.y = 0;
}

export function merge_shape_to_area(state) {
    state.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                state.arena[y + state.position.y][x + state.position.x] = 1;
            }
        })
    })
    check_for_score(state)
}

function check_for_score(state) {
    let lines = 0;
    for (let y = state.arena.length - 1; y >= 0; y--) {
        let row_is_full = true;
        for (let x = 0; x < state.arena[y].length; x++) {
            if (state.arena[y][x] === 0) {
                row_is_full = false;
                break;
            }
        }
        if (row_is_full) {
            lines++;
            state.arena.splice(y, 1);
        }
    }
    if (lines > 0) {
        for (let i = 0; i < lines; i++) {
            const new_row = new Array(state.arena[0].length).fill(0);
            state.arena.unshift(new_row);
        }
    }
    calculate_and_update_score(state, lines);
}

function calculate_and_update_score(state, lines) {
    if (lines === 0) {
        return;
    }
    const scoring_system = {
        1: 40,
        2: 100,
        3: 300,
        4: 1200
    }
    const old_level = (Math.floor(state.lines / 10) + 1)
    state.lines += lines;
    const level = (Math.floor(state.lines / 10) + 1)
    if (level - old_level === 1) {
        state.speed = state.speed - (Math.ceil(state.speed / 5));
        console.log(state.speed);
        const new_color = random_color();
        state.color = new_color;
        ctx.fillStyle = new_color;
        ctx_next_shape.fillStyle = new_color;
    }
    state.score += scoring_system[lines] * level;
    document.getElementById('score').innerText = `${state.score}`;
    document.getElementById('level').innerText = `${level}`;
    document.getElementById('lines').innerText = `${state.lines}`;
}

export function draw_next_shape(state) {
    const { next_shape } = state;
    let offset_x = 0;
    let offset_y = 0;
    if (next_shape.length === 2) {
        offset_y = 0.5;
    }
    if (next_shape.length === 1) {
        offset_y = 1;
    }
    if (next_shape[0].length === 3) {
        offset_x = 0.5;
    }
    if (next_shape[0].length === 2) {
        offset_x = 1;
    }
    next_shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                const x_pos = x + offset_x;
                const y_pos = y + offset_y;
                draw_cell(ctx_next_shape, x_pos, y_pos);
            }
        })
    })
}



export function draw_shape(state) {
    const { shape, position } = state;
    shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                const x_pos = x + position.x;
                const y_pos = y + position.y;
                draw_cell(ctx, x_pos, y_pos)
            }
        })
    })
}



export function draw_arena(state) {
    state.arena.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                draw_cell(ctx, x, y)
            }
        })
    })
}

function draw_cell(ctx, x, y) {
    ctx.fillRect(x, y, 1, 1);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x + 0.1, y + 0.1, 0.3, 0.3);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(x + 0.1, y + 0.1, 0.2, 0.2);
    ctx.fillStyle = 'white';
    ctx.fillRect(x + 0.1, y + 0.1, 0.1, 0.1);
    ctx.scale(1 / block_size, 1 / block_size);
    ctx.lineWidth = 2;
    ctx.strokeRect(x * block_size, y * block_size, block_size, block_size);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * block_size, y * block_size, 2, 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.strokeRect(x * block_size + 2, y * block_size + 2, block_size - 4, block_size - 4);
    ctx.restore();
}