export default class VoxelSpace {
  // The list of lattice points that are populated with volume.
  points: Map<[number, number, number], Voxel> = new Map();

  constructor() {}
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
