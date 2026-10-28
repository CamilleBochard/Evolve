// Browser storage only keeps per-visitor conveniences (a chosen view, a
// tutorial already seen): the pages work the same without it. A private
// window or blocked site data makes the storage throw; the choice is then
// simply not remembered.

export function readStored(key: string): string | null {
  let value: string | null;
  try {
    value = window.localStorage.getItem(key);
  } catch {
    value = null;
  }
  return value;
}

export function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage refused: nothing to do.
  }
}
