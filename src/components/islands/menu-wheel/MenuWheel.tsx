import { useEffect, useRef, useState } from 'react';

import { MENU_ENTRIES } from '../../../data/menu';
import type { MenuVersion } from '../../../data/menu';
import { useIsAwake } from '../shared/useIsAwake';
import styles from './MenuWheel.module.css';
import { SelectionPanel } from './SelectionPanel';
import { WheelEntry } from './WheelEntry';
import { WheelOverlay } from './WheelOverlay';
import type { MenuWheelPrints } from './menu-prints';

// The wheel is the menu above this width; below, it is only a backdrop
// behind the list of pages. Same value as the CSS.
const WHEEL_QUERY = '(min-width: 721px)';

interface MenuWheelProps {
  version: MenuVersion;
  prints: MenuWheelPrints;
}

function isTypingOrModified(event: KeyboardEvent): boolean {
  const isTyping =
    event.target instanceof HTMLElement &&
    event.target.closest('input, textarea, select') !== null;
  const hasModifier = event.ctrlKey || event.metaKey || event.altKey;
  const isBlocked = isTyping || hasModifier || event.defaultPrevented;
  return isBlocked;
}

// The wheel of the pause menu: the printed wheel, a page on each
// medallion, and the panel describing the page it points at. Pointing or
// focusing an entry selects it; number keys and arrows turn the wheel,
// Enter opens the selected page.
// It is marked data-wheel-ready once it runs in the browser: until then,
// the page shows its plain list of links instead.
export default function MenuWheel({ version, prints }: MenuWheelProps) {
  const isAwake = useIsAwake();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const entryRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const entryCount = MENU_ENTRIES.length;

  useEffect(() => {
    function focusEntry(index: number): void {
      entryRefs.current[index]?.focus();
    }

    function handleKey(event: KeyboardEvent): void {
      const isWheelShown = window.matchMedia(WHEEL_QUERY).matches;
      if (!isWheelShown || isTypingOrModified(event)) {
        return;
      }
      const number = Number(event.key);
      const isEntryNumber =
        Number.isInteger(number) && number >= 1 && number <= entryCount;
      if (isEntryNumber) {
        focusEntry(number - 1);
        return;
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        focusEntry((selectedIndex + 1) % entryCount);
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        focusEntry((selectedIndex - 1 + entryCount) % entryCount);
        return;
      }
      // On a link, Enter already opens it.
      const isOnLink =
        event.target instanceof HTMLElement &&
        event.target.closest('a') !== null;
      if (event.key === 'Enter' && !isOnLink) {
        window.location.href = MENU_ENTRIES[selectedIndex].href;
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [selectedIndex, entryCount]);

  let readyFlag: string | undefined;
  if (isAwake) {
    readyFlag = '';
  }

  return (
    <>
      <div className={styles.wheel} data-wheel-ready={readyFlag}>
        <div className={styles.art} aria-hidden="true">
          <img
            className={styles.sun}
            src={prints.sun.src}
            width={prints.sun.width}
            height={prints.sun.height}
            alt=""
          />
          <img
            className={styles.body}
            src={prints.wheel.src}
            width={prints.wheel.width}
            height={prints.wheel.height}
            alt=""
          />
          <WheelOverlay
            version={version}
            selectedIndex={selectedIndex}
            isAwake={isAwake}
          />
        </div>
        <nav className={styles.entries} aria-label="Pages du site">
          {MENU_ENTRIES.map((entry, index) => (
            <WheelEntry
              key={entry.id}
              ref={(element) => {
                entryRefs.current[index] = element;
              }}
              entry={entry}
              index={index}
              miniature={prints.medallions[entry.figure]}
              isSelected={index === selectedIndex}
              isAwake={isAwake}
              onSelect={setSelectedIndex}
            />
          ))}
        </nav>
      </div>
      {isAwake && (
        <SelectionPanel
          entry={MENU_ENTRIES[selectedIndex]}
          index={selectedIndex}
          count={entryCount}
        />
      )}
    </>
  );
}
