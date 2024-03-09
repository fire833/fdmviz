export enum ViewMode {
  RAW_STL,
  PARTICLE_SIM,
  NORMAL_MAP,
}

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
