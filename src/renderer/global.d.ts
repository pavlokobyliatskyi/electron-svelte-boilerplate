import type { ApiHandler } from '../main/preload';

declare module '*.svelte' {
  export { SvelteComponent as default } from 'svelte';
}

declare global {
  interface Window {
    api: ApiHandler;
  }
}
