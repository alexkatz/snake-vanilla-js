// -------- variables -------------------

let frameMs = 100;

let initialSnakeLength = 3;

let size = {
  PIXEL: 32,
  BOARD: 18,
};

let currentSnakeDirection;

const directionQueue = [];

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

const INITIAL_SNAKE_DIRECTION = DIRECTION.RIGHT;

const ID = {
  ROOT: 'root',
  BOARD: 'board',
  LABELS: 'labels',
  SCORE: 'score',
  GAME_STATUS: 'game-status',
  PIXEL: 'pixel',
  FRAME_MS: 'frame-ms',
};

const MESSAGES = {
  GAME_OVER: 'whoops lol',
};

// --------------------------------------

// -------- initialize the board --------

const getElement = (id) => document.getElementById(id);

const createDiv = (id) => {
  const div = document.createElement('div');

  if (id) {
    div.id = id;
  }

  return div;
};

const createInput = (id) => {
  const input = document.createElement('input');
  input.id = id;
  return input;
};

const initBodyStyle = () => {
  document.body.style.height = '100%';
  document.body.style.backgroundColor = COLOR.BACKGROUND;
  document.body.style.padding = '0';
  document.body.style.margin = '0';
  document.body.style.position = 'relative';
  document.body.style.height = '100%';

  const htmlNode = document.getElementsByTagName('html')[0];
  htmlNode.style.height = '100%';
};

const createRoot = () => {
  const rootNode = createDiv(ID.ROOT);
  rootNode.style.width = '100%';
  rootNode.style.height = '100%';
  rootNode.style.display = 'flex';
  rootNode.style.flexDirection = 'column';
  rootNode.style.alignItems = 'center';
  rootNode.style.justifyContent = 'center';
  document.body.prepend(rootNode);
};

const createBoard = () => {
  const boardSizePixels = `${size.PIXEL * size.BOARD}px`;
  const rootNode = getElement(ID.ROOT);

  const boardNode = createDiv(ID.BOARD);
  boardNode.style.width = boardSizePixels;
  boardNode.style.height = boardSizePixels;
  boardNode.style.border = '1px solid rgba(255, 255, 255, 0.5)';
  boardNode.style.display = 'flex';
  boardNode.style.flexWrap = 'wrap';
  rootNode.append(boardNode);
};

const createSquares = () => {
  const boardNode = getElement(ID.BOARD);
  const squareSizePixels = `${size.PIXEL}px`;

  for (let i = 0; i < size.BOARD * size.BOARD; i += 1) {
    const square = createDiv(createSquareId(i));
    square.style.width = squareSizePixels;
    square.style.height = squareSizePixels;
    square.style.boxSizing = 'border-box';
    square.style.borderRadius = '6px';
    square.style.border = `1px solid ${COLOR.BACKGROUND}`;
    boardNode.append(square);
  }
};

const createLabels = () => {
  const labelsNode = createDiv(ID.LABELS);
  labelsNode.style.display = 'flex';
  labelsNode.style.justifyContent = 'space-between';
  labelsNode.style.alignItems = 'center';
  labelsNode.style.width = `${size.BOARD * size.PIXEL}px`;
  labelsNode.style.height = '100px';
  getElement(ID.ROOT).append(labelsNode);
};

const createGameStatusLabel = () => {
  const gameStatusNode = createDiv(ID.GAME_STATUS);
  gameStatusNode.style.color = COLOR.TEXT;
  getElement(ID.LABELS).append(gameStatusNode);
};

const createScoreInnerText = (score) => `tail: ${score}`;

const createScoreLabel = () => {
  const scoreNode = createDiv(ID.SCORE);
  scoreNode.innerText = createScoreInnerText(initialSnakeLength);
  scoreNode.style.color = COLOR.TEXT;
  getElement(ID.LABELS).append(scoreNode);
};

const createLabelInputPair = (id, text, initialValue) => {
  const container = createDiv(`${id}-container`);
  container.style.display = 'flex';
  container.style.padding = '20px';

  const label = createDiv(`${id}-label`);
  label.style.color = COLOR.TEXT;
  label.style.paddingRight = '10px';

  const input = createInput(`${id}-input`);
  input.value = initialValue;

  label.innerText = text;
  container.append(label, input);

  return container;
};

const createTopInputs = () => {
  const topInputContainerNode = createDiv();
  topInputContainerNode.style.display = 'flex';
  topInputContainerNode.style.justifyContent = 'space-between';
  topInputContainerNode.style.position = 'absolute';
  topInputContainerNode.style.top = '0px';
  topInputContainerNode.style.left = '0px';

  const pixelPair = createLabelInputPair(ID.PIXEL, 'pixel size:', size.PIXEL);
  const boardPair = createLabelInputPair(ID.BOARD, 'board size:', size.BOARD);
  const fpsPair = createLabelInputPair(ID.FRAME_MS, 'ms per frame:', frameMs);

  topInputContainerNode.append(pixelPair, boardPair, fpsPair);

  getElement(ID.ROOT).append(topInputContainerNode);
};

const showStatusText = (text) => {
  const label = getElement(ID.GAME_STATUS);
  label.innerText = text;
  label.style.opacity = '1';
};

// --------------------------------------

// -------- utilities  ------------------

const coordinatesFromIndex = (index) => ({
  i: index % size.BOARD,
  j: Math.floor(index / size.BOARD),
});

const getRandomCoords = (inset) => {
  const coords = {
    i: Math.floor(Math.random() * Math.floor(size.BOARD)),
    j: Math.floor(Math.random() * Math.floor(size.BOARD)),
  };

  if (inset) {
    if (coords.i < inset) coords.i = inset;
    if (coords.i > size.BOARD - inset) coords.i = size.BOARD - inset;
    if (coords.j < inset) coords.j = inset;
    if (coords.j > size.BOARD - inset) coords.j = size.BOARD - inset;
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

const areCoordsEqual = (a, b) => !a || !b || (a.i === b.i && a.j === b.j);

const isWithinBounds = (coords, squareSize) => coords.i > -1 && coords.i < squareSize && coords.j > -1 && coords.j < squareSize;

const getOppositeDirection = (direction) => {
  if (direction === DIRECTION.UP) return DIRECTION.DOWN;
  if (direction === DIRECTION.DOWN) return DIRECTION.UP;
  if (direction === DIRECTION.LEFT) return DIRECTION.RIGHT;
  if (direction === DIRECTION.RIGHT) return DIRECTION.LEFT;
};

const areOppositeDirections = (a, b) => a === getOppositeDirection(b);

const shouldQueueDirection = (direction) => {
  const nextDirection = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : currentSnakeDirection;
  return !areOppositeDirections(direction, nextDirection);
};
// --------------------------------------

// -------- game functions  -------------

const getNextHeadCoords = ({ i, j }, direction) => {
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

const getNextTailCoordsList = ({ snakeLength, tailCoordsList, headCoords }, nextHeadCoords, nextSnakeLength) => {
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
  if (!isWithinBounds(headCoords, size.BOARD)) return true;
  if (tailCoordsList.some((c) => areCoordsEqual(headCoords, c))) return true;
  return false;
};

const getNextCandyCoords = (headCoords, tailCoordsList, candyCoords, attemptedCoordinates = []) => {
  if (!areCoordsEqual(headCoords, candyCoords)) return candyCoords;

  const nextCandyCoords = getRandomCoords();

  if ([headCoords, ...tailCoordsList, ...attemptedCoordinates].some((c) => areCoordsEqual(c, nextCandyCoords))) {
    return getNextCandyCoords(headCoords, tailCoordsList, candyCoords, [...attemptedCoordinates, nextCandyCoords]);
  }

  return nextCandyCoords;
};

const getNextSnakeLength = (headCoords, candyCoords, snakeLength) => (areCoordsEqual(headCoords, candyCoords) ? snakeLength + 1 : snakeLength);

const getNextGameState = (gameState) => {
  if (!gameState) {
    const headCoords = getRandomCoords(initialSnakeLength);
    const tailCoordsList = getNextTailCoordsList({ snakeLength: initialSnakeLength }, headCoords);
    return {
      headCoords,
      tailCoordsList,
      candyCoords: getNextCandyCoords(headCoords, tailCoordsList),
      snakeDirection: DIRECTION.RIGHT,
      snakeLength: initialSnakeLength,
      gameOver: false,
    };
  }

  const nextSnakeDirection = (currentSnakeDirection = directionQueue.shift() || gameState.snakeDirection);
  const nextHeadCoords = getNextHeadCoords(gameState.headCoords, nextSnakeDirection);
  const nextSnakeLength = getNextSnakeLength(nextHeadCoords, gameState.candyCoords, gameState.snakeLength);
  const nextTailCoordsList = getNextTailCoordsList(gameState, nextHeadCoords, nextSnakeLength);
  const nextCandyCoords = getNextCandyCoords(nextHeadCoords, [...(gameState.tailCoordsList || []), ...nextTailCoordsList], gameState.candyCoords);
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

// --------------------------------------

// -------- rendering -------------------

const render = (prevGameState, { headCoords, candyCoords, gameOver, tailCoordsList, snakeLength }) => {
  if (gameOver) {
    showStatusText(MESSAGES.GAME_OVER);
    return;
  }

  for (let i = 0; i < size.BOARD * size.BOARD; i += 1) {
    const coords = coordinatesFromIndex(i);
    getSquare(coords).style.backgroundColor = (() => {
      if (areCoordsEqual(coords, headCoords)) {
        return COLOR.SNAKE;
      } else if (areCoordsEqual(coords, candyCoords)) {
        return COLOR.CANDY;
      } else if (tailCoordsList.filter((c) => areCoordsEqual(c, coords)).length === 1) {
        return COLOR.SNAKE;
      } else {
        return COLOR.BACKGROUND;
      }
    })();
  }

  if (prevGameState.snakeLength !== snakeLength) {
    getElement(ID.SCORE).innerText = createScoreInnerText(snakeLength);
  }
};

const clearLayout = () => {
  getElement(ID.ROOT).remove();
};

const createLayout = () => {
  clearLayout();

  initBodyStyle();
  createRoot();
  createBoard();
  createSquares();
  createLabels();
  createScoreLabel();
  createTopInputs();
  createGameStatusLabel();
};

// --------------------------------------

// -------- game loop -------------------

const createLoop = () => {
  let isLooping;
  let cachedGameState;

  const loop = (prevGameState) => {
    const gameState = getNextGameState(prevGameState);
    render(prevGameState, gameState);
    cachedGameState = gameState;
    if (gameState.gameOver || !isLooping) return;
    setTimeout(() => loop(gameState), frameMs);
  };

  const isPaused = () => !isLooping;

  const isGameOver = () => cachedGameState && cachedGameState.gameOver;

  const pause = () => {
    isLooping = false;
  };

  const start = () => {
    isLooping = true;
    loop(getNextGameState());
  };

  const resume = () => {
    isLooping = true;
    loop(cachedGameState);
  };

  start();

  return {
    pause,
    resume,
    isPaused,
    isGameOver,
  };
};

// --------------------------------------

// -------- user input ------------------

document.body.addEventListener('keydown', (e) => {
  if (!loop.isPaused()) {
    const direction = (() => {
      switch (e.keyCode) {
        case 37:
          return DIRECTION.LEFT;
        case 38:
          return DIRECTION.UP;
        case 39:
          return DIRECTION.RIGHT;
        case 40:
          return DIRECTION.DOWN;
        default:
          return null;
      }
    })();

    // if a queued direction exists and it is opposite of new direction, ignore
    // if a queued direction does not exist, but current direction is opposite of new direction, ignore

    if (shouldQueueDirection(direction)) {
      directionQueue.push(direction);
    }
  }

  if (e.keyCode === 13) {
    const pixelInput = getElement(`${ID.PIXEL}-input`);
    const boardInput = getElement(`${ID.BOARD}-input`);
    const fpsInput = getElement(`${ID.FRAME_MS}-input`);
    const inputs = [pixelInput, boardInput, fpsInput];

    if (loop.isGameOver() || (loop.isPaused() && inputs.some((input) => input === document.activeElement))) {
      size.PIXEL = pixelInput.value;
      size.BOARD = boardInput.value;
      frameMs = fpsInput.value;

      inputs.forEach((i) => i.blur());

      showStatusText('');

      createLayout();
      loop = createLoop();
    } else if (loop.isPaused()) {
      showStatusText('');
      loop.resume();
    } else {
      showStatusText('paused lol');
      loop.pause();
    }
  }
});

// --------------------------------------

// -------- on landing ------------------

createLayout();
loop = createLoop();

// --------------------------------------
