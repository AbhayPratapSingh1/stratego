import { setupPiecesDetails, waitingReq, newDataReq } from "./serverReq.js";


export const getPiecesDeatails = async () => {
  const res = await setupPiecesDetails();
  if (!res.ok) {
    alert("Something bad happen contact developer");
  }

  const { pieces } = await res.json();
  return pieces;
};
export const sendWaitingRequest = async (gameState) => {
  const res = await waitingReq();

  if (!res.ok) {
    alert("Something bad happen contact developer");
  }

  if (res.status === 204) {
    console.log("sending again");
    return sendWaitingRequest(gameState);
  }


  const { data, type } = await res.json();
  if (type === "redirect") {
    window.location.href = "/login.html";
    return;
  }

  gameState.board = data.board;
  gameState.resData = data;
  console.log(data.color);

  gameState.selfColor = data.color;

  gameState.state = "placement";
  return;
};


export const newUpdatesFetching = async (id) => {
  const res = await newDataReq(id);

  if (!res.ok) {
    alert("Something bad happen contact developer");
  }

  if (res.status === 204) {
    console.log("requesting again");
    return newUpdatesFetching(id);
  }

  return await res.json();
};
