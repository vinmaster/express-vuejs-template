import { RateLimiterMemory } from 'rate-limiter-flexible';

const minute = 60;

export function rateLimiter(opts = {}) {
  opts = Object.assign(
    {
      points: 100, // Maximum number of points can be consumed over duration
      duration: minute * 5, // Number of seconds before consumed points are reset
    },
    opts
  );

  const rateLimiterMemory = new RateLimiterMemory(opts);
  return (req, res, next) => {
    rateLimiterMemory
      .consume(req.ip)
      .then(() => {
        next();
      })
      .catch(rateLimiterRes => {
        const headers = {
          'Retry-After': rateLimiterRes.msBeforeNext / 1000,
          'X-RateLimit-Limit': opts['points'],
          'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
          'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext),
        };
        res.set(headers).status(429).send({ error: 'Too Many Requests' });
      });
  };
}
