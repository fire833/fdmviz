<script lang="ts">
  import { ViewMode } from '../types';
  import {
    fileURL,
    viewMode,
    simSpeed,
    layerHeight,
    temperature,
    showVertexNormals,
    meltyParticles,
    shakyBed,
    wetFilament,
    thermalTransfer,
  } from '../stores';

  let files: FileList;

  // Pull out first file in files and set the fileURL to it
  $: if (files) {
    let file: File | null;
    file = files.item(0);
    if (file != null) {
      fileURL.set(URL.createObjectURL(file));
    }
  }
</script>

<div class="container">
  <h1>Settings</h1>

  <div class="section">
    <h2>Upload Model</h2>
    <input type="file" bind:files accept=".stl" />
  </div>

  <div class="section">
    <h2>View Mode</h2>

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
        id="particle"
        name="viewMode"
        value={ViewMode.PARTICLE_SIM}
        bind:group={$viewMode}
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
      />
      <div class="align">Layer Height (mm)</div>
      <input
        type="number"
        bind:value={$layerHeight}
        min="0.05"
        max="1"
        step="0.05"
      />
      <div class="align">Temperature (°C)</div>
      <input
        type="number"
        bind:value={$temperature}
        min="100"
        max="400"
        step="10"
      />
    </div>
  </div>

  <div class="section">
    <h2>Features</h2>

    <div class="left">
      <input type="checkbox" id="melty" bind:checked={$showVertexNormals} />
      <label for="melty">Show Vertex Normals</label>
    </div>
    <div class="left">
      <input type="checkbox" id="melty" bind:checked={$meltyParticles} />
      <label for="melty">Melty Particles</label>
    </div>
    <div class="left">
      <input type="checkbox" id="shaky" bind:checked={$shakyBed} />
      <label for="shaky">Shaky Bed</label>
    </div>
    <div class="left">
      <input type="checkbox" id="wet" bind:checked={$wetFilament} />
      <label for="wet">Wet Filament</label>
    </div>
    <div class="left">
      <input type="checkbox" id="transfer" bind:checked={$thermalTransfer} />
      <label for="transfer">Thermal Transfer</label>
    </div>
  </div>
</div>

<style>
  .container {
    padding: 1rem;
    margin: auto 0;

    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: var(--ui-color);
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

    border-color: var(--color-blue-pale);
    border-style: solid;
    border-width: 1.5px;
    border-radius: 4px;
  }

  .left {
    display: flex;
    justify-content: start;
    gap: 0.5rem;
    grid-column: span 2;
  }

  h1 {
    font-size: 1.2em;
    color: var(--color-blue-pale);
  }
  h2 {
    font-weight: 500;
    margin-bottom: 0.2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 2fr 7ch;
    gap: 0.2rem 1rem;
  }
</style>
