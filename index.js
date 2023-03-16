/* eslint padded-blocks: ["error", { "blocks": "always" }] */

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

  function startGame() {

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

  }

  startGame();
  playerSelector();

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
