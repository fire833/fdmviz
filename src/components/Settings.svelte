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
  } from '../stores';

  const dispatchModalEvent = createEventDispatcher();
</script>

<div class="ui">
  <h1>Settings</h1>
  <button on:click={() => dispatchModalEvent('openModal', {})}>
    Choose Model
  </button>

  <div class="section">
    <h2>Visualizer Mode</h2>

    <div class="left">
      <input
        type="radio"
        id="raw"
        name="viewMode"
        value={ViewMode.RAW_STL}
        bind:group={$viewMode}
      />
      <label for="raw">Raw 3D File</label>
    </div>

    <div class="left">
      <input
        type="radio"
        id="normal"
        name="viewMode"
        value={ViewMode.FRAG_SHADER}
        bind:group={$viewMode}
      />
      <label for="normal">Fragment Shader</label>
    </div>

    <div class="left">
      <input
        type="radio"
        id="particle"
        name="viewMode"
        value={ViewMode.PARTICLE_SIM}
        bind:group={$viewMode}
        disabled
      />
      <label for="particle">Particle Simulation</label>
    </div>

    <div class="left">
      <input
        type="radio"
        id="normal"
        name="viewMode"
        value={ViewMode.NORMAL_MAP}
        bind:group={$viewMode}
        disabled
      />
      <label for="normal">Normal Map</label>
    </div>
  </div>

  <div class="section">
    <h2>Parameters</h2>

    <div class="grid">
      <div class="align">Sim Speed (TPS)</div>
      <input
        type="number"
        bind:value={$simSpeed}
        min="0.25"
        max="4.0"
        step="0.25"
        disabled
      />
      <div class="align">Layer Height (mm)</div>
      <input
        type="number"
        bind:value={$layerHeight}
        min="0.05"
        max="1"
        step="0.05"
        disabled
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
