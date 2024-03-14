<script lang="ts">
  import { onMount } from 'svelte';
  import Simulator from '../graphics/simulator';
  import {
    fileURL,
    showVertexNormals,
    showSurfaceNormals,
    viewMode,
    layerHeight,
    orbit,
  } from '../stores';

  let container: HTMLElement;
  let sim = new Simulator();

  fileURL.subscribe((value: string) => {
    sim.uploadMesh(value);
  });

  orbit.subscribe((value: boolean) => {
    sim.setOrbitCamera(value);
  });

  showVertexNormals.subscribe((value: boolean) => {
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
