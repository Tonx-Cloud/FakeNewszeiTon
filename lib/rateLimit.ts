/**
 * Simple sliding-window rate limiter (in-memory).
 * Resets on cold start — acceptable for MVP.
 * For production scale, use Upstash Redis (@upstash/ratelimit).
 */

const windowMs = 60_000 // 1 minute
const maxRequests = 10  // 10 requests per minute per IP

const hits = new Map<string, number[]>()

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, timestamps] of hits) {
    const valid = timestamps.filter(t => now - t < windowMs)
    if (valid.length === 0) hits.delete(key)
    else hits.set(key, valid)
  }
}, 300_000)

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const timestamps = (hits.get(ip) || []).filter(t => now - t < windowMs)

  if (timestamps.length >= maxRequests) {
    hits.set(ip, timestamps)
    return { allowed: false, remaining: 0 }
  }

  timestamps.push(now)
  hits.set(ip, timestamps)
  return { allowed: true, remaining: maxRequests - timestamps.length }
}
