<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { simSpeed, visualizer } from '../stores';
  import { get } from 'svelte/store';
  import CircleProgressBar from './CircleProgressBar.svelte';

  let button: HTMLButtonElement;

  let TPS: number = get(simSpeed); // simSpeed
  const TIME_STEP_SIZE = 50;

  simSpeed.subscribe((value) => {
    TPS = value;
  });

  // Function to update the progress
  let progress = 0.5;
  function updateProgress() {
    progress = progress + TPS / TIME_STEP_SIZE;
    if (progress >= 1) button.click();
  }

  function handleClick() {
    $visualizer.updatePhysics();
    progress = 0;
  }

  let intervalID: number;
  onMount(
    () => (intervalID = setInterval(updateProgress, 1000 / TIME_STEP_SIZE)),
  );
  onDestroy(() => clearInterval(intervalID));
</script>

<div class="ui">
  <button bind:this={button} on:click={() => handleClick()}>
    Step Simulation
    {#key progress}
      <CircleProgressBar {progress}></CircleProgressBar>
    {/key}
  </button>
</div>

<style>
  .ui {
    position: absolute;

    bottom: 0;
    left: 50vw;
    transform: translate(-50%, 0);

    display: flex;
    border-radius: 6px 6px 0 0;

    gap: 1rem;
  }

  button {
    align-items: center;
    gap: 8px;
    display: flex;
    flex-direction: row;
  }
</style>
