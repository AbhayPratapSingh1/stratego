import { newDataReq, waitingReq } from "./serverReq.js";


const sendWaitingRequest = async (gameState) => {
  const res = await waitingReq();
  console.log("here");



  if (!res.ok) {
    alert("Something bad happen contact developer");
  }



  if (res.status === 204) {
    console.log("sending again");
    return sendWaitingRequest(gameState);
  }

  gameState.state = "start-playing"

  const { data, type } = await res.json();
  if (type === "redirect") {
    window.location.href = "/login.html"
    return
  }

  gameState.resData = data;
  gameState.play.color = gameState.resData.color;
  return
}


const renderWaitingPage = () => {
  const body = document.querySelector(".board")
  // body.classList.remove("white");
  // body.classList.add("dark");
}

const handleWaitingTime = (gameState) => {
  renderWaitingPage();
  return sendWaitingRequest(gameState)
}


const newUpdatesFetching = async (id) => {
  const res = await newDataReq(id);

  if (!res.ok) {
    alert("Something bad happen contact developer");
  }

  if (res.status === 204) {
    console.log("requesting again");
    return newUpdatesFetching(id);
  }

  return await res.json();
}


const updateBoard = (gameState) => {
  const board = gameState.board
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const box = document.querySelector(`#box-${row}-${col}`);
      const detail = board[row][col]
      box.innerText = detail.value === 0 ? " " : detail.value;
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
  console.log(data)
  gameState.play.lastUpdatedId = data.lastId;
  gameState.isPlayerTurn = data.isPlayerTurn;
  gameState.board = data.board;
  updateBoard(gameState)
}

const renderBoard = () => {
  const board = document.querySelector(".board")
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {

      const newElement = document.createElement("div");
      newElement.id = `box-${row}-${col}`;
      newElement.classList.add("block");
      newElement.innerText = "1"
      board.append(newElement);
    }
  }

}

const startPlaying = (gameState) => {
  handleGameUpdates(gameState)
  renderBoard();

  // if (!gameState.play.isLatest) {
  //       gameState.play.isLatest = true;
  //       gameState.game = new Game(10, gameState.play.color);
  //       updateData();
  //     }
  //     background(100, 0, 200);
  //     fill(1)
  //     renderBoard(gameState.game.getBoard());
  //     if (isPieceChoosDialogOpen) {
  //       renderPieceChooseDialog()
  //     }
  //     break;
  // }
}


window.onload = () => {
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

  handleWaitingTime(gameState)
    .then(() => {
      startPlaying(gameState);
    });


  //   case "start-playing": {
  //     if (!gameState.play.isLatest) {
  //       gameState.play.isLatest = true;
  //       gameState.game = new Game(10, gameState.play.color);
  //       updateData();
  //     }

  //     background(100, 0, 200);
  //     fill(1)
  //     renderBoard(gameState.game.getBoard());
  //     if (isPieceChoosDialogOpen) {
  //       renderPieceChooseDialog()
  //     }
  //     break;
  //   }
  // }
}