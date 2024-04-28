import { writable, type Writable } from 'svelte/store';
import { ViewMode } from './types';
import Visualizer from './visualizer/Visualizer';

// Create a store which is kept updated & loaded with localStorage.
function createStore<T>(key: string, initialValue: T): Writable<T> {
  // Initialize localStorage with initialValue
  const existingValue = localStorage.getItem(key);
  if (!existingValue) localStorage.setItem(key, JSON.stringify(initialValue));

  // Create store
  var store: Writable<T> = existingValue
    ? writable(JSON.parse(existingValue))
    : writable(initialValue);

  // Update localStorage when store is updated
  store.subscribe((value) => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  return store;
}

/* --- SETTINGS STORES --- */

// FileURL
export const fileURL = createStore<string>('fileURL', 'utah_teapot.stl');

// ViewMode
export const viewMode = createStore<ViewMode>('viewMode', ViewMode.RAW_STL);

// Parameters
export const layerHeight = createStore<number>('layerHeight', 0.2); // mm
export const simSpeed = createStore<number>('simSpeed', 1); // ticks per second
export const temperature = createStore<number>('temperature', 150); // °C
export const spaceDim = createStore<number>('spaceDim', 25); // Dimension of voxel space

// Features
export const orbit = createStore<boolean>('orbit', true);
export const showVertexNormals = createStore<boolean>(
  'showVertexNormals',
  false,
);
export const showSurfaceNormals = createStore<boolean>(
  'showSurfaceNormals',
  false,
);
export const showSurfaceUVs = createStore<boolean>('showSurfaceUVs', false);
export const smoothGeometry = createStore<boolean>('smoothGeometry', false);
export const meltyParticles = createStore<boolean>('meltyParticles', false);
export const shakyBed = createStore<boolean>('shakyBed', false);
export const wetFilament = createStore<boolean>('wetFilament', false);
export const thermalTransfer = createStore<boolean>('thermalTransfer', false);

// Loading messages
export const loadingMessages = writable<Array<String>>(new Array<String>());

// Global visualizer object
export const visualizer = writable<Visualizer>(new Visualizer());
