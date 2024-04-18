import {
  BufferGeometry,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Vector3,
} from 'three';
import { marchingCubes, resolution, scale } from './MarchingCubes';
import type VoxelSpace from './VoxelSpace';

export default class Simulator {
  private voxelSpace: VoxelSpace | undefined;
  private maxPolygons = 30000;
  private points: Vector3[] = [];
  private values: number[] = [];
  private metaBalls: { center: Vector3; radius: number }[] = [];

  constructor(geom: BufferGeometry) {
    // TODO: Create voxelSpace based on base geometry
    this.reset();
  }

  public reset() {
    this.metaBalls = [];
    this.metaBalls.push({ center: new Vector3(-3, 1, 0), radius: 0.2 });
    this.metaBalls.push({ center: new Vector3(2, 0, 0), radius: 0.5 });
    this.metaBalls.push({ center: new Vector3(2, 0, -2), radius: 0.25 });
  }

  // Step the simulator forward by (delta) time
  public update(delta: number) {
    this.metaBalls[0].center.x += 0.7 * delta;
    //generateVoxels(this.metaBalls);
    this.generateVoxels();
  }

  // Placeholder: generate voxel field based on metaballs
  generateVoxels(): void {
    this.points = [];
    this.values = [];
    // generate the list of 3D points
    for (var k = 0; k < resolution; k++) {
      for (var j = 0; j < resolution; j++) {
        for (var i = 0; i < resolution; i++) {
          var x = -(scale / 2) + (scale * i) / (resolution - 1);
          var y = -(scale / 2) + (scale * j) / (resolution - 1);
          var z = -(scale / 2) + (scale * k) / (resolution - 1);
          this.points.push(new Vector3(x, y, z));
        }
      }
    }
    // generate values array for points
    const total = resolution * resolution * resolution;
    for (var i = 0; i < total; i++) this.values[i] = 0;

    // Add "Rule" here changing the value of each point given the list passed in
    // meta balls
    for (const metaBall of this.metaBalls) {
      for (let i = 0; i < this.points.length; i++) {
        // meta ball function
        const distance =
          metaBall.radius - metaBall.center.distanceTo(this.points[i]);
        this.values[i] += Math.exp(-(distance * distance));
      }
    }

    // Adds floor (Created by yours truly CMATT)
    for (let i = 0; i < this.points.length; i++) {
      // meta ball function
      this.values[i] += Math.exp(-this.points[i].y - 4.3);
    }
  }

  getTriangles(): Vector3[] {
    return marchingCubes(this.points, this.values);
  }

  getGeometry(): BufferGeometry {
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

    return geometry;
  }
}
