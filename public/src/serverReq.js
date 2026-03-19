const APIS = {
  LOGIN: "/login",
  UPDATE: "/update-game",
  FIND_MATCHING: "/find-match",
  NEW_DATA: "/new-data",
  GET_SETUP_PIECES: "/get-setup-pieces",
  SET_PIECES: "/set-pieces",
  MOVE_PIECE: "/move-pieces",
}

export const loginReq = (name) => {
  return fetch(APIS.LOGIN, {
    method: "POST",
    body: JSON.stringify({ name })
  })
}

export const waitingReq = () => {
  return fetch(APIS.FIND_MATCHING)
}


export const newDataReq = (lastId) => {
  console.log("Sending Req");

  return fetch(APIS.NEW_DATA, {
    method: "POST",
    body: JSON.stringify({ lastId })
  })
}

export const setupPiecesDetails = () => {
  return fetch(APIS.GET_SETUP_PIECES)
}


export const submitPiecePlacementReq = (setup) => {
  return fetch(APIS.SET_PIECES, {
    method: "POST",
    body: JSON.stringify({ setup })
  })
}

export const movePlayedReq = (from, to) => {
  console.log({ from, to });

  return fetch(APIS.MOVE_PIECE, {
    method: "POST",
    body: JSON.stringify({ from, to })
  })

}