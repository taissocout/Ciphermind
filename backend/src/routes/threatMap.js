import { Router } from 'express'
import { readThreatEvents } from '../services/threatMapStore.js'
const router = Router()
router.get('/', (req, res) => res.json({ total: 0, generatedAt: new Date().toISOString(), events: readThreatEvents() }))
export default router
