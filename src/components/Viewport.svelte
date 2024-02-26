<script lang="ts">
  import { onMount } from 'svelte';
  import Simulator from '../graphics/simulator';

  let container: HTMLElement;
  let sim = new Simulator();

  onMount(() => {
    container.appendChild(sim.getHTMLElement());
    sim.setAnimationLoop();
  });
</script>

<div bind:this={container}></div>
