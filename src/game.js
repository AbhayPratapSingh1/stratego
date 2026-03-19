import { isNumber } from "./utilities.js";



export class Game {
  constructor(roomId, player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.roomId = roomId;
    this.listners = {};
    this.lastId = 0;
    this.#setGamePhase();
    this.matrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ value: -1, id: null })))
    this.#addWater();
    this.piecesCount = {
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
      8: 1,
      9: 1,
      10: 1,
    }
  }
  getSetupPieces() {
    return [
      { value: 1, count: 2 },
      // { value: 2, count: 2 },
      // { value: 3, count: 2 },
      // { value: 4, count: 2 },
      // { value: 5, count: 2 },
      // { value: 6, count: 2 },
      // { value: 7, count: 1 },
      // { value: 8, count: 1 },
      // { value: 9, count: 1 },
      // { value: 10, count: 1 },
    ]
  }


  getColor(id) {
    return id === this.player1.id ? "R" : "B";
  }

  #setGamePhase() {
    this.gamePhase = {
      final: "placement",
      players: {}
    }

    this.gamePhase.players[this.player1.id] = "placement";
    this.gamePhase.players[this.player2.id] = "placement";
  }

  setUserPieces(id, pieces) {
    const playersGamePhase = this.gamePhase.players
    if (playersGamePhase[id] !== "placement") {
      return { status: -1, message: "Invalid Action" };
    }

    try {
      this.#setPiece(id, pieces);
    } catch (e) {
      console.log(e);

      return { status: -1, message: "Invalid pieces Type/count" }
    }

    playersGamePhase[id] = "play";

    if (Object.values(playersGamePhase).every((phase) => phase !== "placement")) {
      this.gamePhase.final = "play";
      console.log("BOTH SUBMITTED THE PIECES, NOT SETTING PLAY MODE");

      this.updateGame();
    }

    return { status: 0, message: "setted piece for player" };
  }

  #setPiece(id, pieces) {
    const totalPieces = this.getSetupPieces();

    for (const { x, y, value } of pieces) {

      if (!isNumber(x) || !isNumber(y) || !isNumber(value)) {
        throw new Error("Invalid pieces values");
      }

      const piece = totalPieces.find(piece => piece.value === value);
      piece.count--;

      if (piece.count < 0 || this.isOccupied(x, y)) {
        throw new Error("Invalid pieces count/placement");
      }

      this.matrix[y][x] = { value, id };
    }

    if (this.#isAnyPieceLeft(totalPieces)) {
      throw new Error("Invalid pieces utilization");
    }
  }

  #isAnyPieceLeft(pieces) {
    for (const { count } of pieces) {
      if (count !== 0) {
        return true;
      }
    }
    return false
  }

  isOccupied(x, y) {
    return this.matrix[y][x].value !== -1;
  }


  #addWater() {
    this.waterPos = [
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },

      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
    ]

    this.waterPos.forEach(({ x, y }) => {
      this.matrix[y][x] = { value: 0, id: "water" }
    })

    return this
  }

  getBoard(id) {
    const p1Id = id;
    const p2Id = id === this.player1.id ? this.player2.id : this.player1.id;
    const p1Color = this.getColor(id);
    const p2Color = p1Color === "R" ? "B" : "R";

    const newMatrix = this.matrix.map(row => row.map(({ id, value }) => {
      if (id === p1Id) {
        return { value, pieceColor: p1Color }
      }

      if (id === p2Id) {
        return { value: 0, pieceColor: p2Color }
      }

      if (id === "water") {
        return { value: 0, pieceColor: "W" }
      }

      return { value: 0, pieceColor: "X" }
    }))

    return newMatrix;
  }

  getTurnOf() {
    return this.player1.id
  }

  addListner(id, resolver) {
    this.listners[id] = resolver;
  }

  removeListner(id) {
    delete this.listners[id];
  }

  getData() {
    return this.getBoard();
  }

  updateGame() {
    this.lastId++;
    for (const id in this.listners) {
      const resolver = this.listners[id]
      console.log({ id });

      const parsedId = Number(id);
      resolver(this.getBoard(parsedId));
    }
  }
} 