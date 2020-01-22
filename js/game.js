'use strict';

var MINE = '💣';
var EMPTY = ' ';
var FLAG = '🏴‍☠️';

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstTurn: true
};

var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gIntervalTimer;
var isHint = false;
var gBoard = buildBoard(); // Matrix contains cell objects:

function init() {
    //  when page loads
    renderBoard(gBoard);
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

            // var cellValue = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;
            var className = 'cell' + i + '-' + j;

            strHtml +=
                `<td class="blank ${className}" onmousedown="clicked(event,this, ${i}, ${j})"
                 onclick="cellClicked(${i}, ${j})">
                
            </td>`;
            //     `<td class="blank ${className}" onclick="cellClicked(this, ${i}, ${j})">
            //     ${cellValue}
            // </td>`;
        }
        strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;

}

function clicked(event, elCell, i, j) {
    // if (event.button === 1) {
    //     cellClicked(i, j);
    //     return;
    // }
    if (event.button === 2) cellMarked(elCell, i, j);
}

function timerOn() {
    gGame.secsPassed++;
    var strHtml = `Time: ${gGame.secsPassed}`;
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = strHtml;
}

function cellClicked(i, j) {

    if (gBoard[i][j].isShown) return;
    if (gBoard[i][j].isMarked) return;
    if (isHint) {
        // isHint = false;
        hint(i, j);
        return;
    }

    var elCell = document.querySelector(`.cell${i}-${j}`);
    // console.log(elCell);

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
    var cellValue = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;
    // renderCell(i, j, cellValue);
    // elCell.classList.remove('blank');

    if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {//if not mine and 0
        expandShown(elCell, i, j)
        cellValue = EMPTY;
    }

    if (gBoard[i][j].isMine) { // you loose
        console.log('you loose');
    }

    renderCell(i, j, cellValue);
    // elCell.classList.remove('blank');
}

function hint(i,j) {
    console.log('h');
    setTimeout(function () {
        isHint=false;

    }, 3000);

// gBoard[i][j].


}

function cellMarked(elCell, i, j) {
    // Called on right click to mark a cell ...

    if (gBoard[i][j].isShown) return;
    var elCell = document.querySelector(`.cell${i}-${j}`);

    if (!gBoard[i][j].isMarked) {// if not marked
        gBoard[i][j].isMarked = true;
        elCell.innerHTML = FLAG;
    } else { //it is mark
        gBoard[i][j].isMarked = false;
        elCell.innerHTML = EMPTY;
    }
    // renderFlag(i, j);
    // gBoard[i][j].isMarked = (gBoard[i][j].isMarked) ? true : false;
    // renderFlag(i, j);
}


function checkGameOver() {
    // when all mines are marked and all the other cells are shown
}

function expandShown(elCell, posI, posJ) { //board
    //When user clicks a cell with no mines around, we need to open not only that cell,
    // but also its neighbors. begin-  opens the non-mine 1st degree neighbors

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === posI && j === posJ) continue;
            if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
                renderCell(i, j, EMPTY);
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.classList.remove('blank');

                // var cellValue = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;
                // renderCell(i, j, cellValue);
                // elCell.classList.remove('blank');
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


