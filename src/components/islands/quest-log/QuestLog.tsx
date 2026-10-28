import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { DEFAULT_QUEST_ID } from '../../../data/quests';
import type { QuestId } from '../../../data/quests';
import { campaignStats } from '../../../lib/journal/campaign';
import {
  findQuest,
  isQuestId,
  questGroups,
  visibleQuests,
} from '../../../lib/journal/quest-list';
import type { QuestFilter, QuestOrder } from '../../../lib/journal/quest-list';
import { CampaignTimeline } from './CampaignTimeline';
import { QuestList } from './QuestList';
import { QuestListHead } from './QuestListHead';
import styles from './QuestLog.module.css';
import { QuestSheet } from './QuestSheet';

// Below this width the list and the sheet are stacked and the page scrolls:
// the sheet is brought into view after a choice. Same value as the CSS.
const STACKED_QUERY = '(max-width: 960px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function scrollBehavior(): ScrollBehavior {
  let behavior: ScrollBehavior = 'smooth';
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    behavior = 'auto';
  }
  return behavior;
}

// The quest log: campaign timeline, quest list and the sheet of the
// selected quest. Rendered on the server with the default quest; a link
// such as /journal#magento, from the skill tree, opens that quest once the
// island wakes up.
export default function QuestLog() {
  const [selectedId, setSelectedId] = useState<QuestId>(DEFAULT_QUEST_ID);
  const [filter, setFilter] = useState<QuestFilter>('all');
  const [order, setOrder] = useState<QuestOrder>('newest');

  const sheetColumnRef = useRef<HTMLDivElement>(null);
  const listItems = useRef(new Map<QuestId, HTMLButtonElement>());
  // Set by a click: on stacked screens, the sheet is scrolled into view.
  const shouldRevealSheet = useRef(false);

  const stats = useMemo(() => campaignStats(), []);
  const groups = useMemo(() => questGroups(filter, order), [filter, order]);
  const quest = findQuest(selectedId);

  const selectQuest = useCallback((id: QuestId, shouldReveal: boolean) => {
    shouldRevealSheet.current = shouldReveal;
    setSelectedId(id);
    window.history.replaceState(null, '', `#${id}`);
  }, []);

  const registerItem = useCallback(
    (id: QuestId, button: HTMLButtonElement | null) => {
      if (button === null) {
        listItems.current.delete(id);
        return;
      }
      listItems.current.set(id, button);
    },
    [],
  );

  // The quest named by the address, now and when the address changes.
  useEffect(() => {
    function selectFromHash(): void {
      const hashId = window.location.hash.slice(1);
      if (isQuestId(hashId)) {
        setSelectedId(hashId);
      }
    }
    selectFromHash();
    window.addEventListener('hashchange', selectFromHash);
    return () => window.removeEventListener('hashchange', selectFromHash);
  }, []);

  // A new quest: its sheet starts at the top, its list item comes into view.
  useEffect(() => {
    const sheetColumn = sheetColumnRef.current;
    const isStacked = window.matchMedia(STACKED_QUERY).matches;
    if (sheetColumn !== null) {
      sheetColumn.scrollTop = 0;
      if (isStacked && shouldRevealSheet.current) {
        sheetColumn.scrollIntoView({
          behavior: scrollBehavior(),
          block: 'start',
        });
      }
    }
    shouldRevealSheet.current = false;
    const listItem = listItems.current.get(selectedId);
    if (listItem !== undefined && !isStacked) {
      listItem.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedId]);

  function toggleOrder(): void {
    let nextOrder: QuestOrder = 'newest';
    if (order === 'newest') {
      nextOrder = 'oldest';
    }
    setOrder(nextOrder);
  }

  // Up and down arrows walk through the quests the list shows.
  function handleArrowKey(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }
    event.preventDefault();
    const quests = visibleQuests(filter, order);
    const index = quests.findIndex((item) => item.id === selectedId);
    let nextIndex = index + 1;
    if (event.key === 'ArrowUp') {
      nextIndex = index - 1;
    }
    const nextQuest = quests[nextIndex];
    if (nextQuest === undefined) {
      return;
    }
    selectQuest(nextQuest.id, false);
    listItems.current.get(nextQuest.id)?.focus();
  }

  return (
    <div className={styles.log}>
      <div className={styles.timelineRow}>
        <CampaignTimeline
          selectedId={selectedId}
          onSelect={(id) => selectQuest(id, true)}
        />
      </div>
      <div className={styles.listColumn}>
        <QuestListHead
          filter={filter}
          order={order}
          doneCount={stats.doneCount}
          questCount={stats.questCount}
          onFilterChange={setFilter}
          onOrderToggle={toggleOrder}
        />
        <QuestList
          groups={groups}
          selectedId={selectedId}
          onSelect={(id) => selectQuest(id, true)}
          onArrowKey={handleArrowKey}
          registerItem={registerItem}
        />
      </div>
      <div className={styles.sheetColumn} ref={sheetColumnRef}>
        <p className="visually-hidden" aria-live="polite">
          Quête affichée : {quest.title}
        </p>
        <QuestSheet
          key={quest.id}
          quest={quest}
          onSelect={(id) => selectQuest(id, true)}
        />
      </div>
    </div>
  );
}
