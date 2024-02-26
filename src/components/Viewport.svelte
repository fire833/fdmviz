<script lang="ts">
  import { onMount } from 'svelte';
  import Simulator from '../graphics/simulator';

  let container: HTMLElement;
  let sim = new Simulator();

  function animate() {
    sim.render();
    requestAnimationFrame(animate); // TODO: use setAnimationLoop to not use this recursively
  }

  onMount(() => {
    container.appendChild(sim.getHTMLElement());
    animate();
  });
</script>

<div bind:this={container}></div>
