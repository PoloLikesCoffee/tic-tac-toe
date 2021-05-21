// factory player
const Player = (name, marker) => {
    return { name, marker};
};

//module gameboard
const gameBoard = (() => {

    //create the board
    let board = [];
    let _colAndRow = 3;
    let boxes = document.querySelector('.boxes');
    let index = 0;
    boxes.style.setProperty('--temp-column', _colAndRow);
    boxes.style.setProperty('--temp-row', _colAndRow);

    for (i = 0; i < (_colAndRow * _colAndRow); i++) {
        board.push('');
        let cell = document.createElement('div');
        cell.classList.add('box');
        cell.setAttribute('data-index', index);
        // {once: ture} => only call this function once
        cell.addEventListener('click', handleClickOnBox, {once: true});
        boxes.appendChild(cell);
        index++;
    }

    //handle the click on each box of the board
    function handleClickOnBox(event) {
        let cell = event.target;
        const index = cell.getAttribute('data-index');
        //switch turn 
        gameCore.switchPlayer();
        //change the class of the cell to 'fire' or 'water' if it is player 1 or player 2 'click'
        gameCore.changeClass();
        //add mark
        gameCore.addMark(cell, gameCore.changeClass());
        //check for win
        //check for draw
        board[index]=gameCore.changeClass();
        gameCore.fillInArray(board);
        gameCore.checkWinner();
    }
    return {
        handleClickOnBox
    }
})();

//module game core
const gameCore = (() => {

    //two players
    const player1 = Player('Maa', 'fire');
    const player2 = Player('Polo', 'water');

    //arrays of both players where boxes are stored
    let array1 = [];
    let array2 = [];

    //if it is true => player 1 turn else => player 2 turn
    let player1Turn = true;

    const span_player1 = document.getElementById('span1');
    const span_player2 = document.getElementById('span2');
    span_player1.innerText = '次の方';

    //end game pop up
    const endScreen = document.querySelector('.end-game-message');
    const p = document.getElementById('winning-text');
    const restartBtn = document.getElementById('restart');
    restartBtn.addEventListener('click', restartGame);

    //array if winning combinations
    const winningArray = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function changeClass() {
        const currentClass = this.player1Turn ? player1.marker : player2.marker;
        return currentClass;
    }

    //add marker of the player in the box
    function addMark(box, class_player) {
        box.classList.add(class_player);
        if (class_player == 'fire') {
            span_player2.innerText = '次の方';
            span_player1.innerText = '';
        } else if (class_player == 'water') {
            span_player1.innerText = '次の方';
            span_player2.innerText = '';
        }
    }

    function switchPlayer() {
        //use var = !var to toggle boolean
        this.player1Turn = !this.player1Turn;
    }

    function fillInArray(board) {
        // const index = cell.getAttribute('data-index');
        board.forEach((item, index) => {
            if (item == player1.marker) {
                //prevent duplicate of index in the array
                if (array1.indexOf(index) === -1) array1.push(index);
            } else if (item == player2.marker) {
                if (array2.indexOf(index) === -1) array2.push(index);
            }
        });
    }

    function checkWinner() {
        winningArray.forEach(combo => {
            let fire_result = combo.every((element) => array1.includes(element));
            let water_result = combo.every((element) => array2.includes(element));
            if (fire_result) {
                endScreen.classList.add('show');
                p.innerText = 'Player 1 is the winner!';
                span_player1.innerText = '';
                span_player2.innerText = '';
            } else if (water_result) {
                endScreen.classList.add('show');
                p.innerText = 'Player 2 is the winner!';
                span_player1.innerText = '';
                span_player2.innerText = '';
            } else if (isDraw() && (!fire_result && !water_result)){
                endScreen.classList.add('show');
                p.innerText = 'It\'s a draw! Maybe next time...';
                span_player1.innerText = '';
                span_player2.innerText = '';
            }
        })
    }

    function isDraw() {
        const boxesElements = document.querySelectorAll('[data-index]');
        return [...boxesElements].every(box => {
            return box.classList.contains('fire') || 
            box.classList.contains('water');
        });
    }

    function restartGame() {
        location.reload();
    }
    return {
        changeClass,
        addMark,
        switchPlayer,
        fillInArray,
        checkWinner
    }
})();