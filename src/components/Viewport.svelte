<script lang="ts">
  import { onMount } from 'svelte';
  import Simulator from '../graphics/Simulator';
  import {
    fileURL,
    showVertexNormals,
    showSurfaceNormals,
    viewMode,
    layerHeight,
    orbit,
  } from '../stores';
  import { get } from 'svelte/store';

  let container: HTMLElement;
  let sim = new Simulator();

  fileURL.subscribe((value: string) => {
    sim.uploadMesh(value);
    sim.resetPhysics();
  });

  orbit.subscribe((value: boolean) => {
    sim.setOrbitCamera(value);
  });

  showVertexNormals.subscribe((value: boolean) => {
    sim.setVertexNormals(value);
  });

  viewMode.subscribe((value) => {
    sim.uploadMesh(get(fileURL));
    sim.updateMeshMaterial();
    sim.resetPhysics();
  });

  showSurfaceNormals.subscribe(() => sim.updateMeshMaterial());
  layerHeight.subscribe(() => sim.updateMeshMaterial());

  onMount(() => {
    container.appendChild(sim.getHTMLElement());
  });
</script>

<div bind:this={container}></div>
