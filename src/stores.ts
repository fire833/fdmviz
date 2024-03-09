import { writable } from 'svelte/store';
import { ViewMode } from './types';

export const fileURL = writable<string>();
export const viewMode = writable<ViewMode>(ViewMode.RAW_STL);
// Parameters
export const simSpeed = writable<Number>(1);
export const layerHeight = writable<Number>(0.2);
export const temperature = writable<Number>(150);
// Features
export const showVertexNormals = writable<boolean>(false);
export const showSurfaceNormals = writable<boolean>(false);
export const meltyParticles = writable<boolean>(false);
export const shakyBed = writable<boolean>(false);
export const wetFilament = writable<boolean>(false);
export const thermalTransfer = writable<boolean>(false);
