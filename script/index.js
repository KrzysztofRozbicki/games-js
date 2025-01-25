const menu = document.querySelector('header');
menu.innerHTML = `
    <nav>
    <ul>
        <li>
            <a href="/">Home</a>

        </li>
        <li>
            <a href="/tetris.html">Tetris</a>

        </li>
        <li>
            <a href="/snake.html">Snake</a>
        </li>
    </ul>
    </nav>
`

const footer = document.querySelector('footer');
footer.innerHTML = `
    <p>&copy; 2025 <a href="https://pogbit.com/"> PogBit </a></p>
`