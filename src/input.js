// Keeps track of which keys are held down right now.
// Example: keys.KeyW is true while W is pressed.

export const keys = {};

window.addEventListener('keydown', (event) => {
  keys[event.code] = true;
  // Stop Space from scrolling the page.
  if (event.code === 'Space') event.preventDefault();
});

window.addEventListener('keyup', (event) => {
  keys[event.code] = false;
});

// If the window loses focus, forget all keys so the player doesn't keep walking.
window.addEventListener('blur', () => {
  for (const code in keys) keys[code] = false;
});
