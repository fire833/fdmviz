<div class="container">
  <h1>Settings</h1>
  <div>
    <button
      on:click={() => {
        alert('Changing mode ;)');
      }}
    >
      Mode A
    </button>
    <button
      on:click={() => {
        alert('Changing mode ;)');
      }}
    >
      Mode B
    </button>
    <button
      on:click={() => {
        alert('Changing mode ;)');
      }}
    >
      Mode C
    </button>
  </div>
  <div class="align">
    Speed
    <input type="range" />
  </div>
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
</style>
