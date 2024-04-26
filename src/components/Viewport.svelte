<script lang="ts">
  import { onMount } from 'svelte';
  import { visualizer } from '../stores';

  let container: HTMLElement;

  onMount(() => {
    container.appendChild($visualizer.getHTMLElement());

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
