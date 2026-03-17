import cron from 'node-cron'
import { clearCache } from './kev.js'
export function startCronJobs() {
  cron.schedule('0 */6 * * *', () => { console.log('[CRON] Clearing KEV cache'); clearCache() })
}
