import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

import { useMediaQuery } from './useMediaQuery';

export const SMALL_SCREEN_QUERY = '(max-width: 720px)';

// One branch with its satellites on both sides (388 units), plus room for
// the edge fades and the scrollbar.
const BRANCH_WIDTH = 432;

// Ratio between tree units and screen pixels: 1 on desktop; on small
// screens, the tree shrinks until a whole branch fits the frame.
export function useTreeScale(frameRef: RefObject<HTMLElement | null>): number {
  const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale(): void {
      const frame = frameRef.current;
      let nextScale = 1;
      if (isSmallScreen && frame !== null) {
        nextScale = Math.min(1, frame.clientWidth / BRANCH_WIDTH);
      }
      setScale(nextScale);
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [frameRef, isSmallScreen]);

  return scale;
}
