import { handleGameUpdates } from "./playGame.js";
import { handlePlacementMode } from "./placement.js";
import { waitForOpponent } from "./serverReqHandler.js";
import { clearActionBox, removeEventListener, displayWaitingScreen, hideWaitingScreen, PIECE_COLOR_MAP } from "./utilities.js";
import { movePlayedReq } from "./serverReq.js";


const handleMatchMaking = async (gameState) => {

  displayWaitingScreen(gameState.MESSAGES.WAITING_OTHER_PLAYER_CONNECTION);
  await waitForOpponent(gameState)

  hideWaitingScreen("")
  return gameState
}

const moveSelectedToNewPos = async (gameState, selected, newBlock) => {
  const { x, y } = selected.dataset;
  const { x: x2, y: y2 } = newBlock.dataset;
  selected.classList.remove('selected-box');
  gameState.selectedPiece = null;
  await movePlayedReq({ x: Number(x), y: Number(y) }, { x: Number(x2), y: Number(y2) })
  await handleGameUpdates(gameState); // check for current updaet
  await handleGameUpdates(gameState); // check for other player movement
}

const isBlockSelectable = (gameState, block) => {
  const color = block.dataset.color;
  return gameState.selfColor === color;
}

const addEventListenerToBoard = (gameState) => {
  const board = document.querySelector("#board");

  const eventListner = (e) => {
    if (!gameState.isTurn) {
      console.log("Not your turn");
      return
    }

    const block = e.target;

    const selectedPiece = gameState.selectedPiece;

    if (selectedPiece === block) { // if same deselect
      block.classList.remove("selected-box");
      gameState.selectedPiece = null;
      return
    }

    if (selectedPiece && block.dataset.placeAble === "false") { // if not correct leave
      return;
    }

    if (!selectedPiece) { // if not selected select it;
      if (!isBlockSelectable(gameState, block)) {
        return;
      }
      block.classList.add("selected-box");
      gameState.selectedPiece = block;
      return;
    }

    moveSelectedToNewPos(gameState, selectedPiece, block);

    // if (isAlreadyAssined(block.id, gameState)) {
    //   const prevValue = gameState.setupStore[block.id];
    //   const button = document.querySelector(`#type-${prevValue}`);
    //   const count = Number(button.dataset.count);

    //   setAddPieceButtonSpecifications(button, prevValue, Number(count) + 1);
    // }

    // block.textContent = "";
    // delete gameState.setupStore[block.id];

    // if (selectedPiece) {
    //   const { value, count: rawCount } = selectedPiece.dataset;
    //   const count = Number(rawCount);

    //   selectedPiece.classList.remove("selected-piece-btn");
    //   setAddPieceButtonSpecifications(selectedPiece, value, count - 1);

    //   gameState.setupStore[block.id] = value;
    //   block.textContent = value;
    //   gameState.selectedPiece = null;
    // }

    // const isAllConsumed = gameState.toConsume !== Object.keys(gameState.setupStore).length;
    // submitButton.disabled = isAllConsumed;

  }

  board.addEventListener("click", eventListner)
  gameState.events.push({ selector: "#board", eventType: "click", fn: eventListner })
}

const startPlaying = async (gameState) => {
  await handleGameUpdates(gameState)
  hideWaitingScreen("");
  addEventListenerToBoard(gameState);

  if (!gameState.isTurn) {
    console.log("awaitinf for turn");
    await handleGameUpdates(gameState)
  }

}

window.onload = () => {
  const gameState = {
    state: "login",
    isTurn: false,
    selectedPiece: null,
    setupStore: {},
    toConsume: null,
    selfColor: null,
    lastUpdatedId: 0,

    events: [],

    MESSAGES: {
      SENDING_PIECE_SETUP: "Waiting For other player to finish setup",
      WAITING_OTHER_PLAYER_CONNECTION: "Waiting for other player to connect",
    }
  }

  handleMatchMaking(gameState)
    .then(handlePlacementMode)
    .then((args) => {
      clearActionBox();
      removeEventListener(gameState.events);
      gameState.state = "playing"
      return args
    })
    .then(startPlaying);
}