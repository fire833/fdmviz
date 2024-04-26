import { writable } from 'svelte/store';
import { ViewMode } from './types';

const fileURLKey: string = 'fileURL';
const orbitKey: string = 'orbit';
const showVertexNormalsKey: string = 'showVertexNormals';
const showSurfaceNormalsKey: string = 'showSurfaceNormals';
const showSurfaceUVsKey: string = 'showSurfaceUVs';
const smoothGeometryKey: string = 'smoothGeometry';

export const openModal = writable<boolean>(false);

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

// Orbit boolean
if (!localStorage.getItem(orbitKey)) localStorage.setItem(orbitKey, 'true'); // Set the default value in the store
export const orbit = writable<boolean>(
  localStorage.getItem(orbitKey) === 'true',
);
orbit.subscribe((val) => {
  localStorage.setItem(orbitKey, val ? 'true' : 'false');
});

// ShowVertexNormals boolean
if (!localStorage.getItem(showVertexNormalsKey))
  localStorage.setItem(showVertexNormalsKey, 'false'); // Set the default value in the store
export const showVertexNormals = writable<boolean>(
  localStorage.getItem(showVertexNormalsKey) === 'true',
);
showVertexNormals.subscribe((val) => {
  localStorage.setItem(showVertexNormalsKey, val ? 'true' : 'false');
});

// ShowSurfaceNormals boolean
if (!localStorage.getItem(showSurfaceNormalsKey))
  localStorage.setItem(showSurfaceNormalsKey, 'false'); // Set the default value in the store
export const showSurfaceNormals = writable<boolean>(
  localStorage.getItem(showSurfaceNormalsKey) === 'true',
);
showSurfaceNormals.subscribe((val) => {
  localStorage.setItem(showSurfaceNormalsKey, val ? 'true' : 'false');
});

// showSurfaceUVs boolean
if (!localStorage.getItem(showSurfaceUVsKey))
  localStorage.setItem(showSurfaceUVsKey, 'false'); // Set the default value in the store
export const showSurfaceUVs = writable<boolean>(
  localStorage.getItem(showSurfaceUVsKey) === 'true',
);
showSurfaceUVs.subscribe((val) => {
  localStorage.setItem(showSurfaceUVsKey, val ? 'true' : 'false');
});

// smoothGeometry boolean
if (!localStorage.getItem(smoothGeometryKey))
  localStorage.setItem(smoothGeometryKey, 'false'); // Set the default value in the store
export const smoothGeometry = writable<boolean>(
  localStorage.getItem(smoothGeometryKey) === 'true',
);
smoothGeometry.subscribe((val) => {
  localStorage.setItem(smoothGeometryKey, val ? 'true' : 'false');
});

export const meltyParticles = writable<boolean>(false);
export const shakyBed = writable<boolean>(false);
export const wetFilament = writable<boolean>(false);
export const thermalTransfer = writable<boolean>(false);
