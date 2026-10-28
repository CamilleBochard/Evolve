import styles from './BlockHead.module.css';

interface BlockHeadProps {
  label: string;
  micro?: string;
}

// Heading of a block of the quest sheet: "[Récit]", with an optional count.
export function BlockHead({ label, micro }: BlockHeadProps) {
  return (
    <h3 className={styles.head}>
      <span className={styles.label}>{label}</span>
      {micro !== undefined && <span className={styles.micro}>{micro}</span>}
    </h3>
  );
}
