import {
  BufferGeometry,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Vector3,
} from 'three';
import { marchingCubes } from './MarchingCubes';
import VoxelSpace, { defaultResolution } from './VoxelSpace';

export default class Simulator {
  private geometry: BufferGeometry | null;
  private voxelSpace: VoxelSpace | undefined;
  private maxPolygons = 30000;
  private points: Vector3[] = [];
  private values: number[] = [];

  constructor(geom: BufferGeometry) {
    this.geometry = null;
    this.reset();
    this.voxelSpace = new VoxelSpace(geom);
    this.generateVoxels();
  }

  // Reset the state of the simulator
  public reset() {}

  // Step the simulator forward by (delta) time
  public update(delta: number) {}

  generateVoxels(): void {
    this.points = [];

    for (let x = -(defaultResolution / 2); x < defaultResolution / 2; x++) {
      for (let y = -(defaultResolution / 2); y < defaultResolution / 2; y++) {
        for (let z = -(defaultResolution / 2); z < defaultResolution / 2; z++) {
          this.points.push(new Vector3(x, y, z));
          this.values.push(this.voxelSpace?.getFromCoords(x, y, z) ? 0 : 1); // 0 if populated, 1 if empty
        }
      }
    }
  }

  getTriangles(): Vector3[] {
    return marchingCubes(this.points, this.values);
  }

  private generateGeometry(): BufferGeometry {
    let geometry = new BufferGeometry();

    const vertices: Array<number> = Array(3 * this.maxPolygons).fill(0);
    let trianglePoints: Vector3[] = this.getTriangles();

    for (let i = 0; i < trianglePoints.length; i++) {
      const x = trianglePoints[i].x;
      const y = trianglePoints[i].y;
      const z = trianglePoints[i].z;

      vertices[i * 3] = x;
      vertices[i * 3 + 1] = y;
      vertices[i * 3 + 2] = z;
    }
    // Update mesh with new triangles
    const positionAttribute = new Float32BufferAttribute(vertices, 3);
    positionAttribute.setUsage(DynamicDrawUsage);
    geometry.setAttribute('position', positionAttribute);
    geometry.setDrawRange(0, trianglePoints.length);
    geometry.computeVertexNormals();
    geometry.getAttribute('position').needsUpdate = true;
    geometry.getAttribute('normal').needsUpdate = true;

    if (!geometry.boundingBox) geometry.computeBoundingBox();
    let min = geometry.boundingBox?.min;
    let max = geometry.boundingBox?.max;
    console.debug(
      `generated cubes mesh: (${min?.x}, ${min?.y}, ${min?.z}) -> (${max?.x}, ${max?.y}, ${max?.z})`,
    );

    if (this.geometry) this.geometry.dispose();
    this.geometry = geometry;
    return geometry;
  }

  getGeometry(): BufferGeometry {
    // Return memoized geometry
    if (this.geometry) return this.geometry;
    // Return generated geometry
    else {
      if (this.voxelSpace) {
        this.geometry = this.voxelSpace.exportGeometry();
        return this.geometry;
      } else return new BufferGeometry();
    }
  }
}
