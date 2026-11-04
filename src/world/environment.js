// Sky, sunlight, clouds and the green ground.
import * as THREE from 'three';
import { COLORS, WORLD } from '../config.js';
import { createRandom } from '../random.js';

export function createEnvironment(scene) {
  const random = createRandom(7);

  // ----- Sky -----
  scene.background = new THREE.Color(COLORS.sky);
  // Fog fades far-away things into the sky colour.
  scene.fog = new THREE.Fog(COLORS.sky, 90, 320);

  // ----- Light -----
  // Soft light from the whole sky (blue from above, green bounced from the grass).
  const skyLight = new THREE.HemisphereLight(0xcfeaff, 0x6a9c4a, 1.3);
  scene.add(skyLight);

  // The sun. It casts shadows. main.js moves it along with the player.
  const sun = new THREE.DirectionalLight(0xfff4e0, 2.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const area = 50; // shadows are drawn within 50 m of the player
  sun.shadow.camera.left = -area;
  sun.shadow.camera.right = area;
  sun.shadow.camera.top = area;
  sun.shadow.camera.bottom = -area;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 200;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);
  scene.add(sun.target);

  // ----- Ground -----
  // A big flat square, split into triangles that each get a slightly
  // different green. That gives the patchy low-poly look.
  const size = WORLD.groundSize;
  const groundGeometry = new THREE.PlaneGeometry(size, size, 80, 80).toNonIndexed();
  const colors = [];
  const shade = new THREE.Color();
  const vertexCount = groundGeometry.attributes.position.count;
  for (let i = 0; i < vertexCount; i += 3) {
    shade.setHex(random.pick(COLORS.grass));
    for (let j = 0; j < 3; j++) colors.push(shade.r, shade.g, shade.b);
  }
  groundGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const ground = new THREE.Mesh(
    groundGeometry,
    new THREE.MeshLambertMaterial({ vertexColors: true })
  );
  ground.rotation.x = -Math.PI / 2; // lay it flat
  ground.receiveShadow = true;
  scene.add(ground);

  // ----- Clouds -----
  const cloudMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    emissive: 0xbbbbbb,
    flatShading: true,
    fog: false,
  });
  const puffGeometry = new THREE.IcosahedronGeometry(1, 0);
  for (let i = 0; i < 18; i++) {
    const cloud = new THREE.Group();
    const puffs = 3 + Math.floor(random() * 3);
    for (let p = 0; p < puffs; p++) {
      const puff = new THREE.Mesh(puffGeometry, cloudMaterial);
      puff.position.set(p * 4 - puffs * 2, random.range(-1, 1.5), random.range(-2, 2));
      puff.scale.setScalar(random.range(3, 5.5));
      cloud.add(puff);
    }
    cloud.position.set(random.range(-300, 300), random.range(55, 80), random.range(-300, 300));
    cloud.rotation.y = random() * Math.PI;
    scene.add(cloud);
  }

  return { sun };
}
