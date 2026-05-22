import * as THREE from "three";

/**
 * Load a grayscale elevation / bump map (self-hosted, equirectangular).
 */
export async function loadHeightPixels(url) {
  const image = await loadImage(url);
  return imageDataFromImage(image);
}

async function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load height map: ${url}`));
    img.src = url;
  });
}

function imageDataFromImage(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Displace sphere vertices along normals using equirectangular height data.
 * Uses geometry UVs so displacement aligns with the color texture.
 *
 * @param {THREE.BufferGeometry} geometry
 * @param {ImageData} heightPixels
 * @param {number} exaggeration - multiplier in world units (Earth radius = 1)
 */
export function applyTerrainDisplacement(geometry, heightPixels, exaggeration) {
  const { width, height, data } = heightPixels;
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const normal = geometry.attributes.normal;

  const vertex = new THREE.Vector3();
  const n = new THREE.Vector3();

  for (let i = 0; i < position.count; i += 1) {
    const elevation = sampleHeightBilinear(
      data,
      width,
      height,
      uv.getX(i),
      uv.getY(i),
    );
    const displacement = elevation * exaggeration;

    vertex.fromBufferAttribute(position, i);
    n.fromBufferAttribute(normal, i);
    vertex.addScaledVector(n, displacement);
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

/**
 * @returns {number} height in 0..1
 */
function sampleHeightBilinear(data, width, height, u, v) {
  const x = u * (width - 1);
  const y = (1 - v) * (height - 1);

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, width - 1);
  const y1 = Math.min(y0 + 1, height - 1);
  const tx = x - x0;
  const ty = y - y0;

  const h00 = readHeight(data, width, x0, y0);
  const h10 = readHeight(data, width, x1, y0);
  const h01 = readHeight(data, width, x0, y1);
  const h11 = readHeight(data, width, x1, y1);

  const h0 = h00 * (1 - tx) + h10 * tx;
  const h1 = h01 * (1 - tx) + h11 * tx;
  return h0 * (1 - ty) + h1 * ty;
}

function readHeight(data, width, x, y) {
  const idx = (y * width + x) * 4;
  return data[idx] / 255;
}
