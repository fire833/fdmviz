<script lang="ts">
  import { onMount } from 'svelte';
  import Simulator from '../graphics/simulator';
  import {
    fileURL,
    showVertexNormals,
    showSurfaceNormals,
    viewMode,
  } from '../stores';
  import { ViewMode } from '../types';

  let container: HTMLElement;
  let sim = new Simulator();

  // If the fileURL updates, update the sim's mesh
  fileURL.subscribe((value) => {
    sim.uploadMesh(value);
  });

  showVertexNormals.subscribe((value) => {
    sim.setVertexNormals(value);
  });

  showSurfaceNormals.subscribe((value) => {
    if (value) {
      sim.setMeshMaterial(false, true, false);
    } else {
      sim.setMeshMaterial(
        $viewMode == ViewMode.RAW_STL,
        false,
        $viewMode == ViewMode.FRAG_SHADER,
      );
    }
  });

  viewMode.subscribe((value) => {
    if ($showSurfaceNormals) {
      sim.setMeshMaterial(false, true, false);
    } else if (value == ViewMode.RAW_STL) {
      sim.setMeshMaterial(true, false, false);
    } else if (value == ViewMode.FRAG_SHADER) {
      sim.setMeshMaterial(false, false, true);
    }
  });

  onMount(() => {
    container.appendChild(sim.getHTMLElement());
  });
</script>

<div bind:this={container}></div>
