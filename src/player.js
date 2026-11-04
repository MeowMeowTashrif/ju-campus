// The player: a friendly capsule with eyes, who walks, runs and jumps.
import * as THREE from 'three';
import { COLORS, PLAYER, WORLD } from './config.js';
import { keys } from './input.js';
import { resolveCollisions } from './colliders.js';

function makeCharacter() {
  const character = new THREE.Group();

  // Body: a capsule 1.8 m tall. Its bottom sits at y = 0 (the feet).
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 0.8, 4, 10),
    new THREE.MeshLambertMaterial({ color: COLORS.player, flatShading: true })
  );
  body.position.y = 0.9;
  body.castShadow = true;
  character.add(body);

  // Eyes on the front (+z side), so you can see which way it faces.
  const white = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const black = new THREE.MeshLambertMaterial({ color: 0x222222 });
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), white);
    eye.position.set(side * 0.18, 1.4, 0.42);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), black);
    pupil.position.set(0, 0, 0.09);
    eye.add(pupil);
    character.add(eye);
  }

  return character;
}

// Turns `current` toward `target` by a fraction, the short way round the circle.
function turnToward(current, target, amount) {
  const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + difference * amount;
}

export class Player {
  constructor(scene) {
    this.mesh = makeCharacter();
    this.mesh.position.set(PLAYER.spawn.x, 0, PLAYER.spawn.z);
    this.mesh.rotation.y = Math.PI; // start facing north (toward -z)
    scene.add(this.mesh);

    this.verticalSpeed = 0;
    this.onGround = true;
  }

  get position() {
    return this.mesh.position;
  }

  // Called every frame. `dt` is the seconds since the last frame,
  // `cameraYaw` is the direction the camera is looking.
  update(dt, cameraYaw) {
    const position = this.mesh.position;

    // 1. Which way do the keys say to go? (relative to the camera)
    let forwardAmount = 0;
    let sideAmount = 0;
    if (keys.KeyW || keys.ArrowUp) forwardAmount += 1;
    if (keys.KeyS || keys.ArrowDown) forwardAmount -= 1;
    if (keys.KeyD || keys.ArrowRight) sideAmount += 1;
    if (keys.KeyA || keys.ArrowLeft) sideAmount -= 1;

    const forward = new THREE.Vector3(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
    const right = new THREE.Vector3(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw));
    const direction = forward.multiplyScalar(forwardAmount).add(right.multiplyScalar(sideAmount));

    // 2. Walk (or run with Shift)
    if (direction.lengthSq() > 0) {
      direction.normalize();
      const running = keys.ShiftLeft || keys.ShiftRight;
      const speed = running ? PLAYER.runSpeed : PLAYER.walkSpeed;
      position.addScaledVector(direction, speed * dt);

      // Smoothly turn the character to face where it's walking.
      const targetAngle = Math.atan2(direction.x, direction.z);
      this.mesh.rotation.y = turnToward(this.mesh.rotation.y, targetAngle, Math.min(1, 12 * dt));
    }

    // 3. Jump and fall
    if (keys.Space && this.onGround) {
      this.verticalSpeed = PLAYER.jumpSpeed;
      this.onGround = false;
    }
    this.verticalSpeed -= PLAYER.gravity * dt;
    position.y += this.verticalSpeed * dt;
    if (position.y <= 0) {
      position.y = 0;
      this.verticalSpeed = 0;
      this.onGround = true;
    }

    // 4. Don't walk through trees, the lake or buildings
    resolveCollisions(position, PLAYER.radius);

    // 5. Stay inside the map
    const limit = WORLD.walkableSize / 2;
    position.x = THREE.MathUtils.clamp(position.x, -limit, limit);
    position.z = THREE.MathUtils.clamp(position.z, -limit, limit);
  }
}
