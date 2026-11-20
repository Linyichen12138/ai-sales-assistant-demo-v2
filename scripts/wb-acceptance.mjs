// 主工作台路径 A–F 与 W01–W13 回归。示例数据，不调用外部服务。
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const base = process.argv[2] || process.env.BASE || 'http://127.0.0.1:5173/'
const out = 'docs/acceptance-20261120'
await mkdir(out, { recursive: true })
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
const results = []
async function text() { return (await page.locator('#root').innerText()).replace(/\s+/g, ' ') }
async function shot(name) { await page.screenshot({ path: `${out}/${name}.png` }) }
async function check(id, name, fn) {
  const c0 = buckets.consoleError.length
  const p0 = buckets.pageerror.length
  try {
    await fn()
    const fresh = [...buckets.consoleError.slice(c0), ...buckets.pageerror.slice(p0)]
    if (fresh.length) throw new Error('控制台或 pageerror: ' + fresh.join(' | '))
    results.push({ id, name, ok: true })
    console.log('PASS', id, name)
  } catch (e) {
    results.push({ id, name, ok: false, error: e.message })
    console.error('FAIL', id, name, e.message)
    await shot(`fail-${id}`).catch(() => {})
  }
}
const has = async (...parts) => {
  try {
    await page.waitForFunction((need) => {
      const t = (document.querySelector('#root')?.innerText || '').replace(/\s+/g, ' ')
      return need.every((p) => t.includes(p))
    }, parts, { timeout: 5000 })
  } catch {
    const t = await text()
    throw new Error(`缺少内容。当前 ${page.url()} 。片段：${t.slice(0, 180)}`)
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

await page.goto(base + '#/w01')
await page.evaluate(() => localStorage.clear())
await page.goto(base + '#/w01')
await page.getByTestId('page-w01').waitFor({ timeout: 8000 }).catch(async () => {
  await page.getByText('今天先从哪件事开始？').waitFor({ timeout: 8000 })
})

await check('W01', '工作台默认态可达', async () => {
  await hash('#/w01'); await has('今天先从哪件事开始？', '禾川食品', '拜访 · 复访', '周敏', '刘峰', '马丽')
  await shot('w01-workbench')
})

await check('A1', '侧栏新线索进入 W14', async () => {
  await page.locator('.wb-mod', { hasText: '线索' }).click()
  await page.getByTestId('side-lead-new').click()
  await hash('#/w14'); await has('线索列表', '禾川食品（示例公司）', '展会', '86', '↑8', '华粮餐饮', '鲜源连锁', '北湾烘焙')
  await shot('a-w14-leads')
})

await check('A2', '禾川卡进入 W15', async () => {
  await page.getByTestId('lead-hechuan').click()
  await hash('#/w15'); await has('意向评分 86', '10月28日 78', '10月30日 82', '11月2日 86', '低钠配方', '供货稳定性', '账期')
  await shot('a-w15-detail')
})

await check('A3', '转为商机离开线索', async () => {
  await page.getByTestId('convert-opp').click()
  await hash('#/w02'); await has('已由线索转为商机', '阶段已离开线索', '¥135 万', '300 吨', '低钠配方的稳定性检测报告', '批次留样与追溯流程', '新品试产的交付周期')
  await shot('a-w02-converted')
})

await check('A4', '能力中心进入 W16 再进入运行中', async () => {
  await page.getByRole('button', { name: '能力中心' }).click()
  await hash('#/w10'); await has('能力中心', '报价测算', '查看详情')
  await shot('w10-capability-center')
  await page.getByTestId('skill-quote').click()
  await hash('#/w16'); await has('能力详情 / 报价测算', '查原料价', '比对生产线', '研判毛利与回款周期')
  await lacks('¥343.2 万')
  await shot('a-w16-detail')
  await page.getByTestId('use-in-chat').click()
  await hash('#/w17'); await has('禾川报价测算', '查原料价', '已完成', '比对生产线', '进行中', '研判毛利', '等待中', '能力运行中', '周敏', '300 吨', '计算中')
  await lacks('报价为动作模块', '¥343.2 万')
  await shot('a-w17-running')
})

await check('A5', 'W18 数字与产线互斥', async () => {
  await page.getByTestId('quote-finish').click()
  await hash('#/w18')
  await has('¥135 万', '¥78 万', '¥27.3 万', '¥105.3 万', '¥29.7 万', '22%', '¥48 万', '45 天')
  await lacks('报价为动作模块', '¥343.2 万')
  await page.getByTestId('pick-b').click()
  await has('¥126 万', '¥9 万', '6.67%')
  const bOn = await page.getByTestId('pick-b').getAttribute('class')
  const aOff = await page.getByTestId('pick-a').getAttribute('class')
  if (!bOn?.includes('primary') || aOff?.includes('primary')) throw new Error('产线 A/B 未互斥')
  await page.getByTestId('pick-a').click()
  await has('¥105.3 万', '22%')
  await shot('a-w18-result')
})

await check('A6', '采纳进入禾川 diff', async () => {
  await page.getByTestId('adopt').click()
  await hash('#/w04'); await has('写入前 diff / 签约审批', '禾川食品', '¥120 万', '¥135 万', '拜访 · 复访', '签约 · 正式合同')
  await lacks('¥343.2 万', '华粮餐饮 · 2027 年度采购商机')
  await shot('a-w04-diff')
})

await check('A7', '确认提交进入 W19', async () => {
  await page.getByTestId('w04-commit').click()
  await hash('#/w19')
  await has('禾川食品 · 正式合同', '¥135 万', '王磊', '已通过', '陈静', '审核中', '赵敏', '未开始', '还差')
  const prog = (await page.getByTestId('approval-progress').innerText()).replace(/\d{1,2}月\d{1,2}日/g, '')
  if (/\d+\s*[.、)]\s*\d+/.test(prog)) throw new Error('W19 步骤编号重复: ' + prog)
  await shot('a-w19-progress')
})

await check('A8', '鲜源逾期进入催收并回流任务', async () => {
  await page.locator('.wb-mod', { hasText: '履约与回款' }).click()
  await page.getByTestId('side-pay-remind').click()
  await hash('#/w13'); await has('回款预警', '¥104 万', '¥20 万', '逾期 1 笔', '¥36 万', '¥48 万')
  await shot('w13-payment-warning')
  await page.getByTestId('pay-xianyuan').click()
  await hash('#/w20'); await has('鲜源连锁', '逾期 5 天', '¥36 万', '马丽', '今日 15:00', '确认鲜源付款计划并约定回款日')
  await lacks('禾川食品 · 正式合同')
  await shot('a-w20-plan')
  await page.getByTestId('add-today').click()
  await has('鲜源催款电话')
  await page.getByTestId('sidebar').getByRole('button', { name: '今日任务' }).click()
  await hash('#/w09'); await has('鲜源催款电话')
  await shot('a-w09-task')
  await page.getByTestId('open-task-center').click()
  await hash('#/w24'); await has('任务中心', '鲜源催款电话')
  await shot('a-w24-collect')
})

await check('B1', '测算失败进入异常三块', async () => {
  await page.getByTestId('reset-demo').click()
  await page.goto(base + '#/w17')
  await page.getByTestId('quote-fail').click()
  await hash('#/w22')
  await has('测算失败转人工', '外部系统调不通', '改用本地价表', '通知运维', '你是要重算禾川报价，还是只要毛利提醒')
  await lacks('报价为动作模块')
  await shot('b-w22-exception')
})

await check('B2', '转人工进入任务中心待确认', async () => {
  await page.getByTestId('escalate').click()
  await hash('#/w24'); await has('任务中心', '报价测算转人工跟进', '待确认')
  await shot('b-w24-manual')
})

await check('B3', '为什么调用与换能力', async () => {
  await page.goto(base + '#/w17')
  await page.getByTestId('why-call').click()
  await hash('#/w23'); await has('为什么调用这个能力', '命中规则', '模型判断', '0.86', '禾川')
  await lacks('报价为动作模块')
  await shot('b-w23-why')
  await page.getByTestId('switch-skill').click()
  await hash('#/w10'); await has('能力中心')
})

await check('B4', '本地价表重试仍是禾川', async () => {
  await page.goto(base + '#/w22')
  await page.getByTestId('use-local').click()
  await hash('#/w17'); await has('已改用本地价表', '禾川报价测算', '300 吨')
  await lacks('¥343.2 万')
  await shot('b-w17-retry')
})

await check('B5', '回答反问后继续', async () => {
  await page.goto(base + '#/w22')
  await page.getByTestId('w22-input').fill('重算禾川报价')
  await page.getByTestId('w22-send').click()
  await has('已收到「重算禾川报价」', '未调用外部服务')
})

await check('C1', '编辑未确认不写入', async () => {
  await page.getByTestId('reset-demo').click()
  await page.goto(base + '#/w03')
  const before = await page.getByTestId('w03-committed-next').innerText()
  await page.getByTestId('w03-edit').click()
  await page.getByTestId('field-w03.next').fill('临时草稿不应写入')
  const mid = await page.getByTestId('w03-committed-next').innerText()
  if (mid !== before || mid.includes('临时草稿')) throw new Error('未确认已写入纪要')
  await has('未经确认不会写入')
  await shot('c-w03-edit-uncommitted')
})

await check('C2', '驳回必填理由且不写入', async () => {
  await page.getByTestId('reset-demo').click()
  await page.goto(base + '#/w03')
  await page.getByTestId('w03-reject').click()
  const btn = page.getByTestId('reject-submit-w03')
  if (await btn.isEnabled()) throw new Error('未填理由仍可提交驳回')
  await page.getByTestId('reason-w03-card').fill('采购窗口仍需再确认（示例）')
  await btn.click()
  await has('已驳回', '未写入')
  const next = await page.getByTestId('w03-committed-next').innerText()
  if (next.includes('采购窗口仍需再确认')) throw new Error('驳回理由写进了纪要')
  await shot('c-w03-rejected')
})

await check('C3', '确认写入后纪要变化', async () => {
  await page.getByTestId('reset-demo').click()
  await page.goto(base + '#/w03')
  await page.getByTestId('w03-edit').click()
  await page.getByTestId('field-w03.next').fill('确认后的下一步（示例）')
  await page.getByTestId('w03-open-diff').click()
  await page.getByTestId('w03-commit').click()
  await has('已写入拜访纪要')
  const next = await page.getByTestId('w03-committed-next').innerText()
  if (!next.includes('确认后的下一步')) throw new Error('确认后纪要未更新')
  await shot('c-w03-committed')
})

await check('C4', '三态展开依据与部门', async () => {
  await page.goto(base + '#/w09')
  await page.getByTestId('w09-open-w09-window').click()
  await hash('#/w21'); await has('推断', '事实', '待审批', '依据：展会纪要与邮件确认（示例）', '需确认部门：技术部（示例）')
  await page.getByTestId('w21-toggle-infer').click()
  await has('依据：复访纪要里刘峰的技术评估仍有 3 项未答（示例）', '不确定性：检测报告、留样追溯和试产周期是否都要补发，尚未与刘峰确认（示例）')
  await lacks('依据：展会纪要与邮件确认（示例）')
  await page.getByTestId('w21-toggle-approve').click()
  await has('依据：禾川报价测算口径为 ¥135 万，尚未提交组长审批（示例）', '不确定性：王磊确认前，正式合同不会写入（示例）')
  await lacks('复访纪要里刘峰')
  await shot('c-w21-states')
})

await check('C5', '取消编辑并跨页丢弃未确认草稿', async () => {
  await page.getByTestId('reset-demo').click()
  await page.goto(base + '#/w03')
  const before = await page.getByTestId('w03-committed-next').innerText()
  await page.getByTestId('w03-edit').click()
  await page.getByTestId('field-w03.next').fill('临时草稿应被取消')
  await page.getByTestId('w03-cancel').click()
  if (await page.getByTestId('edit-form-w03').count()) throw new Error('取消后仍在编辑')
  const after = await page.getByTestId('w03-committed-next').innerText()
  if (after !== before || after.includes('临时草稿应被取消')) throw new Error('取消写入了纪要')
  await page.getByTestId('w03-edit').click()
  const again = await page.getByTestId('field-w03.next').inputValue()
  if (again !== before) throw new Error('重新编辑仍残留草稿: ' + again)
  await page.getByTestId('field-w03.next').fill('跨页草稿应丢弃')
  await page.goto(base + '#/w01')
  await page.goto(base + '#/w03')
  if (await page.getByTestId('edit-form-w03').count()) throw new Error('跨页返回仍停留编辑')
  if ((await page.getByTestId('w03-committed-next').innerText()).includes('跨页草稿应丢弃')) throw new Error('跨页后只读内容被改')
  await page.getByTestId('w03-edit').click()
  if ((await page.getByTestId('field-w03.next').inputValue()).includes('跨页草稿应丢弃')) throw new Error('跨页后草稿残留')
  await page.getByTestId('w03-cancel').click()
  await page.goto(base + '#/w12')
  const note = await page.getByTestId('w12-committed-note').innerText()
  await page.getByTestId('edit-w12-quote').click()
  await page.getByTestId('field-w12.note').fill('华粮临时草稿')
  await page.getByTestId('cancel-w12-quote').click()
  if (await page.getByTestId('edit-form-w12-quote').count()) throw new Error('华粮取消后仍在编辑')
  const note2 = await page.getByTestId('w12-committed-note').innerText()
  if (note2 !== note || note2.includes('华粮临时草稿')) throw new Error('华粮取消写入了说明')
  await page.getByTestId('edit-w12-quote').click()
  if ((await page.getByTestId('field-w12.note').inputValue()).includes('华粮临时草稿')) throw new Error('华粮重新编辑残留')
  await page.getByTestId('field-w12.note').fill('华粮跨页草稿')
  await page.goto(base + '#/w01')
  await page.goto(base + '#/w12')
  if (await page.getByTestId('edit-form-w12-quote').count()) throw new Error('华粮跨页仍在编辑')
  const note3 = await page.getByTestId('w12-committed-note').innerText()
  if (note3.includes('华粮跨页草稿')) throw new Error('华粮跨页写入了说明')
  await page.getByTestId('edit-w12-quote').click()
  if ((await page.getByTestId('field-w12.note').inputValue()).includes('华粮跨页草稿')) throw new Error('华粮跨页草稿残留')
})

await check('D1', '开始初访进入现场速记', async () => {
  await page.goto(base + '#/w05')
  await has('拜访 · 初访', '周敏', '开始初访')
  await shot('w05-visit-prep')
  await page.getByTestId('start-visit').filter({ visible: true }).click()
  await hash('#/w06')
  await has('现场速记', '低钠配方稳定性检测报告', '批次留样与追溯流程', '新品试产交付周期')
  await page.getByTestId('field-note').fill('现场：客户要看检测报告（示例）')
  await page.getByTestId('save-note').click()
  await has('草稿已保存')
  await page.getByTestId('hold-sensitive').click()
  await has('敏感回答已转人工确认：价格承诺（示例）', '不写入')
  await shot('d-w06-notes')
  await page.getByTestId('to-w07').click()
  await hash('#/w07'); await has('访前准备 / 访后确认', '周敏', '未确认不会写入')
  await page.getByTestId('tab-before').click(); await has('访前重点')
  await page.getByTestId('tab-after').click()
  await shot('d-w07-review')
  await page.getByTestId('finish-visit').click()
  await hash('#/w01'); await has('今天先从哪件事开始？', '禾川食品')
})

await check('D2', '窄屏从 W05 开始初访走到 W07 再返回', async () => {
  await mkdir(`${out}/pr2-static`, { recursive: true })
  const stamp = async (p) => p.evaluate(() => {
    document.getElementById('pr2-stamp')?.remove()
    const bar = document.createElement('div')
    bar.id = 'pr2-stamp'
    bar.textContent = 'PR2 候选静态产物 · 不是当前线上版本'
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#B75A3B;color:#fff;font:600 12px/1.3 sans-serif;padding:6px 8px;text-align:center'
    document.body.appendChild(bar)
  })
  for (const [width, height] of [[390, 844], [430, 900]]) {
    const mobile = await browser.newPage({ viewport: { width, height } })
    watch(mobile)
    const mark = `${width}窄屏现场草稿不写入`
    await mobile.goto(base + '#/w05')
    await mobile.getByTestId('page-w05').waitFor()
    const start = mobile.getByTestId('start-visit').filter({ visible: true })
    if (await start.count() !== 1) throw new Error(`${width} 可见的开始初访不是 1 个`)
    const side = await mobile.evaluate(() => document.querySelector('.wb-side')?.getBoundingClientRect().width ?? 0)
    if (side > 0) throw new Error(`${width} 侧栏仍占宽`)
    await stamp(mobile)
    await mobile.screenshot({ path: `${out}/pr2-static/w05-${width}.png` })
    await mobile.locator('#pr2-stamp').evaluate((el) => el.remove())
    await start.click()
    await mobile.waitForURL((u) => new URL(u).hash.startsWith('#/w06'))
    await mobile.getByTestId('page-w06').waitFor()
    const w06 = (await mobile.locator('#root').innerText()).replace(/\s+/g, ' ')
    for (const s of ['现场速记', '拜访 · 初访', '低钠配方稳定性检测报告', '批次留样与追溯流程', '新品试产交付周期']) {
      if (!w06.includes(s)) throw new Error(`${width} W06 缺少「${s}」`)
    }
    await mobile.getByTestId('field-note').fill(mark)
    await mobile.getByTestId('save-note').click()
    await mobile.getByText('草稿已保存').waitFor()
    await stamp(mobile)
    await mobile.screenshot({ path: `${out}/pr2-static/w06-${width}.png` })
    await mobile.locator('#pr2-stamp').evaluate((el) => el.remove())
    await mobile.getByTestId('to-w07').click()
    await mobile.waitForURL((u) => new URL(u).hash.startsWith('#/w07'))
    await mobile.getByTestId('page-w07').waitFor()
    const w07 = (await mobile.locator('#root').innerText()).replace(/\s+/g, ' ')
    for (const s of ['访前准备 / 访后确认', '周敏', '未经确认不会写入', '完成并返回工作台']) {
      if (!w07.includes(s)) throw new Error(`${width} W07 缺少「${s}」`)
    }
    if (w07.includes('已写入拜访纪要')) throw new Error(`${width} 未确认却显示已写入`)
    await stamp(mobile)
    await mobile.screenshot({ path: `${out}/pr2-static/w07-${width}.png` })
    await mobile.locator('#pr2-stamp').evaluate((el) => el.remove())
    await mobile.getByTestId('finish-visit').click()
    await mobile.waitForURL((u) => new URL(u).hash.startsWith('#/w01'))
    await mobile.getByText('今天先从哪件事开始？').waitFor()
    await mobile.goto(base + '#/w03')
    await mobile.getByTestId('w03-committed-next').waitFor()
    const committed = await mobile.getByTestId('w03-committed-next').innerText()
    if (committed.includes(mark)) throw new Error(`${width} 现场草稿写入了纪要`)
    if (committed !== '跟进采购窗口并确认需求数量（示例）') throw new Error(`${width} 已确认下一步被改成：${committed}`)
    await mobile.evaluate((msg) => {
      const bar = document.createElement('div')
      bar.id = 'pr2-stamp'
      bar.textContent = msg
      bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#1d3b2e;color:#fff;font:600 12px/1.3 sans-serif;padding:6px 8px;text-align:center'
      document.body.appendChild(bar)
    }, `PR2 候选静态产物 · 不是当前线上版本 · 断言通过：已确认下一步仍是原文，不含「${mark}」`)
    await mobile.screenshot({ path: `${out}/pr2-static/w03-after-${width}.png` })
    await mobile.close()
  }
})

await check('E1', '任务中心看到催收与转人工并可回三态', async () => {
  await page.getByTestId('reset-demo').click()
  await page.goto(base + '#/w20')
  await page.getByTestId('add-today').click()
  await page.goto(base + '#/w22')
  await page.getByTestId('escalate').click()
  await hash('#/w24')
  await has('任务中心', '进行中', '待确认', '已完成', '鲜源催款电话', '报价测算转人工跟进')
  await page.getByTestId('task-t-manual').locator('.wb-textbtn').click()
  await hash('#/w21'); await has('依据：展会纪要与邮件确认（示例）')
  await shot('e-w21-from-task')
})

await check('F1', '华粮报价隔离', async () => {
  await page.goto(base + '#/w11')
  await has('禾川食品（示例公司）')
  const customer = await page.getByTestId('w11-customer').innerText()
  if (!customer.includes('禾川')) throw new Error('日程默认右栏不是禾川: ' + customer)
  if (customer.includes('华粮')) throw new Error('默认右栏串到华粮')
  await shot('f-w11-hechuan')
  await page.getByTestId('cal-hualiang').click()
  const hl = await page.getByTestId('w11-customer').innerText()
  if (!hl.includes('华粮')) throw new Error('选中华粮后右栏未切换')
  await shot('f-w11-hualiang')
  await page.getByTestId('w11-next-quote').click()
  await hash('#/w12')
  await has('¥343.2 万', '18%', '商机', '报价是动作，不改变商机阶段')
  await lacks('¥105.3 万', '禾川食品 · 正式合同')
  await page.getByTestId('hualiang-approve').click()
  await hash('#/w12')
  await has('华粮餐饮签约审批', '¥343.2 万', '阶段仍为商机')
  await lacks('写入前 diff / 签约审批')
  await shot('f-w12-hualiang')
})

await check('F2', '禾川报价单不复用华粮金额', async () => {
  await page.goto(base + '#/w18')
  await page.getByTestId('open-hechuan-sheet').click()
  await has('禾川报价单', '¥135 万', '¥78 万', '¥27.3 万', '¥105.3 万', '45 天')
  await lacks('¥343.2 万')
  await shot('f-w12-hechuan-sheet')
  await page.getByTestId('side-quote-sheet').click()
  await has('¥343.2 万')
  await lacks('¥105.3 万')
})

await check('F3', '华粮编辑未确认不改说明', async () => {
  const before = await page.getByTestId('w12-committed-note').innerText()
  await page.getByTestId('edit-w12-quote').click()
  await page.getByTestId('field-w12.note').fill('未确认的华粮说明')
  const mid = await page.getByTestId('w12-committed-note').innerText()
  if (mid !== before || mid.includes('未确认的华粮说明')) throw new Error('华粮说明未确认已写入')
})

const routes = ['/w01', '/w02', '/w03', '/w04', '/w05', '/w09', '/w10', '/w11', '/w12', '/w13']
await check('N1', '今日任务角标随新增、完成和重置变化', async () => {
  await page.getByTestId('reset-demo').click()
  await hash('#/w01')
  const read = async () => (await page.getByTestId('today-badge').innerText()).trim()
  if (await read() !== '5') throw new Error('重置后角标应为 5，实际 ' + await read())
  await page.goto(base + '#/w20')
  await page.getByTestId('add-today').click()
  if (await read() !== '6') throw new Error('加入任务后角标应为 6，实际 ' + await read())
  await page.goto(base + '#/w24')
  await page.getByTestId('complete-t-window').click()
  if (await read() !== '5') throw new Error('完成后角标应为 5，实际 ' + await read())
  await has('已完成', '跟进周敏确认采购窗口')
  await page.getByTestId('reset-demo').click()
  await hash('#/w01')
  if (await read() !== '5') throw new Error('再次重置后角标应为 5，实际 ' + await read())
})

await check('R1', 'W01–W13 仍可达且无错误标签', async () => {
  for (const r of routes) {
    await page.goto(base + '#' + r)
    await page.waitForTimeout(150)
    const t = await text()
    if (t.includes('报价为动作模块')) throw new Error(r + ' 出现错误标签')
    if (!t.trim()) throw new Error(r + ' 空白')
  }
  await page.goto(base + '#/w08')
  await hash('#/w01')
  await shot('r-w01-after-routes')
})

const failed = results.filter((r) => !r.ok)
const diagnostics = {
  pageerror: buckets.pageerror,
  consoleError: buckets.consoleError,
  requestFailed: buckets.requestFailed,
  httpError: buckets.httpError,
}
console.log(JSON.stringify({ passed: results.length - failed.length, failed: failed.length, results, diagnostics }, null, 2))
await browser.close()
process.exit(failed.length || diagnostics.pageerror.length || diagnostics.consoleError.length || diagnostics.requestFailed.length || diagnostics.httpError.length ? 1 : 0)
