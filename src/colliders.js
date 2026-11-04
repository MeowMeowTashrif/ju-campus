// =============================================================
//  SIMPLE COLLISIONS
//  Anything the player should not walk through is added here:
//    - circles for round things (trees, the lake)
//    - boxes for square things (signs, buildings)
//  Boxes are lined up with the x and z directions (not rotated).
// =============================================================

const circles = [];
const boxes = [];

// A round blocker centred at (x, z).
export function addCircleCollider(x, z, radius) {
  circles.push({ x, z, radius });
}

// A rectangular blocker centred at (x, z), `width` along x and `depth` along z.
export function addBoxCollider(x, z, width, depth) {
  boxes.push({
    minX: x - width / 2,
    maxX: x + width / 2,
    minZ: z - depth / 2,
    maxZ: z + depth / 2,
  });
}

// Is the spot (x, z) inside, or within `margin` of, any blocker?
// Trees use this so they don't grow inside the lake or a building.
export function isBlocked(x, z, margin = 0) {
  for (const c of circles) {
    if (Math.hypot(x - c.x, z - c.z) < c.radius + margin) return true;
  }
  for (const b of boxes) {
    if (x > b.minX - margin && x < b.maxX + margin &&
        z > b.minZ - margin && z < b.maxZ + margin) return true;
  }
  return false;
}

// Push the player out of anything they walked into.
export function resolveCollisions(position, playerRadius) {
  for (const c of circles) {
    const dx = position.x - c.x;
    const dz = position.z - c.z;
    const distance = Math.hypot(dx, dz);
    const minDistance = c.radius + playerRadius;
    if (distance < minDistance && distance > 0.0001) {
      const push = (minDistance - distance) / distance;
      position.x += dx * push;
      position.z += dz * push;
    }
  }

  for (const b of boxes) {
    // Find the point on the box closest to the player.
    const closestX = Math.max(b.minX, Math.min(position.x, b.maxX));
    const closestZ = Math.max(b.minZ, Math.min(position.z, b.maxZ));
    const dx = position.x - closestX;
    const dz = position.z - closestZ;
    const distance = Math.hypot(dx, dz);

    if (distance >= playerRadius) continue; // not touching

    if (distance > 0.0001) {
      // Touching the edge: push straight out.
      const push = (playerRadius - distance) / distance;
      position.x += dx * push;
      position.z += dz * push;
    } else {
      // The centre is inside the box: push out through the nearest side.
      const toLeft = position.x - b.minX;
      const toRight = b.maxX - position.x;
      const toBack = position.z - b.minZ;
      const toFront = b.maxZ - position.z;
      const smallest = Math.min(toLeft, toRight, toBack, toFront);
      if (smallest === toLeft) position.x = b.minX - playerRadius;
      else if (smallest === toRight) position.x = b.maxX + playerRadius;
      else if (smallest === toBack) position.z = b.minZ - playerRadius;
      else position.z = b.maxZ + playerRadius;
    }
  }
}
