<script lang="ts">
  let fileList: FileList;
</script>

<div class="container">
  <input type="file" bind:files={fileList} />
</div>

<style>
  .container {
    position: absolute;
    right: 0;
    width: 25%;
    padding: 1rem;
    margin-top: 4rem;

    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: #44444b;

    gap: 2rem;
  }
</style>
