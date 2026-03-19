

const handleLogin = async (name, reset) => {
  gameState.isLoading = true;
  const response = await loginReq(name)
  if (!response.ok) {
    if (response.status === 204) {
      console.log("no user find trying again");
      return await handleLogin(name);
    }
    if (response.status === 400) {
      console.log("Bad Request");
      gameState.isLoading = false;
      return
    }
    gameState.isLoading = false;
    alert("Something went wrong contact owner!");
  }


  reset();

  gameState.state = "waiting"
  return await response.json();
}


const sendWaitingRequest = async () => {
  const res = await waitingReq();

  if (!res.ok) {
    alert("Something bad happen contact developer");
  }
  if (res.status === 204) {
    console.log("sending again");
    return sendWaitingRequest();
  }

  gameState.state = "start-playing"

  gameState.resData = await res.json();
  gameState.play.color = gameState.resData.color;
  return
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