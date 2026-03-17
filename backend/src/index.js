import 'dotenv/config'
import express from 'express'
import { helmetMiddleware, globalRateLimit, corsMiddleware } from './middleware/security.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'
import { startCronJobs } from './services/cron.js'
import cvesRouter from './routes/cves.js'
import kevRouter from './routes/kev.js'
import analystRouter from './routes/analyst.js'
import threatMapRouter from './routes/threatMap.js'
const missing = ['CLAUDE_API_KEY'].filter(k => !process.env[k])
if (missing.length) { console.error(`[FATAL] Missing: ${missing.join(', ')}`); process.exit(1) }
const app = express()
const PORT = process.env.PORT || 3001
app.use(helmetMiddleware); app.use(corsMiddleware); app.use(globalRateLimit)
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false, limit: '10kb' }))
app.get('/', (req, res) => res.json({ status: 'ok', service: 'CipherMind Backend', version: '1.0.0' }))
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
app.use('/api/cves', cvesRouter)
app.use('/api/kev', kevRouter)
app.use('/api/analyst', analystRouter)
app.use('/api/threat-map', threatMapRouter)
app.use(notFoundHandler); app.use(errorHandler)
app.listen(PORT, '0.0.0.0', () => { console.log(`[SERVER] Running on port ${PORT}`); startCronJobs() })
export default app
