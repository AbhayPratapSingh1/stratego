import { handlePlacementMode } from "./placement.js";
import { updateBoard } from "./render.js";
import { sendWaitingRequest, newUpdatesFetching } from "./serverReqHandler.js";
import { showWaitingScreen, stopWaitingScreen } from "./waiting.js";

const handleMatchMaking = async (gameState) => {

  showWaitingScreen(gameState.MESSAGES.WAITING_OTHER_PLAYER_CONNECTION);

  await sendWaitingRequest(gameState)

  stopWaitingScreen("")
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
  stopWaitingScreen("");
}


window.onload = () => {
  const gameState = {
    state: "login",

    selectedPiece: null,
    setupStore: {},
    toConsume: null,
    selfColor: null,
    lastUpdatedId: 0,

    events: {
      setUpBoardForBoard: null,
      selectPiece: null
    },

    MESSAGES: {
      SENDING_PIECE_SETUP: "Waiting For other player to finish setup",
      WAITING_OTHER_PLAYER_CONNECTION: "Waiting for other player to connect",
    }
  }

  handleMatchMaking(gameState)
    .then(handlePlacementMode)
    .then(startPlaying);
}