/// <reference types="p5/global"/>
// @ts-nocheck

const gameState = {
  isWaiting: true,
  isLoading: false,
  game: null,
  selected: { x: -1, y: -1 },
  isTurn: true
}

const handleLoginAndRequest = async (username) => {
  const { color } = await handleLogin(username);
  gameState.game.setRole(color)
  fetchBasicDetail();
}

const handleLogin = async (name) => {
  gameState.isLoading = true;
  const data = await fetch("/login", {
    method: "POST",
    body: JSON.stringify({ name })
  })

  if (data.status === 204) {
    console.log("no user find trying again");
    await handleLogin(name);
  }

  matrixHandler.setLoggedIn(true);
  gameState.isLoading = false;
  return await data.json();
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
  gameState.game.addPiece(5, { x: 3, y: 3 }, 1)
  gameState.game.addPiece(5, { x: 3, y: 2 }, 0)
  const userName = prompt("User anem")
  handleLoginAndRequest(userName);
}

const clickedBox = (x, y) => {
  const sizeX = width / CONSTANTS.blocks;
  const sizeY = height / CONSTANTS.blocks;

  const posX = Math.floor(x / sizeX);
  const posY = Math.floor(y / sizeY);
  return { x: posX, y: posY }

}


function mousePressed() {
  gameState.selected = clickedBox(mouseX, mouseY)
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

function mouseReleased() {
  if (!gameState.isTurn || gameState.isLoading) {
    console.log("Waiting...");
    return;
  }

  const { x, y } = gameState.selected
  const newPos = clickedBox(mouseX, mouseY);
  const { x: nx, y: ny } = newPos;

  const isPrevOccupied = gameState.game.isOccupied(x, y)
  const isWater = gameState.game.isWater(x, y)
  const isNewPlaceOccupied = gameState.game.isOccupied(nx, ny);
  const isMoveablePiece = gameState.game.isValidPieceToMove(x, y);
  if (isPrevOccupied && !isNewPlaceOccupied && !isWater) {
    if (isMoveablePiece) {
      gameState.isTurn = false
      gameState.game.updatePos({ x, y }, newPos)
      sendAction(gameState.selected, newPos)
      matrixHandler.save([]);
    }
    else {
      console.log("Invalid Peice SEleecion");
    }

  }
}


const matrixHanlderCreator = () => {
  let matrix = [];
  let isRendered = true;
  let isLoggedIn = false
  return {
    isLogedIn: () => {
      return isLoggedIn
    },
    setLoggedIn: (status) => {
      isLoggedIn = status;
    },
    save: (newMatrix) => {
      matrix = newMatrix
      isRendered = false
    },
    next: () => {
      isRendered = true;
      return matrix;
    },
    isRendered: () => {
      return isRendered
    },
    peek: () => {
      return matrix;
    }
  }
}

const matrixHandler = matrixHanlderCreator()

const waitingScreen = () => {
  background(1)
  translate(width / 2, height / 2);
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(255);
  stroke(255);
  text("Waiting for other player...", 0, 0)

}

async function draw() {
  if (!matrixHandler.isLogedIn()) {
    background(220)
  } else if (gameState.isWaiting) {
    waitingScreen()
  }

  if (!matrixHandler.isRendered()) {
    matrixHandler.next()
    console.log("Rendering");
    background(220)
    fill(1)
    renderBoard(gameState.game.getBoard(), 10, 10);
  }

}  
