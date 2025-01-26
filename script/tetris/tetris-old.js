import shapes_array from './utils/blocks.js';

const canvas = document.querySelector('.tetris-canvas');
const ctx = canvas.getContext('2d');

// Setting the canvas and block size

const screen_proportion = window.innerWidth / window.innerHeight;
let canvas_width = window.innerWidth - 300;
let canvas_height = canvas_width * 2;
if (screen_proportion > 0.6) {
    canvas_height = window.innerHeight - 300;
    canvas_width = canvas_height / 2;
}

canvas.width = canvas_width;
canvas.height = canvas_height;

const block_size = canvas_width / 10;

// Setting the global variables

let game_run = true;
let drop_time = 250;
let dropping = true;
let timeoutID;

let player_position = { x: 0, y: 0 };


let block_color = random_color();
ctx.fillStyle = block_color;
ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'


const area_grid = new Array(10);
for (let i = 0; i < area_grid.length; i++) {
    area_grid[i] = new Array(20).fill(null);
}

function clear_area_grid() {
    for (let i = 0; i < area_grid.length; i++) {
        for (let j = 0; j < area_grid[i].length; j++) {
            if (area_grid[i][j] === false) {
                area_grid[i][j] = null;
            }
        }
    }
}

function random_color() {
    const green = Math.floor(Math.random() * (255 - 63) + 63);
    const blue = Math.floor(Math.random() * (255 - 63) + 63);
    const red = Math.floor(Math.random() * (255 - 63) + 63);
    return `rgb(${green}, ${blue}, ${red})`
}

function draw_block(shape, { x = 0, y = 0 }) {

    const x_start = x;
    const y_start = y;
    clear_area_grid()
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {

                // Jeśli nowy blok wychodzi poza canvas narysuj nowy blok
                if (x >= canvas.width && y_start === 0) {
                    dropping = false;
                    console.error('error drawing again');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    return;
                }

                ctx.fillRect(x, y, block_size, block_size);
                ctx.strokeRect(x, y, block_size, block_size);
                if (x >= 0 && x < canvas.width) {
                    save_cell_to_area(x, y);
                }



                // Jeśli blok dociera na koniec planszy
                if (y + block_size >= canvas.height && !shape[i][j + 1]) {
                    dropping = false;
                    save_cell_to_area(x, y);
                    save_shape_to_area()
                    return false;
                }

            }
            x = +((x + block_size).toFixed(2));
        }
        x = x_start;
        y = +((y + block_size).toFixed(2));
    }
}

function save_cell_to_area(x, y) {
    let x_pos = x;
    let y_pos = y;
    x_pos = Math.round(x_pos / block_size);
    y_pos = Math.round(y_pos / block_size);
    area_grid[x_pos][y_pos] = false;
}

function save_shape_to_area() {
    for (let i = 0; i < area_grid.length; i++) {
        for (let j = 0; j < area_grid[i].length; j++) {
            if (area_grid[i][j] === false) {
                if (j === 0) {
                    game_run = false;
                }
                area_grid[i][j] = true;
                ctx.fillRect(i * block_size, j * block_size, block_size, block_size);
                ctx.strokeRect(i * block_size, j * block_size, block_size, block_size);
            }
        }
    }
}

function move_block() {
    addEventListener("keyup", (event) => {
        const { key } = event
        if (key === 'ArrowLeft') {
            const new_pos = player_position.x - block_size;
            player_position.x = new_pos;
        }

        if (key === 'ArrowRight') {
            const new_pos = player_position.x + block_size;
            console.log(new_pos / block_size);
            player_position.x = new_pos;
        }

        if (key === 'ArrowDown') {
            const new_pos = player_position.y + block_size;
            player_position.y = new_pos;
        }
    });
}

function collision_detection(x, y) {
    let x_pos = x;
    let y_pos = y;
    x_pos = Math.round(x_pos / block_size);
    y_pos = Math.round(y_pos / block_size);
    if (area_grid[x_pos][y_pos] === true) {
        return true;
    }
    return false;
}

function collision_shape_detection(shape, { x = 0, y = 0 }) {
    if (!dropping) {
        return;
    }
    const x_start = x;
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
                const is_colliding = collision_detection(x, y);
                if (is_colliding) {
                    console.log('colliding');
                    return true;
                }
            }
            x = +((x + block_size).toFixed(2));
        }
        x = x_start;
        y = +((y + block_size).toFixed(2));
    }

}

function draw_area() {
    for (let i = 0; i < area_grid.length; i++) {
        for (let j = 0; j < area_grid[i].length; j++) {
            if (area_grid[i][j] === true) {
                ctx.fillRect(i * block_size, j * block_size, block_size, block_size);
                ctx.strokeRect(i * block_size, j * block_size, block_size, block_size);
            }
        }
    }
}

function new_block() {
    const random_start_position = Math.floor(Math.random() * 10) * block_size;
    //const random_start_position = 4 * block_size;
    const random_block_index = Math.floor(Math.random() * shapes_array.length);
    const random_block = shapes_array[random_block_index];
    const start_position = { x: +(random_start_position.toFixed(2)), y: 0 };
    draw_block(random_block, start_position);
    return { random_block, start_position };
}

function drop_block(shape) {
    clearTimeout(timeoutID);
    dropping = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let { x, y } = player_position;
    draw_block(shape, player_position);
    player_position = { x, y: +(y += block_size).toFixed(2) };
    const is_colliding = collision_shape_detection(shape, player_position);
    if (is_colliding) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        save_shape_to_area()
        draw_area()
        game();
        return;
    }

    draw_area()

    timeoutID = setTimeout(() => {
        if (dropping) {
            drop_block(shape)
        }
        else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            draw_area()
            game();
            return;
        }
    }, drop_time)


}

function game() {
    if (!game_run) {
        ctx.fillStyle = 'black';
        ctx.font = "10vh sans-serif";
        ctx.fillText("GAME", canvas.width / 10, (canvas.height / 2 - canvas.width / 8));
        ctx.fillText("OVER", canvas.width / 10, (canvas.height / 2 + canvas.width / 8));
        return;
    }

    const block = new_block();
    const shape = block.random_block;
    player_position = block.start_position;
    drop_block(shape);
}


move_block();
game();

