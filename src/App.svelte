<script lang="ts">
  import Counter from './lib/Counter.svelte';
  import UserInterface from './lib/UserInterface.svelte';
  import Viewport from './lib/Viewport.svelte';
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
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    text-align: center;
  }
</style>
