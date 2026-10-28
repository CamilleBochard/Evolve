// Content and placement of the skill popup.
import { SKILL_QUESTS } from '../../data/skill-tree';
import type { Skill, SkillHub, SkillState } from '../../data/skill-tree';
import type { SkillEntry } from './entries';
import { countUnlockedSatellites } from './layout';

export const STATE_LABELS: Record<SkillState, string> = {
  unlocked: 'Débloquée',
  progress: 'En cours',
  locked: 'Verrouillée',
};

export interface PopupDescription {
  label: string;
  // One quest title per line when the skill was earned in several quests.
  title: string;
  text: string;
}

function describeHub(hub: SkillHub): PopupDescription {
  const names = hub.satellites.map((satellite) => satellite.name).join(' · ');
  const description: PopupDescription = {
    label: '[Satellites]',
    title: `${countUnlockedSatellites(hub)} débloqués`,
    text: names,
  };
  return description;
}

function describeQuest(skill: Skill): PopupDescription {
  let description: PopupDescription = {
    label: '[Quête]',
    title: 'Aucune quête pour l’instant',
    text: 'Compétence à débloquer dans une prochaine aventure.',
  };
  if (skill.quest === undefined) {
    return description;
  }
  let verb = 'Obtenue';
  if (skill.state === 'progress') {
    verb = 'En cours';
  }
  const quest = SKILL_QUESTS[skill.quest];
  description = {
    label: `[${verb} dans la quête]`,
    title: quest.title,
    text: quest.text,
  };
  if (skill.otherQuests !== undefined) {
    // Several quests: titles only, the texts would be too long together.
    const questIds = [skill.quest, ...skill.otherQuests];
    const titles = questIds.map((questId) => SKILL_QUESTS[questId].title);
    description = {
      label: `[${verb} dans les quêtes]`,
      title: titles.join('\n'),
      text: '',
    };
  }
  return description;
}

export function describeEntry(entry: SkillEntry): PopupDescription {
  let description = describeQuest(entry.skill);
  if (entry.kind === 'hub') {
    description = describeHub(entry.hub.hub);
  }
  return description;
}

// Short code shown in the visual box of the popup: the hub code, or the
// capitals (or first letters) of a satellite name.
export function monogram(entry: SkillEntry): string {
  if (entry.kind === 'hub') {
    const hubCode = entry.hub.hub.mono;
    return hubCode;
  }
  const name = entry.skill.name;
  const capitals = name.replace(/[^A-Z]/g, '');
  let mono = name
    .replace(/[^A-Za-zÀ-ÿ]/g, '')
    .slice(0, 3)
    .toUpperCase();
  if (capitals.length >= 2 && capitals.length <= 4) {
    mono = capitals;
  }
  return mono;
}

// ---------- Placement ----------

const POPUP_GAP = 18;
const POPUP_MARGIN = 24;

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  left: number;
  top: number;
}

function clamp(value: number, min: number, max: number): number {
  const clamped = Math.min(Math.max(value, min), max);
  return clamped;
}

// Candidate positions, best first: away from the hub so the node stays
// visible, then below the skill, over the hub only as a last resort.
function candidates(entry: SkillEntry, popup: Size): Point[] {
  const toTheRight = {
    left: entry.x + entry.halfWidth + POPUP_GAP,
    top: entry.y - 40,
  };
  const toTheLeft = {
    left: entry.x - entry.halfWidth - POPUP_GAP - popup.width,
    top: entry.y - 40,
  };
  let below = { left: entry.x - entry.halfWidth, top: entry.y + 30 };
  if (entry.kind === 'hub') {
    below = { left: entry.x - popup.width / 2, top: entry.y + 80 };
    return [below, toTheRight, toTheLeft];
  }
  let ordered = [toTheRight, below, toTheLeft];
  const isLeftOfHub = entry.x < entry.hub.x;
  if (isLeftOfHub) {
    ordered = [toTheLeft, below, toTheRight];
  }
  return ordered;
}

// Position of the popup next to its skill, kept inside the tree.
export function popupPosition(
  entry: SkillEntry,
  popup: Size,
  tree: Size,
): Point {
  const options = candidates(entry, popup);
  const fitting = options.find(
    (option) =>
      option.left >= POPUP_MARGIN &&
      option.left + popup.width <= tree.width - POPUP_MARGIN,
  );
  let chosen = options[0];
  if (fitting !== undefined) {
    chosen = fitting;
  }
  const position: Point = {
    left: clamp(
      chosen.left,
      POPUP_MARGIN,
      tree.width - popup.width - POPUP_MARGIN,
    ),
    top: clamp(
      chosen.top,
      POPUP_MARGIN,
      tree.height - popup.height - POPUP_MARGIN,
    ),
  };
  return position;
}
