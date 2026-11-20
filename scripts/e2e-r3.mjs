// r3 主路径与回归。示例数据，不调用外部服务。
import { chromium } from 'playwright'
import { execSync } from 'node:child_process'
import { mkdir } from 'node:fs/promises'

const base = process.argv[2] || process.env.BASE || 'http://127.0.0.1:5173/'
const out = '/tmp/r3-shots'
await mkdir(out, { recursive: true })
const dirty = execSync('git diff --name-only -- docs/v2-skeleton release/v1').toString().trim()
if (dirty) {
  console.error('FAIL skeleton-or-release', dirty)
  process.exit(1)
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const buckets = { pageerror: [], consoleError: [], requestFailed: [], httpError: [] }
function watch(p) {
  p.on('pageerror', (e) => buckets.pageerror.push(String(e)))
  p.on('console', (m) => { if (m.type() === 'error') buckets.consoleError.push(m.text()) })
  p.on('requestfailed', (r) => buckets.requestFailed.push(`${r.failure()?.errorText || 'failed'} ${r.url()}`))
  p.on('response', (r) => { if (r.status() >= 400) buckets.httpError.push(`${r.status()} ${r.url()}`) })
}
watch(page)
const errs = buckets.consoleError
const results = []
const text = async () => (await page.locator('#root').innerText()).replace(/\s+/g, ' ')
const has = async (...parts) => {
  try {
    await page.waitForFunction((need) => {
      const t = (document.querySelector('#root')?.innerText || '').replace(/\s+/g, ' ')
      return need.every((p) => t.includes(p))
    }, parts, { timeout: 5000 })
  } catch {
    const t = await text()
    throw new Error(`缺少内容 @ ${page.url()} 。片段：${t.slice(0, 220)}`)
  }
}
const lacks = async (...parts) => {
  const t = await text()
  for (const p of parts) if (t.includes(p)) throw new Error(`不应出现「${p}」`)
}
const hash = async (h) => {
  try { await page.waitForURL((u) => new URL(u).hash.startsWith(h), { timeout: 5000 }) }
  catch { throw new Error(`路由应为 ${h}，实际 ${page.url()}`) }
}
async function check(id, name, fn) {
  const e0 = errs.length
  try {
    await fn()
    if (errs.length > e0) throw new Error('控制台报错: ' + errs.slice(e0).join(' | '))
    results.push({ id, ok: true, name })
    console.log('PASS', id, name)
  } catch (e) {
    results.push({ id, ok: false, name, error: e.message })
    console.error('FAIL', id, name, e.message)
    await page.screenshot({ path: `${out}/fail-${id}.png` }).catch(() => {})
  }
}

await page.goto(base + '#/w01')
await page.evaluate(() => localStorage.clear())
await page.goto(base + '#/w14')
await page.getByTestId('page-w14').waitFor()

await check('P1', '线索列表到详情再转商机且不重复创建', async () => {
  await has('线索列表', '共 4 条', '禾川食品（示例公司）', '周敏（示例）', '展会', '86', '↑8')
  await page.getByTestId('lead-hechuan').click()
  await hash('#/w15')
  await has('意向评分', '86', '10月28日 78', '10月30日 82', '11月2日 86', '低钠配方', '供货稳定性', '账期')
  await page.getByTestId('back-leads').click()
  await hash('#/w14')
  await page.getByTestId('lead-hechuan').click()
  await page.getByTestId('convert-opp').click()
  await hash('#/w02')
  await has('已由线索转为商机', '周敏', '¥135 万', '300 吨')
  await page.goto(base + '#/w15')
  await page.getByTestId('convert-opp').click()
  await has('商机已存在，未重复创建')
})

await check('P2', '报价步骤、原因、失败重试与转人工只建一次', async () => {
  await page.getByTestId('reset-demo').click()
  await page.goto(base + '#/w10')
  await page.getByTestId('skill-quote').click()
  await hash('#/w16')
  await has('能力详情 / 报价测算', '查原料价', '研判毛利与回款周期', '在对话中使用')
  await page.getByTestId('use-in-chat').click()
  await hash('#/w17')
  await has('查原料价', '已完成', '比对生产线', '进行中', '研判毛利', '等待中', '能力运行中', '计算中', '周敏')
  await lacks('报价为动作模块')
  await page.getByTestId('quote-advance').click()
  await has('比对生产线', '已完成', '研判毛利', '进行中')
  await page.getByTestId('why-call').click()
  await hash('#/w23')
  await has('为什么调用这个能力', '命中规则', '模型判断', '0.86', '禾川')
  await lacks('报价为动作模块')
  await page.getByTestId('switch-skill').click()
  await hash('#/w10')
  await page.goto(base + '#/w17')
  await page.getByTestId('quote-fail').click()
  await hash('#/w22')
  await has('测算失败转人工', '外部系统调不通', '改用本地价表', '通知运维', '你是要重算禾川报价，还是只要毛利提醒')
  await page.getByTestId('w22-input').fill('只要毛利提醒')
  await page.getByTestId('w22-send').click()
  await has('已收到「只要毛利提醒」', '未调用外部服务')
  await page.getByTestId('use-local').click()
  await hash('#/w17')
  await has('已改用本地价表', '禾川报价测算')
  await page.getByTestId('quote-fail').click()
  await page.getByTestId('escalate').click()
  await hash('#/w24')
  await page.goto(base + '#/w22')
  await page.getByTestId('escalate').click()
  await hash('#/w24')
  await has('未重复创建')
  await page.getByTestId('task-t-manual').waitFor()
  if (await page.getByTestId('task-t-manual').count() !== 1) throw new Error('转人工任务重复')
})

await check('P3', '产线互斥、采纳幂等、上下文与刷新', async () => {
  await page.getByTestId('reset-demo').click()
  await page.goto(base + '#/w17')
  await page.getByTestId('quote-finish').click()
  await hash('#/w18')
  const read = async (id) => (await page.getByTestId(id).innerText()).replace(/\s+/g, ' ')
  const math = async () => page.getByTestId('hechuan-result').evaluate((el) => ({
    line: el.getAttribute('data-line'),
    cost: el.getAttribute('data-cost'),
    profit: el.getAttribute('data-profit'),
    margin: el.getAttribute('data-margin'),
  }))
  let m = await math()
  if (m.line !== 'A' || m.cost !== '105.3' || m.profit !== '29.7' || m.margin !== '22%') throw new Error('产线 A 计算不对 ' + JSON.stringify(m))
  await has('¥135 万', '¥78 万', '¥27.3 万', '¥105.3 万', '¥29.7 万', '22%', '¥48 万', '45 天')
  await lacks('75.3', '153.3', '38.7', '¥126 万', '6.67%', '报价为动作模块')
  if (!(await read('ctx-line')).includes('产线 A') || !(await read('ctx-cost')).includes('¥105.3 万') || !(await read('ctx-margin')).includes('22%')) throw new Error('右栏未反映产线 A')
  await page.getByTestId('pick-b').click()
  m = await math()
  if (m.line !== 'B' || m.cost !== '126' || m.profit !== '9' || m.margin !== '6.67%') throw new Error('产线 B 计算不对 ' + JSON.stringify(m))
  const bOn = await page.getByTestId('pick-b').getAttribute('class')
  const aOff = await page.getByTestId('pick-a').getAttribute('class')
  if (!bOn?.includes('primary') || aOff?.includes('primary')) throw new Error('A/B 未互斥')
  await has('¥126 万', '¥9 万', '6.67%', '¥48 万', '¥27.3 万')
  await lacks('¥105.3 万', '¥29.7 万', '22%', '75.3')
  if (!(await read('ctx-cost')).includes('¥126 万') || !(await read('ctx-profit')).includes('¥9 万')) throw new Error('右栏未改到产线 B')
  await page.reload()
  await page.getByTestId('page-w18').waitFor()
  m = await math()
  if (m.line !== 'B' || m.cost !== '126') throw new Error('刷新后产线丢失 ' + JSON.stringify(m))
  await page.getByTestId('adopt').click()
  await hash('#/w04')
  await has('¥135 万', '禾川食品')
  await page.goto(base + '#/w18')
  await page.getByTestId('adopt').click()
  await has('未重复写入')
  await page.goto(base + '#/w04')
  await page.getByTestId('w04-commit').click()
  await hash('#/w19')
  await page.goto(base + '#/w04')
  await page.getByTestId('w04-commit').click()
  await has('未重复提交')
})

await check('P4', '签约推进到回款，任务筛选归档幂等', async () => {
  await page.getByTestId('reset-demo').click()
  await page.goto(base + '#/w19')
  await has('¥135 万', '王磊', '已通过', '陈静', '审核中', '赵敏', '未开始', '还差')
  await page.getByTestId('sign-advance').click()
  await has('赵敏', '盖章中')
  await lacks('未开始')
  await page.getByTestId('sign-advance').click()
  await page.getByTestId('sign-to-pay').waitFor()
  await page.getByTestId('sign-to-pay').click()
  await hash('#/w20')
  await has('鲜源连锁', '逾期 5 天', '¥36 万', '马丽', '今日 15:00', '确认鲜源付款计划并约定回款日')
  await page.getByTestId('add-today').click()
  await page.getByTestId('add-today').click()
  await has('未重复创建', '鲜源催款电话')
  if (await page.getByTestId('task-t-xianyuan').count() !== 0) throw new Error('催收任务不该出现在回款页')
  await page.goto(base + '#/w24')
  if (await page.getByTestId('task-t-xianyuan').count() !== 1) throw new Error('催收任务未进任务中心或重复')
  await page.getByTestId('filter-待确认').click()
  await page.getByTestId('group-pending').waitFor()
  if (await page.getByTestId('group-doing').count()) throw new Error('筛选后仍显示进行中')
  await page.getByTestId('filter-全部').click()
  await page.getByTestId('archive-t-hualiang-done').click()
  await page.getByTestId('filter-已归档').click()
  await has('华粮报价测算采纳')
  if (await page.getByTestId('group-done').count()) throw new Error('归档筛选仍显示已完成分组')
  await page.reload()
  await has('华粮报价测算采纳')
  const badge = (await page.getByTestId('today-badge').innerText()).trim()
  if (badge !== '6') throw new Error('加入催收后角标应为 6，实际 ' + badge)
})

await check('P5', '确认驳回、r2 口径与窄屏', async () => {
  await page.getByTestId('reset-demo').click()
  await page.goto(base + '#/w03')
  await has('2026-11-03', '未经确认不会写入')
  await lacks('2025-01-15')
  await page.getByTestId('w03-reject').click()
  const btn = page.getByTestId('reject-submit-w03')
  if (await btn.isEnabled()) throw new Error('空驳回仍可提交')
  await page.getByTestId('reason-w03-card').fill('窗口未定（示例）')
  await btn.click()
  await has('已驳回', '未写入')
  await page.goto(base + '#/w09')
  await has('待王磊审批（示例）')
  await page.goto(base + '#/w11')
  const hours = await page.locator('.wb-cal-hours').innerText()
  if ((hours.match(/11:00/g) || []).length !== 1) throw new Error('11:00 时间轴不唯一')
  await page.getByTestId('side-visit-sample').click()
  await has('样品安排')
  await page.goto(base + '#/w12')
  const ava = await page.locator('.wb-msg.me .wb-ava.user').innerText()
  if (ava.trim() !== '张') throw new Error('W12 用户头像不是张')
  await page.goto(base + '#/w04')
  if (await page.locator('.wb-ava.ai svg').count() < 1) throw new Error('W04 缺少 A 头像')
  await page.goto(base + '#/w01')
  await has('今天先从哪件事开始？', '拜访 · 复访')
  const narrow = await browser.newPage({ viewport: { width: 800, height: 900 } })
  watch(narrow)
  await narrow.goto(base + '#/w14')
  await narrow.getByTestId('page-w14').waitFor()
  const t = await narrow.locator('#root').innerText()
  if (!t.includes('线索列表') || !t.includes('禾川食品')) throw new Error('窄屏缺少线索列表')
  await narrow.screenshot({ path: `${out}/narrow-w14.png` })
  await narrow.setViewportSize({ width: 390, height: 844 })
  await narrow.goto(base + '#/w06')
  await narrow.getByTestId('page-w06').waitFor()
  const side = await narrow.evaluate(() => document.querySelector('.wb-side')?.getBoundingClientRect().width ?? 0)
  if (side > 0) throw new Error('390px 侧栏仍占宽')
  await narrow.close()
})

const shots = ['w14', 'w15', 'w16', 'w17', 'w18', 'w19', 'w20', 'w21', 'w22', 'w23', 'w24']
await page.setViewportSize({ width: 1920, height: 1080 })
await page.getByTestId('reset-demo').click()
for (const id of shots) {
  await page.goto(base + '#/' + id)
  await page.waitForTimeout(200)
  await page.screenshot({ path: `${out}/${id}.png` })
}
await page.getByTestId('pick-b').count()
await page.goto(base + '#/w18')
await page.getByTestId('pick-b').click()
await page.screenshot({ path: `${out}/w18-line-b.png` })

const failed = results.filter((r) => !r.ok)
console.log(JSON.stringify({ passed: results.length - failed.length, failed: failed.length, results, diagnostics: buckets }, null, 2))
await browser.close()
const bad = buckets.pageerror.length + buckets.consoleError.length + buckets.requestFailed.length + buckets.httpError.length
process.exit(failed.length || bad ? 1 : 0)
