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

let drop_time = 100;
let dropping = true;
let timeoutID;

let block_color = random_color();
ctx.fillStyle = block_color;

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
    // debugger;
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

                const is_colliding = collision_detection(x, y);
                if (is_colliding) {
                    return;
                }

                ctx.fillRect(x, y, block_size, block_size);
                save_cell_to_area(x, y);



                // Jeśli blok do  ciera na koniec planszy
                if (y + block_size >= canvas.height && !shape[i][j + 1]) {
                    dropping = false;
                    save_cell_to_area(x, y);
                    save_shape_to_area()
                    return;
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
                area_grid[i][j] = true;
                ctx.fillRect(i * block_size, j * block_size, block_size, block_size);
            }
        }
    }
}



function collision_detection(x, y) {

    let x_pos = x;
    let y_pos = y;
    x_pos = Math.round(x_pos / block_size);
    y_pos = Math.round(y_pos / block_size);
    if (area_grid[x_pos][y_pos] === true) {
        debugger;
        dropping = false;
        save_shape_to_area()
        return true;
    }
    return false;
}

function draw_area() {
    for (let i = 0; i < area_grid.length; i++) {
        for (let j = 0; j < area_grid[i].length; j++) {
            if (area_grid[i][j] === true) {
                ctx.fillRect(i * block_size, j * block_size, block_size, block_size);
            }
        }
    }
}

function new_block() {
    const random_start_position = Math.floor(Math.random() * 10) * block_size;
    const random_block_index = Math.floor(Math.random() * shapes_array.length);
    const random_block = shapes_array[random_block_index];
    const start_position = { x: +(random_start_position.toFixed(2)), y: 0 }
    draw_block(random_block, start_position);
    return { random_block, start_position };
}


function drop_block(shape, start_position) {
    clearTimeout(timeoutID);
    dropping = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let { x, y } = start_position;
    draw_block(shape, start_position)
    draw_area()

    let new_position = { x, y: +(y += block_size).toFixed(2) };

    timeoutID = setTimeout(() => {
        if (dropping) {
            drop_block(shape, new_position)
        }
        else {
            console.log(start_position);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            draw_area()
            game();
            return;
        }
    }, drop_time)


}




function game() {
    const block = new_block();
    const shape = block.random_block;
    const start_position = block.start_position;
    drop_block(shape, start_position);
}



game();

