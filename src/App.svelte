<script lang="ts">
  import UserInterface from './components/UserInterface.svelte';
  import Viewport from './components/Viewport.svelte';
</script>

<main>
  <div class="bg">
    <Viewport></Viewport>
  </div>
  <div class="fg">
    <UserInterface></UserInterface>
  </div>
</main>

<style>
  .bg {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    text-align: center;
  }

  .fg {
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    text-align: center;
    pointer-events: none;
  }
</style>
