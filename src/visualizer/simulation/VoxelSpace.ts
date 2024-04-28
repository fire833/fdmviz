import {
  BufferGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector3,
} from 'three';
import { edgeTable, triTable } from './LookUpTable';

export const defaultResolution = 15;

export default class VoxelSpace {
  sizex: number;
  sizey: number;
  sizez: number;

  meshstepx: number;
  meshstepy: number;
  meshstepz: number;

  minx: number;
  miny: number;
  minz: number;
  // The list of voxels (tupleToString([x,y,z])) that are non-empty.
  private voxels: Map<string, Voxel>;

  // The bases that we want to use for intersection detection purposes.
  private bases: Array<Vector3> = Array<Vector3>(
    new Vector3(-1, 0, 0),
    new Vector3(1, 0, 0),
    new Vector3(0, -1, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, -1),
    new Vector3(0, 0, 1),
  );

  // Build a new voxelspace by a voxelizing BufferGeometry.
  constructor(
    geom: BufferGeometry,
    spacex: number = defaultResolution,
    spacey: number = defaultResolution,
    spacez: number = defaultResolution,
  ) {
    this.sizex = spacex;
    this.sizey = spacey;
    this.sizez = spacez;

    let dim = this.getMeshDimensions(geom);
    console.debug(
      `mesh space: (${dim[0]}, ${dim[2]}, ${dim[4]}) -> (${dim[1]}, ${dim[3]}, ${dim[5]})`,
    );

    this.meshstepx = (dim[1] - dim[0]) / this.sizex;
    this.meshstepy = (dim[3] - dim[2]) / this.sizey;
    this.meshstepz = (dim[5] - dim[4]) / this.sizez;

    this.minx = dim[0];
    this.miny = dim[2];
    this.minz = dim[4];

    this.voxels = this.voxelize(geom);
  }

  private voxelize(geom: BufferGeometry): Map<string, Voxel> {
    const voxels: Map<string, Voxel> = new Map();

    const mesh = new Mesh(geom);
    mesh.material = new MeshBasicMaterial();
    mesh.material.side = DoubleSide;
    const raycaster = new Raycaster();

    for (let x = 0; x < this.sizex; x++) {
      for (let y = 0; y < this.sizey; y++) {
        for (let z = 0; z < this.sizez; z++) {
          const nx = x * this.meshstepx + this.minx;
          const ny = y * this.meshstepy + this.miny;
          const nz = z * this.meshstepz + this.minz;
          if (this.insideMesh(raycaster, new Vector3(nx, ny, nz), mesh)) {
            voxels.set(this.tupleToString([x, y, z]), new Voxel(z));
          }
        }
      }
    }

    return voxels;
  }

  // Get the minimum and max of the current geometry, so we can compute the correct range
  // of values to then perform marching cubes on.
  private getMeshDimensions(
    geom: BufferGeometry,
  ): [number, number, number, number, number, number] {
    if (!geom.boundingBox) geom.computeBoundingBox();
    if (geom.boundingBox) {
      let min: Vector3 = geom.boundingBox.min;
      let max: Vector3 = geom.boundingBox.max;
      return [
        min.x - 0.1, // 0
        max.x + 0.1, // 1
        min.y - 0.1, // 2
        max.y + 0.1, // 3
        min.z - 0.1, // 4
        max.z + 0.1, // 5
      ];
    } else {
      return [-50, 50, -50, 50, -50, 50];
    }
  }

  // Method to use a raycaster to determine whether we are inside of the
  // mesh or not. If we are, then we return true, and we will add the voxel
  // point to the space. Otherwise, we will continue onwards.
  private insideMesh(
    caster: Raycaster,
    position: Vector3,
    mesh: Mesh,
  ): boolean {
    caster.set(position, this.bases[0]);
    let rayCasterIntersects = caster.intersectObject(mesh, false);
    // we need odd number of intersections
    return rayCasterIntersects.length % 2 == 1;
  }

  public getFromCoords(x: number, y: number, z: number): Voxel | undefined {
    return this.voxels.get(this.tupleToString([x, y, z]));
  }

  public getFromVector(vector: Vector3): Voxel | undefined {
    return this.getFromCoords(vector.x, vector.y, vector.z);
  }

  public voxelExists(x: number, y: number, z: number): boolean {
    return this.voxels.has(this.tupleToString([x, y, z]));
  }

  // Used for generating keys for accessing/retrieving from the voxelspace.
  private tupleToString(tuple: [number, number, number]): string {
    return tuple.join(',');
  }

  // Computes the average between the two provided vectors, and
  // denormalizes the vector to fit with the original model space.
  private denormalizeVector(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
  ): Vector3 {
    let avgx = (x1 + x2) / 2;
    let avgy = (y1 + y2) / 2;
    let avgz = (z1 + z2) / 2;

    return new Vector3(
      this.minx + avgx * this.meshstepx,
      this.miny + avgy * this.meshstepy,
      this.minz + avgz * this.meshstepz,
    );
  }

  // Run marching cubes on the voxelspace and
  // compute the corresponding BufferGeometry.
  public exportGeometry(): BufferGeometry {
    let geom = new BufferGeometry();
    // approximated intersection points
    let vlist: Array<Vector3> = new Array<Vector3>(12);

    // TODO: need to statically allocate this, probably
    let vertices: number[] = [];

    for (let z = 0; z < this.sizez - 1; z++)
      for (let y = 0; y < this.sizey - 1; y++)
        for (let x = 0; x < this.sizex - 1; x++) {
          if (!this.voxelExists(x, y, z)) continue;
          // The mask used for checking intersection.
          let cubeMask = 0;

          // Check which neighbors exist and build up the corresponding cube mask.
          if (this.voxelExists(x, y, z)) cubeMask |= 1;
          if (this.voxelExists(x + 1, y, z)) cubeMask |= 2;
          if (this.voxelExists(x, y + 1, z)) cubeMask |= 8;
          if (this.voxelExists(x + 1, y + 1, z)) cubeMask |= 4;
          if (this.voxelExists(x, y, z + 1)) cubeMask |= 16;
          if (this.voxelExists(x + 1, y, z + 1)) cubeMask |= 32;
          if (this.voxelExists(x, y + 1, z + 1)) cubeMask |= 128;
          if (this.voxelExists(x + 1, y + 1, z + 1)) cubeMask |= 64;

          // lookup edges
          let bits = edgeTable[cubeMask];
          if (bits === 0) continue;

          // approximate intersection points
          if (bits & 1) {
            vlist[0] = this.denormalizeVector(x, y, z, x + 1, y, z);
          }
          if (bits & 2) {
            vlist[1] = this.denormalizeVector(x + 1, y, z, x + 1, y + 1, z);
          }
          if (bits & 4) {
            vlist[2] = this.denormalizeVector(x, y + 1, z, x + 1, y + 1, z);
          }
          if (bits & 8) {
            vlist[3] = this.denormalizeVector(x, y, z, x, y + 1, z);
          }
          // top of the cube
          if (bits & 16) {
            vlist[4] = this.denormalizeVector(x, y, z + 1, x + 1, y, z + 1);
          }
          if (bits & 32) {
            vlist[5] = this.denormalizeVector(
              x + 1,
              y,
              z + 1,
              x + 1,
              y + 1,
              z + 1,
            );
          }
          if (bits & 64) {
            vlist[6] = this.denormalizeVector(
              x,
              y + 1,
              z + 1,
              x + 1,
              y + 1,
              z + 1,
            );
          }
          if (bits & 128) {
            vlist[7] = this.denormalizeVector(x, y, z + 1, x, y + 1, z + 1);
          }
          // vertical lines of the cube
          if (bits & 256) {
            vlist[8] = this.denormalizeVector(x, y, z, x, y, z + 1);
          }
          if (bits & 512) {
            vlist[9] = this.denormalizeVector(x + 1, y, z, x + 1, y, z + 1);
          }
          if (bits & 1024) {
            vlist[10] = this.denormalizeVector(
              x + 1,
              y + 1,
              z,
              x + 1,
              y + 1,
              z + 1,
            );
          }
          if (bits & 2048) {
            vlist[11] = this.denormalizeVector(x, y + 1, z, x, y + 1, z + 1);
          }

          // lookup triangles
          let i = 0;
          cubeMask <<= 4; // multiply by 16...
          while (triTable[cubeMask + i] != -1) {
            let index1 = triTable[cubeMask + i];
            let index2 = triTable[cubeMask + i + 1];
            let index3 = triTable[cubeMask + i + 2];
            let val1 = vlist[index1];
            let val2 = vlist[index2];
            let val3 = vlist[index3];

            vertices.push(
              val1.x,
              val1.y,
              val1.z,
              val3.x,
              val3.y,
              val3.z,
              val2.x,
              val2.y,
              val2.z,
            );

            i += 3;
          }
        }

    console.debug(
      `computed is ${vertices.length} and is ${vertices.length / 3} size`,
    );

    // Update mesh with new triangles
    const positionAttribute = new Float32BufferAttribute(vertices, 3);
    positionAttribute.setUsage(DynamicDrawUsage);
    geom.setAttribute('position', positionAttribute);
    geom.setDrawRange(0, vertices.length);
    geom.computeVertexNormals();
    geom.getAttribute('position').needsUpdate = true;
    geom.getAttribute('normal').needsUpdate = true;

    geom.computeBoundingBox();
    let min = geom.boundingBox?.min;
    let max = geom.boundingBox?.max;
    console.debug(
      `voxel space: (${min?.x}, ${min?.y}, ${min?.z}) -> (${max?.x}, ${max?.y}, ${max?.z})`,
    );

    // Return the computed geometry.
    return geom;
  }

  // Steps through all voxels and applies gravity transformations
  // to the voxelspace. Returns the number of changed voxels.
  public stepGravity(): number {
    let count = 0;

    for (let z = 0; z < this.sizez; z++)
      for (let y = this.sizey; y > 0; y--)
        for (let x = 0; x < this.sizex; x++) {
          let voxel: Voxel | undefined = this.getFromCoords(x, y, z);
          if (voxel) {
            // Check for the collective "tension" between all other neighbor nodes.
            let tension = this.getNeighborsTension(x, y, z);
            if (tension < 6 && this.isVoxelFreeHanging(x, y, z) && y - 1 > 0) {
              count++;
              this.voxels.delete(this.tupleToString([x, y, z]));
              this.voxels.set(this.tupleToString([x, y - 1, z]), voxel);
            }
          }
        }

    return count;
  }

  // Steps through all voxels and translates temperature
  public stepTemperature(): void {}

  // Returns the relative "tension" between all relative neighbors,
  // if they exist, and returns a sum for upstream computation.
  private getNeighborsTension(x: number, y: number, z: number): number {
    let sum = 0;
    if (this.voxels.has(this.tupleToString([x + 1, y, z]))) sum++;
    if (this.voxels.has(this.tupleToString([x - 1, y, z]))) sum++;
    if (this.voxels.has(this.tupleToString([x, y + 1, z]))) sum++;
    if (this.voxels.has(this.tupleToString([x, y, z + 1]))) sum++;
    if (this.voxels.has(this.tupleToString([x, y, z - 1]))) sum++;
    if (this.voxels.has(this.tupleToString([x + 1, y, z + 1]))) sum++;
    if (this.voxels.has(this.tupleToString([x - 1, y, z + 1]))) sum++;
    if (this.voxels.has(this.tupleToString([x + 1, y, z - 1]))) sum++;
    if (this.voxels.has(this.tupleToString([x - 1, y, z - 1]))) sum++;

    return sum;
  }

  private isVoxelFreeHanging(x: number, y: number, z: number): boolean {
    return !this.voxels.has(this.tupleToString([x, y - 1, z]));
  }
}

// The primary class containing any useful state for a Voxel within
// our environment. Right now, this is just limited to temperature,
// but could contain other variables about this point in space.
export class Voxel {
  // The original layer the particle existed in within the
  // lattice when it was added.
  layer: number;
  temperature: number;

  constructor(layer: number) {
    this.layer = layer;
    this.temperature = 25;
  }
}
