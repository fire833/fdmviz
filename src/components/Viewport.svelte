<script lang="ts">
  import { onMount } from 'svelte';
  import Visualizer from '../visualizer/Visualizer';

  let container: HTMLElement;
  let sim = new Visualizer();

  onMount(() => {
    container.appendChild(sim.getHTMLElement());

    // Disable HMR for this component
    // So that the whole page is reloaded if the Visualizer is changed
    if (import.meta.hot) {
      import.meta.hot.accept(() => {
        // Trigger a full reload of the page
        window.location.reload();
      });
    }
  
  });
</script>

<div bind:this={container}></div>

<style>
  div {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
</style>