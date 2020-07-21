// -------- constants -------------------

const FRAME_MS = 120;

const SIZE = {
  PIXEL: 30,
  BOARD: 25,
};

const COLOR = {
  BACKGROUND: 'black',
  TEXT: 'white',
  SNAKE: 'lightgreen',
  CANDY: 'violet',
};

const DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
};

const ID = {
  ROOT: 'root',
  BOARD: 'board',
  LABELS: 'labels',
  GAME_OVER: 'game-over',
};

// --------------------------------------

// -------- initialize the board --------

const getElement = (id) => document.getElementById(id);
const createDiv = (id) => {
  const div = document.createElement('div');
  div.id = id;
  return div;
};

const initLayout = () => {
  document.body.style.height = '100%';
  document.body.style.backgroundColor = COLOR.BACKGROUND;
  document.body.style.padding = '0';
  document.body.style.margin = '0';
  document.body.style.position = 'relative';
  document.body.style.height = '100%';

  const htmlNode = document.getElementsByTagName('html')[0];
  htmlNode.style.height = '100%';

  const rootNode = getElement(ID.ROOT);
  rootNode.style.width = '100%';
  rootNode.style.height = '100%';
  rootNode.style.display = 'flex';
  rootNode.style.flexDirection = 'column';
  rootNode.style.alignItems = 'center';
  rootNode.style.justifyContent = 'center';
};

const createBoard = () => {
  const boardSizePixels = `${SIZE.PIXEL * SIZE.BOARD}px`;
  const rootNode = getElement(ID.ROOT);

  const boardNode = createDiv(ID.BOARD);
  boardNode.style.width = boardSizePixels;
  boardNode.style.height = boardSizePixels;
  boardNode.style.border = '1px solid rgba(255, 255, 255, 0.5)';
  boardNode.style.display = 'flex';
  boardNode.style.flexWrap = 'wrap';
  rootNode.append(boardNode);

  const labelsNode = createDiv(ID.LABELS);
  labelsNode.style.display = 'flex';
  labelsNode.style.justifyContent = 'center';
  labelsNode.style.alignItems = 'center';
  labelsNode.style.width = `${SIZE.BOARD * SIZE.PIXEL}px`;
  labelsNode.style.height = '100px';
  rootNode.append(labelsNode);
};

const createSquares = () => {
  const boardNode = getElement(ID.BOARD);
  const squareSizePixels = `${SIZE.PIXEL}px`;

  for (let i = 0; i < SIZE.BOARD * SIZE.BOARD; i += 1) {
    const square = createDiv(createSquareId(i));
    square.style.width = squareSizePixels;
    square.style.height = squareSizePixels;
    square.style.boxSizing = 'border-box';
    square.style.borderRadius = '6px';
    square.style.border = `1px solid ${COLOR.BACKGROUND}`;
    boardNode.append(square);
  }
};

const createGameOverLabel = () => {
  const gameOverNode = createDiv(ID.GAME_OVER);
  gameOverNode.innerText = 'whoops lol';
  gameOverNode.style.color = COLOR.TEXT;
  gameOverNode.style.opacity = '0';
  getElement(ID.LABELS).append(gameOverNode);
};

// --------------------------------------

// -------- utilities  ------------------

const coordinatesFromIndex = (index) => ({
  i: index % SIZE.BOARD,
  j: Math.floor(index / SIZE.BOARD),
});

const getRandomCoords = () => ({
  i: Math.floor(Math.random() * Math.floor(SIZE.BOARD)),
  j: Math.floor(Math.random() * Math.floor(SIZE.BOARD)),
});

const coordinatesToId = ({ i, j }) => `${i}-${j}`;

const coordinatesFromId = (id) => {
  const [i, j] = id.split('-').map((char) => Number(char));
  return { i, j };
};

const createSquareId = (index) => coordinatesToId(coordinatesFromIndex(index));

const getSquare = ({ i, j }) => getElement(coordinatesToId({ i, j }));

const coordsAreEqual = (a, b) => a.i === b.i && a.j === b.j;

const isWithinBounds = (coords, squareSize) => coords.i > -1 && coords.i < squareSize && coords.j > -1 && coords.j < squareSize;

const getTraveledHeadCoords = ({ headCoords: { i, j } = getRandomCoords(), snakeDirection }) => {
  switch (snakeDirection) {
    case DIRECTION.UP:
      return {
        i,
        j: j - 1,
      };
    case DIRECTION.RIGHT:
      return {
        i: i + 1,
        j,
      };
    case DIRECTION.DOWN:
      return {
        i,
        j: j + 1,
      };
    case DIRECTION.LEFT:
      return {
        i: i - 1,
        j,
      };
  }
};

const getTraveledTailCoords = ({ snakeLength, headCoords, snakeDirection, tailCoords }) => {
  if (tailCoords === undefined) {
    return [];
  }

  // grow tail pixel by pixel from spawn point
  if (tailCoords.length < snakeLength) {
    let newTailCords;
    switch (snakeDirection) {
      case DIRECTION.UP:
        newTailCords = {
          i: headCoords.i,
          j: headCoords.j - 1,
        };
        break;
      case DIRECTION.DOWN:
        newTailCords = {
          i: headCoords.i,
          j: headCoords.j + 1,
        };
        break;
      case DIRECTION.RIGHT:
        newTailCords = {
          i: headCoords.i - 1,
          j: headCoords.j,
        };
        break;
      case DIRECTION.LEFT:
        newTailCords = {
          i: headCoords.i + 1,
          j: headCoords.j,
        };
        break;
    }

    return [...tailCoords, newTailCords];
  }

  return tailCoords;
};

const getGameOver = ({ headCoords }) => {
  if (!isWithinBounds(headCoords, SIZE.BOARD)) return true;
  return false;
};

// --------------------------------------

// -------- game state ------------------

let gameState = {
  headCoords: undefined,
  tailCoords: undefined,
  candyCoords: getRandomCoords(),
  snakeDirection: DIRECTION.RIGHT,
  snakeLength: 3,
  gameOver: false,
};

const setGameState = (nextGameState) => {
  const newGameState = {
    ...gameState,
    ...nextGameState,
  };

  gameState = {
    ...newGameState,
    tailCoords: getTraveledTailCoords(newGameState),
    gameOver: getGameOver(newGameState),
  };
};

// --------------------------------------

// -------- user input ------------------

document.body.addEventListener('keydown', (e) => {
  e = e || window.event;
  const { snakeDirection } = gameState;
  if (e.keyCode == '38' && snakeDirection !== DIRECTION.DOWN) {
    setGameState({
      snakeDirection: DIRECTION.UP,
    });
  } else if (e.keyCode == '40' && snakeDirection !== DIRECTION.UP) {
    setGameState({
      snakeDirection: DIRECTION.DOWN,
    });
  } else if (e.keyCode == '37' && snakeDirection !== DIRECTION.RIGHT) {
    setGameState({
      snakeDirection: DIRECTION.LEFT,
    });
  } else if (e.keyCode == '39' && snakeDirection !== DIRECTION.LEFT) {
    setGameState({
      snakeDirection: DIRECTION.RIGHT,
    });
  }
});

// --------------------------------------

// -------- frame rendering -------------

const render = ({ headCoords, candyCoords, gameOver, tailCoords }) => {
  if (gameOver) {
    const gameOverNode = getElement(ID.GAME_OVER);
    gameOverNode.style.opacity = '1';
  }

  if (gameOver) return;

  for (let i = 0; i < SIZE.BOARD * SIZE.BOARD; i += 1) {
    const coords = coordinatesFromIndex(i);
    const square = getSquare(coords);

    square.style.backgroundColor = (() => {
      if (coordsAreEqual(coords, headCoords)) {
        return COLOR.SNAKE;
      } else if (coordsAreEqual(coords, candyCoords)) {
        return COLOR.CANDY;
      } else if (tailCoords.filter((c) => coordsAreEqual(c, coords)).length === 1) {
        return COLOR.SNAKE;
      } else {
        return COLOR.BACKGROUND;
      }
    })();
  }
};

// --------------------------------------

initLayout();
createBoard();
createSquares();
createGameOverLabel();

(function loop() {
  setGameState({
    headCoords: getTraveledHeadCoords(gameState),
  });

  render(gameState);

  if (gameState.gameOver) return;

  setTimeout(loop, FRAME_MS);
})();
