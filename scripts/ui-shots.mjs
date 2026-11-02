// 定稿对照截图：node scripts/ui-shots.mjs [UI-01,UI-02...]  → screenshots/impl/UI-xx.png（手机 750×1624 / PC 1920×1080）
import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:5173/'
const only = (process.argv[2] || '').split(',').filter(Boolean)
// [id, 导览步骤, 路由(可空=该步默认), 点击序列, 截图前等待ms]
const SPECS = [
  ['UI-01', 1], ['UI-02', 2], ['UI-03', 2, null, ['sign-in'], 700], ['UI-04', 3], ['UI-05', 3, '/screen/c02'],
  ['UI-06', 4], ['UI-07', 5], ['UI-08', 5, null, ['c10-tab-learn']], ['UI-09', 5, null, ['c10-tab-use']],
  ['UI-10', 6, null, ['mark-blocker'], 2600], ['UI-11', 6, null, ['mark-blocker', 'phone-role-pill'], 2600],
  ['UI-12', 7], ['UI-13', 8], ['UI-14', 8, null, ['send-guidance']], ['UI-15', 8, null, ['view-evidence']],
  ['UI-16', 8, null, ['send-guidance', 'confirm-send']],
  ['UI-17', 9], ['UI-18', 9, null, ['guidance-view']], ['UI-19', 9, '/c04/summary'],
  ['UI-20', 10], ['UI-21', 10, '/c06/chat', ['ask-elder'], 3200], ['UI-22', 11, '/c06/trail'],
  ['UI-23', 11], ['UI-24', 12, '/c05'], ['UI-25', 12], ['UI-26', 12, '/c01'],
  ['UI-27', 13], ['UI-28', 13, null, ['feedback-submit'], 2800], ['UI-29', 13, null, ['feedback-submit', 'view-revisit'], 1200],
  ['UI-30', 14], ['UI-31', 14, null, ['view-quote']], ['UI-32', 15], ['UI-33', 15, null, ['adv-zhang', 'create-coaching']],
  ['UI-34', 16], ['UI-35', 16, '/m01?panel=fourpan'], ['UI-36', 16, '/m01?panel=advice'], ['UI-37', 16, '/s01'],
]
const b = await chromium.launch()
const errs = []
for (const [id, step, path, clicks = [], wait = 1200] of SPECS) {
  if (only.length && !only.includes(id)) continue
  const pc = ['UI-05', 'UI-12', 'UI-13', 'UI-14', 'UI-15', 'UI-16'].includes(id) || Number(id.slice(3)) >= 30
  const p = await b.newPage({ viewport: pc ? { width: 1944, height: 1156 } : { width: 900, height: 1000 }, deviceScaleFactor: pc ? 1 : 2 })
  p.on('console', (m) => m.type() === 'error' && errs.push(id + ' ' + m.text()))
  p.on('pageerror', (e) => errs.push(id + ' ' + e))
  await p.goto(base + '#/c01'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(600)
  await p.click('[data-testid=guide-open]'); await p.waitForTimeout(300)
  await p.click(`[data-testid=guide-step-${step}]`); await p.waitForTimeout(900)
  if (path) { await p.evaluate((h) => { location.hash = h }, path); await p.waitForTimeout(900) }
  if (id === 'UI-02' || id === 'UI-03') { const a = p.locator('[data-testid=agree]'); if (await a.count() && !(await a.getAttribute('class'))?.includes('on')) await a.click() }
  if (id === 'UI-28' || id === 'UI-29') { if (!(await p.locator('[data-testid=feedback-submit]').count())) { await p.click('[data-testid=write-feedback]'); await p.waitForTimeout(700) } }
  for (const c of clicks) { await p.click(`[data-testid="${c}"]`); await p.waitForTimeout(900) }
  await p.waitForTimeout(wait)
  if (id === 'UI-24') await p.evaluate(() => { // 定稿 UI-24 为下半屏：团队补充判断 / 盘客纪要
    const b = document.querySelector('.ph-body'); const t = [...document.querySelectorAll('.c5-hd')].find((x) => x.textContent === '团队补充判断')
    if (b && t) b.scrollTop += t.closest('.card').getBoundingClientRect().top - b.getBoundingClientRect().top - 14
  })
  if (id === 'UI-24') await p.waitForTimeout(300)
  const el = pc ? await p.$('.pc-wrap') : await p.$('#ph-screen')
  await el.screenshot({ path: `screenshots/impl/${id}.png` })
  await p.close()
  console.log('shot', id)
}
console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no console errors')
await b.close()
