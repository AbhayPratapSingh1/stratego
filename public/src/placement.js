import { renderBoard, updateBoard } from "./render.js";
import { submitPiecePlacementReq } from "./serverReq.js";
import { getPiecesDeatails } from "./serverReqHandler.js";
import { showWaitingScreen, stopWaitingScreen } from "./waiting.js";


const isAlreadyAssined = (id, gameState) => {
  return id in gameState.setupStore;
}

const createSaveButton = (_gameState) => {
  const actionBox = document.querySelector("#action");
  const button = document.createElement("button")
  button.id = "save-placement";
  button.textContent = "Save";
  button.disabled = true;
  actionBox.append(button);
}


const handlePiecePlacementSubmit = async (gameState) => {
  const setup = gameState.setupStore;
  const placements = [];
  for (const boxId in setup) {
    const element = document.querySelector(`#${boxId}`);
    const x = element.dataset.x;
    const y = element.dataset.y;
    const value = setup[boxId];

    placements.push({ x, y, value });
  }


  showWaitingScreen(gameState.MESSAGES.SENDING_PIECE_SETUP)
  await submitPiecePlacementReq(placements);


  gameState.currentEventResolver();
}

const setSubmitButtonListner = (gameState) => {
  const saveButton = document.querySelector("#save-placement");
  saveButton.addEventListener("click", (e) => {
    handlePiecePlacementSubmit(gameState)
  })
}

const getPiecesCount = (piece) => {
  let totalPieceCount = 0;
  for (const { count } of piece) {
    totalPieceCount += count;
  }
  console.log({ totalPieceCount });

  return totalPieceCount

}

export const handlePlacementMode = async (gameState) => {
  const pieces = await getPiecesDeatails();
  gameState.toConsume = getPiecesCount(pieces);
  gameState.pieces = pieces;

  createAddingButtonsForPieces(gameState, pieces);
  renderBoard();
  updateBoard(gameState)

  createSaveButton(gameState);

  const moveNextPromise = new Promise((res) => {
    gameState.currentEventResolver = res;
  })

  setSubmitButtonListner(gameState);
  setEventListnersToBoard(gameState);
  return moveNextPromise;
};

const setAddPieceButtonSpecifications = (button, value, count) => {
  button.id = `type-${value}`;
  button.textContent = `${value} (${count})`;
  button.dataset.type = "piece-button";
  button.dataset.value = value;
  button.dataset.count = count;
  button.disabled = count === 0;
}

const createAddingButtonsForPieces = (gameState, pieces) => {
  const action = document.querySelector("#action");
  const options = document.createElement("div");


  const buttons = pieces.map(({ value, count }) => {
    const button = document.createElement("button");
    setAddPieceButtonSpecifications(button, value, count);
    return button
  })


  options.append(...buttons);
  action.appendChild(options);

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
  };

  action.addEventListener("click", gameState.events.selectPiece);
};

const setEventListnersToBoard = (gameState) => {
  const board = document.querySelector("#board");
  const submitButton = document.querySelector("#save-placement");

  gameState.events.setUpBoardForBoard = (c) => {
    const block = c.target;
    const selectedPiece = gameState.selectedPiece;
    if (block.dataset.notPlaceAble !== "false") {

      return;
    }

    if (isAlreadyAssined(block.id, gameState)) {
      const prevValue = gameState.setupStore[block.id];
      const button = document.querySelector(`#type-${prevValue}`);
      const count = Number(button.dataset.count);

      setAddPieceButtonSpecifications(button, prevValue, Number(count) + 1);
    }

    block.textContent = "";
    delete gameState.setupStore[block.id];

    if (selectedPiece) {
      const { value, count: rawCount } = selectedPiece.dataset;
      const count = Number(rawCount);

      selectedPiece.classList.remove("selected-piece-btn");
      setAddPieceButtonSpecifications(selectedPiece, value, count - 1);

      gameState.setupStore[block.id] = value;
      block.textContent = value;
      gameState.selectedPiece = null;
    }

    const isAllConsumed = gameState.toConsume !== Object.keys(gameState.setupStore).length;
    submitButton.disabled = isAllConsumed;
  };

  board.addEventListener("click", gameState.events.setUpBoardForBoard);
};