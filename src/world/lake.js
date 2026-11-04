// One lake with a sandy shore. JU is famous for its lakes (and the migratory
// birds that visit them in winter), so later you can add more of these.
import * as THREE from 'three';
import { COLORS, LAKE } from '../config.js';
import { addCircleCollider } from '../colliders.js';
import { createRandom } from '../random.js';

// Builds a wobbly, roughly round flat shape so the lake doesn't look like a perfect circle.
function blobGeometry(wobbles, baseRadius) {
  const shape = new THREE.Shape();
  wobbles.forEach((wobble, i) => {
    const angle = (i / wobbles.length) * Math.PI * 2;
    const r = baseRadius * wobble;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

export function createLake(scene, { x, z, radius } = LAKE) {
  const random = createRandom(42);
  const wobbles = Array.from({ length: 18 }, () => random.range(0.88, 1.1));

  const lake = new THREE.Group();
  lake.position.set(x, 0, z);

  // Sandy shore (slightly bigger than the water)
  const sand = new THREE.Mesh(
    blobGeometry(wobbles, radius + 4),
    new THREE.MeshLambertMaterial({ color: COLORS.sand, polygonOffset: true, polygonOffsetFactor: -1 })
  );
  sand.rotation.x = -Math.PI / 2;
  sand.position.y = 0.03;
  sand.receiveShadow = true;
  lake.add(sand);

  // Water
  const water = new THREE.Mesh(
    blobGeometry(wobbles, radius),
    new THREE.MeshLambertMaterial({ color: COLORS.water, polygonOffset: true, polygonOffsetFactor: -2 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.06;
  lake.add(water);

  // A few lily pads to make it cuter
  const padMaterial = new THREE.MeshLambertMaterial({ color: 0x3f9b3a, flatShading: true });
  const padGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 7);
  for (let i = 0; i < 10; i++) {
    const angle = random() * Math.PI * 2;
    const distance = random.range(0.3, 0.75) * radius;
    const pad = new THREE.Mesh(padGeometry, padMaterial);
    pad.position.set(Math.cos(angle) * distance, 0.1, Math.sin(angle) * distance);
    pad.scale.setScalar(random.range(0.6, 1.3));
    lake.add(pad);
  }

  scene.add(lake);

  // Stop the player from walking into the water.
  addCircleCollider(x, z, radius * 0.92);
}
