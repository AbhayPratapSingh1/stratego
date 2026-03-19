export const showWaitingScreen = (message) => {
  const modal = document.querySelector("#message-modal")
  const desciptionBox = modal.querySelector("h2");
  desciptionBox.textContent = message
  modal.showModal();
}

export const stopWaitingScreen = (message) => {
  const modal = document.querySelector("#message-modal")
  const desciptionBox = modal.querySelector("h2");
  desciptionBox.textContent = message
  modal.close();
}