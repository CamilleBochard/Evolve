// Quests as the list shows them: filtered, grouped by chapter, in the chosen
// order. The data is written oldest first.
import { QUESTS, QUEST_CHAPTERS } from '../../data/quests';
import type {
  Quest,
  QuestChapter,
  QuestId,
  QuestType,
} from '../../data/quests';

export type QuestFilter = 'all' | QuestType;

// newest: latest chapters and quests first. oldest: the campaign in reading
// order.
export type QuestOrder = 'newest' | 'oldest';

export interface ChapterGroup {
  chapter: QuestChapter;
  quests: Quest[];
}

// Chronological neighbours, whatever the list order.
export interface QuestNeighbours {
  older: Quest | null;
  newer: Quest | null;
}

export function isQuestId(value: string): value is QuestId {
  const isKnown = QUESTS.some((quest) => quest.id === value);
  return isKnown;
}

export function findQuest(id: QuestId): Quest {
  const quest = QUESTS.find((item) => item.id === id);
  if (quest === undefined) {
    throw new Error(`No quest ${id}`);
  }
  return quest;
}

export function chapterOf(quest: Quest): QuestChapter {
  const chapter = QUEST_CHAPTERS.find((item) => item.id === quest.chapter);
  if (chapter === undefined) {
    throw new Error(`No chapter ${quest.chapter}`);
  }
  return chapter;
}

// Number of the quest in the campaign, such as QST.05.
export function questCode(quest: Quest): string {
  const number = String(QUESTS.indexOf(quest) + 1).padStart(2, '0');
  const code = `QST.${number}`;
  return code;
}

function inOrder<Item>(items: Item[], order: QuestOrder): Item[] {
  const ordered = [...items];
  if (order === 'newest') {
    ordered.reverse();
  }
  return ordered;
}

// Chapters holding at least one quest that passes the filter.
export function questGroups(
  filter: QuestFilter,
  order: QuestOrder,
): ChapterGroup[] {
  let quests = QUESTS;
  if (filter !== 'all') {
    quests = QUESTS.filter((quest) => quest.type === filter);
  }
  const groups: ChapterGroup[] = [];
  for (const chapter of inOrder(QUEST_CHAPTERS, order)) {
    const chapterQuests = quests.filter(
      (quest) => quest.chapter === chapter.id,
    );
    if (chapterQuests.length === 0) {
      continue;
    }
    groups.push({ chapter, quests: inOrder(chapterQuests, order) });
  }
  return groups;
}

// The list flattened: what the up and down arrows walk through.
export function visibleQuests(filter: QuestFilter, order: QuestOrder): Quest[] {
  const groups = questGroups(filter, order);
  const quests = groups.flatMap((group) => group.quests);
  return quests;
}

export function questNeighbours(quest: Quest): QuestNeighbours {
  const index = QUESTS.indexOf(quest);
  let older: Quest | null = null;
  if (index > 0) {
    older = QUESTS[index - 1];
  }
  let newer: Quest | null = null;
  if (index < QUESTS.length - 1) {
    newer = QUESTS[index + 1];
  }
  const neighbours: QuestNeighbours = { older, newer };
  return neighbours;
}
