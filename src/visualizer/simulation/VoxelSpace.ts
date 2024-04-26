import {
  BufferGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector3,
} from 'three';

export const defaultResolution = 30;

export default class VoxelSpace {
  sizex: number;
  sizey: number;
  sizez: number;
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
    this.voxels = this.voxelize(geom);
  }

  private voxelize(geom: BufferGeometry): Map<string, Voxel> {
    const voxels: Map<string, Voxel> = new Map();

    const mesh = new Mesh(geom);
    mesh.material = new MeshBasicMaterial();
    mesh.material.side = DoubleSide;
    const raycaster = new Raycaster();

    for (let x = -(this.sizex / 2); x < this.sizex / 2; x++) {
      for (let y = -(this.sizey / 2); y < this.sizey / 2; y++) {
        for (let z = -(this.sizez / 2); z < this.sizez / 2; z++) {
          if (this.insideMesh(raycaster, new Vector3(x, y, z), mesh)) {
            voxels.set(this.tupleToString([x, y, z]), new Voxel(z));
          }
        }
      }
    }

    return voxels;
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

  private tupleToString(tuple: [number, number, number]): string {
    return tuple.join(',');
  }

  // Steps through all voxels and applies gravity transformations
  // to the voxelspace. Returns the number of changed voxels.
  public stepGravity(): number {
    let count = 0;

    for (let z = -(defaultResolution / 2); z < defaultResolution / 2; z++)
      for (let y = 0; y < defaultResolution - 1; y++)
        for (let x = -(defaultResolution / 2); x < defaultResolution / 2; x++) {
          let voxel: Voxel | undefined = this.getFromCoords(x, y, z);
          if (voxel) {
            // Check for the collective "tension" between all other neighbor nodes.
            let tension = this.getNeighborsTension(x, y, z);
            if (tension < 4 && this.isVoxelFreeHanging(x, y, z) && y - 1 > 0) {
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
