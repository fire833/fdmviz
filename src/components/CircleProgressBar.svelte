<script>
  export let progress;
  const angle = 360 * progress;

  // Adapt the logic according to the approach
  const background = `conic-gradient(transparent 0deg ${angle}deg, white ${angle}deg 360deg)`;

  $: cssVarStyles = `--background:${background}`;
</script>

<div id="progress-circle" style={cssVarStyles}></div>

<style>
  #progress-circle {
    background: var(--background);
    border-radius: 50%;
    width: 1em;
    height: 1em;
    transition: all 500ms ease-in;
    will-change: transform;
  }
</style>
