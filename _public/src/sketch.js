/// <reference types="p5/global"/>
// @ts-nocheck

const gameState = {
  isWaiting: true,
  isLoading: true,
  game: null,
  selected: { x: -1, y: -1 },
  isTurn: true,
  login: {
    isSetupDone: false,
  },
  waiting: {
    isMatchingStarted: false
  },
  play: {
    isLatest: false,
    lastUpdatedId: -1,
    color: null,
    state: "placement",
    isPieceChoosDialogOpen: false,
  },
  state: "login"
}

const handleLoginAndRequest = async (username) => {
  const { color } = await handleLogin(username);
  gameState.game.setRole(color)
  fetchBasicDetail();
}



const fetchBasicDetail = async () => {
  gameState.isLoading = true;
  console.log("reqested for game");
  const response = await fetch("/game-and-role");
  if (response.status === 204) {
    console.log("retry");
    return fetchBasicDetail();
  }

  const data = await response.json()
  gameState.isWaiting = false;

  gameState.game.setRole(data.color)
  gameState.game.storeMatrix(data.board);

  if (data.color === "G") {
    fetchNewUpdate();
    gameState.isTurn = false
  }
  gameState.isLoading = false;
  return matrixHandler.save(data);

}

const fetchNewUpdate = async () => {
  gameState.isLoading = true;
  console.log("new Update Call....");
  const response = await fetch("/game");
  if (response.status === 204) {
    console.log("retry");
    return fetchNewUpdate();
  }

  const data = await response.json()
  gameState.isWaiting = false;
  gameState.game.storeMatrix(data.board);
  gameState.isTurn = true;
  gameState.isLoading = false;
  return matrixHandler.save(data);
}


async function setup() {
  createCanvas(CONFIG.size, CONFIG.size);
  gameState.game = new Game(10);
}


const sendAction = async (from, to) => {
  const response = await fetch("/action", {
    method: "POST",
    body: JSON.stringify({ data: { from, to }, action: "move" })
  })

  if (!(response.ok)) {
    alert("Invalid")
  } else {
    console.log("done sending update");
    fetchNewUpdate()
  }
}


async function draw() {
  switch (gameState.state) {
    case "login":
      showLoginPage(); break;

    case "waiting":
      waitingPage(); break;

    case "start-playing": {
      if (!gameState.play.isLatest) {
        gameState.play.isLatest = true;
        gameState.game = new Game(10, gameState.play.color);
        updateData();
      }

      background(100, 0, 200);
      fill(1)
      renderBoard(gameState.game.getBoard());
      if (isPieceChoosDialogOpen) {
        renderPieceChooseDialog()
      }
      break;
    }
  }
}  



