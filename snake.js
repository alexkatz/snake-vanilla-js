// -------- constants -------------------

const FRAME_MS = 80;

const INITIAL_SNAKE_LENGTH = 2;

const SIZE = {
  PIXEL: 30,
  BOARD: 30,
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
  gameOverNode.innerText = 'heather is a cutie!';
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

const getRandomCoords = (inset) => {
  const coords = {
    i: Math.floor(Math.random() * Math.floor(SIZE.BOARD)),
    j: Math.floor(Math.random() * Math.floor(SIZE.BOARD)),
  };

  if (inset) {
    if (coords.i < inset) coords.i = inset;
    if (coords.i > SIZE.BOARD - inset) coords.i = SIZE.BOARD - inset;
    if (coords.j < inset) coords.j = inset;
    if (coords.j > SIZE.BOARD - inset) coords.j = SIZE.BOARD - inset;
  }

  return coords;
};

const coordinatesToId = ({ i, j }) => `${i}-${j}`;

const coordinatesFromId = (id) => {
  const [i, j] = id.split('-').map((char) => Number(char));
  return { i, j };
};

const createSquareId = (index) => coordinatesToId(coordinatesFromIndex(index));

const getSquare = ({ i, j }) => getElement(coordinatesToId({ i, j }));

const coordsAreEqual = (a, b) => a.i === b.i && a.j === b.j;

const isWithinBounds = (coords, squareSize) => coords.i > -1 && coords.i < squareSize && coords.j > -1 && coords.j < squareSize;

const getNextHeadCoords = ({ i, j } = getRandomCoords(10), direction) => {
  switch (direction) {
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

const getNextTailCoords = ({ snakeLength, tailCoordsList, headCoords }, nextHeadCoords, nextSnakeLength) => {
  if (tailCoordsList === undefined) {
    // create initial tail based on snake length, always to the left since initial direction is right. minus 1 because the head is part of the length.
    return [...Array(snakeLength - 1).keys()].map((i) => ({
      i: nextHeadCoords.i - (i + 1),
      j: nextHeadCoords.j,
    }));
  }

  // we collected a candy! yum. snake must grow. we'll store the old end of the tail before the new tail is generated
  let newTailCoords;
  if (nextSnakeLength > snakeLength) {
    newTailCoords = tailCoordsList[tailCoordsList.length - 1];
  }

  // 0th index assumes old head, 1st index assumes 0th, 2nd index assumes 1st, etc.
  const nextTailCoordsList = tailCoordsList.map((_, index) => {
    if (index === 0) return headCoords;
    return tailCoordsList[index - 1];
  });

  // if the tail should grow, we'll take the old end of the tail onto the end of the new tail, so it grows!
  if (newTailCoords) {
    nextTailCoordsList.push(newTailCoords);
  }

  return nextTailCoordsList;
};

const getNextGameOver = (headCoords, tailCoordsList) => {
  if (!isWithinBounds(headCoords, SIZE.BOARD)) return true;
  if (tailCoordsList.some((t) => coordsAreEqual(headCoords, t))) return true;
  return false;
};

const getNextCandyCoords = (headCoords, candyCoords) => {
  if (!coordsAreEqual(headCoords, candyCoords)) return candyCoords;
  return getRandomCoords();
};

const getNextSnakeLength = (headCoords, candyCoords, snakeLength) => (coordsAreEqual(headCoords, candyCoords) ? snakeLength + 1 : snakeLength);

// --------------------------------------

// -------- game state ------------------

const getNextGameState = (gameState) => {
  if (!gameState)
    return {
      headCoords: undefined,
      tailCoordsList: undefined,
      candyCoords: getRandomCoords(),
      snakeDirection: DIRECTION.RIGHT,
      snakeLength: INITIAL_SNAKE_LENGTH,
      gameOver: false,
    };

  const nextSnakeDirection = CURRENT_SNAKE_DIRECTION || gameState.snakeDirection;
  const nextHeadCoords = getNextHeadCoords(gameState.headCoords, nextSnakeDirection);
  const nextCandyCoords = getNextCandyCoords(nextHeadCoords, gameState.candyCoords);
  const nextSnakeLength = getNextSnakeLength(nextHeadCoords, gameState.candyCoords, gameState.snakeLength);
  const nextTailCoordsList = getNextTailCoords(gameState, nextHeadCoords, nextSnakeLength);
  const nextGameOver = getNextGameOver(nextHeadCoords, nextTailCoordsList);

  return {
    headCoords: nextHeadCoords,
    tailCoordsList: nextTailCoordsList,
    candyCoords: nextCandyCoords,
    snakeDirection: nextSnakeDirection,
    snakeLength: nextSnakeLength,
    gameOver: nextGameOver,
  };
};

let CURRENT_SNAKE_DIRECTION;

// --------------------------------------

// -------- user input ------------------

document.body.addEventListener('keydown', (e) => {
  e = e || window.event;
  if (e.keyCode == '38' && CURRENT_SNAKE_DIRECTION !== DIRECTION.DOWN) {
    CURRENT_SNAKE_DIRECTION = DIRECTION.UP;
  } else if (e.keyCode == '40' && CURRENT_SNAKE_DIRECTION !== DIRECTION.UP) {
    CURRENT_SNAKE_DIRECTION = DIRECTION.DOWN;
  } else if (e.keyCode == '37' && CURRENT_SNAKE_DIRECTION !== DIRECTION.RIGHT) {
    CURRENT_SNAKE_DIRECTION = DIRECTION.LEFT;
  } else if (e.keyCode == '39' && CURRENT_SNAKE_DIRECTION !== DIRECTION.LEFT) {
    CURRENT_SNAKE_DIRECTION = DIRECTION.RIGHT;
  }
});

// --------------------------------------

// -------- frame rendering -------------

const render = ({ headCoords, candyCoords, gameOver, tailCoordsList }) => {
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
      } else if (tailCoordsList.filter((c) => coordsAreEqual(c, coords)).length === 1) {
        return COLOR.SNAKE;
      } else {
        return COLOR.BACKGROUND;
      }
    })();
  }
};

initLayout();
createBoard();
createSquares();
createGameOverLabel();

// --------------------------------------

// -------- game loop -------------------

(function loop(oldGameState) {
  const gameState = getNextGameState(oldGameState);

  render(gameState);

  if (gameState.gameOver) return;

  setTimeout(() => loop(gameState), FRAME_MS);
})(getNextGameState());

// --------------------------------------
