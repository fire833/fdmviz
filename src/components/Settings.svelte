<script lang="ts">
  import { ViewMode } from '../types';
  import {
    fileURL,
    viewMode,
    simSpeed,
    layerHeight,
    temperature,
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

  <fieldset>
    <legend>Upload Model</legend>
    <input type="file" bind:files accept=".stl" />
  </fieldset>

  <fieldset>
    <legend>View Mode</legend>

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
  </fieldset>

  <fieldset class="grid">
    <legend>Parameters</legend>

    <div class="align">
      Sim Speed:
      <div style="width: 3ch">{$simSpeed}</div>
    </div>
    <input type="range" bind:value={$simSpeed} />
    <div class="align">
      Layer Height:
      <div style="width: 3ch">{$layerHeight}</div>
    </div>
    <input type="range" bind:value={$layerHeight} />
    <div class="align">
      Temperature:
      <div style="width: 3ch">{$temperature}</div>
    </div>
    <input type="range" bind:value={$temperature} />
  </fieldset>

  <fieldset>
    <legend>Features</legend>

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
  </fieldset>
</div>

<style>
  .container {
    position: absolute;
    padding: 1rem;
    margin-top: 4rem;

    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: #44444b;

    gap: 1rem;
  }

  .align {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-content: center;
  }

  fieldset {
    padding: 0.5rem 1rem 1rem 1rem;
    gap: 0.5rem;
    display: flex;
    flex-direction: column;

    border-color: #fff;
    border-style: solid;
    border-width: 1.5px;
  }

  .left {
    display: flex;
    justify-content: start;
    gap: 0.5rem;
    grid-column: span 2;
  }

  legend {
    padding: 0 0.5rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 2fr 3fr;
  }
</style>
