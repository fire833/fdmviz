<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Visualizer from '../visualizer/Visualizer';

  let container: HTMLElement;
  let sim = new Visualizer();

  onMount(() => {
    container.appendChild(sim.getHTMLElement());
    if (import.meta.hot) {
      import.meta.hot.accept(() => {
        // Trigger a full reload of the page
        window.location.reload();
      });
    }
  });
</script>

<div bind:this={container}></div>
