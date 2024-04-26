<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import PickModel from './PickModel.svelte';
  import Settings from './Settings.svelte';
  import GitHub from './GitHub.svelte';
  import Loading from './Loading.svelte';
  import SimControls from './SimControls.svelte';
  import { viewMode } from '../stores';
  import { ViewMode } from '../types';

  let modal: SvelteComponent;
</script>

<PickModel bind:this={modal}></PickModel>
<Settings on:openModal={modal.showModal()}></Settings>
<GitHub></GitHub>
<Loading></Loading>
<SimControls></SimControls>
{#if $viewMode == ViewMode.SIMULATION}
  <SimControls></SimControls>
{/if}
