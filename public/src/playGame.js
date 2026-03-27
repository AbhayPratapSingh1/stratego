import { updateBoard } from "./render.js";
import { newUpdatesFetching } from "./serverReqHandler.js";

export const handleGameUpdates = async (gameState) => {
  const data = await newUpdatesFetching(gameState.lastUpdatedId);
  gameState.lastUpdatedId = data.lastId;
  gameState.isPlayerTurn = data.isPlayerTurn;
  gameState.board = data.board;
  gameState.isTurn = data.isTurn
  updateBoard(gameState);
};
