// Ready-made building blocks for campus places.
// Use these in your place files so each new building only takes a few lines.
import * as THREE from 'three';
import { addBoxCollider } from '../colliders.js';

function shadowy(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// A coloured box. Its bottom sits on the ground at (x, z).
export function makeBox({ width, height, depth, color }) {
  const box = shadowy(new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshLambertMaterial({ color, flatShading: true })
  ));
  box.position.y = height / 2;
  return box;
}

// A simple building: walls, a flat roof, a door and rows of windows.
// The door faces south (+z). Adds a collider so the player can't walk through.
export function createSimpleBuilding(scene, {
  x, z,
  width = 20, depth = 12,
  floors = 3,
  wallColor = 0xd9534f,  // JU buildings are often red brick
  roofColor = 0xeeeeee,
  windowColor = 0x9fd8ff,
}) {
  const floorHeight = 3.5;
  const height = floors * floorHeight;
  const building = new THREE.Group();

  // Walls
  building.add(makeBox({ width, height, depth, color: wallColor }));

  // Roof edge
  const roof = makeBox({ width: width + 0.6, height: 0.5, depth: depth + 0.6, color: roofColor });
  roof.position.y = height + 0.25;
  building.add(roof);

  // Door
  const door = makeBox({ width: 2.4, height: 2.8, depth: 0.2, color: 0x6b4226 });
  door.position.z = depth / 2 + 0.05;
  door.position.y = 1.4;
  building.add(door);

  // Windows on the front and back
  const windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });
  const windowGeometry = new THREE.BoxGeometry(1.4, 1.4, 0.2);
  const perRow = Math.max(1, Math.floor(width / 4));
  for (let floor = 0; floor < floors; floor++) {
    for (let i = 0; i < perRow; i++) {
      const wx = -width / 2 + (i + 0.5) * (width / perRow);
      const wy = floor * floorHeight + 2.2;
      if (floor === 0 && Math.abs(wx) < 2) continue; // leave room for the door
      for (const side of [-1, 1]) {
        const win = new THREE.Mesh(windowGeometry, windowMaterial);
        win.position.set(wx, wy, side * (depth / 2 + 0.05));
        building.add(win);
      }
    }
  }

  building.position.set(x, 0, z);
  scene.add(building);
  addBoxCollider(x, z, width, depth);
  return building;
}

// A flat sign with text drawn on it (used for name boards).
export function makeTextTexture(lines, { width = 1024, height = 340, background = '#2e7d32' } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((line, i) => {
    ctx.font = `${line.bold ? 'bold ' : ''}${line.size}px system-ui, sans-serif`;
    ctx.fillText(line.text, width / 2, (height / (lines.length + 1)) * (i + 1));
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
