// Mulberry32: a small seeded random generator. The same seed always gives the
// same sequence, so prints and layouts are identical on every build.
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    const result = ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    return result;
  }
  return next;
}
