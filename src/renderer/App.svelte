<script lang="ts">
  import { fade } from 'svelte/transition';

  let version: string | null = $state<string | null>(null);

  window.api.ipcRenderer.once<{ version: string }>('get-version', (args) => {
    version = args.version;
  });

  function getVersion(): void {
    window.api.ipcRenderer.sendMessage('get-version');
  }
</script>

<div class="container">
  {#if version}
    {#await import("./LazyComponent.svelte") then { default: LazyComponent }}
      <div transition:fade>
        <LazyComponent />
        <div class="text">{version}</div>
      </div>
    {/await}
  {/if}
  <button onclick={getVersion} disabled={version !== null}>GET VERSION</button>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    gap: 8px;
  }

  .text {
    text-align: center;
  }
</style>
