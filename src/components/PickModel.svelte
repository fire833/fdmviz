<script lang="ts">
  import { fileURL } from '../stores';

  enum Mode {
    Preset,
    Upload,
    URL,
  }
  let mode: Mode = Mode.Preset;

  let presets = [
    ['Utah Teapot', 'utah_teapot.stl'], // Default, local
    [
      '3DBenchy',
      'https://raw.githubusercontent.com/CreativeTools/3DBenchy/master/Single-part/3DBenchy.stl',
    ],
    [
      'Test Print (Gabbox3D)',
      'https://files.printables.com/media/prints/112181/stls/1101993_ab05a0a9-23ad-451c-84ea-c6c1bca52aee/all_in_one_3d_printer_test.stl',
    ],
    [
      'Heavy Metal Groot (Max666)',
      'https://files.printables.com/media/prints/16627/stls/158987_fd548c76-c58f-4a26-9f5b-d6639e6cbad2/heavy_metal_groot_01.stl',
    ],
  ];

  let textInput: string;

  function updateModel(url: string) {
    fileURL.set(url); // Set the URL
    dialog.close(); // Close modal
  }

  let fileButton: HTMLInputElement;
  let fileUploads: FileList;
  // Pull out first file in files and set the fileURL to it
  $: if (fileUploads) {
    let file: File | null;
    file = fileUploads.item(0);
    if (file != null) {
      updateModel(URL.createObjectURL(file));
    }
  }

  let dialog: HTMLDialogElement;

  export function showModal() {
    dialog.showModal();
  }

  export function hide() {
    dialog.close();
  }

  function handleDialogClick(event: Event) {
    if (event.target && event.target == dialog) hide();
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="dialog-parent"
  on:click={(event) => {
    handleDialogClick(event);
  }}
>
  <dialog bind:this={dialog}>
    <div class="ui">
      <h1>Choose an STL Model</h1>
      <div class="modes">
        <button
          on:click={() => {
            mode = Mode.Preset;
          }}>Preset</button
        >
        <button
          on:click={() => {
            mode = Mode.Upload;
          }}>Upload</button
        >
        <button
          on:click={() => {
            mode = Mode.URL;
          }}>URL</button
        >
      </div>
      <div class="section">
        {#if mode == Mode.Preset}
          <p>Pick a preset 3D Model</p>
          <div class="list">
            {#each presets as [name, url]}
              <button class="list-item" on:click={() => updateModel(url)}>
                {name}
              </button>
            {/each}
          </div>
        {:else if mode == Mode.Upload}
          <p>Upload an STL model</p>
          <button on:click={() => fileButton.click()}>Pick file</button>
          <input
            type="file"
            bind:this={fileButton}
            bind:files={fileUploads}
            accept=".stl"
          />
        {:else}
          <p>Enter a URL to an STL file</p>
          <form on:submit|preventDefault={() => updateModel(textInput)}>
            <input type="text" placeholder="https://" bind:value={textInput} />
          </form>
        {/if}
      </div>
    </div>
  </dialog>
</div>

<style>
  .dialog-parent {
    pointer-events: all;
    visibility: hidden;
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  dialog {
    border: none;
    background: none;
    color: inherit;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  dialog::backdrop {
    /* A bit darker and blurred */
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }

  .ui {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modes {
    display: grid;
    grid-template-columns: 10rem 10rem 10rem;
    gap: 0.75rem;
  }

  .section {
    display: block;
    align-content: center;
    justify-content: center;
    padding: 3rem;
    min-height: 16rem;
  }

  p {
    padding-bottom: 1rem;
  }

  .list {
    display: grid;
    align-content: center;
    justify-content: center;
    gap: 0.5rem;
  }

  input[type='file'] {
    display: none;
  }
</style>
