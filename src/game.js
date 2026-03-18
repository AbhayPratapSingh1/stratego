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
      return -1;
    }
    try {
      this.#setPiece(pieces)
    } catch (e) {
      return { status: -1, message: "Invalid pieces Type/count" }
    }

    playersGamePhase[id] = "play";

    if (Object.values(playersGamePhase).every((phase) => phase !== "placement")) {
      this.gamePhase.final = "play";
      this.updateGame();
    }

    return { status: -1, message: "Invalid pieces Type/count" };
  }

  #setPiece(pieces) {
    for (const { x, y, v } of pieces) {
      this.piecesCount[v]--;
      if (this.piecesCount[v] < 0 || this.isOccupied(x, y)) {
        throw new Error("Invalid pieces valus");
      }
      this.matrix[y][x] === v;
    }
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
    for (const resolver of this.listners) {
      resolver(this.getData())
    }
  }
} 