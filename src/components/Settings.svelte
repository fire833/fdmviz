<script lang="ts">
  let fileList: FileList;
</script>

<div class="container">
  <h1>Settings</h1>

  <fieldset>
    <legend>Upload Model</legend>
    <input type="file" bind:files={fileList} />
  </fieldset>

  <fieldset>
    <legend>View Mode</legend>

    <div class="left">
      <input type="radio" id="huey" name="drone" value="huey" checked />
      <label for="huey">Raw 3D File</label>
    </div>

    <div class="left">
      <input type="radio" id="dewey" name="drone" value="dewey" />
      <label for="dewey">Particle Simulation</label>
    </div>

    <div class="left">
      <input type="radio" id="louie" name="drone" value="louie" />
      <label for="louie">Normal Map</label>
    </div>
  </fieldset>

  <fieldset class="grid">
    <legend>Parameters</legend>

    <div class="align">Sim Speed</div>
    <input type="range" />
    <div class="align">Layer Height</div>
    <input type="range" />
    <div class="align">Temperature</div>
    <input type="range" />
  </fieldset>

  <fieldset>
    <legend>Features</legend>

    <div class="left">
      <input type="checkbox" id="melty" />
      <label for="melty">Melty Particles</label>
    </div>
    <div class="left">
      <input type="checkbox" id="shaky" />
      <label for="shaky">Shaky Bed</label>
    </div>
    <div class="left">
      <input type="checkbox" id="wet" />
      <label for="wet">Wet Filament</label>
    </div>
    <div class="left">
      <input type="checkbox" id="transfer" />
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
