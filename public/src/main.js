import { sendWaitingRequest, newUpdatesFetching, getPiecesDeatails } from "./serverReqHandler.js";

const renderWaitingPage = () => {
  const body = document.querySelector("#board")

  // body.classList.remove("white");
  // body.classList.add("dark");
}

const handleWaitingTime = (gameState) => {
  renderWaitingPage();
  return sendWaitingRequest(gameState)
}



const updateBoard = (gameState) => {
  const board = gameState.board
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const box = document.querySelector(`#box-${row}-${col}`);
      const detail = board[row][col]

      box.textContent = detail.value === 0 ? " " : detail.value;
      switch (detail.pieceColor) {
        case "W":
          box.classList.add("water");
          break;
        case "R":
          box.classList.add("red");
          break
        case "B":
          box.classList.add("blue");
          break
      }
    }
  }
}


const handleGameUpdates = async (gameState) => {
  const data = await newUpdatesFetching(gameState.play.lastUpdatedId);
  console.log(data)
  gameState.play.lastUpdatedId = data.lastId;
  gameState.isPlayerTurn = data.isPlayerTurn;
  gameState.board = data.board;
  updateBoard(gameState)
}

const renderBoard = () => {
  const board = document.querySelector("#board")
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {

      const newElement = document.createElement("div");
      newElement.id = `box-${row}-${col}`;
      newElement.classList.add("block");
      newElement.textContent = " ";
      board.append(newElement);
    }
  }
}

const createAddingButtonsForPieces = (gameState, pieces) => {
  const action = document.querySelector("#action");
  for (const { value, count } of pieces) {
    const button = document.createElement("button");
    button.id = `type-${value}`;
    button.textContent = `${value} (${count})`;
    button.dataset.type = "piece-button"
    button.dataset.value = value;
    button.dataset.count = count;
    action.append(button);
  }

  gameState.events.selectPiece = (e) => {
    const button = e.target;
    if (button.dataset.type === "piece-button") {
      const prevButton = gameState.selectedPiece;

      if (prevButton) {
        prevButton.classList.remove("selected-piece-btn");
      }

      gameState.selectedPiece = button;
      button.classList.add("selected-piece-btn");
    }
  }

  action.addEventListener("click", gameState.events.selectPiece)
}

const isAlreadyAssined = (id, gameState) => {
  return id in gameState.setupStore
}


const setEventListnersToBoard = (gameState) => {
  const board = document.querySelector("#board")

  gameState.events.setUpBoardForBoard = (c) => {
    const block = c.target;
    const selectedPiece = gameState.selectedPiece
    if (selectedPiece) {

      const { value, count } = selectedPiece.dataset;

      selectedPiece.textContent = `${value} (${count - 1})`
      selectedPiece.classList.remove("selected-piece-btn");
      selectedPiece.dataset.count = count - 1;

      if (count === "1") {
        selectedPiece.disabled = true;
      }

      if (isAlreadyAssined(block.id, gameState)) {
        const prevValue = gameState.setupStore[block.id];
        const button = document.querySelector(`#type-${prevValue}`)

        const count = +button.dataset.count;
        button.dataset.count = count + 1;
        button.textContent = `${prevValue} (${count + 1})`
        if (button.disabled) {
          button.disabled = false;
        }
      }

      gameState.setupStore[block.id] = value;
      block.textContent = value;
      gameState.selectedPiece = null;
      return;
    }

    if (isAlreadyAssined(block.id, gameState)) {
      const prevValue = gameState.setupStore[block.id];
      const button = document.querySelector(`#type-${prevValue}`)

      const count = +button.dataset.count;
      button.dataset.count = count + 1;
      button.textContent = `${prevValue} (${count + 1})`
      if (button.disabled) {
        button.disabled = false;
      }

      block.textContent = "";
      delete gameState.setupStore[block.id];
    }
  }
  board.addEventListener("click", gameState.events.setUpBoardForBoard);
}

const handlePlacementMode = async (gameState) => {

  const pieces = await getPiecesDeatails();
  gameState.pieces = pieces;

  createAddingButtonsForPieces(gameState, pieces);
  renderBoard();
  setEventListnersToBoard(gameState);
  return;
}

const startPlaying = (gameState) => {

}

window.onload = () => {
  const gameState = {
    state: "login",
    pieces: null,
    selectedPiece: null,
    setupStore: {},
    events: {
      selectPiece: null
    },
    play: {
      isLatest: false,
      lastUpdatedId: -1,
      color: null,
      state: "placement",
      isPieceChoosDialogOpen: false,
    },
  }

  handleWaitingTime(gameState)
    .then(() => {
      handlePlacementMode(gameState);
    })
    .then(() => {
      startPlaying(gameState);
    });
}