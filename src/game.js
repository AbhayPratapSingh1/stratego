export class Game {
  constructor(roomId, player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.roomId = roomId;
    this.listners = {};
    this.lastId = 0
  }
  getBoard() {
    return this.matrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ value: 0, bg: " " })))
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