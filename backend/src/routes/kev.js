import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { getKEVCatalog } from '../services/kev.js'
const router = Router()
router.get('/', asyncHandler(async (req, res) => res.json(await getKEVCatalog())))
export default router
