import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sidebar, type SideConf } from './Sidebar'
import { useWb } from './store'
import { W01, W02, W03, W04, W05, W09, W10, W11, W12, W13 } from './pages'
import './workbench.css'

const CONF: Record<string, SideConf> = {
  '/w01': { expand: ['opp', 'visit'] },
  '/w02': { expand: ['opp'], sel: 'opp-hc', session: 1 },
  '/w03': { expand: ['visit'], sel: 'visit-notes' },
  '/w04': { expand: ['quote'], sel: 'quote-contract', session: 3 },
  '/w05': { expand: ['visit'], sel: 'visit-week' },
  '/w09': { expand: [], sel: 'today' },
  '/w10': { expand: [], sel: 'skills' },
  '/w11': { expand: ['visit'], sel: 'visit-week' },
  '/w12': { expand: ['quote'], sel: 'quote-sheet', session: 2 },
  '/w13': { expand: ['pay'], sel: 'pay-remind' },
}
const PAGES: Record<string, () => ReactNode> = { '/w01': W01, '/w02': W02, '/w03': W03, '/w04': W04, '/w05': W05, '/w09': W09, '/w10': W10, '/w11': W11, '/w12': W12, '/w13': W13 }
export const WB_PATHS = Object.keys(PAGES)

const STEPS: { n: number; label: string; links: [string, string][] }[] = [
  { n: 1, label: '技能卡', links: [['W01', '/w01']] },
  { n: 2, label: '对象对话', links: [['W02', '/w02']] },
  { n: 3, label: '确认/驳回', links: [['W03', '/w03']] },
  { n: 4, label: '开始初访 / 样品安排', links: [['W05', '/w05'], ['W11', '/w11']] },
  { n: 5, label: '报价测算', links: [['W12', '/w12']] },
  { n: 6, label: '签约审批', links: [['W04', '/w04']] },
  { n: 7, label: '回款预警', links: [['W13', '/w13']] },
]

function Tour({ path }: { path: string }) {
  const nav = useNavigate()
  return <nav className="wb-tour" data-testid="tour"><b>演示导览</b>
    {STEPS.map((st) => { const on = st.links.some(([, p]) => p === path); return <span key={st.n} className={`wb-step ${on ? 'on' : ''}`}>
      <button onClick={() => nav(st.links[0][1])}><i>{st.n}</i>{st.label}</button>
      {st.links.length > 1 && st.links.map(([t, p]) => <button key={p} className={`wb-sub ${p === path ? 'on' : ''}`} onClick={() => nav(p)}>{t}</button>)}
      {st.n < 7 && <em>→</em>}</span> })}
    <span className="wb-tour-tip">W09 今日任务、W10 能力中心从侧栏进入 · 示例数据</span>
  </nav>
}

export function Workbench() {
  const p = useLocation().pathname; const Page = PAGES[p] ?? W01; const toast = useWb((s) => s.toast)
  return <div className="wb-root"><Tour path={p} /><div className="wb-shell"><Sidebar conf={CONF[p] ?? CONF['/w01']} page={p} /><Page /></div>{toast && <div className="wb-toast">{toast}</div>}</div>
}
