/**
 * Fixed-window rate limit kept in process memory.
 *
 * The site runs as one container on one VPS, so a Map is enough. If it ever
 * runs as several replicas, move this to the database; do not add a SaaS.
 */
interface Window {
  count: number
  resetAt: number
}

const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

const windows = new Map<string, Window>()

export function isRateLimited(key: string, now: number = Date.now()): boolean {
  const current = windows.get(key)
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  current.count += 1
  return current.count > MAX_PER_WINDOW
}

/** Test seam. Never called by application code. */
export function resetRateLimit(): void {
  windows.clear()
}
