import fs from 'fs'
import path from 'path'

const DATA_FILE = path.resolve(process.cwd(), 'backend/data/threat-events.json')
const MAX_EVENTS = 80
const INTERVAL_MS = 2800

const SOURCES = [
  { city: 'Moscow', country: 'RU', label: 'Moscow, RU', coords: [37.6173, 55.7558], weight: 9 },
  { city: 'Beijing', country: 'CN', label: 'Beijing, CN', coords: [116.4074, 39.9042], weight: 9 },
  { city: 'Shanghai', country: 'CN', label: 'Shanghai, CN', coords: [121.4737, 31.2304], weight: 8 },
  { city: 'Seoul', country: 'KR', label: 'Seoul, KR', coords: [126.9780, 37.5665], weight: 6 },
  { city: 'Mumbai', country: 'IN', label: 'Mumbai, IN', coords: [72.8777, 19.0760], weight: 5 },
  { city: 'Istanbul', country: 'TR', label: 'Istanbul, TR', coords: [28.9784, 41.0082], weight: 4 },
  { city: 'Kyiv', country: 'UA', label: 'Kyiv, UA', coords: [30.5234, 50.4501], weight: 4 },
  { city: 'Mexico City', country: 'MX', label: 'Mexico City, MX', coords: [-99.1332, 19.4326], weight: 3 },
]

const TARGETS = [
  { city: 'Ashburn', country: 'US', label: 'Ashburn, US', coords: [-77.4874, 39.0438], weight: 10 },
  { city: 'Frankfurt', country: 'DE', label: 'Frankfurt, DE', coords: [8.6821, 50.1109], weight: 10 },
  { city: 'London', country: 'GB', label: 'London, GB', coords: [-0.1276, 51.5072], weight: 9 },
  { city: 'Amsterdam', country: 'NL', label: 'Amsterdam, NL', coords: [4.9041, 52.3676], weight: 7 },
  { city: 'Sao Paulo', country: 'BR', label: 'Sao Paulo, BR', coords: [-46.6333, -23.5505], weight: 5 },
  { city: 'Singapore', country: 'SG', label: 'Singapore, SG', coords: [103.8198, 1.3521], weight: 4 },
  { city: 'Tokyo', country: 'JP', label: 'Tokyo, JP', coords: [139.6917, 35.6895], weight: 4 },
]

const ATTACKS = ['SSH Brute Force','RDP Scan','Exploit Attempt','Credential Stuffing','Botnet Callback','Port Scan','Web Exploit Probe','Malware Delivery','API Abuse','Ransomware IOC']
const SEVERITIES = ['low','medium','medium','high','high','critical']

function weightedPick(items) {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let roll = Math.random() * total
  for (const item of items) { roll -= item.weight; if (roll <= 0) return item }
  return items[items.length - 1]
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randomIP() { return `${rand(11,223)}.${rand(1,255)}.${rand(1,255)}.${rand(1,255)}` }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function generateEvent() {
  const source = weightedPick(SOURCES)
  const target = weightedPick(TARGETS)
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    sourceCountry: source.country, targetCountry: target.country,
    sourceCity: source.city, targetCity: target.city,
    sourceLabel: source.label, targetLabel: target.label,
    sourceCoords: source.coords, targetCoords: target.coords,
    sourceIP: randomIP(), attackType: pick(ATTACKS),
    severity: pick(SEVERITIES), timestamp: new Date().toISOString()
  }
}

function readEvents() {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) || []
  } catch { return [] }
}

function tick() {
  const events = readEvents()
  events.unshift(generateEvent())
  fs.writeFileSync(DATA_FILE, JSON.stringify(events.slice(0, MAX_EVENTS), null, 2))
  console.log(`[THREAT SIM] ${events[0].sourceLabel} -> ${events[0].targetLabel} | ${events[0].attackType} | ${events[0].severity}`)
}

console.log('[THREAT SIM] Starting...')
tick()
setInterval(tick, INTERVAL_MS)
