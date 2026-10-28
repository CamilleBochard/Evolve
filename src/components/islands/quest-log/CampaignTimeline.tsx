import type { MouseEvent } from 'react';

import { QUESTS, TIMELINE } from '../../../data/quests';
import type { QuestId } from '../../../data/quests';
import { planTimeline, timelinePercent } from '../../../lib/journal/timeline';
import styles from './CampaignTimeline.module.css';

// Vertical step between two lanes, and height of a bar, in pixels.
const LANE_HEIGHT = 18;
const BAR_HEIGHT = 14;
// Baseline of the bar title inside its bar.
const TEXT_BASELINE = 10;
const TEXT_INSET = 5;

interface CampaignTimelineProps {
  selectedId: QuestId;
  onSelect: (id: QuestId) => void;
}

// Bars are placed through SVG attributes in percent, never an inline style
// attribute: the timeline is rendered on the server, and the Content
// Security Policy refuses inline styles.
function percent(value: number): string {
  const text = `${value}%`;
  return text;
}

function yearLines(): number[] {
  const years: number[] = [];
  for (let year = Math.ceil(TIMELINE.start); year < TIMELINE.end; year++) {
    years.push(year);
  }
  return years;
}

// Every dated quest placed in time, one bar per quest. Each bar is a link
// to the quest, so the address changes like with a skill of the tree.
export function CampaignTimeline({
  selectedId,
  onSelect,
}: CampaignTimelineProps) {
  const plan = planTimeline(QUESTS);
  const trackHeight = plan.laneCount * LANE_HEIGHT;
  const nowX = percent(timelinePercent(TIMELINE.now));

  function handleClick(event: MouseEvent<Element>, id: QuestId): void {
    event.preventDefault();
    onSelect(id);
  }

  return (
    <section
      className={styles.timeline}
      aria-label="Frise de la campagne"
      data-tour="timeline"
    >
      <div className={styles.head}>
        <span className={styles.label}>[Frise de campagne]</span>
        <span className={styles.micro}>TLN.01 · 2011 → 2026</span>
      </div>
      <svg className={styles.track} width="100%" height={trackHeight}>
        {yearLines().map((year) => (
          <line
            key={year}
            className={styles.yearLine}
            x1={percent(timelinePercent(year))}
            x2={percent(timelinePercent(year))}
            y1={0}
            y2={trackHeight}
          />
        ))}
        {plan.bars.map((bar) => {
          const { quest } = bar;
          const classNames = [styles.bar];
          if (quest.type === 'main') {
            classNames.push(styles.main);
          }
          if (quest.status === 'progress') {
            classNames.push(styles.progress);
          }
          return (
            <a
              key={quest.id}
              className={classNames.join(' ')}
              href={`#${quest.id}`}
              aria-label={`${quest.title} · ${quest.period}`}
              aria-current={quest.id === selectedId}
              onClick={(event) => handleClick(event, quest.id)}
            >
              <svg
                x={percent(bar.left)}
                y={bar.lane * LANE_HEIGHT}
                width={percent(bar.width)}
                height={BAR_HEIGHT}
              >
                <rect className={styles.barBox} width="100%" height="100%" />
                <text
                  className={styles.barText}
                  x={TEXT_INSET}
                  y={TEXT_BASELINE}
                >
                  {quest.title}
                </text>
              </svg>
            </a>
          );
        })}
        <line
          className={styles.now}
          x1={nowX}
          x2={nowX}
          y1={-4}
          y2={trackHeight + 4}
        />
      </svg>
      <svg className={styles.years} width="100%" height={14} aria-hidden="true">
        {TIMELINE.ticks.map((year) => (
          <text
            key={year}
            x={percent(timelinePercent(year))}
            y={10}
            textAnchor="middle"
          >
            {year}
          </text>
        ))}
        {/* Today sits just after the last tick: its label goes on the left. */}
        <text
          className={styles.nowLabel}
          x={nowX}
          y={10}
          dx={-4}
          textAnchor="end"
        >
          Auj.
        </text>
      </svg>
    </section>
  );
}
