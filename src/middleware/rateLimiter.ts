import rateLimit from 'express-rate-limit';

export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { message: 'Too many requests. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});