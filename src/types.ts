export enum ViewMode {
  RAW_STL,
  FRAG_SHADER,
  PARTICLE_SIM,
  NORMAL_MAP,
}

export enum MeshMaterial {
  STANDARD,
  FRAG_SHADER,
  NORMALS,
}

// TODO: Unused interface
interface SettingsValues {
  viewMode: ViewMode;
  simSpeed: Number;
  layerHeight: Number;
  temperature: Number;
  showVertexNormals: boolean;
  showSurfaceNormals: boolean;
  meltyParticles: boolean;
  shakyBed: boolean;
  wetFilament: boolean;
  thermalTransfer: boolean;
}
