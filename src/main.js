// =============================================================
//  MAIN: sets everything up and runs the game loop.
// =============================================================
import * as THREE from 'three';
import { createEnvironment } from './world/environment.js';
import { createRoad } from './world/road.js';
import { createLake } from './world/lake.js';
import { createTrees } from './world/trees.js';
import { places } from './places/index.js';
import { Player } from './player.js';
import { FollowCamera } from './followCamera.js';

// ----- 1. Renderer (draws the 3D picture on the page) -----
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.3, 1000);

// ----- 2. Build the world (order matters: trees go last) -----
const { sun } = createEnvironment(scene);
createRoad(scene);
createLake(scene);
for (const createPlace of places) createPlace(scene);
createTrees(scene);

// ----- 3. Player and camera -----
const player = new Player(scene);
const followCamera = new FollowCamera(camera, renderer.domElement);

// ----- 4. Start / pause screen -----
const startScreen = document.getElementById('start-screen');
const positionText = document.getElementById('position');
let playing = false;

function startPlaying() {
  playing = true;
  followCamera.enabled = true;
  startScreen.classList.add('hidden');
  // Lock the mouse to the game so moving it turns the camera.
  try {
    const request = renderer.domElement.requestPointerLock();
    if (request && request.catch) request.catch(() => {}); // not allowed? drag to look instead
  } catch (e) { /* drag to look instead */ }
}

function pause() {
  playing = false;
  followCamera.enabled = false;
  startScreen.classList.remove('hidden');
}

startScreen.addEventListener('click', startPlaying);
// Pressing Esc releases the mouse; when that happens, pause.
document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement !== renderer.domElement && playing) pause();
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ----- 5. Game loop (runs about 60 times a second) -----
const clock = new THREE.Clock();

function gameLoop() {
  // Seconds since the last frame (capped so a slow frame can't launch the player).
  const dt = Math.min(clock.getDelta(), 0.05);

  if (playing) player.update(dt, followCamera.yaw);
  followCamera.update(player.position);

  // Keep the sun (and its shadows) centred on the player.
  const p = player.position;
  sun.position.set(p.x + 30, 60, p.z + 20);
  sun.target.position.set(p.x, 0, p.z);

  positionText.textContent = `x: ${p.x.toFixed(0)}   z: ${p.z.toFixed(0)}`;

  renderer.render(scene, camera);
  requestAnimationFrame(gameLoop);
}

gameLoop();
