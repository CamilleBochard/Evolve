import { useEffect, useId, useRef } from 'react';
import type { CSSProperties } from 'react';

import type { TourStep } from '../../../data/journal-tour';
import styles from './TourDialog.module.css';
import { useTourPlacement } from './useTourPlacement';

interface TourDialogProps {
  step: TourStep;
  index: number;
  count: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

// Tab and Shift+Tab stay inside the card while the tutorial is open.
function keepFocusInside(event: KeyboardEvent, card: HTMLElement): void {
  const focusables = Array.from(
    card.querySelectorAll<HTMLElement>('button:not(:disabled)'),
  );
  if (focusables.length === 0) {
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;
  const isInside = active instanceof Node && card.contains(active);
  let destination: HTMLElement | null = null;
  if (!isInside) {
    destination = first;
  } else if (event.shiftKey && (active === first || active === card)) {
    destination = last;
  } else if (!event.shiftKey && active === last) {
    destination = first;
  }
  if (destination !== null) {
    event.preventDefault();
    destination.focus();
  }
}

function pipClassName(pipIndex: number, currentIndex: number): string {
  let className = styles.pip;
  if (pipIndex < currentIndex) {
    className = `${styles.pip} ${styles.pipDone}`;
  }
  if (pipIndex === currentIndex) {
    className = `${styles.pip} ${styles.pipCurrent}`;
  }
  return className;
}

// One step of the tutorial: a dark veil with a spot cut around the
// explained area, and the card that explains it. Rendered in the browser
// only, so its positions are set through the CSS object model, never an
// inline style attribute in the HTML.
export function TourDialog({
  step,
  index,
  count,
  onNext,
  onPrevious,
  onClose,
}: TourDialogProps) {
  const titleId = useId();
  const cardRef = useRef<HTMLElement>(null);
  const placement = useTourPlacement(step.target, cardRef);
  const isLast = index === count - 1;

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  // Listened in the capture phase, before the top bar: Escape closes the
  // tutorial instead of opening the menu.
  useEffect(() => {
    function handleKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrevious();
        return;
      }
      const card = cardRef.current;
      if (event.key === 'Tab' && card !== null) {
        keepFocusInside(event, card);
      }
    }
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, [onClose, onNext, onPrevious]);

  let spotClassName = `${styles.spot} ${styles.spotCenter}`;
  let spotStyle: CSSProperties | undefined;
  if (placement.spot !== null) {
    const { spot } = placement;
    spotClassName = styles.spot;
    spotStyle = {
      top: spot.top,
      left: spot.left,
      width: spot.right - spot.left,
      height: spot.bottom - spot.top,
    };
  }

  // Measured first, then shown at its place.
  let cardStyle: CSSProperties = { visibility: 'hidden' };
  if (placement.card !== null) {
    cardStyle = { top: placement.card.top, left: placement.card.left };
  }

  let nextLabel = 'Suivant';
  if (isLast) {
    nextLabel = 'Terminer';
  }

  const pips = Array.from({ length: count }, (_, pipIndex) => pipIndex);

  return (
    <div className={styles.tour}>
      <div className={spotClassName} style={spotStyle} aria-hidden="true" />
      <section
        ref={cardRef}
        className={styles.card}
        style={cardStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.bar}>
          <span className={styles.barLabel}>[Tutoriel]</span>
          <span>
            {index + 1} / {count}
          </span>
        </div>
        <div className={styles.body}>
          <h2 className={styles.title} id={titleId}>
            {step.title}
          </h2>
          <p className={styles.text}>{step.text}</p>
          <div className={styles.pips} aria-hidden="true">
            {pips.map((pipIndex) => (
              <i key={pipIndex} className={pipClassName(pipIndex, index)} />
            ))}
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.skip} onClick={onClose}>
              Passer le tutoriel
            </button>
            <span className={styles.moves}>
              <button
                type="button"
                className={styles.previous}
                aria-label="Étape précédente"
                disabled={index === 0}
                onClick={onPrevious}
              >
                ◂
              </button>
              <button type="button" className={styles.next} onClick={onNext}>
                <span className={styles.nextLabel}>{nextLabel}</span>
                <span className={styles.nextHatch} aria-hidden="true" />
              </button>
            </span>
          </div>
          <p className={styles.keys}>
            <kbd>←</kbd> <kbd>→</kbd> naviguer · <kbd>Échap</kbd> fermer
          </p>
        </div>
      </section>
    </div>
  );
}
