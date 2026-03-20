export const removeEventListener = (listners) => {
  for (const { selector, eventType, fn } of listners) {
    const element = document.querySelector(selector);
    element.removeEventListener(eventType, fn);
  }
}
export const clearActionBox = (selector = "#action") => {
  const actionBox = document.querySelector(selector);
  actionBox.replaceChildren();
}

export const displayWaitingScreen = (message) => {
  const modal = document.querySelector("#message-modal");
  const desciptionBox = modal.querySelector("h2");
  desciptionBox.textContent = message;
  if (modal instanceof HTMLDialogElement) {
    modal.showModal();
  }
};

export const hideWaitingScreen = (message) => {
  const modal = document.querySelector("#message-modal");
  const desciptionBox = modal.querySelector("h2");
  desciptionBox.textContent = message;
  if (modal instanceof HTMLDialogElement) {
    modal.close();
  }
};


export const PIECE_COLOR_MAP = {
  "W": "water",
  "R": "red",
  "B": "blue",
  "X": "empty",
}

export const MESSAGES = {
  SENDING_PIECE_SETUP: "Waiting For other player to finish setup",
  WAITING_OTHER_PLAYER_CONNECTION: "Waiting for other player to connect",
}