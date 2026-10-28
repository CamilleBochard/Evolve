// The quests rewritten as a plain résumé, without the game vocabulary.
import type { Quest, QuestObjective } from '../../data/quests';
import { questGroups } from './quest-list';
import type { ChapterGroup } from './quest-list';

// Facts that say where the quest took place. "Atelier" is the game name of
// personal projects: it means nothing in a résumé.
const PLACE_TERMS = ['Lieu', 'Guilde', 'Commanditaire'];
const GAME_ONLY_PLACE = 'Atelier';

// Résumé order: most recent first, locked chapters left out.
export function plainChapters(): ChapterGroup[] {
  const groups = questGroups('all', 'newest');
  const openGroups = groups.filter((group) => !group.chapter.isLocked);
  return openGroups;
}

export function plainPlace(quest: Quest): string {
  const placeFacts = quest.facts.filter(
    (fact) => PLACE_TERMS.includes(fact.term) && fact.value !== GAME_ONLY_PLACE,
  );
  const place = placeFacts.map((fact) => fact.value).join(' · ');
  return place;
}

export function plainObjective(objective: QuestObjective): string {
  let text = objective.text;
  if (!objective.isDone) {
    text = `${objective.text} (en cours)`;
  }
  return text;
}

export function plainFeats(quest: Quest): string {
  const figures = quest.feats.map((feat) => `${feat.value} ${feat.label}`);
  const line = figures.join(' · ');
  return line;
}
