<div class="parent">
  UI
  <button
    on:click={() => {
      alert('Changing mode ;)');
    }}
  >
    Change Mode
  </button>
</div>

<style>
  .parent > * {
    pointer-events: auto;
  }
</style>
