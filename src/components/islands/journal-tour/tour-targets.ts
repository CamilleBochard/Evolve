// Areas of the page the tutorial explains, marked data-tour="<target>".

export function findTourTarget(target: string): HTMLElement | null {
  const element = document.querySelector<HTMLElement>(
    `[data-tour="${target}"]`,
  );
  return element;
}

// Hidden areas (the simple view, a quest without rewards) have no size.
export function isOnScreen(element: HTMLElement): boolean {
  const bounds = element.getBoundingClientRect();
  const isVisible = bounds.width > 0 && bounds.height > 0;
  return isVisible;
}
