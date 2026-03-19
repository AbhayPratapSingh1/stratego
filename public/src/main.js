import { handleGameUpdates } from "./playGame.js";
import { handlePlacementMode } from "./placement.js";
import { waitForOpponent } from "./serverReqHandler.js";
import { clearActionBox, removeEventListener, displayWaitingScreen, hideWaitingScreen } from "./utilities.js";

const handleMatchMaking = async (gameState) => {

  displayWaitingScreen(gameState.MESSAGES.WAITING_OTHER_PLAYER_CONNECTION);
  await waitForOpponent(gameState)

  hideWaitingScreen("")
  return gameState
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