// =============================================================
//  SETTINGS
//  Change the numbers and colours here to tweak the game.
//  Directions: x = east/west, z = north/south, y = up.
//  1 unit is roughly 1 metre.
// =============================================================

export const WORLD = {
  walkableSize: 400, // the player can walk inside a 400 x 400 square
  groundSize: 1000,  // the green ground is bigger, so you never see its edge
};

export const COLORS = {
  sky: 0x8fd3ff,
  grass: [0x6cc24a, 0x74c950, 0x64b943, 0x7bd157], // a few greens for a patchy look
  road: 0x5a5f66,
  roadCentreLine: 0xffd43b,
  roadEdgeLine: 0xffffff,
  water: 0x3fa9f5,
  sand: 0xead9a0,
  trunk: 0x8b5a2b,
  leaves: [0x2e9e45, 0x3cb44b, 0x58c76a, 0x1f8a3b, 0x7cc242],
  player: 0xff7a45,
};

export const PLAYER = {
  spawn: { x: -14, z: 60 }, // where you start
  walkSpeed: 8,
  runSpeed: 16,
  jumpSpeed: 9,
  gravity: 25,
  radius: 0.5, // used for bumping into things
};

export const CAMERA = {
  distance: 9,       // how far behind the player the camera sits
  minDistance: 3,
  maxDistance: 25,
  lookHeight: 1.6,   // the camera looks at this height on the player
  mouseSensitivity: 0.0025,
};

export const ROAD = {
  width: 10, // the road runs north–south through the middle (x = 0)
};

export const LAKE = {
  x: 70,
  z: -50,
  radius: 30,
};
