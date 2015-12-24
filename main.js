const term = require('terminal-kit').terminal;
const _ = require('lodash');
require('colors');

term.grabInput(true);
term.fullscreen(true);
//term.hideCursor();

const COLORS = {
    ' ': 0,
    '.': 40,
    '#': 242,
    'T': 40,
    '=': 4,
    '/': 130,
    '%': 130
};

const MAP = [
    '................................................................................',
    '................................................................................',
    '................................................................................',
    '.....T..........................................................................',
    '................................................................................',
    '.........#######................T....TTT....T.................#########.........',
    '.........#.....#..............................................#...#...#.........',
    '......T..#..........######........===...===...................#...#...#.........',
    '.........#######....#....#........=.......=.....................####.##.........',
    '....................#....#........=.......=...................#...#...#.........',
    '..######............#....#......T....===....T.................#.......#.........',
    '..#....#............##/###......T....=.=....T.................#########.........',
    '..#.#.##TT......................T.=..===..=.T....######/####...........T........',
    '..###.#=T=.....######.............=.......=......#%%%%%%%%%#....................',
    '......=====....#....#.............===...===......#%%%%%%%%%#........##..##......',
    '....T..=====...####.#..T.........................#%%%%%%%%%#........#....#......',
    '......====.....#....#...........T....TTT....T....###########........#....#.....',
    '...............####.#...............................................######......',
    '................................................................................',
    '................................................................................'
];

const player = {
    col: 20,
    row: 4
};


term.on('key', key => {
    if (key === 'CTRL_C') {
        term.fullscreen(false);
        term.hideCursor(false);
        term.grabInput(false);
        process.exit(1);
        return;
    }

    var newPos = {
        col: player.col,
        row: player.row
    };

    switch (key) {
        case 'RIGHT':
            newPos.col++;
            break;
        case 'LEFT':
            newPos.col--;
            break;
        case 'UP':
            newPos.row--;
            break;
        case 'DOWN':
            newPos.row++;
            break;
        default:
            newPos = null;
    }

    if (newPos) {
        if (newPos.col > 0 && newPos.col <= 80 && newPos.row > 0 && newPos.row <= 22) {
            if (MAP[newPos.row - 3][newPos.col - 1] === '#') {
                term.moveTo(1, 1, 'Ouch! You run into the wall.');

                term.moveTo(player.col, player.row);
            } else {
                term.moveTo(1, 1).eraseLine();

                term.moveTo(player.col, player.row);
                const c = MAP[player.row - 3][player.col - 1];
                term.bold.color256(COLORS[c] || 1, c);

                player.col = newPos.col;
                player.row = newPos.row;

                drawPlayer();
            }
        }

    }

    const menuItem = _.find(menuItems, { key: key.toUpperCase() });
    if (menuItem) {
        menuItem.callback();
    }
});

const menuItems = [
    { key: 'S', text: 'Start new game.', callback: startGame },
    null,
    { key: 'O', text: 'Options.', callback() {} }
];

function showMenu() {
    menuItems.forEach((item, i) => {
        if (item) {
            term.moveTo(6, 6 + i);
            term.color256(130, '[');
            term.bold.color256(190, item.key.toUpperCase());
            term.color256(130, '] ' + item.text);
        }
    });


    term.moveTo(40, 22);
    term.color256(130, 'Your choise: ');

    for (var i = 0; i < 256; ++i) {
        //term.color256(i, i + ' HELLO WORLD\n');
    }

    //term.colorRgb(142, 49, 49, 'Hello world');
}

function startGame() {
    term.clear();

    //term.moveTo(1, 1);
    //for (var i = 0; i < 25; ++i) {
    //    term('                                                                                \n');
    //}

    term.moveTo(1, 3);

    MAP.forEach(line => {
        for (var i = 0; i < line.length; ++i) {
            var c = line[i];
            term.bold.color256(COLORS[c] || 1, c);
        }
        if (i !== line.length - 1) {
            term('\n');
        }
        //term(line.replace(/%/g, '%%') + '\n');
    });

    drawPlayer();
}

function drawPlayer() {
    term.moveTo(player.col, player.row);
    term.bold('@');
    term.left()
}

showMenu();
