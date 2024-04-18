import { writable } from 'svelte/store';
import { ViewMode } from './types';

export const openModal = writable<boolean>(false);

// Store for the FileURL
export const fileURL = writable<string>();
// Store for the current viewMode, should affect viewport.
export const viewMode = writable<ViewMode>(ViewMode.RAW_STL);
// Loading
export const loadingMessages = writable<Array<String>>(new Array<String>());
// Parameters
export const layerHeight = writable<number>(0.2); // mm
export const simSpeed = writable<number>(1); // ticks per second
export const temperature = writable<number>(150); // °C
// Features
export const orbit = writable<boolean>(true);
export const showVertexNormals = writable<boolean>(false);
export const showSurfaceNormals = writable<boolean>(false);
export const showSurfaceUVs = writable<boolean>(false);
export const smoothGeometry = writable<boolean>(false);
export const meltyParticles = writable<boolean>(false);
export const shakyBed = writable<boolean>(false);
export const wetFilament = writable<boolean>(false);
export const thermalTransfer = writable<boolean>(false);
