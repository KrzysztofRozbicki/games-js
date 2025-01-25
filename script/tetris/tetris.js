import shapes_array from './utils/blocks.js';

const canvas = document.querySelector('.tetris-canvas');

const ctx = canvas.getContext('2d');

const screen_proportion = window.innerWidth / window.innerHeight;
let canvas_width = window.innerWidth - 300;
let canvas_height = canvas_width * 2;
if (screen_proportion > 0.6) {
    canvas_height = window.innerHeight - 300;
    canvas_width = canvas_height / 2;
}

let drop_time = 100;
let dropping = true;

let block_color = random_color();

canvas.width = canvas_width;
canvas.height = canvas_height;

const block_size = canvas_width / 10;

const area_grid = new Array(10);
for (let i = 0; i < area_grid.length; i++) {
    area_grid[i] = new Array(20).fill(0);
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
    ctx.fillStyle = block_color;
    shape.forEach(row => {

        row.forEach(cell => {
            if (cell) {
                if (y >= canvas.height) {
                    dropping = false;;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    return;
                }
                // Jeśli nowy blok wychodzi poza canvas narysuj nowy blok
                if (x >= canvas.width && y_start === 0) {
                    dropping = false;
                    console.error('error drawing again');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    return;
                }
                ctx.fillRect(x, y, block_size, block_size);
            }
            x = +((x + block_size).toFixed(2));
        })
        x = x_start;
        y = +((y + block_size).toFixed(2));
    })
}

function new_block() {
    block_color = random_color();
    const random_start_position = Math.floor(Math.random() * 10) * block_size;
    const random_block_index = Math.floor(Math.random() * shapes_array.length);
    const random_block = shapes_array[random_block_index];
    const start_position = { x: +(random_start_position.toFixed(2)), y: 0 }
    draw_block(random_block, start_position);
    return { random_block, start_position };
}


function drop_block(shape, start_position) {
    dropping = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let { x, y } = start_position;
    draw_block(shape, start_position)
    let new_position = { x, y: +(y += block_size).toFixed(2) };

    setTimeout(() => {
        if (dropping) {
            drop_block(shape, new_position)
        }
        else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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

