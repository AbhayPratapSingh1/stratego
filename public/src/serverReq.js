const APIS = {
  LOGIN: "/login",
  UPDATE: "/update-game",
  FIND_MATCHING: "/find-match",
  NEW_DATA: "/new-data",
  SETUP_PIECES: "/setup-pieces",
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
  return fetch(APIS.NEW_DATA, {
    method: "POST",
    body: JSON.stringify({ lastId })
  })
}

export const setupPiecesDetails = () => {
  return fetch(APIS.SETUP_PIECES)
}