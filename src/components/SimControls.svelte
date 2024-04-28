<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { simSpeed, visualizer } from '../stores';
  import { get } from 'svelte/store';
  import CircleProgressBar from './CircleProgressBar.svelte';
  import ResetIcon from '../assets/ResetIcon.svg.svelte';

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
  <h1>Controls</h1>
  <button bind:this={button} on:click={() => handleClick()}>
    {#key progress}
      <CircleProgressBar {progress} />
    {/key}
    <div class="center">Step</div>
  </button>
  <!-- 
  <button on:click={() => $visualizer.resetPhysics()}>
    <ResetIcon />
    <div class="center">Reset</div>
  </button> -->
</div>

<style>
  .ui {
    position: absolute;

    right: 0;
    top: 50vh;
    transform: translate(0, -50%);

    display: flex;
    flex-direction: column;
    border-radius: 6px 0 0 6px;

    gap: 1rem;
  }

  button {
    align-items: center;
    gap: 8px;
    display: flex;
    flex-direction: row;
    justify-content: left;
  }

  .center {
    display: flex;
    text-align: center;
  }
</style>
