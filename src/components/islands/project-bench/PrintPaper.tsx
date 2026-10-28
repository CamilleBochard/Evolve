import type { ReactNode } from 'react';

import styles from './PrintPaper.module.css';
import type { PrintFile } from './project-prints';

interface PrintPaperProps {
  print: PrintFile;
  // Empty when the print only decorates a labelled control.
  alt: string;
  className?: string;
  // Drawn over the print, such as a label.
  children?: ReactNode;
}

// A halftone print on the dark gridded paper it is printed on. Shown as is:
// the dots stay square when the print is scaled.
export function PrintPaper({
  print,
  alt,
  className,
  children,
}: PrintPaperProps) {
  const classNames = [styles.paper];
  if (className !== undefined) {
    classNames.push(className);
  }
  return (
    <span className={classNames.join(' ')}>
      <img
        className={styles.image}
        src={print.src}
        width={print.width}
        height={print.height}
        alt={alt}
        decoding="async"
      />
      {children}
    </span>
  );
}
