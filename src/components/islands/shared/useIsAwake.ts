import { useSyncExternalStore } from 'react';

function subscribe(): () => void {
  // Nothing changes once the island is awake.
  function unsubscribe(): void {}
  return unsubscribe;
}

function readClient(): boolean {
  return true;
}

function readServer(): boolean {
  return false;
}

// False on the server and during hydration, true once the island runs in
// the browser: what needs JavaScript to work shows only then.
export function useIsAwake(): boolean {
  const isAwake = useSyncExternalStore(subscribe, readClient, readServer);
  return isAwake;
}
