import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
export const helmetMiddleware = helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'","'unsafe-inline'"], imgSrc: ["'self'","data:"] } }, frameguard: { action: 'deny' }, hidePoweredBy: true, hsts: process.env.NODE_ENV==='production' ? { maxAge: 31536000, includeSubDomains: true } : false, noSniff: true })
export const globalRateLimit = rateLimit({ windowMs: 15*60*1000, max: 100, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests.' } })
export const aiRateLimit = rateLimit({ windowMs: 60*1000, max: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'AI rate limit reached.' } })
function isAllowed(origin) {
  if (!origin) return true
  if (/^http:\/\/localhost:\d+$/i.test(origin)) return true
  if (/^https:\/\/ciphermind(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin)) return true
  if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return true
  return false
}
export const corsMiddleware = cors({ origin: (o, cb) => isAllowed(o) ? cb(null,true) : cb(new Error('CORS: not allowed')), methods: ['GET','POST','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'], credentials: true, maxAge: 86400, optionsSuccessStatus: 204 })
