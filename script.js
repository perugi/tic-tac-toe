const Cell = () => {
  let value = " ";

  function getValue() {
    return value;
  }

  function setValue(char) {
    if (!_isCharValid(char) || !_isCellEmpty()) {
      return false;
    }

    value = char;
    return true;
  }

  function _isCharValid(char) {
    return char === "x" || char === "o";
  }

  function _isCellEmpty() {
    return value === " ";
  }

  return { getValue, setValue };
};

const Gameboard = () => {
  let board;
  initializeBoard();

  function initializeBoard() {
    board = [];
    for (let i = 0; i < 3; i++) {
      board.push([]);
      for (let j = 0; j < 3; j++) {
        board[i].push(Cell());
      }
    }
  }

  function getBoard() {
    return board;
  }

  function printBoard() {
    console.log(
      board[0][0].getValue() +
        " | " +
        board[0][1].getValue() +
        " | " +
        board[0][2].getValue()
    );
    console.log("---+---+---");
    console.log(
      board[1][0].getValue() +
        " | " +
        board[1][1].getValue() +
        " | " +
        board[1][2].getValue()
    );
    console.log("---+---+---");
    console.log(
      board[2][0].getValue() +
        " | " +
        board[2][1].getValue() +
        " | " +
        board[2][2].getValue()
    );
  }

  function setCharacter(row, col, char) {
    return board[row][col].setValue(char);
  }

  function detectWinner() {
    // Check rows
    for (let i = 0; i < board.length; i++) {
      let row = _getRow(i);
      if (_allElementsEqual(row) && row[0] !== " ") {
        return row[0];
      }
    }

    // Check columns
    for (let i = 0; i < board.length; i++) {
      let column = _getColumn(i);
      if (_allElementsEqual(column) && column[0] !== " ") {
        return column[0];
      }
    }

    // Check diagonals
    let diagonal = _getDiagonalOne();
    if (_allElementsEqual(diagonal) && diagonal[0] !== " ") {
      return diagonal[0];
    }

    diagonal = _getDiagonalTwo();
    if (_allElementsEqual(diagonal) && diagonal[0] !== " ") {
      return diagonal[0];
    }

    return null;
  }

  function _getRow(row) {
    return board[row].map((cell) => cell.getValue());
  }

  function _getColumn(col) {
    let column = [];
    for (let i = 0; i < board.length; i++) {
      column.push(board[i][col].getValue());
    }
    return column;
  }

  function _getDiagonalOne() {
    let diagonal = [];
    for (let i = 0; i < board.length; i++) {
      diagonal.push(board[i][i].getValue());
    }
    return diagonal;
  }

  function _getDiagonalTwo() {
    let diagonal = [];
    for (let i = 0; i < board.length; i++) {
      diagonal.push(board[i][board.length - 1 - i].getValue());
    }
    return diagonal;
  }

  function isTie() {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j].getValue() === " ") {
          return false;
        }
      }
    }
    return true;
  }

  function _allElementsEqual(array) {
    return array.every((element) => element === array[0]);
  }

  return {
    getBoard,
    setCharacter,
    detectWinner,
    isTie,
    printBoard,
    initializeBoard,
  };
};

const Player = (name, symbol) => {
  return { name, symbol };
};

const gameController = (() => {
  const board = Gameboard();
  let players;

  function _switchPlayerTurn() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getWinner() {
    return winner;
  }

  function newGame(player1Name, player2Name) {
    board.initializeBoard();
    players = [Player(player1Name, "x"), Player(player2Name, "o")];
    currentPlayer = players[0];
    winner = null;

    board.printBoard();
    console.log(`It's ${currentPlayer.name}'s turn.`);
  }

  function playRound(row, col) {
    if (board.setCharacter(row, col, currentPlayer.symbol)) {
      board.printBoard();

      if (board.detectWinner()) {
        console.log(`${currentPlayer.name} wins!`);
        winner = currentPlayer.name;
        return true;
      }

      if (board.isTie()) {
        console.log("It's a tie!");
        winner = "tie";
        return true;
      }

      _switchPlayerTurn();
      console.log(`It's ${currentPlayer.name}'s turn.`);
      return true;
    }
    return false;
  }

  return {
    playRound,
    getCurrentPlayer,
    getBoard: board.getBoard,
    getWinner,
    newGame,
  };
})();

const screenController = (() => {
  const gameboard = document.querySelector(".gameboard");
  const gameInfo = document.querySelector(".game-info");

  _startNewGame();

  function updateScreen() {
    const board = gameController.getBoard();
    gameboard.innerHTML = "";

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        const boardCell = document.createElement("div");
        boardCell.classList.add("board-cell");

        boardCell.dataset.row = i;
        boardCell.dataset.col = j;
        boardCell.textContent = board[i][j].getValue();

        gameboard.appendChild(boardCell);
      }
    }

    if (gameController.getWinner()) {
      if (gameController.getWinner() == "tie") {
        gameInfo.textContent = "It's a tie!";
      } else {
        gameInfo.textContent = `${gameController.getWinner()} wins!`;
      }
      gameboard.removeEventListener("click", _clickBoardCell);
      gameboard.addEventListener("click", _startNewGame);
    } else {
      gameInfo.textContent = `It's ${gameController.getCurrentPlayer().name}'s 
      [${gameController.getCurrentPlayer().symbol}] turn.`;
    }
  }

  function _clickBoardCell(e) {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    if (gameController.playRound(row, col)) {
      updateScreen();
    }
  }

  function _startNewGame() {
    gameController.newGame("Dominik", "Tamara");
    updateScreen();
    gameboard.removeEventListener("click", _startNewGame);
    gameboard.addEventListener("click", _clickBoardCell);
  }

  return { updateScreen };
})();
