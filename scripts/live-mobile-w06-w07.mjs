// 对当前线上 ee7cf9fd 做 390/430 真实视口的 W06/W07 截图。不改页面状态以外的示例点击。
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const base = process.argv[2] || 'https://linyichen12138.github.io/ai-sales-assistant-demo-v2/'
const out = process.argv[3] || 'docs/acceptance-20261120/live-ee7cf9f'
await mkdir(out, { recursive: true })
const browser = await chromium.launch()
const buckets = { pageerror: [], consoleError: [], requestFailed: [], httpError: [] }
function watch(p) {
  p.on('pageerror', (e) => buckets.pageerror.push(String(e)))
  p.on('console', (m) => { if (m.type() === 'error') buckets.consoleError.push(m.text()) })
  p.on('requestfailed', (r) => buckets.requestFailed.push(`${r.failure()?.errorText || 'failed'} ${r.url()}`))
  p.on('response', (r) => { if (r.status() >= 400) buckets.httpError.push(`${r.status()} ${r.url()}`) })
}
const shots = []
async function run(width, height, tag) {
  const page = await browser.newPage({ viewport: { width, height } })
  watch(page)
  const root = base.replace(/\/?$/, '/')
  const url = root + '#/w06'
  await page.goto(url)
  await page.getByTestId('page-w06').waitFor()
  const w06 = (await page.locator('#root').innerText()).replace(/\s+/g, ' ')
  for (const s of ['现场速记', '拜访 · 初访', '低钠配方稳定性检测报告', '批次留样与追溯流程', '新品试产交付周期']) {
    if (!w06.includes(s)) throw new Error(`${tag} W06 缺少「${s}」`)
  }
  const box = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight, side: document.querySelector('.wb-side')?.getBoundingClientRect().width ?? 0 }))
  if (box.w !== width || box.side > 0) throw new Error(`${tag} 视口不符 ${JSON.stringify(box)}`)
  const w06file = `${out}/w06-${width}.png`
  await page.screenshot({ path: w06file })
  shots.push({ file: w06file, url: page.url(), viewport: { width, height }, step: '直接打开 #/w06。当前线上 390/430 会隐藏右栏，W05 的「开始初访」不在可见区域，因此这一步用页面地址进入现场速记。', assert: '现场速记、拜访·初访、三项未答；侧栏宽度为 0' })
  await page.getByTestId('to-w07').click()
  await page.waitForURL((u) => new URL(u).hash.startsWith('#/w07'))
  await page.getByTestId('page-w07').waitFor()
  await page.getByText('完成并返回工作台').waitFor()
  const w07 = (await page.locator('#root').innerText()).replace(/\s+/g, ' ')
  for (const s of ['访前准备 / 访后确认', '周敏', '未确认不会写入', '完成并返回工作台']) {
    if (!w07.includes(s)) throw new Error(`${tag} W07 缺少「${s}」`)
  }
  const w07file = `${out}/w07-${width}.png`
  await page.screenshot({ path: w07file })
  shots.push({ file: w07file, url: page.url(), viewport: { width, height }, step: '在 #/w06 点进入访后确认', assert: '访前/访后标题、周敏、未确认不会写入、完成并返回工作台' })
  await page.close()
}
await run(390, 844, '390')
await run(430, 900, '430')
const fav = await fetch(base.replace(/\/?$/, '/') + 'favicon.svg')
buckets.httpError.push(`${fav.status} ${fav.url}`)
await browser.close()
console.log(JSON.stringify({ shots, diagnostics: buckets }, null, 2))
const bad = buckets.pageerror.length + buckets.requestFailed.length
if (bad) process.exit(1)
