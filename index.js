/* eslint padded-blocks: ["error", { "blocks": "always" }] */
/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-use-before-define: ["error", { "variables": false }] */

const runTitlescreen = (() => {

  function playerSelector() {

    function switchOption(option) {

      const playerSelectBtn = option.currentTarget;
      const playerIcon = playerSelectBtn.firstChild;
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

      titlescreen.classList.add('swipe-out');
      gamescreen.classList.toggle('hidden');
      setTimeout(() => {

        titlescreen.classList.toggle('hidden');
        gamescreen.classList.add('swipe-in');

      }, 500);

    }

    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => {

      titleToGameTransition();

    });

  };

  const getSelected = () => {

    const xSelector = document.getElementById('x-selector');
    const oSelector = document.getElementById('o-selector');

  };

  startGame();
  playerSelector();

  return {

    getSelected,

  };

})();

const Player = (playerName, playerSign) => {

  let name = playerName;

  let turn = false;

  const getSign = () => playerSign;

  const updateName = (newName) => {

    name = newName;

  };

  return {

    turn,
    getSign,
    updateName,

  };

};

const ai = () => {

};

const gameboard = (() => {

  const gameArray = Array(9).fill(null);
  let roundCount = 0;

  const playerX = Player('user', 'X');
  const playerO = Player('easy', 'O');

  const updateRound = () => {

    roundCount += 1;

  };

  const changeTurn = () => {

    if (playerX.turn === true) {

      playerX.turn = false;
      playerO.turn = true;

    } else {

      playerO.turn = false;
      playerX.turn = true;

    }

  };

  const currentPlayer = () => (playerX.turn === true ? playerX : playerO);

  const makeMove = (e) => {

    if (e.target.id === 'grid'
    || e.target.hasChildNodes()
    || !e.target.classList.contains('grid-cell')) {

      return;

    }

    const cell = e.target;
    const i = cell.dataset.cell;

    gameArray[i] = currentPlayer().getSign();
    gameDisplay.drawSign(i, currentPlayer().getSign());

    changeTurn();

  };

  const checkWin = () => {

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

      if (Xwin.includes(true)) return 'X';
      if (Owin.includes(true)) return 'O';
      return false;

    };

    if (checkForWinner() !== false) {

      endGame();

    }

  };

  const checkTie = () => {

  };

  const endGame = () => {

    console.log('game over');

  };

  return {

    makeMove,
    currentPlayer,
    changeTurn,
    checkWin,

  };

})();

const gameDisplay = (() => {

  const grid = document.getElementById('grid');
  const signImg = (sign) => {

    const img = document.createElement('img');
    img.src = (sign === 'X' ? './svg/x.svg' : './svg/o.svg');
    img.classList.add('game-token');

    return img;

  };

  const bind = () => {

    grid.addEventListener('click', gameboard.makeMove);

  };

  const unbind = () => {

    grid.removeEventListener('click', gameboard.makeMove);

  };

  const drawSign = (i, sign) => {

    const gridCells = Array.from(document.getElementsByClassName('grid-cell'));
    console.log(gridCells);
    console.log(i);
    console.log(gridCells[i]);
    gridCells[i].appendChild(signImg(sign));

    gameboard.checkWin();

  };

  bind();

  return {

    drawSign,

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
