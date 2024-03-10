<script lang="ts">
  import { fileURL, openModal } from '../stores';

  enum Mode {
    Preset,
    Upload,
    URL,
  }
  let mode: Mode = Mode.Preset;

  let presets: Map<string, string> = new Map([
    ['Utah Teapot', 'utah_teapot.stl'], // Default, local
    [
      '3DBenchy',
      'https://raw.githubusercontent.com/CreativeTools/3DBenchy/master/Single-part/3DBenchy.stl',
    ],
    [
      'Moon City (Kijai)',
      'https://files.printables.com/media/prints/218224/stls/1989695_3025bf16-6dda-4a73-8825-f4f98dd4728f/moon-city-2.stl',
    ],
    [
      'Heavy Metal Groot (Max666)',
      'https://files.printables.com/media/prints/16627/stls/158987_fd548c76-c58f-4a26-9f5b-d6639e6cbad2/heavy_metal_groot_01.stl',
    ],
  ]);

  let textInput: string;

  function updateModel(url: string) {
    fileURL.set(url); // Set the URL
    dialog.close(); // Close modal
  }

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
</script>

<dialog bind:this={dialog}>
  <div class="ui">
    <h1>Select Your STL Model</h1>
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
    {#if mode == Mode.Preset}
      <div class="section">
        <p>Pick a preset 3D Model</p>
        <div class="list">
          {#each [...presets] as [name, url]}
            <button class="list-item" on:click={() => updateModel(url)}>
              {name}
            </button>
          {/each}
        </div>
      </div>
    {:else if mode == Mode.Upload}
      <div class="section">
        <p>Upload an STL model</p>
        <input type="file" bind:files={fileUploads} accept=".stl" />
      </div>
    {:else}
      <div class="section">
        <p>Enter a URL to an STL file</p>
        <form on:submit|preventDefault={() => updateModel(textInput)}>
          <input type="text" placeholder="https://" bind:value={textInput} />
        </form>
      </div>
    {/if}
  </div>
</dialog>

<style>
  dialog::backdrop {
    /* A bit darker and blurred */
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }

  dialog {
    border: none;
    background: none;
    color: inherit;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .ui {
    margin: auto;
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
</style>
