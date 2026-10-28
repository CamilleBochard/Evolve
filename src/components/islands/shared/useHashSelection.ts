import { useEffect } from 'react';

// Selects the item named by the address, such as /journal#magento, now and
// each time the address changes. Ids the page does not know are ignored.
// Both arguments must keep the same identity between renders.
export function useHashSelection<Id extends string>(
  isKnownId: (value: string) => value is Id,
  select: (id: Id) => void,
): void {
  useEffect(() => {
    function selectFromHash(): void {
      const hashId = window.location.hash.slice(1);
      if (isKnownId(hashId)) {
        select(hashId);
      }
    }
    selectFromHash();
    window.addEventListener('hashchange', selectFromHash);
    return () => window.removeEventListener('hashchange', selectFromHash);
  }, [isKnownId, select]);
}
