import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { applyTerrainDisplacement, loadHeightPixels } from "./terrain.js";
import { lightingParams } from "./params.js";
import {
  applyRendererParams,
  createEarthMaterial,
  setupLighting,
  updateLightsForCamera,
} from "./rendering.js";

const EARTH_RADIUS = 1;
const EARTH_SEGMENTS = 224;
const TERRAIN_EXAGGERATION = 0.1;
const MIN_CAMERA_DISTANCE = 1.35;
const MAX_CAMERA_DISTANCE = 4.5;

const canvas = document.getElementById("globe-canvas");
const loadingEl = document.getElementById("loading");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
applyRendererParams(renderer);

const scene = new THREE.Scene();
scene.background = new THREE.Color(lightingParams.background);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.05,
  50,
);
camera.position.set(0, 0.15, 2.8);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.rotateSpeed = 0.45;
controls.zoomSpeed = 0.9;
controls.minDistance = MIN_CAMERA_DISTANCE;
controls.maxDistance = MAX_CAMERA_DISTANCE;
controls.enablePan = false;
controls.target.set(0, 0, 0);

const textureLoader = new THREE.TextureLoader();
const [earthTexture, heightPixels] = await Promise.all([
  textureLoader.loadAsync("./assets/earth-day.jpg"),
  loadHeightPixels("./assets/earth-height.png"),
]);

configureColorTexture(earthTexture, renderer);
const lights = setupLighting(scene);
const { sun, fill } = lights;

const earthGeometry = new THREE.SphereGeometry(
  EARTH_RADIUS,
  EARTH_SEGMENTS,
  EARTH_SEGMENTS,
);
applyTerrainDisplacement(earthGeometry, heightPixels, TERRAIN_EXAGGERATION);

const earth = new THREE.Mesh(earthGeometry, createEarthMaterial(earthTexture));
earth.renderOrder = 0;
scene.add(earth);

const stars = createStarfield(2400, 18);
scene.add(stars);

hideLoading();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateLightsForCamera(sun, fill, camera, controls.target);
  stars.rotation.y += 0.00012;
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", onResize);

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function hideLoading() {
  loadingEl.classList.add("is-hidden");
  window.setTimeout(() => loadingEl.remove(), 500);
}

function configureColorTexture(texture, renderer) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
}

function createStarfield(count, radius) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (0.85 + Math.random() * 0.15);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const brightness = 0.55 + Math.random() * 0.45;
    colors[i * 3] = brightness;
    colors[i * 3 + 1] = brightness;
    colors[i * 3 + 2] = brightness * (0.92 + Math.random() * 0.08);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.018,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}
