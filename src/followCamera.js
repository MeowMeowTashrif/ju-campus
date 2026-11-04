// A camera that floats behind the player. Move the mouse to swing it around.
import * as THREE from 'three';
import { CAMERA } from './config.js';

export class FollowCamera {
  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
    this.yaw = 0;      // left/right angle (0 = looking north)
    this.pitch = 0.35; // up/down angle (bigger = camera higher up)
    this.distance = CAMERA.distance;
    this.enabled = false;
    this.dragging = false;

    // Mouse look works two ways:
    //  - with the mouse "locked" to the game (normal), just move the mouse
    //  - if locking isn't allowed, hold the left button and drag
    document.addEventListener('mousemove', (event) => {
      if (!this.enabled) return;
      const locked = document.pointerLockElement === canvas;
      if (!locked && !this.dragging) return;
      this.yaw -= event.movementX * CAMERA.mouseSensitivity;
      this.pitch += event.movementY * CAMERA.mouseSensitivity;
      this.pitch = THREE.MathUtils.clamp(this.pitch, -0.2, 1.3);
    });
    canvas.addEventListener('mousedown', () => (this.dragging = true));
    window.addEventListener('mouseup', () => (this.dragging = false));

    // Scroll wheel zooms in and out.
    canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      this.distance = THREE.MathUtils.clamp(
        this.distance + event.deltaY * 0.01,
        CAMERA.minDistance,
        CAMERA.maxDistance
      );
    }, { passive: false });
  }

  // Called every frame with the player's position.
  update(target) {
    const lookAt = new THREE.Vector3(target.x, target.y + CAMERA.lookHeight, target.z);

    // Work out where the camera sits, on a circle around the player.
    const flat = Math.cos(this.pitch) * this.distance;
    this.camera.position.set(
      lookAt.x + Math.sin(this.yaw) * flat,
      lookAt.y + Math.sin(this.pitch) * this.distance,
      lookAt.z + Math.cos(this.yaw) * flat
    );
    // Never go under the ground.
    this.camera.position.y = Math.max(this.camera.position.y, 0.4);

    this.camera.lookAt(lookAt);
  }
}
