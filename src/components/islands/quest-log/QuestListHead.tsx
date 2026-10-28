import type { QuestFilter, QuestOrder } from '../../../lib/journal/quest-list';
import styles from './QuestListHead.module.css';

interface FilterOption {
  value: QuestFilter;
  label: string;
}

const FILTERS: FilterOption[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'main', label: 'Principales' },
  { value: 'side', label: 'Secondaires' },
];

interface QuestListHeadProps {
  filter: QuestFilter;
  order: QuestOrder;
  doneCount: number;
  questCount: number;
  onFilterChange: (filter: QuestFilter) => void;
  onOrderToggle: () => void;
}

interface OrderButtonText {
  label: string;
  description: string;
}

function orderButtonText(order: QuestOrder): OrderButtonText {
  let text: OrderButtonText = {
    label: '↓ Récentes',
    description: "Ordre de la liste : plus récentes d'abord. Inverser l'ordre.",
  };
  if (order === 'oldest') {
    text = {
      label: '↑ Anciennes',
      description:
        "Ordre de la liste : plus anciennes d'abord. Inverser l'ordre.",
    };
  }
  return text;
}

// Title of the list with the quests done, the order button and the filters
// by quest type.
export function QuestListHead({
  filter,
  order,
  doneCount,
  questCount,
  onFilterChange,
  onOrderToggle,
}: QuestListHeadProps) {
  const orderText = orderButtonText(order);

  return (
    <div className={styles.head} data-tour="filters">
      <div className={styles.top}>
        <span className={styles.label}>
          [Quêtes]{' '}
          <span className={styles.micro}>
            {doneCount} / {questCount} accomplies
          </span>
        </span>
        <button
          type="button"
          className={styles.sort}
          aria-label={orderText.description}
          onClick={onOrderToggle}
        >
          {orderText.label}
        </button>
      </div>
      <div
        className={styles.filters}
        role="group"
        aria-label="Filtrer les quêtes"
      >
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={styles.filter}
            aria-pressed={option.value === filter}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
