import {
  BufferGeometry,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Vector3,
} from 'three';
import { marchingCubes } from './MarchingCubes';
import VoxelSpace, { defaultResolution } from './VoxelSpace';

export default class Simulator {
  private voxelSpace: VoxelSpace | undefined;
  private maxPolygons = 30000;

  constructor(geom: BufferGeometry) {
    this.reset();
    console.time('createVoxelSpace');
    this.voxelSpace = new VoxelSpace(geom);
    console.timeEnd('createVoxelSpace');
    this.generateVoxels();
  }

  // Reset the state of the simulator
  public reset() {}

  // Step the simulator forward by (delta) time
  public update(delta: number) {
    if (this.voxelSpace) {
      console.debug('stepping through gravity in the fluid simulation');
      console.time('gravityStep');
      let changed = this.voxelSpace.stepGravity();
      console.timeEnd('gravityStep');
      console.debug(`moved ${changed} voxels in this step`);
      console.time('temperatureStep');
      this.voxelSpace.stepTemperature();
      console.timeEnd('temperatureStep');
    }
  }

  generateVoxels(): [Vector3[], number[]] {
    let points = [];
    let values = [];

    for (let x = -(defaultResolution / 2); x < defaultResolution / 2; x++) {
      for (let y = 0; y < defaultResolution; y++)
        for (let z = -(defaultResolution / 2); z < defaultResolution / 2; z++) {
          points.push(new Vector3(x, y, z));
          values.push(this.voxelSpace?.getFromCoords(x, y, z) ? 0 : 1); // 0 if populated, 1 if empty
        }
    }

    return [points, values];
  }

  getTriangles(): Vector3[] {
    let [points, values] = this.generateVoxels();
    return marchingCubes(points, values);
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
      `generated cubes mesh: ${geometry.uuid} (${min?.x}, ${min?.y}, ${min?.z}) -> (${max?.x}, ${max?.y}, ${max?.z})`,
    );

    return geometry;
  }

  getGeometry(): BufferGeometry {
    // Return generated geometry
    console.time('generateGeometry');
    let geom = this.voxelSpace?.exportGeometry();
    if (geom === undefined) geom = new BufferGeometry();
    console.timeEnd('generateGeometry');
    return geom;
  }
}
