'use strict';

var MINE = '💣';
var EMPTY = ' ';
var FLAG = '🏴‍☠️';

var NORMAL_SMILEY = '🙂';// Normal
var SAD_SMILEY = '😕';   // Sad & Dead – LOSE (stepped on a mine)
var GLASS_SMILEY = '😎'; // Sunglasses – WIN

var gGame = {
    isOn: false,
    secsPassed: 0,
    isFirstTurn: true
};

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gLives = 3;
var gIntervalTimer;

var gHints = {
    isOn: false,
    counts: 3,
    block: false,
};
var gBoard = buildBoard(); // Matrix contains cell objects:

function setLevel(level) {
    //1= Beginner, 2=Medium, 3=Expert 
    console.log(level);

    switch (level) {
        case 1:
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;
        case 2:
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            break;
        case 3:
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            break;
    }
    restart();
}

function restart() {
    clearInterval(gIntervalTimer);
    gGame = {
        isOn: false,
        shownCount: 0,
        secsPassed: 0,
        isFirstTurn: true
    };
    gLives = 3;   

    gHints = {
        isOn: false,
        counts: 3,
        block: false,
    };
    gBoard = buildBoard();
    init();
}

function init() {
    //  when page loads
    gGame.isOn = true;
    renderBoard(gBoard);
    var elLives = document.querySelector('.lives');
    elLives.innerText = `${gLives} LIVES`;
    var elHint = document.querySelector('.hint');
    elHint.innerText = `${gHints.counts} hints 💡`;
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = `Time: ${gGame.secsPassed}`;

    var beginerVaulue = '';
    var mediumVaulue = '';
    var expertVaulue = '';

    var elBeginner = document.querySelector('.beginner');
    var elMedium = document.querySelector('.medium');
    var elExpert = document.querySelector('.expert');

    if (localStorage.getItem("beginner") === null) {
        beginerVaulue += 'Beginner: not yet best time';
    } else {
        beginerVaulue += `Beginner: ${localStorage.getItem("beginner")} seconds`;
    }
    elBeginner.innerText = beginerVaulue;
    if (localStorage.getItem("medium") === null) {
        mediumVaulue += 'Medium: not yet best time';
    } else {
        mediumVaulue += `Medium: ${localStorage.getItem("medium")} seconds`;
    }
    elMedium.innerText = mediumVaulue;
    if (localStorage.getItem("expert") === null) {
        expertVaulue += 'Expert: not yet best time';
    } else {
        expertVaulue += `Expert: ${localStorage.getItem("expert")} seconds`;
    }
    elExpert.innerText = expertVaulue;
    smiely(NORMAL_SMILEY);
}

function smiely(smielyValue) {
    var elSmiely = document.querySelector('.smiely');
    elSmiely.innerHTML = `<button onclick="restart()"> ${smielyValue} </button> `;
}

function buildBoard() {
    // MODAL- Builds the board Set mines at random locations Call setMinesNegsCount()
    //  Return the created board
    var cell = {};
    var newBoard;
    var SIZE = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };
            board[i][j] = cell;
        }
    }
    for (var k = 0; k < gLevel.MINES; k++) {
        // while (counter<gLevel.MINES)
        var i = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var j = getRandomIntInclusive(0, gLevel.SIZE - 1);
        if (board[i][j].isMine) {
            k = k - 1;
            continue;
        } else {
            board[i][j].isMine = true;
            newBoard = setMinesNegsCount(board, i, j);
        }
    }
    return newBoard;
}

function setMinesNegsCount(board, posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (i === posI && j === posJ) continue;
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount++;
            }
        }
    }
    return board
}

function renderBoard(board) {
    // Render the board as a <table> to the page
    var strHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            var className = 'cell' + i + '-' + j;

            strHtml +=
                `<td class="blank ${className}" onmousedown="clicked(event,this, ${i}, ${j})"
                 onclick="cellClicked(${i}, ${j})">                
            </td>`;
        }
        strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

function clicked(event, elCell, i, j) {
    if (event.button === 2) cellMarked(elCell, i, j);
}

function timerOn() {
    gGame.secsPassed++;
    var strHtml = `Time: ${gGame.secsPassed}`;
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = strHtml;
}

function ShowHint(posI, posJ) {
    setTimeout(function () {
        gHints.isOn = false;
        gHints.block = false;
        for (var i = posI - 1; i <= posI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = posJ - 1; j <= posJ + 1; j++) {
                if (j < 0 || j >= gBoard.length) continue;
                if (!gBoard[i][j].isShown) { // if it didnt showen yet
                    var elCell = document.querySelector(`.cell${i}-${j}`);
                    renderCell(i, j, EMPTY);
                    elCell.classList.add('blank');
                }
                if (gBoard[i][j].isMarked) { // if it didnt showen yet
                    var elCell = document.querySelector(`.cell${i}-${j}`);
                    renderCell(i, j, FLAG);
                }
            }
        }
    }, 1000);

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            var elCell = document.querySelector(`.cell${i}-${j}`);
            if (gBoard[i][j].isMine) {
                renderCell(i, j, MINE);
            } else if (gBoard[i][j].minesAroundCount === 0) {
                renderCell(i, j, EMPTY);
            } else {
                renderCell(i, j, gBoard[i][j].minesAroundCount);
            }
            elCell.classList.remove('blank');
        }
    }
}

function hintOn(elHint) {
    if (!gGame.isOn) return;
    if (gHints.counts <= 0) return;
    gHints.counts--;
    gHints.isOn = true;
    elHint.innerText = `${gHints.counts} hints 💡`;
}

function cellClicked(i, j) {
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    if (gBoard[i][j].isMarked) return;
    if (gHints.isOn) {
        gHints.isOn = false;
        gHints.block = true;
        ShowHint(i, j);
        return;
    }
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.classList.remove('blank');

    if (gGame.isFirstTurn) { //first turn
        gGame.isFirstTurn = false;
        gIntervalTimer = setInterval(timerOn, 1000)

        if (gBoard[i][j].isMine) {
            console.table('its mine');
            gBoard = buildBoard();
            renderBoard(gBoard);
            cellClicked(i, j);
            return;
        }
    }
    gBoard[i][j].isShown = true;
    checkWin();
    var cellValue = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;
    if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) { //if not mine and 0
        expandShown(elCell, i, j)
        cellValue = EMPTY;
    }
    if (gBoard[i][j].isMine) { // loose/ disqualification
        var elLives = document.querySelector('.lives');
       
        if (gLives > 1) {
            gLives--;
            gBoard[i][j].isMarked = true;
            smiely(SAD_SMILEY);
            setTimeout(function () {
                smiely(NORMAL_SMILEY);
            }, 400);
        } else {
            gLives = 0;
            alert('you losed ')
            smiely(SAD_SMILEY);
            gameOver();
            showAllMines();
        }
        checkWin();
        var strText = `LIVES: ${gLives}`;
        elLives.innerText = strText;
    }
    renderCell(i, j, cellValue);
}

function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                gBoard[i][j].isShown = true;
                renderCell(i, j, MINE);
            }
        }
    }
}

function cellMarked(elCell, i, j) {
    // Called on right click to mark a cell ...
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    if (gHints.block) return;
    var elCell = document.querySelector(`.cell${i}-${j}`);
    if (gGame.isFirstTurn) { //first turn
        gGame.isFirstTurn = false;
        gIntervalTimer = setInterval(timerOn, 1000)
    }
    if (!gBoard[i][j].isMarked) {// if not marked
        gBoard[i][j].isMarked = true;
        elCell.innerHTML = FLAG;
        checkWin();
    } else { //it is mark
        gBoard[i][j].isMarked = false;
        elCell.innerHTML = EMPTY;
        // checkWin();
    }
}

function checkWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) return;
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMine) return;
        }
    }
    smiely(GLASS_SMILEY);
    gameOver();
    chekBestTime();
}

function expandShown(elCell, posI, posJ) { //board
    //When user clicks a cell with no mines around, we need to open not only that cell,
    // but also its neighbors. begin-  opens the non-mine 1st degree neighbors
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === posI && j === posJ) continue;
            if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine && !gBoard[i][j].isShown) { //if the cell value is 0 and not showen yet
                gBoard[i][j].isShown = true;
                expandShown(elCell, i, j)
                if (gBoard[i][j].isMarked) {
                    gBoard[i][j].isMarked = false;
                }
                renderCell(i, j, EMPTY);
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.classList.remove('blank');
            } else if (gBoard[i][j].minesAroundCount > 0) {
                gBoard[i][j].isShown = true;
                renderCell(i, j, gBoard[i][j].minesAroundCount);
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.classList.remove('blank');
            }
        }
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function renderCell(i, j, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.innerHTML = value;
}

function gameOver() {
    clearInterval(gIntervalTimer);
    gGame.isOn = false;
}

function chekBestTime() {
    switch (gLevel.SIZE) {
        case 4: //beginer
            if (localStorage.getItem("beginner") > gGame.secsPassed || localStorage.getItem("beginner") === null) {//new best time
                localStorage.setItem("beginner", +gGame.secsPassed);
                var elBeginner = document.querySelector('.beginner');
                elBeginner.innerText = `Beginner: ${gGame.secsPassed} seconds`;
            }
            break;
        case 8: //medium
            if (localStorage.getItem("medium") > gGame.secsPassed || localStorage.getItem("medium") === null) {//new best time
                localStorage.setItem("medium", +gGame.secsPassed);
                var elMedium = document.querySelector('.medium');
                elMedium.innerText = `Medium: ${gGame.secsPassed} seconds`;
            }
            break;
        case 12: //expert
            if (localStorage.getItem("expert") > gGame.secsPassed || localStorage.getItem("expert") === null) {//new best time
                localStorage.setItem("expert", +gGame.secsPassed);
                var elExpert = document.querySelector('.expert');
                elExpert.innerText = `Expert: ${gGame.secsPassed} seconds`;
            }
            break;
    }
}
