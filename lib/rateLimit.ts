export class RateLimiter {
  private tokens = 100
  constructor(private capacity = 100) {}
  take() {
    if (this.tokens <= 0) return false
    this.tokens--
    return true
  }
}

export const rateLimiter = new RateLimiter(1000)
