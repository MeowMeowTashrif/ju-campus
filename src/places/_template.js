// =============================================================
//  TEMPLATE FOR A NEW CAMPUS PLACE
//  1. Copy this file and rename it, e.g. centralLibrary.js
//  2. Rename the function, e.g. createCentralLibrary
//  3. Walk to where it should go in the game, read the x/z numbers
//     in the bottom-left corner, and put them below.
//  4. Add it to the list in places/index.js
// =============================================================
import { createSimpleBuilding } from './helpers.js';

export function createMyBuilding(scene) {
  createSimpleBuilding(scene, {
    x: 30,          // east (+) / west (-)
    z: 20,          // south (+) / north (-)
    width: 24,      // size along x
    depth: 14,      // size along z
    floors: 3,
    wallColor: 0xd9534f,
  });

  // You can add more shapes here: trees, a fountain, a statue, a path...
}
