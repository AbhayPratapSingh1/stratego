import { handlePlacementMode } from "./placement.js";
import { sendWaitingRequest, newUpdatesFetching } from "./serverReqHandler.js";
import { stopWaitingScreen } from "./waiting.js";

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
  gameState.play.lastUpdatedId = data.lastId;
  gameState.isPlayerTurn = data.isPlayerTurn;
  gameState.board = data.board;
  updateBoard(gameState)

}

const startPlaying = async (gameState) => {
  console.log("just sending")
  await handleGameUpdates(gameState)
  stopWaitingScreen("");
  console.log("Done sending")
}


window.onload = () => {
  const gameState = {
    state: "login",
    pieces: null,
    selectedPiece: null,
    setupStore: {},
    toConsume: null,
    events: {
      selectPiece: null
    },
    play: {
      isLatest: false,
      lastUpdatedId: 0,
      color: null,
      state: "placement",
      isPieceChoosDialogOpen: false,
    },

    // NOT WORKING RIGHT NOW BUT MAYBE IT WILL SOMEDAY!

    waitingMessage: "",
    MESSAGES: {
      SENDING_PIECE_SETUP: "waiting since setup is sending",
    }
  }

  handleWaitingTime(gameState)
    .then(() => handlePlacementMode(gameState))
    .then(() => {
      startPlaying(gameState);
    });
}