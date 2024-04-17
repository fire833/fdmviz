import { get } from 'svelte/store';
import {
  BufferAttribute,
  Mesh,
  RepeatWrapping,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
import { clearLoading, startLoading } from '../../displayLoading';
import { layerHeight } from '../../stores';

// Spherical UV projection
export function generateUVs(mesh: Mesh): void {
  const posAttribute = mesh.geometry.getAttribute('position');
  const uvAttribute = new BufferAttribute(
    new Float32Array(posAttribute.count * 2),
    2,
  );

  mesh.geometry.computeBoundingSphere();
  if (!mesh.geometry.boundingSphere) return;
  const radius: number = mesh.geometry.boundingSphere.radius;
  const center: Vector3 = mesh.geometry.boundingSphere.center;

  // Calculate UVs
  for (let i = 0; i < posAttribute.count; i++) {
    const offsetX = (posAttribute.getX(i) - center.x) / radius;
    const offsetY = (posAttribute.getY(i) - center.y) / radius;
    const offsetZ = (posAttribute.getZ(i) - center.z) / radius;

    const u = 0.5 + Math.atan2(offsetZ, offsetX) / (2 * Math.PI);
    const v = 0.5 + Math.asin(offsetY) / Math.PI;

    // Modify u and v as needed
    uvAttribute.setXY(i, u, v);
  }

  // Mark UVs as updated
  mesh.geometry.setAttribute('uv', uvAttribute);
  uvAttribute.needsUpdate = true;
}

export async function getNormalMap(): Promise<Texture> {
  // Load the image
  let normalTexture: Texture;

  let loadingMessage = 'Loading 3D Printed Texture';
  startLoading(loadingMessage);
  let loader = new TextureLoader().loadAsync('alan_warburton.png');
  normalTexture = await loader;
  clearLoading(loadingMessage);

  // Configure the texture
  const scale = get(layerHeight) * 2;
  normalTexture.repeat = new Vector2(1 / scale, 1 / scale);
  normalTexture.wrapS = RepeatWrapping;
  normalTexture.wrapT = RepeatWrapping;

  return normalTexture;
}

export async function getUVMap(): Promise<Texture> {
  // Load the image
  let loadingMessage = 'Loading UV Checker Map';
  startLoading(loadingMessage);
  return new TextureLoader().loadAsync('uv_checker.png');
  clearLoading(loadingMessage);
}
