import { renderBoard, updateBoard } from "./render.js";
import { submitPiecePlacementReq } from "./serverReq.js";
import { getPiecesDeatails } from "./serverReqHandler.js";
import { displayWaitingScreen, MESSAGES } from "./utilities.js";

const isAlreadyAssined = (id, gameState) => {
  return id in gameState.setupStore;
}

const createSaveButton = () => {
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
    const { x, y } = element.dataset
    const value = setup[boxId];

    placements.push({ x, y, value });
  }

  displayWaitingScreen(MESSAGES.SENDING_PIECE_SETUP)

  await submitPiecePlacementReq(placements);

  gameState.next();
}

const setSubmitButtonListner = (gameState) => {
  const saveButton = document.querySelector("#save-placement");
  saveButton.addEventListener("click", () => {
    handlePiecePlacementSubmit(gameState)
  })
}

const getPiecesCount = (piece) => {
  let totalPieceCount = 0;
  for (const { count } of piece) {
    totalPieceCount += count;
  }


  return totalPieceCount

}

export const handlePlacementMode = async (gameState) => {

  const pieces = await getPiecesDeatails();

  gameState.toConsume = getPiecesCount(pieces);

  displayPlaceablePieces(gameState, pieces);
  createSaveButton(gameState);


  renderBoard(gameState);
  updateBoard(gameState)

  const finishPlacement = new Promise((res) => {
    gameState.next = res;
  })

  setSubmitButtonListner(gameState);
  setBoardPlacementEventListners(gameState);

  await finishPlacement;

  return gameState;
};

const setAddPieceButtonSpecifications = (button, value, count) => {
  button.id = `type-${value}`;
  button.textContent = `${value} (${count})`;
  button.dataset.type = "piece-button";
  button.dataset.value = value;
  button.dataset.count = count;
  button.disabled = count === 0;
}

const displayPlaceablePieces = (gameState, pieces) => {
  const action = document.querySelector("#action");
  const options = document.createElement("div");


  const buttons = pieces.map(({ value, count }) => {
    const button = document.createElement("button");
    setAddPieceButtonSpecifications(button, value, count);
    return button
  })


  options.append(...buttons);
  action.appendChild(options);

  const selectPieceEvent = (e) => {
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

  gameState.events.push({ selector: "#action", eventType: "click", fn: selectPieceEvent })
  action.addEventListener("click", selectPieceEvent);
};


const setBoardPlacementEventListners = (gameState) => {
  const board = document.querySelector("#board");
  const submitButton = document.querySelector("#save-placement");

  const setUpBoardForBoard = (c) => {
    const block = c.target;
    const blockDetail = gameState.boardData[block.id];
    const selectedPiece = gameState.selectedPiece;
    if (blockDetail.placeAble === false) {
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

  board.addEventListener("click", setUpBoardForBoard);

  gameState.events.push({ selector: "#board", eventType: "click", fn: setUpBoardForBoard })
};