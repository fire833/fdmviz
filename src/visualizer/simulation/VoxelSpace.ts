import { Mesh, Raycaster, Vector3 } from 'three';
import { marchingCubes } from './MarchingCubes';

export default class VoxelSpace {
  // The list of lattice points that are populated with volume.
  private points: Map<Vector3, Voxel> = new Map();

  // The bases that we want to use for intersection detection purposes.
  private bases: Array<Vector3> = Array<Vector3>(
    new Vector3(-1, 0, 0),
    new Vector3(1, 0, 0),
    new Vector3(0, -1, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, -1),
    new Vector3(0, 0, 1),
  );

  // Build a new voxelspace from a mesh.
  constructor(spacex: number, spacey: number, spacez: number, mesh: Mesh) {
    for (let x = 0; x < spacex; x++) {
      for (let y = 0; y < spacey; y++) {
        for (let z = 0; z < spacez; z++) {
          const pos: Vector3 = new Vector3(x, y, z);
          const caster = new Raycaster();
          if (this.insideMesh(caster, pos, mesh)) {
            this.points.set(new Vector3(x, y, z), new Voxel(z));
          }
        }
      }
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
    for (const vec of this.bases) {
      caster.set(position, vec);
      let rayCasterIntersects = caster.intersectObject(mesh, false);
      // we need odd number of intersections
      if (rayCasterIntersects.length % 2 === 1) return true;
    }

    return false;
  }

  // returns the space as a set of points via marchingCubes.
  public getSpace(): Vector3[] {
    let keys = this.points.keys();
    let points: Vector3[] = [];
    for (const key of keys) points.push(key);
    return marchingCubes(points, []);
  }

  // Perform one physics step on the space.
  public step() {}
}

export class Voxel {
  temperature: number;
  // The original layer the particle existed in within the
  // lattice when it was added.
  layer: number;

  constructor(layer: number) {
    this.layer = layer;
    this.temperature = 25;
  }
}
