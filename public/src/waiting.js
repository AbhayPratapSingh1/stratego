export const displayWaitingScreen = (message) => {
  const modal = document.querySelector("#message-modal")
  const desciptionBox = modal.querySelector("h2");
  desciptionBox.textContent = message
  if (modal instanceof HTMLDialogElement) {
    modal.showModal();
  }
}

export const hideWaitingScreen = (message) => {
  const modal = document.querySelector("#message-modal")
  const desciptionBox = modal.querySelector("h2");
  desciptionBox.textContent = message
  if (modal instanceof HTMLDialogElement) {
    modal.close();
  }
}