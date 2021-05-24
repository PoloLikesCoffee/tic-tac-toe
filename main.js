const Player = (name, marker, turn) => {
    return { name, marker, turn};
};

const gameBoard = (() => {
    //initialization players
    const player1 = Player('Maa', 'fire', true);
    const player2 = Player('Polo', 'water', false);
    let winner = null;
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    //nb of turns
    let numberTurn = 9;
    //use for changing background color of the cell
    let winningCombination = [];
    //every winning combination
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
    //array of board
    let board = [];
    //nb of columns and rows of the board
    let _colAndRow = 3;
    //get the html board
    let boxContainer = document.querySelector('.boxes');
    //initialization of index for each cell
    let index = 0;
    //set the css property of the html board
    boxContainer.style.setProperty('--temp-column', _colAndRow);
    boxContainer.style.setProperty('--temp-row', _colAndRow);
    
    //create the board in the array and the html
    for (i = 0; i < (_colAndRow * _colAndRow); i++) {
        board.push('');
        let cell = document.createElement('div');
        cell.classList.add('box');
        cell.setAttribute('data-index', index);
        boxContainer.appendChild(cell);
        index++;
    }
    //first feature, trigger event listener on cell of the board (one by one)
    const changePlayerTurn = (function () {
        const allBoxes = document.querySelectorAll('.box');
        allBoxes.forEach(box => {
            box.addEventListener('click', e => {
                const index = e.target.getAttribute('data-index');
                if (player1.turn == true && winner == null) {
                    board[index] = player1.marker;
                    box.classList.add('fire');
                    player1.turn = false;
                    player2.turn = true;
                } else if (player2.turn == true && winner == null) {
                    board[index] = player2.marker;
                    box.classList.add('water');
                    player1.turn = true;
                    player2.turn = false;
                } else {
                    //stop when winner = true
                    return;
                }
                checkWinner();
            });
        });
        return {
            allBoxes
        }
    })();

    //second feature, check if either players have one of the winning combinations
    checkWinner = () => {
        numberTurn--;
        let fireMoves = [];
        let waterMoves = [];
        //check elements inside the board array and move the index of the element inside either fire array or water move
        board.forEach((item, index) => {
            if (item == player1.marker) {
                if (fireMoves.indexOf(index) === -1) fireMoves.push(index);
            } else if (item == player2.marker) {
                if (waterMoves.indexOf(index) === -1) waterMoves.push(index);
            }
        });
        //compare the each winning combo with elements inside fire array and water array
        winningArray.forEach(combo => {
            if (combo.every(element => fireMoves.includes(element))) {
                gameBoard.winner = 'player1';
                gameBoard.winningCombination = combo;
            } else if (combo.every(element => waterMoves.includes(element))) {
                gameBoard.winner = 'player2';
                gameBoard.winningCombination = combo;
            } else if (winner == null && winner == undefined && numberTurn <= 0) {
                gameBoard.winner = 'tie';
                gameBoard.winningCombination = combo;
            }
        });
        displayController.displayWinnerRound();
        return winningCombination;
    }

    //third feature, reset any important variables to start a new round
    resetBoard = () => {
        if (gameBoard.winner === 'player1') {
            player1.turn = false;
            player2.turn = true;
        } else if (gameBoard.winner === 'player2') {
            player1.turn = true;
            player2.turn = false;
        } else {
            if (Math.random() < 0.5) {
                player1.turn = false;
                player2.turn = true;
            } else {
                player1.turn = true;
                player2.turn = false;
            }
        }
        gameBoard.winner = null;
        gameBoard.winningCombination = undefined;
        
        numberTurn = 9;
        board.splice(0, board.length);
        for (let i = 0; i < boxContainer.children.length; i++) {
            //change background color of cells to default cell color
            boxContainer.children[i].classList.remove('fire');
            boxContainer.children[i].classList.remove('water');
            boxContainer.children[i].classList.remove('winningCombo');
            boxContainer.children[i].classList.remove('none');
        }
    }

    return {    
        board,
        changePlayerTurn, 
        checkWinner, 
        resetBoard, 
        winningCombination,
        winner,
        scorePlayer1,
        scorePlayer2,
        boxContainer
    }
})();

const displayController = (() => {
    
    //fourth feature, display the round screen and the winning combo
    const allBoxes = document.querySelectorAll('.box');
    const roundDisplay = document.querySelector('.end-round-message');
    const roundDisplayText = document.getElementById('round-text');
    const finalDisplay = document.querySelector('.reload-game-message');
    const finalText = document.getElementById('winning-text');
    //first => show the winning combination
    displayWinCombo = () => {
        gameBoard.winningCombination.forEach((item, index) => {
            const boxToColor = allBoxes.item(item);
            boxToColor.classList.add('winningCombo');
        });
    }
    //fifth feature, add score to players
    const scoreP1 = document.getElementById('span1');
    const scoreP2 = document.getElementById('span2');
    displayWinnerRound = () => {
        //second => show the winner or tie
        if(gameBoard.winner === 'player1') {
            roundDisplayText.innerText = 'Player1 win!';
            gameBoard.scorePlayer1 += 1;
            scoreP1.textContent = gameBoard.scorePlayer1;
            displayWinCombo();
        } else if (gameBoard.winner === 'player2') {
            roundDisplayText.innerText = 'Player2 win!';
            gameBoard.scorePlayer2 += 1;
            scoreP2.innerText = gameBoard.scorePlayer2;
            displayWinCombo();
        } else if (gameBoard.winner === 'tie') {
            roundDisplayText.innerText = "It's a tie";
        } else {
            return;
        };
        //third, display next round screen or end game screen
        if (gameBoard.scorePlayer1 < 5 && gameBoard.scorePlayer2 < 5) {
            roundDisplay.classList.add('show');
            disableAllBoxes();
        } else {
            displayWinnerGame(gameBoard.scorePlayer1, gameBoard.scorePlayer2);
            disableAllBoxes();
        }
    }

    disableAllBoxes = () => {
        for (let i = 0; i < gameBoard.boxContainer.children.length; i++) {
            gameBoard.boxContainer.children[i].classList.add('none');
        }
    }
    
    //sixth feature, click on button to start next round and remove round message
    removeDisplay = () => {
        gameBoard.resetBoard();
        roundDisplay.classList.remove('show');
    }

    //seventh feature, first to 5points win the game and reload game
    displayWinnerGame = (scoreP1, scoreP2) => {
        if (scoreP1 >= 5) {
            finalDisplay.classList.add('show');
            finalText.innerText = "Player1 is the Champion!";
        }else if (scoreP2 >= 5) {
            finalDisplay.classList.add('show');
            finalText.innerText = "Player2 is the Champion!";
        } else {
            return;
        }
    }

    const nextRoundBtn = document.getElementById('new-round');
    nextRoundBtn.addEventListener('click', removeDisplay);

    const reloadBtn = document.getElementById('reload');
    reloadBtn.addEventListener('click', () => { location.reload(); });
    return {
        displayWinnerRound,
        removeDisplay,
        displayWinnerGame,
        disableAllBoxes
    }
})();