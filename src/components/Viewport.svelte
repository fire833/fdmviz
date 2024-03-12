<script lang="ts">
  import { onMount } from 'svelte';
  import Simulator from '../graphics/simulator';
  import {
    fileURL,
    showVertexNormals,
    showSurfaceNormals,
    viewMode,
    layerHeight,
  } from '../stores';

  let container: HTMLElement;
  let sim = new Simulator();

  fileURL.subscribe((value) => {
    sim.uploadMesh(value);
  });

  showVertexNormals.subscribe((value) => {
    sim.setVertexNormals(value);
  });

  viewMode.subscribe(() => sim.updateMeshMaterial());
  showSurfaceNormals.subscribe(() => sim.updateMeshMaterial());
  layerHeight.subscribe(() => sim.updateMeshMaterial());

  onMount(() => {
    container.appendChild(sim.getHTMLElement());
  });
</script>

<div bind:this={container}></div>
