// 用法: node scripts/shot.mjs <name> <hashPath> [phone|pc] [flagsJSON] [testid1,testid2...]
import { chromium } from 'playwright'
const [, , name, path, kind = 'phone', flags, clicks] = process.argv
const base = process.env.BASE || 'http://localhost:5173/'
const b = await chromium.launch()
const vp = kind === 'pc' ? { width: 1600, height: 960 } : { width: 900, height: 980 }
const p = await b.newPage({ viewport: vp, deviceScaleFactor: kind === 'pc' ? 1.2 : 1.5 })
const errs = []
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
p.on('pageerror', (e) => errs.push(String(e)))
if (flags) await p.addInitScript((f) => { localStorage.setItem('ai-sales-demo-v1', JSON.stringify({ state: JSON.parse(f), version: 0 })) }, flags)
await p.goto(base + '#' + path)
await p.waitForTimeout(2800)
for (const c of (clicks || '').split(',').filter(Boolean)) { await p.click(`[data-testid="${c}"]`); await p.waitForTimeout(900) }
const el = kind === 'pc' ? await p.$('.pc-wrap') : await p.$('.phone')
await (el ?? p).screenshot({ path: `screenshots/${name}.png` })
console.log('saved', name, errs.length ? 'ERR ' + errs.join(' | ') : 'no-errors')
await b.close()
