<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { loadingMessages } from "../stores";

    let message: String | undefined = "hoho";
    let span: HTMLSpanElement;

    function toggleSpanVisibility() {
        if (!message) return; // Don't toggle when no text

        if (span.style.visibility == "visible") {
            span.style.visibility = "hidden";
        } else {
            span.style.visibility = "visible";
        }
    }

    // Subscribe local variable to store
    loadingMessages.subscribe((array: String[]) => {message = array.at(0)});

    // Create toggleSpan interval
    let intervalID: number;
    onMount(() => {
        intervalID = setInterval(toggleSpanVisibility, 500)
        }
    );
    onDestroy(() => clearInterval(intervalID)); // Clear on hot module reload

</script>

{#if message}
    <div>
        {message}..<span bind:this={span}>.</span>
    </div>
{/if}

<style>
    div {
      pointer-events: all;
  
      position: absolute;
      right: 0;
      bottom: 0;
  
      padding: 0.6rem;
  
      font-size: 1.1rem;
    }
  </style>