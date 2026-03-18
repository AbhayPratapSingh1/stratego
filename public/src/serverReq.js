const APIS = {
  LOGIN: "/login",
  UPDATE: "/update-game"
}

const loginReq = (name) => {

  return fetch(APIS.LOGIN, {
    method: "POST",
    body: JSON.stringify({ name })
  })
}