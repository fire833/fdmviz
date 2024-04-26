import { writable, type Writable } from 'svelte/store';
import { ViewMode } from './types';
import Visualizer from './visualizer/Visualizer';

const fileURLKey: string = 'fileURL';

// Store for the FileURL
export const fileURL = writable<string>(
  localStorage.getItem(fileURLKey) || 'utah_teapot.stl',
);
fileURL.subscribe((val) => localStorage.setItem(fileURLKey, val));

// Store for the current viewMode, should affect viewport.
export const viewMode = writable<ViewMode>(ViewMode.RAW_STL);

// Loading
export const loadingMessages = writable<Array<String>>(new Array<String>());

// Parameters
export const layerHeight = writable<number>(0.2); // mm
export const simSpeed = writable<number>(1); // ticks per second
export const temperature = writable<number>(150); // °C
export const spaceDim = writable<number>(25); // Dimension of voxel space

// Features

function createBooleanStore(key: string, defVal: boolean): Writable<boolean> {
  if (!localStorage.getItem(key))
    localStorage.setItem(key, defVal ? 'true' : 'false'); // Set the default value in the store
  const store = writable(localStorage.getItem(key) === 'true');
  store.subscribe((val) => {
    localStorage.setItem(key, val ? 'true' : 'false');
  });
  return store;
}

// Orbit boolean
export const orbit = createBooleanStore('orbit', true);
// ShowVertexNormals boolean
export const showVertexNormals = createBooleanStore('showVertexNormals', false);
// ShowSurfaceNormals boolean
export const showSurfaceNormals = createBooleanStore(
  'showSurfaceNormals',
  false,
);
// showSurfaceUVs boolean
export const showSurfaceUVs = createBooleanStore('showSurfaceUVs', false);
// smoothGeometry boolean
export const smoothGeometry = createBooleanStore('smoothGeometry', false);
export const meltyParticles = createBooleanStore('meltyParticles', false);
export const shakyBed = createBooleanStore('shakyBed', false);
export const wetFilament = createBooleanStore('wetFilament', false);
export const thermalTransfer = createBooleanStore('thermalTransfer', false);

// Global vizualizer object so we can reference it anywhere.
// Even though this is bad practice.
export const visualizer = writable<Visualizer>(new Visualizer());
