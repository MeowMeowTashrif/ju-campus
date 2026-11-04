// A "seeded" random number generator.
// Math.random() gives different numbers every time you reload the page.
// This one gives the SAME numbers every time, so trees always grow in the same
// places. Change the seed number to get a different (but still fixed) layout.

export function createRandom(seed = 12345) {
  let state = seed;
  // Returns a number between 0 and 1 (mulberry32 algorithm).
  function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  // Returns a number between min and max.
  random.range = (min, max) => min + random() * (max - min);
  // Picks one item from a list.
  random.pick = (list) => list[Math.floor(random() * list.length)];
  return random;
}
