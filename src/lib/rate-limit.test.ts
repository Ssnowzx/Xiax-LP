import { beforeEach, describe, expect, it } from 'vitest'

import { isRateLimited, resetRateLimit } from '@/lib/rate-limit'

describe('isRateLimited', () => {
  beforeEach(() => {
    resetRateLimit()
  })

  it('should allow five messages in a window and block the sixth', () => {
    // ARRANGE
    const key = '203.0.113.7'
    const now = 1_000

    // ACT
    const results = Array.from({ length: 6 }, () => isRateLimited(key, now))

    // ASSERT
    expect(results.slice(0, 5)).toEqual([false, false, false, false, false])
    expect(results[5]).toBe(true)
  })

  it('should open a fresh window after ten minutes', () => {
    // ARRANGE
    const key = '203.0.113.7'
    const start = 1_000
    for (let index = 0; index < 6; index += 1) isRateLimited(key, start)

    // ACT
    const later = isRateLimited(key, start + 10 * 60 * 1000 + 1)

    // ASSERT
    expect(later).toBe(false)
  })

  it('should count addresses separately', () => {
    // ARRANGE
    for (let index = 0; index < 6; index += 1) isRateLimited('a', 0)

    // ACT
    const other = isRateLimited('b', 0)

    // ASSERT
    expect(other).toBe(false)
  })
})
