export enum ViewMode {
  RAW_STL,
  SHADER,
  SIMULATION,
  TEXTURE,
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
