const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

const window_height = window.innerHeight - 300;
const window_width = window.innerWidth - 300;
let canvas_size = window_height > window_width ? window_width : window_height

canvas.width = canvas_size;
canvas.height = canvas_size;

export const KEY_BINDINGS = {
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
}

const sprite_size = 32;

ctx.fillStyle = "black"

let last_time = 0;
let move_rate = 0;
let game_over = false;
let speed = 100;
ctx.scale(2, 2);

let direction = null;

const doggo = new Image();
doggo.src = '/script/animation/sprites/psaz.png';
doggo.frames = Math.floor(doggo.width / sprite_size);
doggo.current_frame = 1;

const tail = new Image();
tail.src = '/script/animation/sprites/tail.png'
tail.frames = Math.floor(tail.width / sprite_size);
tail.current_frame = 1;

const tail_apple = new Image();
tail_apple.src = '/script/animation/sprites/tailApple.png';
tail_apple.frames = Math.floor(tail_apple.width / sprite_size);
tail_apple.current_frame = 1;
doggo.style.transform = 'scaleY(-1)';

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    check_frames();
    ctx.save();
    ctx.translate(sprite_size / 2, sprite_size / 2);
    ctx.rotate(Math.PI / -1);
    ctx.drawImage(doggo, frame_offset(doggo), 0, sprite_size, sprite_size, -sprite_size / 2, -sprite_size / 2, sprite_size, sprite_size);
    ctx.restore();
    // ctx.drawImage(doggo, frame_offset(doggo), 0, sprite_size, sprite_size, 0, 0, sprite_size, sprite_size);
    ctx.drawImage(tail, frame_offset(tail), 0, sprite_size, sprite_size, 32, 0, sprite_size, sprite_size);
    ctx.drawImage(tail_apple, frame_offset(tail_apple), 0, sprite_size, sprite_size, 64, 0, sprite_size, sprite_size);
}

function game() {
    draw();
    requestAnimationFrame(game);
    move_rate++;
    if (move_rate >= 10) {
        doggo.current_frame++;
        tail.current_frame++;
        tail_apple.current_frame++;
        move_rate = 0;
    }
}

game();

function check_frames() {
    if (doggo.current_frame > doggo.frames) {
        doggo.current_frame = 1;
    }
    if (tail.current_frame > tail.frames) {
        tail.current_frame = 1;
    }
    if (tail_apple.current_frame > tail_apple.frames) {
        tail_apple.current_frame = 1;
    }
}

function frame_offset(image) {
    return ((image.current_frame - 1) * sprite_size);
}

function move() {

}

document.addEventListener('keydown', event => {
    direction = KEY_BINDINGS[event.key];
});