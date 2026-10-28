import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { TOUR_STEPS } from '../../../data/journal-tour';
import type { TourStep } from '../../../data/journal-tour';
import { readStored, writeStored } from '../../../lib/browser-storage';
import { TourDialog } from './TourDialog';
import { findTourTarget, isOnScreen } from './tour-targets';
import { useIsAwake } from '../shared/useIsAwake';

const TOUR_SEEN_KEY = 'journal-tour-seen';

// Steps whose area is missing right now (a quest without rewards, the
// simple view) are skipped.
function availableSteps(): TourStep[] {
  const steps = TOUR_STEPS.filter((step) => {
    if (step.target === null) {
      return true;
    }
    const area = findTourTarget(step.target);
    const isAvailable = area !== null && isOnScreen(area);
    return isAvailable;
  });
  return steps;
}

// Help button of the journal top bar and the tutorial it opens. On a first
// visit the tutorial opens by itself, like the first time on a game's
// inventory screen. The button stays hidden until the island wakes up:
// before that, it would do nothing.
export default function JournalTour() {
  const isAwake = useIsAwake();
  // Steps of the open tutorial; empty when it is closed.
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [index, setIndex] = useState(0);
  // Focus goes back there when the tutorial closes.
  const openerRef = useRef<HTMLElement | null>(null);

  const openTour = useCallback(() => {
    const active = document.activeElement;
    openerRef.current = null;
    if (active instanceof HTMLElement) {
      openerRef.current = active;
    }
    setSteps(availableSteps());
    setIndex(0);
    writeStored(TOUR_SEEN_KEY, 'yes');
  }, []);

  const closeTour = useCallback(() => {
    setSteps([]);
    openerRef.current?.focus();
  }, []);

  const showNextStep = useCallback(() => {
    const nextIndex = index + 1;
    if (nextIndex >= steps.length) {
      closeTour();
      return;
    }
    setIndex(nextIndex);
  }, [index, steps.length, closeTour]);

  const showPreviousStep = useCallback(() => {
    if (index === 0) {
      return;
    }
    setIndex(index - 1);
  }, [index]);

  // First visit: the tutorial opens by itself, on the next frame, once the
  // page is laid out and its areas can be measured.
  useEffect(() => {
    const isSeen = readStored(TOUR_SEEN_KEY) === 'yes';
    if (isSeen) {
      return;
    }
    const frame = window.requestAnimationFrame(openTour);
    return () => window.cancelAnimationFrame(frame);
  }, [openTour]);

  let dialog = null;
  if (steps.length > 0) {
    dialog = createPortal(
      <TourDialog
        step={steps[index]}
        index={index}
        count={steps.length}
        onNext={showNextStep}
        onPrevious={showPreviousStep}
        onClose={closeTour}
      />,
      document.body,
    );
  }

  return (
    <>
      <button
        type="button"
        data-tour="help"
        hidden={!isAwake}
        onClick={openTour}
      >
        <span className="key-hint" aria-hidden="true">
          [?]
        </span>
        Aide
      </button>
      {dialog}
    </>
  );
}
