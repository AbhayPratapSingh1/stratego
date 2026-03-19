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