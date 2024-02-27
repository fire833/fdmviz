import { writable } from 'svelte/store';
import { ViewMode } from './types';

export const file = writable<File>();
export const viewMode = writable<ViewMode>(ViewMode.RAW_STL);
// Parameters
export const simSpeed = writable<Number>(1);
export const layerHeight = writable<Number>(1);
export const temperature = writable<Number>(1);
// Features
export const meltyParticles = writable<Boolean>(false);
export const shakyBed = writable<Boolean>(false);
export const wetFilament = writable<Boolean>(false);
export const thermalTransfer = writable<Boolean>(false);