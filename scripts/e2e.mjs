// 16 步主链路自动化自测：node scripts/e2e.mjs [baseUrl]
// 逐步点击真实按钮（data-testid），校验跨角色状态联动、关键数字、控制台无报错，并逐步截图到 screenshots/e2e-XX.png
import { chromium } from 'playwright'
const base = process.argv[2] || process.env.BASE || 'http://localhost:5173/'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1600, height: 960 } })
const errs = []
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
p.on('pageerror', (e) => errs.push(String(e)))
const results = []
let failed = 0
const tid = (t) => p.locator(`[data-testid="${t}"]`).first()
const click = async (t, wait = 500) => { await tid(t).click({ timeout: 8000 }); await p.waitForTimeout(wait) }
const text = async () => (await p.locator('#root').innerText()).replace(/\s+/g, ' ')
const expectText = async (...ws) => { const t = await text(); for (const w of ws) if (!t.includes(w)) throw new Error(`页面缺少「${w}」`) }
const expectHash = async (h) => { const u = p.url(); if (!u.split('#')[1]?.startsWith(h)) throw new Error(`路由应为 ${h}，实际 ${u}`) }
const stepLabel = async () => (await p.locator('.db-step').innerText())
const expectStep = async (n) => { const v = await p.locator('[data-testid=db-step]').getAttribute('data-step'); if (Number(v) !== n) throw new Error(`导览标签应为 Step ${n}/16，实际 ${await stepLabel()}`) }
// 每步结束后导览标签应处的步骤（Step 12 结束仍在 S-01 第 12 步；Step 16 结束停在 S-01 仍应为 16）
const AFTER = { 12: 12, 16: 16, 17: 1 }
const shot = async (n) => {
  const el = (await p.$('.phone')) ?? (await p.$('.pc-wrap'))
  await (el ?? p).screenshot({ path: `screenshots/e2e-${String(n).padStart(2, '0')}.png` })
}
async function step(n, name, fn) {
  const e0 = errs.length
  try {
    await fn()
    await expectStep(AFTER[n] ?? n + 1)
    if (errs.length > e0) throw new Error('控制台报错: ' + errs.slice(e0).join(' | '))
    await shot(n)
    results.push(`✅ Step ${n} ${name} —— ${await stepLabel()}`)
  } catch (e) {
    failed++
    await shot(n).catch(() => {})
    results.push(`❌ Step ${n} ${name}: ${e.message}`)
    if (n < 16) { await p.evaluate(() => 0); await click('guide-open', 400).catch(() => {}); await click(`guide-step-${n + 1}`, 1200).catch(() => {}) }
  }
}

await p.goto(base)
await p.evaluate(() => localStorage.clear())
await p.goto(base + '#/c01')
await p.waitForTimeout(1200)

await step(1, '工作台 → 今日到访林女士', async () => {
  await expectHash('/c01'); await expectText('林女士')
  await click('visit-card', 800); await expectHash('/c02')
})
await step(2, '签到授权 → 预测生成', async () => {
  const agree = tid('agree'); if (await agree.count()) { const on = await agree.getAttribute('class'); if (!on?.includes('on')) await agree.click() }
  await click('sign-in', 300)
  await tid('view-prediction').waitFor({ timeout: 8000 })
  await p.waitForFunction(() => !document.querySelector('[data-testid="view-prediction"]')?.hasAttribute('disabled'), null, { timeout: 10000 })
  await click('view-prediction', 900)
  await expectText('高净值终局改善型', '82%', '1600–1700 万', '300–350㎡')
})
await step(3, '预测结果（含大屏）→ 生成接待准备', async () => {
  await click('big-screen', 1000); await expectHash('/screen/c02'); await expectText('置信度', '82%', '同行 2 人')
  await click('screen-back', 800); await expectHash('/c02')
  await click('gen-prep', 900); await expectHash('/c03')
})
await step(4, '接待准备（首访）→ 查看产品知识', async () => {
  await expectText('首访 2 人', '1600–1700 万')
  await click('view-knowledge', 900); await expectHash('/c10')
})
await step(5, '查信息/学方法/用金句 → 返回准备 → 开始接待', async () => {
  await click('c10-tab-learn', 500); await click('c10-tab-use', 500)
  await click('ai-rewrite', 1600)
  await click('back-prep', 800); await expectHash('/c03')
  await click('start-reception', 1000); await expectHash('/c04')
})
await step(6, '接待中 → 标记卡点 → 切换销售经理', async () => {
  await click('mark-blocker', 900); await expectText('卡点已同步至作战室')
  await click('role-manager', 1200); await expectHash('/m02')
})
await step(7, '作战室：林女士高亮（来自手机端卡点）→ 进入详情', async () => {
  await expectText('反复询问交付条件', '优先核查', '在线')
  await click('live-lin', 1000); await expectHash('/m03')
})
await step(8, '实时详情 → 风险证据 → 发送远程指导', async () => {
  await click('view-evidence', 800); await expectText('待核查')
  await click('locate-quote', 600)
  await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  if (await tid('evidence-drawer').count()) await p.locator('[data-testid="evidence-drawer"] .dw-hd button').click()
  await p.waitForTimeout(400)
  await click('send-guidance', 800); await click('confirm-send', 1000)
  await expectText('指导已发送至张顾问')
  await click('role-consultant', 1300); await expectHash('/c04')
})
await step(9, '手机端弹出指导 → 查看资料 → 结束接待', async () => {
  await tid('guidance-popup').waitFor({ timeout: 5000 })
  await click('guidance-view', 900); await click('doc-send', 800); await click('doc-close', 600).catch(() => {})
  await tid('guide-card').waitFor({ timeout: 3000 })
  await click('end-reception', 1200); await expectHash('/c04/summary')
  await click('send-ai-card', 1200); await expectHash('/c06')
})
await step(10, 'AI 名片 → AI 分身 → 手机号授权 → 轨迹', async () => {
  await click('forward-card', 700)
  await click('chat-ai', 3500); await expectHash('/c06/chat')
  await click('ask-elder', 3000)
  await click('phone-auth', 700); await click('auth-confirm', 1200); await expectHash('/c06/trail')
  await click('go-review', 1200); await expectHash('/c05')
})
await step(11, '智能盘客：采纳 → 意见 → 纪要 → 生成跟进任务', async () => {
  await expectText('诚意度', '76')
  await click('adopt', 900); await expectText('已采纳')
  await click('add-opinion', 600); await p.locator('.sheet textarea, .sheet input').first().fill('下次先确认交付时间口径').catch(() => {}); await click('opinion-submit', 800)
  await click('gen-minutes', 2200)
  await click('gen-tasks', 2600); await expectHash('/s01')
})
await step(12, '客户详情 · 跟进任务（含工作台 +2 林女士）', async () => {
  await click('s01-tab-接待', 400); await expectText('首访 2 人')
  await click('nav-back', 900).catch(async () => { await p.goto(base + '#/c01') })
  if (!p.url().includes('/c01')) await p.goto(base + '#/c01')
  await p.waitForTimeout(800)
  await click('plus2-lin', 1000); await expectHash('/s01')
})
await step(13, '回写反馈 → 重新计算意向 82→85 → 复访准备', async () => {
  if (!(await tid('feedback-submit').count())) await click('write-feedback', 800)
  await click('feedback-submit', 2600)
  await expectText('85', '81')
  await click('view-revisit', 1000); await expectHash('/c03'); await expectText('复访 3 人')
  await click('role-manager', 1300); await expectHash('/m04')
})
await step(14, '接待分析报告：服务分 88、风险已回应、生成改进任务', async () => {
  await expectText('88', '已回应')
  await click('view-quote', 800); await expectText('已回应', '陈经理指导')
  await p.locator('[data-testid="m04-evidence"] .dw-hd button').click(); await p.waitForTimeout(400)
  await click('confirm-analysis', 500)
  await click('gen-improve', 1600); await expectHash('/m05')
})
await step(15, '四象限：张顾问 → 创建辅导计划', async () => {
  await click('adv-zhang', 800); await expectText('重点辅导', '挖需偏弱')
  await click('create-coaching', 600); await click('coaching-confirm', 900)
  await expectText('辅导计划已创建')
  await click('side-驾驶舱', 1000); await expectHash('/m01')
})
await step(16, '驾驶舱：四盘一控 / 本周经营建议 / 意向 A', async () => {
  await expectText('28', '6.2', '四盘一控')
  await click('fp-控风险', 1000); await expectHash('/m01?panel=fourpan'); await expectText('2 条异常承诺待核查', '已创建辅导计划')
  await click('side-驾驶舱', 900)
  await click('advice-detail', 900); await expectText('PDCA', '12')
  await click('back-warroom', 900); await expectHash('/m02')
  await click('side-驾驶舱', 900)
  await click('intent-A', 1000); await expectHash('/s01'); await expectText('意向', '85')
  // 停在 S-01：步序仍为 16，页面名为 S-01 自己的 PRD 页面名
  { const lb = await stepLabel(); const pgc = await p.locator('[data-testid=db-step]').getAttribute('data-page')
    if (pgc !== 'S-01' || !lb.includes('16/16') || !lb.includes('S-01 客户详情与跟进任务') || lb.includes('M-01')) throw new Error(`S-01 标签错误：${lb}`) }
})

// 导览：任意跳步 + 重置
await step(17, '演示导览：跳 Step 8 / Step 14 / 重置', async () => {
  await click('guide-open', 500); await click('guide-step-8', 1200); await expectHash('/m03'); await expectStep(8)
  await click('guide-open', 500); await click('guide-step-14', 1200); await expectHash('/m04'); await expectText('已回应'); await expectStep(14)
  await click('guide-open', 500); await click('guide-step-3', 1200); await expectHash('/c02'); await expectStep(3)
  await click('guide-open', 500); await click('guide-reset', 1200); await expectHash('/c01')
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('ai-sales-demo-v1')).state)
  if (st.feedbackWritten || st.blockerMarked || st.role !== 'consultant' || st.step !== 1) throw new Error('重置未清空状态')
})

console.log(results.join('\n'))
console.log(failed ? `\n失败 ${failed} 项` : '\n全部通过；控制台错误数 ' + errs.length)
await b.close()
process.exit(failed ? 1 : 0)
