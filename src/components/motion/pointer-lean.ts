/**
 * The hero's satellites lean toward the pointer and the grid shows under it.
 * The same gesture, applied to a card: `lean` is the element that tilts (a
 * card, or a whole deck), `surface` is the element whose grid lights up and
 * whose box the pointer is measured against.
 */

/** How far a card leans toward the pointer, in degrees. */
const TILT_DEG = 4

interface LeanTarget {
  readonly lean: HTMLElement
  readonly surface: HTMLElement
}

function clamp(value: number): number {
  return Math.max(-1, Math.min(1, value))
}

export function leanToward({ lean, surface }: LeanTarget, clientX: number, clientY: number): void {
  const rect = surface.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return
  const x = clientX - rect.left
  const y = clientY - rect.top
  lean.style.setProperty('--ry', `${clamp((x / rect.width) * 2 - 1) * TILT_DEG}deg`)
  lean.style.setProperty('--rx', `${-clamp((y / rect.height) * 2 - 1) * TILT_DEG}deg`)
  surface.style.setProperty('--mx', `${x}px`)
  surface.style.setProperty('--my', `${y}px`)
  surface.dataset['hot'] = 'true'
}

export function resetLean({ lean, surface }: LeanTarget): void {
  lean.style.setProperty('--rx', '0deg')
  lean.style.setProperty('--ry', '0deg')
  surface.dataset['hot'] = 'false'
}

/** Only a fine pointer leans anything; a finger never hovers. */
export function hasFinePointer(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}
