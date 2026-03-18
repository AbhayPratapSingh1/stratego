const APIS = {
  LOGIN: "/login",
  UPDATE: "/update-game",
  FIND_MATCHING: "/find-match"
}

const loginReq = (name) => {
  return fetch(APIS.LOGIN, {
    method: "POST",
    body: JSON.stringify({ name })
  })
}

const waitingReq = () => {
  return fetch(APIS.FIND_MATCHING)
}