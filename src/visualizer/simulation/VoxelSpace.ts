export default class VoxelSpace {
  points: Array<Array<Array<Voxel>>>;

  constructor(sizex: number, sizey: number, sizez: number) {
    this.points = new Array(sizex);
    for (let x = 0; x < sizex; x++) {
      this.points[x] = new Array(sizey);
      for (let y = 0; y < sizey; y++) {
        this.points[x][y] = new Array(sizez);
        for (let z = 0; z < sizez; z++) {
          this.points[x][y][z] = new Voxel(y);
        }
      }
    }
  }
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
