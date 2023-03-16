const titlescreen = (() => {
  function playerSelector() {
    function switchOption(option) {
      let icon = option.currentTarget.firstChild;
      console.log(icon.src);
      if (icon.src === 'file:///Users/bongo/repos/tic-tac-toe/svg/user.svg') {
        icon.src = './svg/easy.svg';
      };
      
    }

    const selectors = Array.from(document.getElementsByClassName('selector'));
    selectors.forEach((option) => {
      option.addEventListener('click', switchOption);
    });
  }
  function startGame() {

  }

  playerSelector();

})();
