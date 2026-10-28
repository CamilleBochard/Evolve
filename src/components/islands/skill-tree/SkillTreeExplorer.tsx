import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SKILL_BRANCHES } from '../../../data/skill-tree';
import { treeEntries } from '../../../lib/skill-tree/entries';
import type { SkillEntry } from '../../../lib/skill-tree/entries';
import {
  TREE_COLUMN_SPACING,
  columnX,
  layoutTree,
} from '../../../lib/skill-tree/layout';
import { popupPosition } from '../../../lib/skill-tree/popup';
import type { Point } from '../../../lib/skill-tree/popup';
import { BranchBar } from './BranchBar';
import { SkillPopup } from './SkillPopup';
import styles from './SkillTreeExplorer.module.css';
import { TreeMinimap } from './TreeMinimap';
import type { Viewport } from './TreeMinimap';
import { TreeSvg } from './TreeSvg';
import { useMediaQuery } from './useMediaQuery';
import { useSmoothPan } from './useSmoothPan';
import { SMALL_SCREEN_QUERY, useTreeScale } from './useTreeScale';

// Room kept around a skill or the popup when they are brought into view.
const REVEAL_MARGIN = 90;
const POPUP_MARGIN = 24;
// Space above the first hub of a branch when jumping to it.
const BRANCH_JUMP_OFFSET = 90;

// The skill tree: drag to explore, branch shortcuts, overview map, and a
// popup for the selected skill. Rendered on the server too, so the whole
// tree is in the HTML before the island wakes up.
export default function SkillTreeExplorer() {
  const layout = useMemo(() => layoutTree(SKILL_BRANCHES), []);
  const entries = useMemo(() => treeEntries(layout), [layout]);

  const frameRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLElement>(null);
  const syncFrame = useRef(0);

  const pan = useSmoothPan(wrapRef);
  const scale = useTreeScale(frameRef);
  const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placement, setPlacement] = useState<Point | null>(null);
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  let selectedEntry: SkillEntry | undefined;
  if (selectedId !== null) {
    selectedEntry = entries.get(selectedId);
  }

  // ---------- Selection ----------

  const toggleSkill = useCallback((id: string) => {
    setPlacement(null);
    setSelectedId((current) => {
      let next: string | null = id;
      if (current === id) {
        next = null;
      }
      return next;
    });
  }, []);

  const closePopup = useCallback(() => {
    setSelectedId(null);
  }, []);

  // Tabbing through the skills brings each one into view.
  const revealSkill = useCallback(
    (id: string) => {
      const entry = entries.get(id);
      if (entry !== undefined) {
        pan.reveal(entry.x * scale, entry.y * scale, REVEAL_MARGIN);
      }
    },
    [entries, pan, scale],
  );

  // On desktop the popup sits next to its skill, once its size is known.
  useLayoutEffect(() => {
    const popup = popupRef.current;
    if (selectedEntry === undefined || isSmallScreen || popup === null) {
      return;
    }
    const size = {
      width: popup.offsetWidth / scale,
      height: popup.offsetHeight / scale,
    };
    const tree = { width: layout.width, height: layout.height };
    const position = popupPosition(selectedEntry, size, tree);
    const screenPosition = {
      left: position.left * scale,
      top: position.top * scale,
    };
    setPlacement(screenPosition);
    pan.revealRect(
      screenPosition.left,
      screenPosition.top,
      popup.offsetWidth,
      popup.offsetHeight,
      POPUP_MARGIN,
    );
  }, [selectedEntry, isSmallScreen, scale, layout, pan]);

  // Escape closes the popup before the page takes it as "open the menu":
  // the capture phase runs first, and the default is marked as handled.
  useEffect(() => {
    if (selectedId === null) {
      return undefined;
    }
    const openedId = selectedId;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Escape') {
        return;
      }
      event.preventDefault();
      setSelectedId(null);
      const skillElement = wrapRef.current?.querySelector<SVGGElement>(
        `[data-skill-id="${openedId}"]`,
      );
      skillElement?.focus({ preventScroll: true });
    }
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [selectedId]);

  // ---------- View: overview frame and current branch ----------

  const syncView = useCallback(() => {
    const wrap = wrapRef.current;
    if (wrap === null) {
      return;
    }
    const centerX = (wrap.scrollLeft + wrap.clientWidth / 2) / scale;
    let closestIndex = 0;
    let closestDistance = Infinity;
    SKILL_BRANCHES.forEach((branch, index) => {
      const distance = Math.abs(columnX(index) - centerX);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveIndex(closestIndex);
    setViewport({
      x: wrap.scrollLeft / scale,
      y: wrap.scrollTop / scale,
      width: wrap.clientWidth / scale,
      height: wrap.clientHeight / scale,
    });
  }, [scale]);

  // At most one view update per frame while scrolling.
  function onScroll(): void {
    if (syncFrame.current !== 0) {
      return;
    }
    syncFrame.current = requestAnimationFrame(() => {
      syncFrame.current = 0;
      syncView();
    });
  }

  useEffect(() => {
    syncView();
    window.addEventListener('resize', syncView);
    return () => window.removeEventListener('resize', syncView);
  }, [syncView]);

  // Small screens show one branch at a time: once the tree is scaled down,
  // the branch in view is centered, so its satellites are not cut.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!isSmallScreen || wrap === null) {
      return;
    }
    const centerX = (wrap.scrollLeft + wrap.clientWidth / 2) / scale;
    const branchIndex = SKILL_BRANCHES.findIndex(
      (branch, index) =>
        Math.abs(columnX(index) - centerX) < TREE_COLUMN_SPACING / 2,
    );
    const centeredIndex = Math.max(branchIndex, 0);
    const left = columnX(centeredIndex) * scale - wrap.clientWidth / 2;
    pan.scrollToPoint(left, wrap.scrollTop, false);
  }, [isSmallScreen, scale, pan]);

  function jumpToBranch(branchIndex: number): void {
    const wrap = wrapRef.current;
    const firstHub = layout.hubs.find(
      (placed) => placed.branchIndex === branchIndex,
    );
    if (wrap === null || firstHub === undefined) {
      return;
    }
    const left = firstHub.x * scale - wrap.clientWidth / 2;
    const top =
      (firstHub.y - firstHub.extents.top - BRANCH_JUMP_OFFSET) * scale;
    pan.scrollToPoint(left, top);
  }

  function navigateTo(x: number, y: number, animate: boolean): void {
    pan.centerOn(x * scale, y * scale, animate);
  }

  // ---------- Render ----------

  let desktopPopup = null;
  let mobilePopup = null;
  if (selectedEntry !== undefined) {
    const popup = (
      <SkillPopup
        ref={popupRef}
        entry={selectedEntry}
        isSheet={isSmallScreen}
        position={placement}
        onClose={closePopup}
      />
    );
    if (isSmallScreen) {
      mobilePopup = popup;
    } else {
      desktopPopup = popup;
    }
  }

  return (
    <div className={styles.explorer}>
      <BranchBar
        branches={SKILL_BRANCHES}
        activeIndex={activeIndex}
        onJump={jumpToBranch}
      />
      <div className={styles.frame} ref={frameRef}>
        <div
          className={styles.wrap}
          ref={wrapRef}
          // The scroll area itself takes focus, so the keyboard can scroll it.
          // eslint-disable-next-line jsx-a11y-x/no-noninteractive-tabindex
          tabIndex={0}
          role="region"
          aria-label="Arbre des compétences, zone défilante"
          onScroll={onScroll}
        >
          <div className={styles.canvas}>
            <TreeSvg
              layout={layout}
              scale={scale}
              selectedId={selectedId}
              onToggle={toggleSkill}
              onFocusSkill={revealSkill}
              onBackgroundClick={closePopup}
            />
            {desktopPopup}
          </div>
        </div>
        <div className={styles.fade} aria-hidden="true" />
        <TreeMinimap
          layout={layout}
          viewport={viewport}
          onNavigate={navigateTo}
        />
        {mobilePopup}
      </div>
    </div>
  );
}
