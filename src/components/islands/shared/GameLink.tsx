import styles from './GameLink.module.css';

interface GameLinkProps {
  label: string;
  // Missing for an action not available yet: shown greyed, not a link.
  href?: string;
  // Short note after the label of an action not available yet: "Bientôt".
  note?: string;
  isAccent?: boolean;
}

// Game menu style link: chamfered label, arrow, hatched box. The React twin
// of the GameButton Astro component.
export function GameLink({
  label,
  href,
  note,
  isAccent = false,
}: GameLinkProps) {
  const classNames = [styles.link];
  if (isAccent) {
    classNames.push(styles.accent);
  }

  const content = (
    <>
      <span className={styles.label}>
        {label}
        {note !== undefined && <span className={styles.note}>· {note}</span>}
      </span>
      <span className={styles.hatch} aria-hidden="true" />
    </>
  );

  if (href === undefined) {
    classNames.push(styles.unavailable);
    const unavailable = <span className={classNames.join(' ')}>{content}</span>;
    return unavailable;
  }

  const link = (
    <a className={classNames.join(' ')} href={href}>
      {content}
    </a>
  );
  return link;
}
