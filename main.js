const Player = (name, marker, turn) => {
    return { name, marker, turn};
};

const gameBoard = (() => {
    //initialization player
    const player1 = Player('Maa', 'fire', true);
    const player2 = Player('Polo', 'water', false);
    let winner = null;
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    //nb of turns
    let turn = 9;
    //use for changing background color of the cell
    let theWinningCombo = [];
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
    let boxes = document.querySelector('.boxes');
    //initialization of index for each cell
    let index = 0;
    //set the css property of the html board
    boxes.style.setProperty('--temp-column', _colAndRow);
    boxes.style.setProperty('--temp-row', _colAndRow);
    
    //create the board in the array and the html
    for (i = 0; i < (_colAndRow * _colAndRow); i++) {
        board.push('');
        let cell = document.createElement('div');
        cell.classList.add('box');
        cell.setAttribute('data-index', index);
        boxes.appendChild(cell);
        index++;
    }
    //first feature, trigger event listener on cell of the board (one by one)
    const changePlayerTurn = (function () {
        const gameBoxes = document.querySelectorAll('.box');
        gameBoxes.forEach(box => {
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
            gameBoxes
        }
    })();

    //second feature, check if either players have one of the winning combinations
    checkWinner = () => {
        turn--;
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
                winner = 'player1';
                theWinningCombo = combo;
            } else if (combo.every(element => waterMoves.includes(element))) {
                winner = 'player2';
                theWinningCombo = combo;
            } else if (winner == null && winner == undefined && turn == 0) {
                winner = 'tie';
                theWinningCombo = combo;
            }
        });
        showRoundDisplay();
        return theWinningCombo;
    }

    //third feature, reset any important variables to start a new round
    resetGame = () => {
        if (winner === 'player1') {
            player1.turn = false;
            player2.turn = true;
        } else if (winner === 'player2') {
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
        winner = null;
        theWinningCombo = undefined;
        
        turn = 9;
        board.splice(0, board.length);
        for (let i = 0; i < boxes.children.length; i++) {
            //change background color of cells to no color
            boxes.children[i].classList.remove('fire');
            boxes.children[i].classList.remove('water');
            boxes.children[i].classList.remove('winningCombo');
        }
    }

    //display part
    
    //fourth feature, display the round screen and the winning combo
    const gameBoxes = document.querySelectorAll('.box');
    const endRoundScreen = document.querySelector('.end-round-message');
    const endRoundText = document.getElementById('round-text');
    const reloadGameScreen = document.querySelector('.reload-game-message');
    const reloadGameText = document.getElementById('winning-text');
    
    //fifth feature, add score to players
    const score1 = document.getElementById('span1');
    const score2 = document.getElementById('span2');
    showRoundDisplay = () => {
        //first => show the winning combination
        showWinningCombo = () => {
            theWinningCombo.forEach((item, index) => {
                const boxToColor = gameBoxes.item(item);
                boxToColor.classList.add('winningCombo');
            });
        };
        //second => show the winner or tie
        if(winner === 'player1') {
            endRoundText.innerText = 'Player1 win!';
            scorePlayer1 += 1;
            score1.textContent = scorePlayer1;
            showWinningCombo();
        } else if (winner === 'player2') {
            endRoundText.innerText = 'Player2 win!';
            scorePlayer2 += 1;
            score2.innerText = scorePlayer2;
            showWinningCombo();
        } else if (winner === 'tie') {
            endRoundText.innerText = "It's a tie";
        } else {
            return;
        };
        //third, display next round screen or end game screen
        if (scorePlayer1 < 5 && scorePlayer2 < 5) {
            endRoundScreen.classList.add('show');
        } else {
            showTheFinalWinner(scorePlayer1, scorePlayer2);
        }
    }
    
    //sixth feature, click on button to start next round and remove round message
    removeRoundDisplay = () => {
        resetGame();
        endRoundScreen.classList.remove('show');
    }

    //seventh feature, first to 5points win the game and reload game
    showFinalDisplay = (scoreP1, scoreP2) => {
        if (scoreP1 >= 5) {
            reloadGameScreen.classList.add('show');
            reloadGameText.innerText = "Player1 is the Champion!";
        }else if (scoreP2 >= 5) {
            reloadGameScreen.classList.add('show');
            reloadGameText.innerText = "Player2 is the Champion!";
        } else {
            return;
        }
    }

    const restartBtn = document.getElementById('restart');
    restartBtn.addEventListener('click', removeRoundDisplay);

    const reloadBtn = document.getElementById('reload');
    reloadBtn.addEventListener('click', () => { location.reload(); });

    return {    
        board,
        changePlayerTurn, 
        checkWinner, 
        resetGame, 
        theWinningCombo,
        winner,
        showRoundDisplay,
        removeRoundDisplay,
        showFinalDisplay
    }
})();
