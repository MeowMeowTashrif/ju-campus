// The main road, running north–south through the middle of the map (along x = 0).
import * as THREE from 'three';
import { COLORS, ROAD, WORLD } from '../config.js';

// Makes a flat rectangle lying on the ground.
function flatStrip(width, length, color, height) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, length),
    new THREE.MeshLambertMaterial({
      color,
      // Helps stop flickering between the road and the grass under it.
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = height;
  mesh.receiveShadow = true;
  return mesh;
}

export function createRoad(scene) {
  const road = new THREE.Group();
  const length = WORLD.groundSize;

  // Tarmac
  road.add(flatStrip(ROAD.width, length, COLORS.road, 0.03));

  // White lines along both edges
  for (const side of [-1, 1]) {
    const edge = flatStrip(0.25, length, COLORS.roadEdgeLine, 0.05);
    edge.position.x = side * (ROAD.width / 2 - 0.4);
    road.add(edge);
  }

  // Yellow dashed line in the centre (only where the player can see it)
  const dashLength = 3;
  const gap = 3;
  const half = WORLD.walkableSize / 2 + 100;
  for (let z = -half; z < half; z += dashLength + gap) {
    const dash = flatStrip(0.3, dashLength, COLORS.roadCentreLine, 0.05);
    dash.position.z = z;
    road.add(dash);
  }

  scene.add(road);
}
