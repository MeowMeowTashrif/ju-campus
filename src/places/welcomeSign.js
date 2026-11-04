// A welcome board near where you start. It's also a small example of a "place".
import * as THREE from 'three';
import { addBoxCollider } from '../colliders.js';
import { makeTextTexture } from './helpers.js';

export function createWelcomeSign(scene) {
  const x = -14;
  const z = 48;

  const sign = new THREE.Group();

  // Two wooden posts
  const postMaterial = new THREE.MeshLambertMaterial({ color: 0x8b5a2b, flatShading: true });
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.6, 0.3), postMaterial);
    post.position.set(side * 2.8, 1.8, 0);
    post.castShadow = true;
    sign.add(post);
  }

  // The board. A box has 6 faces; face number 4 is the front (+z), where the text goes.
  const text = makeTextTexture([
    { text: 'Welcome to', size: 60 },
    { text: 'Jahangirnagar University', size: 68, bold: true },
    { text: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', size: 66 },
  ]);
  const wood = new THREE.MeshLambertMaterial({ color: 0x2e7d32 });
  const front = new THREE.MeshLambertMaterial({ map: text });
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(6.4, 2.1, 0.2),
    [wood, wood, wood, wood, front, wood]
  );
  board.position.y = 2.6;
  board.castShadow = true;
  sign.add(board);

  sign.position.set(x, 0, z);
  scene.add(sign);
  addBoxCollider(x, z, 6.4, 0.6);
}
