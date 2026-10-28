import { useSyncExternalStore } from 'react';

// Whether a media query matches, kept up to date. False on the server, where
// there is no screen: the first render matches the desktop layout.
export function useMediaQuery(query: string): boolean {
  function subscribe(onChange: () => void): () => void {
    const list = window.matchMedia(query);
    list.addEventListener('change', onChange);
    function unsubscribe(): void {
      list.removeEventListener('change', onChange);
    }
    return unsubscribe;
  }

  function readClient(): boolean {
    const matches = window.matchMedia(query).matches;
    return matches;
  }

  function readServer(): boolean {
    return false;
  }

  const matches = useSyncExternalStore(subscribe, readClient, readServer);
  return matches;
}
