// -------- game init properties --------

let frameMs = 100;
let candyTransitionLength = frameMs * 6;
let initialSnakeLength = 3;

let size = {
  PIXEL: 50,
  BOARD: 12,
};

// --------------------------------------

// -------- snake directionality --------

let currentSnakeDirection;

const directionQueue = [];

// --------------------------------------

const createTailColorIncrement = () => Math.floor(size.BOARD * 0.8);

let tailColorIncrement = createTailColorIncrement();

const TAIL_COLOR = [0, 200, 0];

const rgbFromArray = arr => `rgb(${arr[0]}, ${arr[1]}, ${arr[2]}`;

const COLOR = {
  BACKGROUND: 'black',
  TEXT: 'white',
  SNAKE_HEAD: rgbFromArray(TAIL_COLOR),
  CANDY: 'violet',
};

const DIRECTION = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
};

const INITIAL_SNAKE_DIRECTION = DIRECTION.RIGHT;

const ID = {
  ROOT: 'root',
  BOARD: 'board',
  TOP_LABELS: 'top-labels',
  BOTTOM_LABELS: 'bottom-labels',
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

const LABELS_CONTAINER_HEIGHT_PIXELS = '100px';

const getElement = id => document.getElementById(id);

const createDiv = id => {
  const div = document.createElement('div');

  if (id) {
    div.id = id;
  }

  return div;
};

const createInput = id => {
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

  const html = document.getElementsByTagName('html')[0];
  html.style.height = '100%';
};

const createRoot = () => {
  const root = createDiv(ID.ROOT);
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.alignItems = 'center';
  root.style.justifyContent = 'center';
  document.body.prepend(root);
};

const createBoard = () => {
  const boardSizePixels = `${size.PIXEL * size.BOARD}px`;
  const rootNode = getElement(ID.ROOT);

  const boardContainer = createDiv(ID.BOARD);
  boardContainer.style.width = boardSizePixels;
  boardContainer.style.height = boardSizePixels;
  boardContainer.style.border = '1px solid rgba(255, 255, 255, 0.5)';
  boardContainer.style.display = 'flex';
  boardContainer.style.flexWrap = 'wrap';
  rootNode.append(boardContainer);
};

const createSquares = () => {
  const boardContainer = getElement(ID.BOARD);
  const squareSizePixels = `${size.PIXEL}px`;

  for (let i = 0; i < size.BOARD * size.BOARD; i += 1) {
    const square = createDiv(createSquareId(i));
    square.style.width = squareSizePixels;
    square.style.height = squareSizePixels;
    square.style.boxSizing = 'border-box';
    square.style.borderRadius = '6px';
    square.style.border = `1px solid ${COLOR.BACKGROUND}`;
    boardContainer.append(square);
  }
};

const createTopLabelsContainer = () => {
  const label = createDiv(ID.TOP_LABELS);
  label.style.display = 'flex';
  label.style.justifyContent = 'space-between';
  label.style.alignItems = 'center';
  label.style.width = `${size.BOARD * size.PIXEL}px`;
  label.style.height = LABELS_CONTAINER_HEIGHT_PIXELS;
  getElement(ID.ROOT).prepend(label);
};

const createTopLabel = () => {
  const container = getElement(ID.TOP_LABELS);
  const label = createDiv();
  label.style.color = COLOR.TEXT;
  label.style.paddingRight = '10px';
  label.style.display = 'flex';
  label.style.alignItems = 'center';
  label.innerText = 'press spacebar or enter to pause or restart';
  container.append(label);
};

const createBottomLabelsContainer = () => {
  const container = createDiv(ID.BOTTOM_LABELS);
  container.style.display = 'flex';
  container.style.justifyContent = 'space-between';
  container.style.alignItems = 'center';
  container.style.width = `${size.BOARD * size.PIXEL}px`;
  container.style.height = LABELS_CONTAINER_HEIGHT_PIXELS;
  container.style.marginBottom = LABELS_CONTAINER_HEIGHT_PIXELS;
  getElement(ID.ROOT).append(container);
};

const createGameStatusLabel = () => {
  const gameStatusLabel = createDiv(ID.GAME_STATUS);
  gameStatusLabel.style.color = COLOR.TEXT;
  getElement(ID.BOTTOM_LABELS).append(gameStatusLabel);
};

const createScoreInnerText = score => `tail: ${score}`;

const createScoreLabel = () => {
  const scoreLabel = createDiv(ID.SCORE);
  scoreLabel.innerText = createScoreInnerText(initialSnakeLength);
  scoreLabel.style.color = COLOR.TEXT;
  getElement(ID.BOTTOM_LABELS).append(scoreLabel);
};

const createLabelInputPair = (id, text, initialValue) => {
  const container = createDiv(`${id}-container`);
  container.style.display = 'flex';
  container.style.padding = '20px';

  const label = createDiv(`${id}-label`);
  label.style.color = COLOR.TEXT;
  label.style.paddingRight = '10px';
  label.style.display = 'flex';
  label.style.alignItems = 'center';

  const input = createInput(`${id}-input`);
  input.value = initialValue;
  input.style.padding = '10px';

  label.innerText = text;
  container.append(label, input);

  return container;
};

const createFixedInputs = () => {
  const topInputContainer = createDiv();
  topInputContainer.style.display = 'flex';
  topInputContainer.style.justifyContent = 'space-between';
  topInputContainer.style.justifyItems = 'center';
  topInputContainer.style.position = 'absolute';
  topInputContainer.style.top = '0px';
  topInputContainer.style.left = '0px';

  const pixelPair = createLabelInputPair(ID.PIXEL, 'pixel size:', size.PIXEL);
  const boardPair = createLabelInputPair(ID.BOARD, 'board size:', size.BOARD);
  const fpsPair = createLabelInputPair(ID.FRAME_MS, 'ms per frame:', frameMs);

  topInputContainer.append(pixelPair, boardPair, fpsPair);

  getElement(ID.ROOT).append(topInputContainer);
};

const showStatusText = text => {
  const label = getElement(ID.GAME_STATUS);
  label.innerText = text;
  label.style.opacity = '1';
};

const getCandyTransition = () => `background-color ${candyTransitionLength}ms linear`;

// --------------------------------------

// -------- utilities  ------------------

const coordsFromIndex = index => ({
  i: index % size.BOARD,
  j: Math.floor(index / size.BOARD),
});

const getRandomCoords = inset => {
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

const coordsToId = ({ i, j }) => `${i}-${j}`;

const coordsFromId = id => {
  const [i, j] = id.split('-').map(char => Number(char));
  return { i, j };
};

const createSquareId = index => coordsToId(coordsFromIndex(index));

const getSquare = ({ i, j }) => getElement(coordsToId({ i, j }));

const areCoordsEqual = (a, b) => !a || !b || (a.i === b.i && a.j === b.j);

const isWithinBounds = (coords, squareSize) => coords.i > -1 && coords.i < squareSize && coords.j > -1 && coords.j < squareSize;

const getOppositeDirection = direction => {
  if (direction === DIRECTION.UP) return DIRECTION.DOWN;
  if (direction === DIRECTION.DOWN) return DIRECTION.UP;
  if (direction === DIRECTION.LEFT) return DIRECTION.RIGHT;
  if (direction === DIRECTION.RIGHT) return DIRECTION.LEFT;
};

const areOppositeDirections = (a, b) => a === getOppositeDirection(b);

const shouldQueueDirection = direction => {
  const nextDirection = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : currentSnakeDirection;
  return !areOppositeDirections(direction, nextDirection);
};

const getTailColor = index => rgbFromArray(TAIL_COLOR.map(val => val + tailColorIncrement * index));

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
    return [...Array(snakeLength - 1).keys()].map(i => ({
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
  if (tailCoordsList.some(c => areCoordsEqual(headCoords, c))) return true;
  return false;
};

const getNextCandyCoords = (headCoords, tailCoordsList, candyCoords, attemptedCoordinates = []) => {
  if (!areCoordsEqual(headCoords, candyCoords)) return candyCoords;

  const nextCandyCoords = getRandomCoords();

  if ([headCoords, ...tailCoordsList, ...attemptedCoordinates].some(c => areCoordsEqual(c, nextCandyCoords))) {
    return getNextCandyCoords(headCoords, tailCoordsList, candyCoords, [...attemptedCoordinates, nextCandyCoords]);
  }

  return nextCandyCoords;
};

const getNextSnakeLength = (headCoords, candyCoords, snakeLength) => (areCoordsEqual(headCoords, candyCoords) ? snakeLength + 1 : snakeLength);

const getNextGameState = gameState => {
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
    const coords = coordsFromIndex(i);
    const square = getSquare(coords);
    square.style.backgroundColor = (() => {
      if (areCoordsEqual(coords, candyCoords)) {
        square.style.transition = getCandyTransition();
        return COLOR.CANDY;
      } else {
        square.style.transition = null;
        if (areCoordsEqual(coords, headCoords)) {
          return COLOR.SNAKE_HEAD;
        } else {
          const tailIndex = tailCoordsList.findIndex(c => areCoordsEqual(c, coords));
          return tailIndex > -1 ? getTailColor(tailIndex) : COLOR.BACKGROUND;
        }
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
  createBottomLabelsContainer();
  createTopLabelsContainer();
  createTopLabel();
  createScoreLabel();
  createFixedInputs();
  createGameStatusLabel();
};

// --------------------------------------

// -------- game loop -------------------

const createLoop = () => {
  let isLooping;
  let gameState;

  const loop = prevGameState => {
    gameState = getNextGameState(prevGameState);
    render(prevGameState, gameState);
    setTimeout(() => !gameState.gameOver && isLooping && loop(gameState), frameMs);
  };

  const isPaused = () => !isLooping;

  const isGameOver = () => gameState && gameState.gameOver;

  const pause = () => {
    isLooping = false;
  };

  const start = () => {
    isLooping = true;
    loop(getNextGameState());
  };

  const resume = () => {
    isLooping = true;
    loop(gameState);
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

document.body.addEventListener('keydown', e => {
  if (!loop.isPaused()) {
    const direction = Object.values(DIRECTION).find(keyCode => keyCode === e.keyCode);
    if (direction && shouldQueueDirection(direction)) {
      directionQueue.push(direction);
    }
  }

  // enter or spacebar
  if (e.keyCode === 13 || e.keyCode === 32) {
    const pixelInput = getElement(`${ID.PIXEL}-input`);
    const boardInput = getElement(`${ID.BOARD}-input`);
    const fpsInput = getElement(`${ID.FRAME_MS}-input`);
    const inputs = [pixelInput, boardInput, fpsInput];

    if (loop.isGameOver() || inputs.some(input => input === document.activeElement)) {
      size.PIXEL = pixelInput.value;
      size.BOARD = boardInput.value;
      frameMs = fpsInput.value;

      inputs.forEach(i => i.blur());

      showStatusText('');

      loop.pause();

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

// -------- on page load ----------------

createLayout();
loop = createLoop();

// --------------------------------------
