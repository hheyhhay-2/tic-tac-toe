const players = { player1: { token: "⭕️" }, player2: { token: "❌" } };
let currentTurnsPlayer;
let boardGame;
let hasWinner = false;
let canUpdatePlayer = false;
const winningIndices = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/** Query Selectors */
const boardElements = [];
const playerText = document.getElementById("player-text");
const helperText = document.getElementById("helper-text");
const restartButton = document.getElementById("button-restart");

/** Starts Game on page load */
initiateGame();

/** Game Helper Functions */
function initiateGame() {
  setGame();
  createElements();
  attachEventListeners();
}

const choosePlacement = (placement) => {
  if (boardGame[placement] !== null || hasWinner) {
    canUpdatePlayer = false;
    return;
  }

  boardGame.splice(placement, 1, currentTurnsPlayer.token);

  checkForWinner();

  if (!hasWinner) {
    canUpdatePlayer = true;
    return;
  } else {
    canUpdatePlayer = false;
    helperText.innerHTML = `The winner is: ${currentTurnsPlayer.token}`;
  }
};

function setGame() {
  boardGame = [null, null, null, null, null, null, null, null, null];
  hasWinner = false;
  canUpdatePlayer = false;

  boardElements.forEach((el, i) => {
    el.firstChild.nodeValue = boardGame[i];
  });

  if (!currentTurnsPlayer) {
    currentTurnsPlayer = players.player1;
  }

  playerText.innerHTML = `It's ${currentTurnsPlayer.token} turn`;
  helperText.innerHTML = ``;
}

function countTurns(array) {
  let count = 0;

  array.forEach((el) => {
    if (el) {
      count++;
    }
  });

  return count;
}

function updatePlayer() {
  const { player1, player2 } = players;
  currentTurnsPlayer = currentTurnsPlayer === player1 ? player2 : player1;
  playerText.innerHTML = `It's ${currentTurnsPlayer.token} turn`;
}

function checkForWinner() {
  const turnsTaken = countTurns(boardGame);

  if (turnsTaken < 5) {
    canUpdatePlayer = false;
    return;
  }

  if (turnsTaken === 9) {
    canUpdatePlayer = false;
    helperText.innerHTML = "sorry! no one won. Restart game";
    return;
  }

  winningIndices.find((set) => {
    if (
      boardGame[set[0]] &&
      boardGame[set[0]] === boardGame[set[1]] &&
      boardGame[set[1]] === boardGame[set[2]]
    ) {
      hasWinner = true;
    }
  });
}

/** Event Listerner Helper Functions */
function createElements() {
  for (let x = 0; x < boardGame.length; x++) {
    let el = document.getElementById(`button-${x}`);
    boardElements.push(el);
  }
}

function attachEventListeners() {
  console.log(boardElements);
  boardElements.forEach((el) => {
    el.addEventListener("click", (e) => {
      let placement = parseInt(e.target.id.replace("button-", ""));

      choosePlacement(placement);
      el.firstChild.nodeValue = boardGame[placement];

      if (canUpdatePlayer) {
        updatePlayer();
      }
    });
  });
}

restartButton.addEventListener("click", () => {
  initiateGame();
});
