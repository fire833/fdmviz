import {
  BufferGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector3,
} from 'three';

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

  private isolevel = 0.5;

  // Build a new voxelspace by a voxelizing BufferGeometry.
  constructor(
    geom: BufferGeometry,
    spacex: number = 25,
    spacey: number = 25,
    spacez: number = 25,
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

    let dim = this.getMeshDimensions(geom);

    const stepx = (dim[1] - dim[0]) / this.sizex;
    const stepy = (dim[3] - dim[2]) / this.sizey;
    const stepz = (dim[5] - dim[4]) / this.sizez;
    for (let x = dim[0]; x < dim[1]; x += stepx) {
      for (let y = dim[2]; y < dim[3]; y += stepy) {
        for (let z = dim[4]; z < dim[5]; z += stepz) {
          if (this.insideMesh(raycaster, new Vector3(x, y, z), mesh)) {
            // console.log(`found voxel at (${x},${y},${z})`);
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
        min.x - 0.5,
        max.x + 0.5,
        min.y - 0.5,
        max.y + 0.5,
        min.z - 0.5,
        max.z + 0.5,
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

  // // Run marching cubes on the voxelspace and
  // // compute the corresponding BufferGeometry.
  // public exportGeometry(): BufferGeometry {
  //   let geom = new BufferGeometry();
  //   // approximated intersection points
  //   let vlist: Array<Vector3> = new Array(12);
  //   // The mask used for checking intersection.
  //   let cubeMask = 0;

  //   // TODO: need to statically allocate this, probably
  //   let vertices: Vector3[] = [];

  //   for (let z = 0; z < this.sizez - 1; z++)
  //     for (let y = 0; y < this.sizey - 1; y++)
  //       for (let x = 0; x < this.sizex - 1; x++) {
  //         if (!this.voxelExists(x, y, z)) continue;

  //         // Check which neighbors exist and build up the corresponding cube mask.
  //         if (this.voxelExists(x, y, z)) cubeMask |= 1;
  //         if (this.voxelExists(x + 1, y, z)) cubeMask |= 2;
  //         if (this.voxelExists(x, y + 1, z)) cubeMask |= 8;
  //         if (this.voxelExists(x + 1, y + 1, z)) cubeMask |= 4;
  //         if (this.voxelExists(x, y + 2, z)) cubeMask |= 8;

  //         // lookup edges
  //         let bits = edgeTable[cubeMask];
  //         if (bits === 0) continue;

  //         // approximate intersection points
  //         let mu = 0.5;
  //         if (bits & 1) {
  //           mu = (this.isolevel - value0) / (value1 - value0);
  //           vlist[0] = points[p].clone().lerp(points[px], mu);
  //         }
  //         if (bits & 2) {
  //           mu = (this.isolevel - value1) / (value3 - value1);
  //           vlist[1] = points[px].clone().lerp(points[pxy], mu);
  //         }
  //         if (bits & 4) {
  //           mu = (this.isolevel - value2) / (value3 - value2);
  //           vlist[2] = points[py].clone().lerp(points[pxy], mu);
  //         }
  //         if (bits & 8) {
  //           mu = (this.isolevel - value0) / (value2 - value0);
  //           vlist[3] = points[p].clone().lerp(points[py], mu);
  //         }
  //         // top of the cube
  //         if (bits & 16) {
  //           mu = (this.isolevel - value4) / (value5 - value4);
  //           vlist[4] = points[pz].clone().lerp(points[pxz], mu);
  //         }
  //         if (bits & 32) {
  //           mu = (this.isolevel - value5) / (value7 - value5);
  //           vlist[5] = points[pxz].clone().lerp(points[pxyz], mu);
  //         }
  //         if (bits & 64) {
  //           mu = (this.isolevel - value6) / (value7 - value6);
  //           vlist[6] = points[pyz].clone().lerp(points[pxyz], mu);
  //         }
  //         if (bits & 128) {
  //           mu = (this.isolevel - value4) / (value6 - value4);
  //           vlist[7] = points[pz].clone().lerp(points[pyz], mu);
  //         }
  //         // vertical lines of the cube
  //         if (bits & 256) {
  //           mu = (this.isolevel - value0) / (value4 - value0);
  //           vlist[8] = points[p].clone().lerp(points[pz], mu);
  //         }
  //         if (bits & 512) {
  //           mu = (this.isolevel - value1) / (value5 - value1);
  //           vlist[9] = points[px].clone().lerp(points[pxz], mu);
  //         }
  //         if (bits & 1024) {
  //           mu = (this.isolevel - value3) / (value7 - value3);
  //           vlist[10] = points[pxy].clone().lerp(points[pxyz], mu);
  //         }
  //         if (bits & 2048) {
  //           mu = (this.isolevel - value2) / (value6 - value2);
  //           vlist[11] = points[py].clone().lerp(points[pyz], mu);
  //         }

  //         // lookup triangles
  //         let i = 0;
  //         cubeMask <<= 4; // multiply by 16...
  //         while (triTable[cubeMask + i] != -1) {
  //           var index1 = triTable[cubeMask + i];
  //           var index2 = triTable[cubeMask + i + 1];
  //           var index3 = triTable[cubeMask + i + 2];

  //           vertices.push(vlist[index1], vlist[index2], vlist[index3]);

  //           trianglePoints.push(vlist[index1].clone());
  //           trianglePoints.push(vlist[index2].clone());
  //           trianglePoints.push(vlist[index3].clone());

  //           i += 3;
  //         }

  //         cubeMask = 0;
  //         vlist.fill(0);
  //       }

  //   // Update mesh with new triangles
  //   const positionAttribute = new Float32BufferAttribute(vertices, 3);
  //   positionAttribute.setUsage(DynamicDrawUsage);
  //   geometry.setAttribute('position', positionAttribute);
  //   geometry.setDrawRange(0, trianglePoints.length);
  //   geometry.computeVertexNormals();
  //   geometry.getAttribute('position').needsUpdate = true;
  //   geometry.getAttribute('normal').needsUpdate = true;

  //   // Return the computed geometry.
  //   return geom;
  // }
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
