<script lang="ts">
  import { onMount } from 'svelte';
  import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
  import Renderer from '../graphics/renderer';

  let viewport: HTMLElement;
  let renderer = new Renderer();

  function animate() {
    requestAnimationFrame(animate);
    renderer.render();
  }

  onMount(() => {
    viewport.appendChild(renderer.get_dom_element());
    animate();
  });
</script>

<div bind:this={viewport}></div>
