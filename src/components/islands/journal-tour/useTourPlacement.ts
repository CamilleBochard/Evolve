import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

import {
  cardPosition,
  centeredPosition,
  spotBox,
} from '../../../lib/journal/tour';
import type { Box, Point } from '../../../lib/journal/tour';
import { findTourTarget } from './tour-targets';

export interface TourPlacement {
  // Null for a step in the middle of the screen.
  spot: Box | null;
  // Null until the card is measured.
  card: Point | null;
}

// Where the spot and the card go for a step: the area is brought into view
// first (the page scrolls on small screens), then measured. Placed again
// when the window is resized.
export function useTourPlacement(
  target: string | null,
  cardRef: RefObject<HTMLElement | null>,
): TourPlacement {
  const [placement, setPlacement] = useState<TourPlacement>({
    spot: null,
    card: null,
  });

  useLayoutEffect(() => {
    function place(): void {
      const card = cardRef.current;
      if (card === null) {
        return;
      }
      const screen = { width: window.innerWidth, height: window.innerHeight };
      const cardSize = { width: card.offsetWidth, height: card.offsetHeight };
      let area: HTMLElement | null = null;
      if (target !== null) {
        area = findTourTarget(target);
      }
      if (area === null) {
        setPlacement({ spot: null, card: centeredPosition(cardSize, screen) });
        return;
      }
      const spot = spotBox(area.getBoundingClientRect(), screen);
      setPlacement({ spot, card: cardPosition(spot, cardSize, screen) });
    }

    if (target !== null) {
      findTourTarget(target)?.scrollIntoView({ block: 'center' });
    }
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [target, cardRef]);

  return placement;
}
