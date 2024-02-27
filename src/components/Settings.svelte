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

  <fieldset>
    <legend>Features</legend>

    <div class="align">
      Speed
      <input type="range" />
    </div>
    <div class="left">
      <input type="checkbox" id="melty" />
      <label for="melty">Melty Particles</label>
    </div>
    <div class="left">
      <input type="checkbox" id="shaky" />
      <label for="shaky">Shaky Bed</label>
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
    justify-content: center;
    align-content: center;
    gap: 1rem;
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
  }

  legend {
    padding: 0 0.5rem;
  }
</style>
