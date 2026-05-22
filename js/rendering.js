import * as THREE from "three";
import { lightingParams } from "./params.js";

const SUN_DISTANCE = 12;
const _toCamera = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _lightDir = new THREE.Vector3();

export function createEarthMaterial(colorMap) {
  return new THREE.MeshStandardMaterial({
    map: colorMap,
    roughness: lightingParams.roughness,
    metalness: lightingParams.metalness,
    toneMapped: false,
  });
}

export function setupLighting(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, lightingParams.ambientIntensity);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(
    lightingParams.hemiSky,
    lightingParams.hemiGround,
    lightingParams.hemiIntensity,
  );
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(
    lightingParams.sunColor,
    lightingParams.sunIntensity,
  );
  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight(
    lightingParams.fillColor,
    lightingParams.fillIntensity,
  );
  scene.add(fill);
  scene.add(fill.target);

  return { ambient, hemi, sun, fill };
}

export function applyLightingParams(lights) {
  const { ambient, hemi, sun, fill } = lights;

  ambient.intensity = lightingParams.ambientIntensity;
  hemi.intensity = lightingParams.hemiIntensity;
  hemi.color.set(lightingParams.hemiSky);
  hemi.groundColor.set(lightingParams.hemiGround);

  sun.intensity = lightingParams.sunIntensity;
  sun.color.set(lightingParams.sunColor);

  fill.intensity = lightingParams.fillIntensity;
  fill.color.set(lightingParams.fillColor);
}

export function applyRendererParams(renderer) {
  if (lightingParams.toneMapping === "aces") {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lightingParams.exposure;
  } else {
    renderer.toneMapping = THREE.NoToneMapping;
  }
}

export function updateLightsForCamera(sun, fill, camera, target) {
  _toCamera.subVectors(camera.position, target).normalize();
  _right.setFromMatrixColumn(camera.matrixWorld, 0);
  _up.setFromMatrixColumn(camera.matrixWorld, 1);

  _lightDir
    .copy(_toCamera)
    .multiplyScalar(lightingParams.sunTowardCamera)
    .addScaledVector(_right, lightingParams.sunTowardRight)
    .addScaledVector(_up, lightingParams.sunTowardUp)
    .normalize();

  sun.position.copy(target).addScaledVector(_lightDir, SUN_DISTANCE);
  sun.target.position.copy(target);

  _lightDir
    .copy(_toCamera)
    .multiplyScalar(lightingParams.fillTowardCamera)
    .addScaledVector(_right, lightingParams.fillTowardRight)
    .addScaledVector(_up, lightingParams.fillTowardUp)
    .normalize();

  fill.position.copy(target).addScaledVector(_lightDir, SUN_DISTANCE);
  fill.target.position.copy(target);
}
