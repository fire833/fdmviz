<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ViewMode } from '../types';
  import {
    viewMode,
    simSpeed,
    layerHeight,
    temperature,
    showVertexNormals,
    meltyParticles,
    shakyBed,
    wetFilament,
    thermalTransfer,
    showSurfaceNormals,
    orbit,
    smoothGeometry,
    showSurfaceUVs,
  } from '../stores';

  const dispatchModalEvent = createEventDispatcher();

  const viewModes = [
    { label: 'Raw 3D File', id: 'raw', value: ViewMode.RAW_STL },
    { label: 'Fragment Shader', id: 'shader', value: ViewMode.SHADER },
    {
      label: 'Fluid Simulation',
      id: 'particle',
      value: ViewMode.SIMULATION,
    },
    {
      label: 'Texture Map',
      id: 'normal',
      value: ViewMode.TEXTURE,
    },
  ];
</script>

<div class="ui">
  <h1>Settings</h1>
  <button on:click={() => dispatchModalEvent('openModal', {})}>
    Choose Model
  </button>

  <div class="section">
    <h2>Visualizer Mode</h2>

    {#each viewModes as mode}
      <div class="left">
        <input
          type="radio"
          id={mode.id}
          name="viewMode"
          value={mode.value}
          bind:group={$viewMode}
        />
        <label for={mode.id}>{mode.label}</label>
      </div>
    {/each}
  </div>

  <div class="section">
    <h2>Parameters</h2>

    <div class="grid">
      <div class="align">Layer Height (mm)</div>
      <input
        type="number"
        bind:value={$layerHeight}
        min="0.05"
        max="2"
        step="0.05"
      />
      <div class="align">Sim Speed (TPS)</div>
      <input
        type="number"
        bind:value={$simSpeed}
        min="0.25"
        max="4.0"
        step="0.25"
      />
      <div class="align">Temperature (°C)</div>
      <input
        type="number"
        bind:value={$temperature}
        min="100"
        max="400"
        step="10"
        disabled
      />
    </div>
  </div>

  <div class="section">
    <h2>Features</h2>

    <div class="left">
      <input type="checkbox" id="orbit" bind:checked={$orbit} />
      <label for="orbit">Orbit Camera</label>
    </div>
    <div class="left">
      <input
        type="checkbox"
        id="vertexNormals"
        bind:checked={$showVertexNormals}
      />
      <label for="vertexNormals">Show Vertex Normals</label>
    </div>
    <div class="left">
      <input
        type="checkbox"
        id="surfaceNormals"
        bind:checked={$showSurfaceNormals}
      />
      <label for="surfaceNormals">Show Surface Normals</label>
    </div>
    <div class="left">
      <input type="checkbox" id="surfaceUVs" bind:checked={$showSurfaceUVs} />
      <label for="surfaceUVs">Show Surface UVs</label>
    </div>
    <div class="left">
      <input
        type="checkbox"
        id="smoothGeometry"
        bind:checked={$smoothGeometry}
      />
      <label for="smoothGeometry">Smooth Geometry</label>
    </div>
    <div class="left">
      <input
        type="checkbox"
        id="melty"
        bind:checked={$meltyParticles}
        disabled
      />
      <label for="melty">Melty Particles</label>
    </div>
    <div class="left">
      <input type="checkbox" id="shaky" bind:checked={$shakyBed} disabled />
      <label for="shaky">Shaky Bed</label>
    </div>
    <div class="left">
      <input type="checkbox" id="wet" bind:checked={$wetFilament} disabled />
      <label for="wet">Wet Filament</label>
    </div>
    <div class="left">
      <input
        type="checkbox"
        id="transfer"
        bind:checked={$thermalTransfer}
        disabled
      />
      <label for="transfer">Thermal Transfer</label>
    </div>
  </div>
</div>

<style>
  .ui {
    margin: auto 0;

    display: flex;
    flex-direction: column;
    border-radius: 0 6px 6px 0;

    gap: 1rem;
    overflow: scroll;
    max-height: 80vh;
  }

  .align {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
  }

  .section {
    padding: 0.5rem 1rem 1rem 1rem;
    gap: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  .left {
    display: flex;
    justify-content: start;
    gap: 0.5rem;
    grid-column: span 2;
  }

  .grid {
    display: grid;
    grid-template-columns: 2fr 7ch;
    gap: 0.2rem 1rem;
  }
</style>
