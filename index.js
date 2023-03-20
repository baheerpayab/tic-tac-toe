/* eslint padded-blocks: ["error", { "blocks": "always" }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-use-before-define: ["error", { "variables": false }] */

const runTitlescreen = (() => {

  function playerSelector() {

    function switchOption(option) {

      const playerSelectBtn = option.currentTarget;
      const playerIcon = playerSelectBtn.firstElementChild;
      const currentSelection = playerSelectBtn.dataset.selected;
      const playerName = playerSelectBtn.nextElementSibling;
      switch (currentSelection) {

        case 'user':

          playerIcon.src = './svg/easy.svg';
          playerSelectBtn.style.backgroundColor = 'var(--easy)';
          playerSelectBtn.dataset.selected = 'easy';
          playerName.textContent = 'AI - EASY';
          break;

        case 'easy':

          playerIcon.src = './svg/medium.svg';
          playerSelectBtn.style.backgroundColor = 'var(--medium)';
          playerSelectBtn.dataset.selected = 'medium';
          playerName.textContent = 'AI - MEDIUM';
          break;

        case 'medium':

          playerIcon.src = './svg/hard.svg';
          playerSelectBtn.style.backgroundColor = 'var(--hard)';
          playerSelectBtn.dataset.selected = 'hard';
          playerName.textContent = 'AI - HARD';
          break;

        case 'hard':

          playerIcon.src = './svg/impossible.svg';
          playerSelectBtn.style.backgroundColor = 'var(--impossible)';
          playerSelectBtn.dataset.selected = 'impossible';
          playerName.textContent = 'AI - IMPOSSIBLE';
          break;

        case 'impossible':

          playerIcon.src = './svg/user.svg';
          playerSelectBtn.style.backgroundColor = 'var(--user)';
          playerSelectBtn.dataset.selected = 'user';
          playerName.textContent = 'USER';
          break;

        default:
          break;

      }

    }

    const selectors = Array.from(document.getElementsByClassName('selector'));
    selectors.forEach((option) => {

      option.addEventListener('click', switchOption);

    });

  }

  const startGame = () => {

    function titleToGameTransition() {

      const titlescreen = document.getElementById('titlescreen');
      const gamescreen = document.getElementById('gamescreen');

      titlescreen.classList.add('slide-out-transition');
      gamescreen.classList.remove('hidden');
      setTimeout(() => {

        titlescreen.classList.add('hidden');
        titlescreen.classList.remove('slide-out-transition');
        gamescreen.classList.add('slide-in-bottom-transition');
        setTimeout(() => {

          gamescreen.classList.add('game-active');
          gamescreen.classList.remove('slide-in-bottom-transition');

        }, 500);

      }, 500);

    }

    const xSelected = document.getElementById('x-selector').dataset.selected;
    const oSelected = document.getElementById('o-selector').dataset.selected;

    titleToGameTransition();
    gameboard.updatePlayers(xSelected, oSelected);
    gameboard.isCurrentPlayerAi();

  };

  const gameToTitleTransition = () => {

    const overlay = document.getElementById('overlay');
    const titlescreen = document.getElementById('titlescreen');
    const gamescreen = document.getElementById('gamescreen');

    overlay.classList.add('hidden');
    titlescreen.classList.remove('hidden');
    titlescreen.classList.add('slide-in-top-transition');
    setTimeout(() => {

      gamescreen.classList.add('hidden');
      gamescreen.classList.remove('game-active');
      titlescreen.classList.remove('slide-in-top-transition');

    }, 500);

  };

  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', startGame);

  playerSelector();

  return {
    gameToTitleTransition,
  };

})();

const Player = (playerName, playerSign, turn) => {

  let name = playerName;

  let isTurn = turn;

  let wins = 0;

  let movesMade = 0;

  const updateName = (newName) => {

    name = newName;

  };

  const addWin = () => {

    wins += 1;

  };

  const addMove = () => {

    movesMade += 1;

  };

  const resetWins = () => {

    wins = 0;

  };

  const resetMoves = () => {

    movesMade = 0;

  }

  const getSign = () => playerSign;

  const getWins = () => wins;

  const getMoves = () => movesMade;

  const getName = () => name;

  return {

    isTurn,
    wins,
    updateName,
    addWin,
    resetWins,
    getSign,
    getWins,
    getName,
    movesMade,
    addMove,
    getMoves,
    resetMoves,

  };

};

const aiPlayer = (() => {

  const findBestMove = (ai, gameArray) => {

    const mySign = ai.getSign();
    const enemySign = mySign === 'X' ? 'O' : 'X';
    console.log(enemySign);
    console.log(ai.getMoves());

    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const currentCombos = winPatterns.map((e) => e.map((x) => gameArray[x]));

    const getBlockMove = () => {

      const blockWinCombo = currentCombos.filter((e) => (
        (e[0] === e[1]) && (e[2] === null) && (e[0] === enemySign))
      || ((e[1] === e[2]) && (e[0] === null) && (e[1] === enemySign))
      || ((e[0] === e[2]) && (e[1] === null) && (e[2] === enemySign)));

      const blockWinComboIndex = function indexOfArray(val, array) {

        const hash = {};
        for (let i = 0; i < array.length; i += 1) {

          hash[array[i]] = i;

        }
        return (hash.hasOwnProperty(val)) ? hash[val] : -1;

      };

      const missingMoveIndex = (array) => {

        if (array.length !== 0) {

          const newArray = array[0];
          console.log(newArray);
          return newArray.indexOf(null);

        }

        return false;

      };

      const blockWin = () => {

        const blockWinPattern = blockWinComboIndex(blockWinCombo, currentCombos);
        console.log(blockWinPattern);
        const missingBlockMove = missingMoveIndex(blockWinCombo);
        console.log(missingBlockMove);

        if (missingBlockMove !== false) {

          return winPatterns[blockWinPattern][missingBlockMove];

        }

        return false;

      };

      return blockWin();

    };

    const getWinMove = () => {

      const winCombo = currentCombos.filter((e) => (
        (e[0] === e[1]) && (e[2] === null) && (e[0] === mySign))
      || ((e[1] === e[2]) && (e[0] === null) && (e[1] === mySign))
      || ((e[0] === e[2]) && (e[1] === null) && (e[2] === mySign)));

      const winComboIndex = function indexOfArray(val, array) {

        const hash = {};
        for (let i = 0; i < array.length; i += 1) {

          hash[array[i]] = i;

        }
        return (hash.hasOwnProperty(val)) ? hash[val] : -1;

      };

      const missingMoveIndex = (array) => {

        if (array.length !== 0) {

          const newArray = array[0];
          console.log(newArray);
          return newArray.indexOf(null);

        }

        return false;

      };

      const getWin = () => {

        const getWinPattern = winComboIndex(winCombo, currentCombos);
        console.log(getWinPattern);
        const missingWinMove = missingMoveIndex(winCombo);
        console.log(missingWinMove);

        if (missingWinMove !== false) {

          return winPatterns[getWinPattern][missingWinMove];

        }

        return false;

      };

      return getWin();

    };

    if ((getBlockMove() !== false) && (getWinMove() !== false)) {

      return getWinMove();

    }

    if (getBlockMove() !== false) {

      return getBlockMove();

    }

    if (gameArray[4] === enemySign) {

      const corners = [0, 2, 6, 8];
      return corners[Math.floor(Math.random() * corners.length)];

    }

    if (((gameArray[0] || gameArray[2]
      || gameArray[6] || gameArray[8]) === enemySign || mySign)
      && ai.getMoves() === 0) {

      console.log('center is the best move');
      return 4;

    }

    if (((gameArray[1] || gameArray[3]
      || gameArray[5] || gameArray[7]) === enemySign)
      && ai.getMoves === 0) {

      console.log('random move is the best move');
      return getRandomMove();

    }


    if (ai.getMoves() > 0) {

      return getRandomMove(gameArray);

    }

    if (((gameArray[1] || gameArray[3]
      || gameArray[5] || gameArray[7]) === null)
      && ai.getMoves === 0) {

      const corners = [0, 2, 6, 8];
      return corners[Math.floor(Math.random() * corners.length)];

    }

  };

  const getRandomMove = (gameArray) => {

    const emptyCells = [];
    for (let i = 0; i < gameArray.length; i += 1) {

      if (gameArray[i] === null) {

        emptyCells.push(i);

      }

    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];

  };

  return {

    findBestMove,
    getRandomMove,

  };

})();

const gameboard = (() => {

  let gameArray = Array(9).fill(null);
  let roundCount = 1;

  const playerX = Player('user', 'X', true);
  const playerO = Player('easy', 'O', false);

  const updatePlayers = (newX, newO) => {

    playerX.updateName(newX);
    playerO.updateName(newO);
    gameDisplay.renderPlayers(playerX, playerO);
    gameDisplay.renderPlayerTurn(playerX, playerO);

  };

  const updateWins = (winner) => {

    switch (winner) {

      case 'tie':
        return 'tie';

      default:
        winner.addWin();
        gameDisplay.renderWins(playerX, playerO);
        return winner.getWins();

    }

  };

  const changeTurn = () => {

    if (playerX.isTurn === true) {

      playerX.isTurn = false;
      playerO.isTurn = true;
      gameDisplay.renderPlayerTurn(playerO, playerX);
      isCurrentPlayerAi();

    } else {

      playerO.isTurn = false;
      playerX.isTurn = true;
      gameDisplay.renderPlayerTurn(playerX, playerO);
      isCurrentPlayerAi();

    }

  };

  const currentPlayer = () => (playerO.isTurn === true ? playerO : playerX);

  const isCurrentPlayerAi = () => {

    if (currentPlayer().getName() === 'user') {

      console.log('is not AI');
      gameDisplay.bind();

    } else {

      console.log('is AI');
      gameDisplay.unbind();
      makeAiMove();

    }

  };

  const makeMove = (e) => {

    if (e.target.id === 'grid'
    || e.target.hasChildNodes()
    || !e.target.classList.contains('grid-cell')) {

      return;

    }

    const cell = e.target;
    const i = cell.dataset.cell;

    gameArray[i] = currentPlayer().getSign();
    console.log(playerX.isTurn);
    gameDisplay.renderSign(i, currentPlayer().getSign());

    changeTurn();
    checkWinOrTie();

  };

  const makeAiMove = () => {

    console.log('ai move');

    const bestMove = aiPlayer.findBestMove(currentPlayer(), gameArray);
    const randomMove = aiPlayer.getRandomMove(gameArray);

    currentPlayer().addMove();

    gameArray[bestMove] = currentPlayer().getSign();
    gameDisplay.renderSign(bestMove, currentPlayer().getSign());

    setTimeout(() => {

      changeTurn();
      checkWinOrTie();

    }, 2000);

  };

  const checkWinOrTie = () => {

    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const isX = (currentValue) => currentValue === 'X';
    const isO = (currentValue) => currentValue === 'O';

    const currentCombos = winPatterns.map((e) => e.map((x) => gameArray[x]));

    const Xwin = currentCombos.map((e) => e.every(isX));

    const Owin = currentCombos.map((e) => e.every(isO));

    const checkForWinner = () => {

      if (Xwin.includes(true)) return playerX;
      if (Owin.includes(true)) return playerO;
      return false;

    };

    const checkTie = () => {

      if (!gameArray.includes(null) && checkForWinner() === false) {

        return 'tie';

      }

      return false;

    };

    if (checkForWinner() !== false) {

      endRound(checkForWinner());
      return checkForWinner();

    }

    if (checkTie() === 'tie') {

      endRound('tie');
      return checkTie();

    }

  };

  const endRound = (winner) => {

    if (updateWins(winner) === 3) {

      endGame(winner);

    } else {

      console.log('round over');
      newRound();

    }

  };

  const newRound = () => {

    roundCount += 1;
    gameDisplay.renderRound(roundCount);
    gameArray = Array(9).fill(null);
    playerX.isTurn = true;
    playerO.isTurn = false;
    playerX.resetMoves();
    playerO.resetMoves();
    gameDisplay.renderPlayerTurn(playerX, playerO);
    isCurrentPlayerAi();

  };

  const endGame = (winner) => {

    console.log('game over');
    gameDisplay.unbind();
    gameDisplay.renderPlayerTurn(playerX, playerO).unrender();
    gameDisplay.renderWinModal(winner);

  };

  const resetGame = () => {

    gameArray = Array(9).fill(null);
    roundCount = 1;
    gameDisplay.renderRound(roundCount);
    playerX.isTurn = true;
    playerO.isTurn = false;
    playerX.resetWins();
    playerO.resetWins();
    gameDisplay.renderWins(playerX, playerO);

  };

  return {

    makeMove,
    currentPlayer,
    isCurrentPlayerAi,
    changeTurn,
    checkWinOrTie,
    updatePlayers,
    resetGame,

  };

})();

const gameDisplay = (() => {

  const grid = document.getElementById('grid');
  const gridCells = Array.from(document.getElementsByClassName('grid-cell'));

  const signImg = (sign) => {

    const img = document.createElement('img');
    img.src = (sign === 'X' ? './svg/x.svg' : './svg/o.svg');
    img.classList.add('cell-sign');

    return img;

  };

  const bind = () => {

    grid.addEventListener('click', gameboard.makeMove);

  };

  const unbind = () => {

    grid.removeEventListener('click', gameboard.makeMove);

  };

  const renderPlayerTurn = (current, waiting) => {

    const currentPlayer = document.getElementById(`player-profile-${current.getSign().toLowerCase()}`);
    const waitingPlayer = document.getElementById(`player-profile-${waiting.getSign().toLowerCase()}`);
    console.log(current.isTurn);

    currentPlayer.firstElementChild.style.animation = 'small-float 2s ease-in-out infinite';
    currentPlayer.style.boxShadow = '0px 0px 20px #333333';
    waitingPlayer.firstElementChild.style.animation = '';
    waitingPlayer.style.boxShadow = '';

    const unrender = () => {

      currentPlayer.firstElementChild.style.animation = '';
      currentPlayer.style.boxShadow = '';
      waitingPlayer.firstElementChild.style.animation = '';
      waitingPlayer.style.boxShadow = '';

    };

    return {
      unrender,
    };

  };

  const renderSign = (i, sign) => {

    // console.log(gridCells);
    // console.log(i);
    // console.log(gridCells[i]);
    gridCells[i].appendChild(signImg(sign));

  };

  const renderWins = (playerX, playerO) => {

    const xWins = document.getElementById('x-wins');
    const oWins = document.getElementById('o-wins');

    xWins.textContent = playerX.getWins();
    oWins.textContent = playerO.getWins();

  };

  const renderPlayers = (playerX, playerO) => {

    const renderPlayer = (player) => {

      const playerProfile = document.getElementById(`player-profile-${player.getSign().toLowerCase()}`);
      playerProfile.firstElementChild.src = `./svg/${player.getName()}.svg`;
      playerProfile.style.backgroundColor = `var(--${player.getName()})`;
      const playerName = playerProfile.nextElementSibling;
      switch (player.getName()) {

        case 'user':
          playerName.textContent = 'USER';
          break;

        case 'easy':
          playerName.textContent = 'AI - EASY';
          break;

        case 'medium':
          playerName.textContent = 'AI - MEDIUM';
          break;

        case 'hard':
          playerName.textContent = 'AI - HARD';
          break;

        case 'impossible':
          playerName.textContent = 'AI - IMPOSSIBLE';
          break;

        default:
          break;

      }

    };

    renderPlayer(playerX);
    renderPlayer(playerO);

  };

  const renderRound = (roundCount) => {

    const roundTitle = document.getElementById('round');
    roundTitle.textContent = `ROUND ${roundCount}`;
    gridCells.forEach((e) => {

      e.innerHTML = '';

    });

  };

  const renderWinModal = (winner) => {

    const overlay = document.getElementById('overlay');
    const returnBtn = document.getElementById('return-btn');
    const winModal = document.getElementById('win-modal');
    const winnerProfile = document.getElementById('winner-profile');

    winnerProfile.style.backgroundColor = `var(--${winner.getName()})`;
    winnerProfile.firstChild.src = `./svg/${winner.getName()}.svg`;
    winnerProfile.firstChild.style.animation = 'small-float 2s ease-in-out infinite';

    const setWinnerTxt = () => {

      const winnerTxt = document.getElementById('winner-txt');

      switch (winner.getName()) {

        case 'user':
          winnerTxt.textContent = `USER \n(${winner.getSign()}) WINS!`;
          break;

        case 'easy':
          winnerTxt.textContent = `AI - EASY \n(${winner.getSign()}) WINS!`;
          break;

        case 'medium':
          winnerTxt.textContent = `AI - MEDIUM \n(${winner.getSign()}) WINS!`;
          break;

        case 'hard':
          winnerTxt.textContent = `AI - HARD \n(${winner.getSign()}) WINS!`;
          break;

        case 'impossible':
          winnerTxt.textContent = `AI - IMPOSSIBLE \n(${winner.getSign()}) WINS!`;
          break;

        default:
          break;

      }

    };

    const resetAndReturn = () => {

      runTitlescreen.gameToTitleTransition();
      gameboard.resetGame();

    };

    setWinnerTxt();
    overlay.classList.remove('hidden');
    returnBtn.addEventListener('click', resetAndReturn);

  };

  return {

    bind,
    renderPlayerTurn,
    renderSign,
    renderWins,
    renderPlayers,
    renderRound,
    unbind,
    renderWinModal,

  };

})();


/* function switchOption(option) {
  const playerSelectBtn = option.currentTarget;
  const playerIcon = playerSelectBtn.firstChild;
  const playerName =
  if (playerSelectBtn.classList.contains('user')) {
    playerIcon.src = './svg/easy.svg';
    playerSelectBtn.classList.remove('user');
    playerSelectBtn.classList.add('easy');
  } else if (playerSelectBtn.classList.contains('easy')) {
    playerIcon.src = './svg/medium.svg';
    playerSelectBtn.classList.remove('easy');
    playerSelectBtn.classList.add('medium');
  } else if (playerSelectBtn.classList.contains('medium')) {
    playerIcon.src = './svg/hard.svg';
    playerSelectBtn.classList.remove('medium');
    playerSelectBtn.classList.add('hard');
  } else if (playerSelectBtn.classList.contains('hard')) {
    playerIcon.src = './svg/impossible.svg';
    playerSelectBtn.classList.remove('hard');
    playerSelectBtn.classList.add('impossible');
  } else if (playerSelectBtn.classList.contains('impossible')) {
    playerIcon.src = './svg/user.svg';
    playerSelectBtn.classList.remove('impossible');
    playerSelectBtn.classList.add('user');
  }
} */
