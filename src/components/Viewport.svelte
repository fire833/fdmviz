<script lang="ts">
  import { onMount } from 'svelte';
  import Visualizer from '../visualizer/Visualizer';

  let container: HTMLElement;
  let sim = new Visualizer();

  onMount(() => {
    container.appendChild(sim.getHTMLElement());
  });
</script>

<div bind:this={container}></div>
