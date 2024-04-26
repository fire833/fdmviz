<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import PickModel from './PickModel.svelte';
  import Settings from './Settings.svelte';
  import GitHub from './GitHub.svelte';
  import Loading from './Loading.svelte';

  let modal: SvelteComponent;
</script>

<PickModel bind:this={modal}></PickModel>
<Settings on:openModal={modal.showModal()}></Settings>
<GitHub></GitHub>
<Loading></Loading>
