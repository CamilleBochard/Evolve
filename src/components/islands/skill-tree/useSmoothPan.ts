import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';

// Smooth 2D navigation of a scrollable container: drag with the mouse, with
// inertia, and eased programmatic scrolling. Touch and trackpads keep native
// scrolling, which is already smooth. Coordinates are scroll pixels.

const DRAG_THRESHOLD = 5;
const FRICTION = 0.93;
const MIN_SPEED = 0.02;
const SAMPLE_WINDOW_MS = 90;
const MAX_SAMPLES = 12;
const BASE_DURATION_MS = 700;

export interface PanApi {
  scrollToPoint: (left: number, top: number, animate?: boolean) => void;
  centerOn: (x: number, y: number, animate?: boolean) => void;
  // Keeps a point visible with some room, without moving if it already is.
  reveal: (x: number, y: number, margin: number) => void;
  // Scrolls just enough for a whole rectangle to be visible.
  revealRect: (
    x: number,
    y: number,
    width: number,
    height: number,
    margin: number,
  ) => void;
}

interface Sample {
  x: number;
  y: number;
  time: number;
}

interface PointerState {
  id: number;
  startX: number;
  startY: number;
  startLeft: number;
  startTop: number;
  isDragging: boolean;
  samples: Sample[];
}

function clamp(value: number, min: number, max: number): number {
  const clamped = Math.min(Math.max(value, min), max);
  return clamped;
}

function easeOutCubic(progress: number): number {
  const remaining = 1 - progress;
  const eased = 1 - remaining * remaining * remaining;
  return eased;
}

function prefersReducedMotion(): boolean {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return reduced;
}

// Speed of the last moves, in pixels per millisecond, for the inertia.
function measureVelocity(samples: Sample[]): { x: number; y: number } {
  const now = performance.now();
  const recent = samples.filter(
    (sample) => now - sample.time < SAMPLE_WINDOW_MS,
  );
  let velocity = { x: 0, y: 0 };
  if (recent.length >= 2) {
    const first = recent[0];
    const last = recent[recent.length - 1];
    const elapsed = Math.max(last.time - first.time, 1);
    velocity = {
      x: (last.x - first.x) / elapsed,
      y: (last.y - first.y) / elapsed,
    };
  }
  return velocity;
}

// Cancels the running scroll animation or inertia, if any.
function cancelFrame(frame: { current: number }): void {
  if (frame.current !== 0) {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
  }
}

export function useSmoothPan(
  containerRef: RefObject<HTMLElement | null>,
): PanApi {
  const animationFrame = useRef(0);

  const api = useMemo<PanApi>(() => {
    function scrollToPoint(left: number, top: number, animate = true): void {
      const container = containerRef.current;
      if (container === null) {
        return;
      }
      cancelFrame(animationFrame);
      const endLeft = clamp(
        left,
        0,
        container.scrollWidth - container.clientWidth,
      );
      const endTop = clamp(
        top,
        0,
        container.scrollHeight - container.clientHeight,
      );
      if (!animate || prefersReducedMotion()) {
        container.scrollLeft = endLeft;
        container.scrollTop = endTop;
        return;
      }
      const startLeft = container.scrollLeft;
      const startTop = container.scrollTop;
      const distance = Math.hypot(endLeft - startLeft, endTop - startTop);
      // Longer trips take a bit longer, without ever feeling sluggish.
      const duration = clamp(
        BASE_DURATION_MS * (0.5 + distance / 2000),
        350,
        1000,
      );
      const startTime = performance.now();

      function step(now: number): void {
        const scrolled = containerRef.current;
        if (scrolled === null) {
          return;
        }
        const progress = clamp((now - startTime) / duration, 0, 1);
        const eased = easeOutCubic(progress);
        scrolled.scrollLeft = startLeft + (endLeft - startLeft) * eased;
        scrolled.scrollTop = startTop + (endTop - startTop) * eased;
        animationFrame.current = 0;
        if (progress < 1) {
          animationFrame.current = requestAnimationFrame(step);
        }
      }
      animationFrame.current = requestAnimationFrame(step);
    }

    function centerOn(x: number, y: number, animate = true): void {
      const container = containerRef.current;
      if (container === null) {
        return;
      }
      scrollToPoint(
        x - container.clientWidth / 2,
        y - container.clientHeight / 2,
        animate,
      );
    }

    function reveal(x: number, y: number, margin: number): void {
      const container = containerRef.current;
      if (container === null) {
        return;
      }
      const left = container.scrollLeft;
      const top = container.scrollTop;
      const isVisibleX =
        x > left + margin && x < left + container.clientWidth - margin;
      const isVisibleY =
        y > top + margin && y < top + container.clientHeight - margin;
      if (isVisibleX && isVisibleY) {
        return;
      }
      centerOn(x, y);
    }

    function revealRect(
      x: number,
      y: number,
      width: number,
      height: number,
      margin: number,
    ): void {
      const container = containerRef.current;
      if (container === null) {
        return;
      }
      let targetLeft = container.scrollLeft;
      let targetTop = container.scrollTop;
      if (x + width + margin > targetLeft + container.clientWidth) {
        targetLeft = x + width + margin - container.clientWidth;
      }
      if (x - margin < targetLeft) {
        targetLeft = x - margin;
      }
      if (y + height + margin > targetTop + container.clientHeight) {
        targetTop = y + height + margin - container.clientHeight;
      }
      if (y - margin < targetTop) {
        targetTop = y - margin;
      }
      const hasMoved =
        targetLeft !== container.scrollLeft ||
        targetTop !== container.scrollTop;
      if (hasMoved) {
        scrollToPoint(targetLeft, targetTop);
      }
    }

    const panApi: PanApi = { scrollToPoint, centerOn, reveal, revealRect };
    return panApi;
  }, [containerRef]);

  // Mouse drag with inertia, attached once to the container.
  useEffect(() => {
    const container = containerRef.current;
    if (container === null) {
      return undefined;
    }
    const element: HTMLElement = container;
    const frame = animationFrame;
    function stopAnimation(): void {
      cancelFrame(frame);
    }
    let pointer: PointerState | null = null;
    let suppressNextClick = false;

    function startInertia(velocityX: number, velocityY: number): void {
      if (prefersReducedMotion()) {
        return;
      }
      let speedX = velocityX;
      let speedY = velocityY;
      let previousTime = performance.now();

      function step(now: number): void {
        const elapsed = now - previousTime;
        previousTime = now;
        const decay = Math.pow(FRICTION, elapsed / 16);
        speedX = speedX * decay;
        speedY = speedY * decay;
        element.scrollLeft = element.scrollLeft - speedX * elapsed;
        element.scrollTop = element.scrollTop - speedY * elapsed;
        frame.current = 0;
        const isMoving =
          Math.abs(speedX) > MIN_SPEED || Math.abs(speedY) > MIN_SPEED;
        if (isMoving) {
          frame.current = requestAnimationFrame(step);
        }
      }
      frame.current = requestAnimationFrame(step);
    }

    function onPointerDown(event: PointerEvent): void {
      if (event.pointerType !== 'mouse' || event.button !== 0) {
        return;
      }
      // Elements marked data-no-pan (the popup) keep the normal mouse behaviour.
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('[data-no-pan]') !== null
      ) {
        return;
      }
      stopAnimation();
      pointer = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: element.scrollLeft,
        startTop: element.scrollTop,
        isDragging: false,
        samples: [],
      };
    }

    function onPointerMove(event: PointerEvent): void {
      if (pointer === null || event.pointerId !== pointer.id) {
        return;
      }
      const deltaX = event.clientX - pointer.startX;
      const deltaY = event.clientY - pointer.startY;
      if (!pointer.isDragging) {
        if (Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) {
          return;
        }
        pointer.isDragging = true;
        element.setPointerCapture(pointer.id);
        element.dataset.dragging = 'true';
      }
      element.scrollLeft = pointer.startLeft - deltaX;
      element.scrollTop = pointer.startTop - deltaY;
      pointer.samples.push({
        x: event.clientX,
        y: event.clientY,
        time: performance.now(),
      });
      if (pointer.samples.length > MAX_SAMPLES) {
        pointer.samples.shift();
      }
    }

    function onPointerUp(event: PointerEvent): void {
      if (pointer === null || event.pointerId !== pointer.id) {
        return;
      }
      if (pointer.isDragging) {
        suppressNextClick = true;
        // Some browsers fire no click after a drag: never swallow a later, real click.
        window.setTimeout(() => {
          suppressNextClick = false;
        }, 0);
        delete element.dataset.dragging;
        const velocity = measureVelocity(pointer.samples);
        startInertia(velocity.x, velocity.y);
      }
      pointer = null;
    }

    // A drag must not end with a click selecting the node under the cursor.
    function onClickCapture(event: MouseEvent): void {
      if (suppressNextClick) {
        event.stopPropagation();
        event.preventDefault();
        suppressNextClick = false;
      }
    }

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerUp);
    element.addEventListener('click', onClickCapture, true);
    element.addEventListener('wheel', stopAnimation, { passive: true });
    element.addEventListener('touchstart', stopAnimation, { passive: true });
    element.addEventListener('keydown', stopAnimation);
    return () => {
      stopAnimation();
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerUp);
      element.removeEventListener('click', onClickCapture, true);
      element.removeEventListener('wheel', stopAnimation);
      element.removeEventListener('touchstart', stopAnimation);
      element.removeEventListener('keydown', stopAnimation);
    };
  }, [containerRef]);

  return api;
}
