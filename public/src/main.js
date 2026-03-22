import { handleGameUpdates } from "./playGame.js";
import { handlePlacementMode } from "./placement.js";
import { waitForOpponent } from "./serverReqHandler.js";
import { clearActionBox, removeEventListener, displayWaitingScreen, hideWaitingScreen, MESSAGES } from "./utilities.js";
import { movePlayedReq } from "./serverReq.js";


const handleMatchMaking = async (gameState) => {

  displayWaitingScreen(MESSAGES.WAITING_OTHER_PLAYER_CONNECTION);
  await waitForOpponent(gameState)

  hideWaitingScreen("")
  return gameState
}

const isValidMove = (gameState, from, to) => {
  const { x, y } = from;
  const { x: x2, y: y2 } = to;

  const invalids = gameState.invalidMovementPlace

  if ((invalids.includes(gameState.board[y2][x2].pieceColor))) {
    false;
  }
  return gameState.board[y][x].pieceColor === gameState.selfColor
}

const moveSelectedToNewPos = async (gameState, selected, newBlock) => {
  const selectedDetail = gameState.boardData[selected.id];
  const newBlockDetail = gameState.boardData[newBlock.id];

  const { x, y } = selectedDetail;
  const { x: x2, y: y2 } = newBlockDetail;

  if (!isValidMove(gameState, selectedDetail, newBlockDetail)) {
    console.log("Invlaid");
    return;
  }

  console.log(gameState.board[y2][x2])
  selected.classList.remove('selected-box');
  gameState.selectedPiece = null;

  const { ok } = await movePlayedReq({ x: Number(x), y: Number(y) }, { x: Number(x2), y: Number(y2) })

  if (ok) {
    console.log("Ok req");

    await handleGameUpdates(gameState); // check for current updaet
    await handleGameUpdates(gameState); // check for other player movement
  } else {
    console.log("not Ok req");

  }
}

const isBlockSelectable = (gameState, block) => {
  const color = gameState.boardData[block.id].color;
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
    const blockDetail = gameState.boardData[block.id];
    if (selectedPiece && blockDetail.placeAble === false) { // if not correct leave
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
  }

  board.addEventListener("click", eventListner)
  gameState.events.push({ selector: "#board", eventType: "click", fn: eventListner })
}

const startPlaying = async (gameState) => {
  await handleGameUpdates(gameState);

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

    invalidMovementPlace: ["X", "W"],

    board: null,
    boardData: {},
    buttonData: {},

    events: [],
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