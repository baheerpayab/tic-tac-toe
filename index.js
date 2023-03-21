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
    gameboard.isCurrentPlayerAi(false);

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
    // console.log(enemySign);
    // console.log(ai.getMoves());

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

      const missingBlockMoveIndex = (array) => {

        if (array.length !== 0) {

          const newArray = array[0];
          // console.log(newArray);
          return newArray.indexOf(null);

        }

        return false;

      };

      const blockWin = () => {

        const blockWinPattern = blockWinComboIndex(blockWinCombo, currentCombos);
        // console.log(blockWinPattern);
        const missingBlockMove = missingBlockMoveIndex(blockWinCombo);
        // console.log(missingBlockMove);

        if (missingBlockMove !== false && blockWinPattern !== -1) {

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

      const missingWinMoveIndex = (array) => {

        if (array.length !== 0) {

          const newArray = array[0];
          // console.log(newArray);
          return newArray.indexOf(null);

        }

        return false;

      };

      const getWin = () => {

        const getWinPattern = winComboIndex(winCombo, currentCombos);
        // console.log(winCombo);
        // console.log(getWinPattern);
        const missingWinMove = missingWinMoveIndex(winCombo);
        // console.log(missingWinMove);

        if (missingWinMove !== false && getWinPattern !== -1) {

          return winPatterns[getWinPattern][missingWinMove];

        }

        return false;

      };

      return getWin();

    };

    if ((getBlockMove() !== false) && (getWinMove() !== false)) {

      console.log('winning');
      return getWinMove();

    }

    if (getBlockMove() !== false) {

      console.log('blocking');
      return getBlockMove();

    }

    if (getWinMove() !== false) {

      console.log('winning');
      return getWinMove();

    }

    if ((gameArray[4] === null)
    && ((gameArray[0] === null) && (gameArray[2] === null)
    && (gameArray[6] === null) && (gameArray[8] === null))
    && (ai.getMoves() === 0)) {

      console.log('cornering to win');
      const corners = [0, 2, 6, 8];
      return corners[Math.floor(Math.random() * corners.length)];

    }

    if ((gameArray[4] === enemySign)
    && ((gameArray[0] && gameArray[2] && gameArray[6] && gameArray[8]) === null)
    && ai.getMoves() === 0) {

      console.log('cornering');
      const corners = [0, 2, 6, 8];
      const move = corners[Math.floor(Math.random() * corners.length)];

      if (gameArray[move] === null) {

        return move;

      }

      console.log('trying again');
      findBestMove(ai, gameArray);

    }

    if (((gameArray[1] || gameArray[3]
      || gameArray[5] || gameArray[7]) === null)
      && ai.getMoves === 0) {

      console.log('cornering two');
      const corners = [0, 2, 6, 8];
      return corners[Math.floor(Math.random() * corners.length)];

    }

    if (((gameArray[0] && gameArray[7]) === enemySign) && ai.getMoves() === 1) {

      console.log('first');
      return 6;

    }

    if (((gameArray[2] && gameArray[7]) === enemySign) && ai.getMoves() === 1) {

      console.log('second');
      return 8;

    }

    if (((gameArray[0] && gameArray[5]) === enemySign) && ai.getMoves() === 1) {

      console.log('third');
      return 2;

    }

    if (((gameArray[6] && gameArray[5]) === enemySign) && ai.getMoves() === 1) {

      console.log('fourth');
      return 8;

    }

    if (((gameArray[6] && gameArray[1]) === enemySign) && ai.getMoves() === 1) {

      console.log('fifth');
      return 0;

    }

    if (((gameArray[8] && gameArray[1]) === enemySign) && ai.getMoves() === 1) {

      console.log('sixth');
      return 2;

    }

    if (((gameArray[8] && gameArray[3]) === enemySign) && ai.getMoves() === 1) {

      console.log('seventh');
      return 6;

    }

    if (((gameArray[2] && gameArray[4]) === enemySign) && ai.getMoves() === 1) {

      console.log('eigth');
      return 0;

    }

    if (((gameArray[0] || gameArray[2]
      || gameArray[6] || gameArray[8]) === enemySign)
      && ai.getMoves() === 0) {

      console.log('centering to block');
      return 4;

    }

    if (((gameArray[0] || gameArray[2]
      || gameArray[6] || gameArray[8]) === mySign)
      && ai.getMoves() === 0) {

      console.log('centering to win');
      return 4;

    }

    if (((gameArray[1] || gameArray[3]
      || gameArray[5] || gameArray[7]) === enemySign)
      && ai.getMoves === 0) {

      console.log('randoming');
      return getRandomMove();

    }

    if ((gameArray[4] === mySign) && ai.getMoves() < 2) {

      console.log('middling');
      const middles = [1, 3, 5, 7];
      const move = middles[Math.floor(Math.random() * middles.length)];

      if (gameArray[move] === null) {

        return move;

      }

      console.log('trying again');
      findBestMove(ai, gameArray);

    }

    if (ai.getMoves() > 0) {

      console.log('randoming');
      return getRandomMove(gameArray);

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

  let state = false;

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

    if (gameArray.indexOf(null) !== -1) {

      if (playerX.isTurn === true) {

        playerX.isTurn = false;
        playerO.isTurn = true;
        gameDisplay.renderPlayerTurn(playerO, playerX);

      } else {

        playerO.isTurn = false;
        playerX.isTurn = true;
        gameDisplay.renderPlayerTurn(playerX, playerO);

      }

    }

  };

  const currentPlayer = () => (playerO.isTurn === true ? playerO : playerX);

  const isCurrentPlayerAi = (pause) => {

    if (currentPlayer().getName() === 'user') {

      console.log('is not AI');
      gameDisplay.bind();

    } else if (pause === false) {

      console.log('is AI');
      gameDisplay.unbind();
      makeAiMove();

    } else {

      return;

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
    // console.log(playerX.isTurn);
    gameDisplay.renderSign(i, currentPlayer().getSign());

    changeTurn();
    state = checkWinOrTie();
    isCurrentPlayerAi(state);

  };

  const makeAiMove = () => {

    console.log('ai move');

    const bestMove = aiPlayer.findBestMove(currentPlayer(), gameArray);
    const randomMove = aiPlayer.getRandomMove(gameArray);
    let chosenMove = 0;

    currentPlayer().addMove();

    switch (currentPlayer().getName()) {

      case 'easy':
        if (Math.random() < 0.25) {

          gameArray[bestMove] = currentPlayer().getSign();
          chosenMove = bestMove;

        } else {

          gameArray[randomMove] = currentPlayer().getSign();
          chosenMove = randomMove;

        }
        break;

      case 'medium':
        if (Math.random() < 0.65) {

          gameArray[bestMove] = currentPlayer().getSign();
          chosenMove = bestMove;

        } else {

          gameArray[randomMove] = currentPlayer().getSign();
          chosenMove = randomMove;

        }
        break;

      case 'hard':
        if (Math.random() < 0.90) {

          gameArray[bestMove] = currentPlayer().getSign();
          chosenMove = bestMove;

        } else {

          gameArray[randomMove] = currentPlayer().getSign();
          chosenMove = randomMove;

        }
        break;

      case 'impossible':
        gameArray[bestMove] = currentPlayer().getSign();
        chosenMove = bestMove;
        break;

      default:
        if (Math.random() < 0.25 / 100) gameArray[bestMove] = currentPlayer().getSign();

    }

    setTimeout(() => {

      gameDisplay.renderSign(chosenMove, currentPlayer().getSign());

    }, 500);

    const time = (playerX && playerO) !== 'user' ? 1000 : 0;
    setTimeout(() => {

      changeTurn();
      state = checkWinOrTie();
      isCurrentPlayerAi(state);

    }, time);

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

    // const winningCombo = currentCombos.filter((e) => ((e[0] === e[1]) && (e[1] === e[2])));

    // const winningComboIndex = function indexOfArray(val, array) {

    //   const hash = {};
    //   for (let i = 0; i < array.length; i += 1) {

    //     hash[array[i]] = i;

    //   }
    //   return (hash.hasOwnProperty(val)) ? hash[val] : -1;

    // };

    // console.log(winningComboIndex(winningCombo, currentCombos));

    // const winningComboCells = winPatterns[winningComboIndex(winningCombo, currentCombos)];

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

      gameDisplay.highlightWin(checkForWinner());
      endRound(checkForWinner());
      return checkForWinner();

    }

    if (checkTie() === 'tie') {

      gameDisplay.highlightTie();
      endRound('tie');
      return checkTie();

    }

    return false;

  };

  const endRound = (winner) => {

    if (updateWins(winner) === 3) {

      endGame(winner);

    } else {

      setTimeout(() => {

        newRound();

      }, 1000);

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
    state = false;
    isCurrentPlayerAi(state);

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
    img.dataset.sign = `${sign}`;

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
    // console.log(current.isTurn);

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

  const highlightWin = (winner) => {

    const winnerSign = winner.getSign();
    console.log(winnerSign);
    const winnerCells = Array.from(document.querySelectorAll(`[data-sign="${winnerSign}"]`));
    console.log(winnerCells);
    // console.log(document.querySelectorAll('[src="./svg/x.svg"]'));

    for (let i = 0; i < winnerCells.length; i += 1) {

      winnerCells[i].parentElement.style.backgroundColor = '#A3D7A2';

    }

  };

  const highlightTie = () => {

    for (let i = 0; i < gridCells.length; i += 1) {

      gridCells[i].style.backgroundColor = '#e8e2b0';

    }

  };

  const renderRound = (roundCount) => {

    const roundTitle = document.getElementById('round');
    roundTitle.textContent = `ROUND ${roundCount}`;
    gridCells.forEach((e) => {

      e.innerHTML = '';
      e.style.backgroundColor = '';

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
    highlightWin,
    highlightTie,
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
