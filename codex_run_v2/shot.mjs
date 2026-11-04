import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const p = await b.newPage({ viewport: { width: 1440, height: 810 } })
const url = 'file://' + process.cwd() + '/dist/index.html'
for (const w of ['w01','w02','w03','w04','w05','w09','w10','w11','w12','w13']) {
  await p.goto(url + '#/' + w); await p.waitForTimeout(300)
  await p.screenshot({ path: `codex_run_v2/selfcheck/${w.toUpperCase()}.png` })
}
// interaction: W01 复访方案 -> W02 ; W03 confirm shows diff
await p.goto(url + '#/w01'); await p.click('text=复访方案'); await p.waitForTimeout(200); console.log('after click', p.url())
await p.goto(url + '#/w03'); await p.click('.wb-detail >> text=确认写入'); await p.waitForTimeout(200)
await p.screenshot({ path: 'codex_run_v2/selfcheck/W03_diff.png' })
await p.goto(url); await p.waitForTimeout(200); console.log('root ->', p.url())
await b.close()
