<script lang="ts">
  import { onMount } from 'svelte';
  import Simulator from '../graphics/simulator';
  import { fileURL, showVertexNormals } from '../stores';

  let container: HTMLElement;
  let sim = new Simulator();

  // If the fileURL updates, update the sim's mesh
  fileURL.subscribe((value) => {
    sim.uploadMesh(value);
  });

  showVertexNormals.subscribe((value) => {
    sim.setVertexNormals(value);
  });

  onMount(() => {
    container.appendChild(sim.getHTMLElement());
  });
</script>

<div bind:this={container}></div>
