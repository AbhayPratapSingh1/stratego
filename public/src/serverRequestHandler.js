

const handleLogin = async (name, reset) => {
  console.log("here");

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

  }


  reset();

  gameState.state = "waiting"
  return await response.json();
}