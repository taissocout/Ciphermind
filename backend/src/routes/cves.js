import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { getRecentCVEs, getCVEById } from '../services/nvd.js'
const router = Router()
router.get('/', asyncHandler(async (req, res) => {
  const { id, ...params } = req.query
  if (id) return res.json({ cves: [await getCVEById(id)] })
  res.json(await getRecentCVEs(params))
}))
export default router
