const showLoginPage = () => {
  if (!gameState.login.isSetupDone) {
    background(220)
    const input = createInput("");
    const button = createButton("Login");
    input.position(windowWidth / 2, windowHeight / 2);
    button.position(windowWidth / 2, windowHeight / 2 + 50)
    button.mousePressed(() => {
      handleLogin(input.value(), () => {
        input.remove()
        button.remove()
      });
    })
    gameState.login.isSetupDone = true;
  }
}
