import { BufferAttribute, Mesh } from 'three';

export function generateUVs(mesh: Mesh) {
  const posAttribute = mesh.geometry.getAttribute('position');
  const uvAttribute = new BufferAttribute(
    new Float32Array(posAttribute.count * 2),
    2,
  );

  mesh.geometry.computeBoundingSphere();
  if (!mesh.geometry.boundingSphere) return;

  const radius: number = mesh.geometry.boundingSphere.radius;
  const centerX: number = mesh.geometry.boundingSphere.center.x;
  const centerZ: number = mesh.geometry.boundingSphere.center.z;

  // Set UVs
  console.log(posAttribute.count);
  for (let i = 0; i < posAttribute.count; i++) {
    const offsetX = centerX - posAttribute.getX(i);
    const offsetZ = centerZ - posAttribute.getZ(i);
    const angle = Math.atan2(offsetZ, offsetX); // Angle in radians

    const u = (angle + Math.PI) / (2 * Math.PI);
    const v = Math.asin(posAttribute.getY(i) / (2 * radius));

    // Modify u and v as needed
    uvAttribute.setXY(i, u, v);
  }

  // Mark UVs as updated
  mesh.geometry.setAttribute('uv', uvAttribute);
  uvAttribute.needsUpdate = true;
}
