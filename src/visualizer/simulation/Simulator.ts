import {
  BufferGeometry,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Vector3,
} from 'three';
import { marchingCubes, resolution } from './MarchingCubes';
import VoxelSpace from './VoxelSpace';

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

    for (var x = 0; x < resolution; x++) {
      for (var y = 0; y < resolution; y++) {
        for (var z = 0; z < resolution; z++) {
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

    const vertices = Array(3 * this.maxPolygons).fill(0);
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

    this.geometry = geometry;
    return geometry;
  }

  getGeometry(): BufferGeometry {
    // Return memoized geometry
    if (this.geometry) return this.geometry;
    // Return generated geometry
    else return this.generateGeometry();
  }
}
