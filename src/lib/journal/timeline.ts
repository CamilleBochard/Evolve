// Campaign timeline: each quest with dates becomes a bar, placed in percent
// of the timeline width, on the first lane where it overlaps no other bar.
import { TIMELINE } from '../../data/quests';
import type { Quest } from '../../data/quests';

export interface TimelineBar {
  quest: Quest;
  // Percent of the timeline width.
  left: number;
  width: number;
  lane: number;
}

export interface TimelinePlan {
  bars: TimelineBar[];
  laneCount: number;
}

export function timelinePercent(year: number): number {
  const elapsed = year - TIMELINE.start;
  const span = TIMELINE.end - TIMELINE.start;
  const percent = (elapsed / span) * 100;
  return percent;
}

// A quest still running ends today.
function questEnd(quest: Quest): number {
  let end = TIMELINE.now;
  if (quest.to !== null) {
    end = quest.to;
  }
  return end;
}

export function planTimeline(quests: Quest[]): TimelinePlan {
  const laneEnds: number[] = [];
  const bars: TimelineBar[] = [];
  for (const quest of quests) {
    const start = quest.from;
    if (start === null) {
      continue;
    }
    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    const end = questEnd(quest);
    laneEnds[lane] = end;
    const left = timelinePercent(start);
    const width = timelinePercent(end) - left;
    bars.push({ quest, left, width, lane });
  }
  const plan: TimelinePlan = { bars, laneCount: laneEnds.length };
  return plan;
}
