import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { aiRateLimit } from '../middleware/security.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import { llmFirewall } from '../middleware/llmFirewall.js'
import { queryAnalyst } from '../services/claude.js'
const router = Router()
function validate(req, res, next) {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ error: 'Invalid request.' })
  const extra = Object.keys(req.body||{}).filter(k => !['messages','context'].includes(k))
  if (extra.length) return res.status(400).json({ error: 'Unexpected fields.' })
  next()
}
router.post('/', aiRateLimit,
  [body('messages').isArray({min:1,max:10}), body('messages.*.role').isIn(['user','assistant']), body('messages.*.content').isString().trim().isLength({min:1,max:2000}), body('context').optional().isString().trim().isLength({max:3000})],
  validate, llmFirewall,
  asyncHandler(async (req, res) => {
    const { messages, context='' } = req.body
    res.json({ response: await queryAnalyst({ messages, context }) })
  })
)
export default router
