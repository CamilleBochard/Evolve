import styles from './GameLink.module.css';

interface GameLinkProps {
  href: string;
  label: string;
  isAccent?: boolean;
}

// Game menu style link: chamfered label, arrow, hatched box. The React twin
// of the GameButton Astro component.
export function GameLink({ href, label, isAccent = false }: GameLinkProps) {
  const classNames = [styles.link];
  if (isAccent) {
    classNames.push(styles.accent);
  }
  return (
    <a className={classNames.join(' ')} href={href}>
      <span className={styles.label}>{label}</span>
      <span className={styles.hatch} aria-hidden="true" />
    </a>
  );
}
