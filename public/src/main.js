import { handlePlacementMode } from "./placement.js";
import { updateBoard } from "./render.js";
import { sendWaitingRequest, newUpdatesFetching } from "./serverReqHandler.js";
import { clearActionBox, removeEventListener } from "./utilities.js";
import { displayWaitingScreen, hideWaitingScreen } from "./waiting.js";

const handleMatchMaking = async (gameState) => {

  displayWaitingScreen(gameState.MESSAGES.WAITING_OTHER_PLAYER_CONNECTION);
  await sendWaitingRequest(gameState)

  hideWaitingScreen("")
  return gameState
}

const handleGameUpdates = async (gameState) => {
  const data = await newUpdatesFetching(gameState.lastUpdatedId);
  gameState.lastUpdatedId = data.lastId;
  gameState.isPlayerTurn = data.isPlayerTurn;
  gameState.board = data.board;
  updateBoard(gameState)

}

const startPlaying = async (gameState) => {
  await handleGameUpdates(gameState)
  hideWaitingScreen("");
}

window.onload = () => {
  const gameState = {
    state: "login",

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
      return args
    })
    .then(startPlaying);
}