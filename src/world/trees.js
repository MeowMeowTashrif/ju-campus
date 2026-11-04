// Low-poly trees scattered around the map.
// They are created LAST, so they can avoid the road, lake and any buildings.
import * as THREE from 'three';
import { COLORS, PLAYER, ROAD, WORLD } from '../config.js';
import { addCircleCollider, isBlocked } from '../colliders.js';
import { createRandom } from '../random.js';

// Shapes and colours are made once and shared by every tree (faster).
const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.35, 2, 6);
const trunkMaterial = new THREE.MeshLambertMaterial({ color: COLORS.trunk, flatShading: true });
const coneGeometry = new THREE.ConeGeometry(1.6, 2.6, 7);
const ballGeometry = new THREE.IcosahedronGeometry(1.8, 0);
const leafMaterials = COLORS.leaves.map(
  (color) => new THREE.MeshLambertMaterial({ color, flatShading: true })
);

function addShadows(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// A pointy tree made of stacked cones.
function makePineTree(leaves) {
  const tree = new THREE.Group();
  const trunk = addShadows(new THREE.Mesh(trunkGeometry, trunkMaterial));
  trunk.position.y = 1;
  tree.add(trunk);
  for (let i = 0; i < 3; i++) {
    const cone = addShadows(new THREE.Mesh(coneGeometry, leaves));
    cone.position.y = 2.6 + i * 1.1;
    cone.scale.setScalar(1 - i * 0.22);
    tree.add(cone);
  }
  return tree;
}

// A round, bushy tree.
function makeRoundTree(leaves) {
  const tree = new THREE.Group();
  const trunk = addShadows(new THREE.Mesh(trunkGeometry, trunkMaterial));
  trunk.position.y = 1;
  tree.add(trunk);
  const crown = addShadows(new THREE.Mesh(ballGeometry, leaves));
  crown.position.y = 3.2;
  tree.add(crown);
  return tree;
}

export function createTrees(scene, count = 220) {
  const random = createRandom(2024);
  const half = WORLD.walkableSize / 2 - 5;
  let planted = 0;
  let attempts = 0;

  while (planted < count && attempts < count * 20) {
    attempts++;
    const x = random.range(-half, half);
    const z = random.range(-half, half);

    // Skip spots that are on/near the road, near the start point, or near
    // anything solid (lake, buildings, other trees).
    if (Math.abs(x) < ROAD.width / 2 + 3) continue;
    if (Math.hypot(x - PLAYER.spawn.x, z - PLAYER.spawn.z) < 12) continue;
    if (isBlocked(x, z, 3)) continue;

    const leaves = random.pick(leafMaterials);
    const tree = random() < 0.5 ? makePineTree(leaves) : makeRoundTree(leaves);
    const size = random.range(0.8, 1.5);
    tree.scale.setScalar(size);
    tree.position.set(x, 0, z);
    tree.rotation.y = random() * Math.PI * 2;
    scene.add(tree);

    addCircleCollider(x, z, 0.4 * size); // you bump into the trunk
    planted++;
  }
}
