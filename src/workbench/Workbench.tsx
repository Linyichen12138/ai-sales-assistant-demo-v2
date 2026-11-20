import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sidebar, type SideConf } from './Sidebar'
import { useWb } from './store'
import { W06, W07, W14, W15, W16, W17, W18, W19, W20, W21, W22, W23, W24 } from './ext'
import { W01, W02, W03, W04, W05, W09, W10, W11, W12, W13 } from './pages'
import './workbench.css'

const CONF: Record<string, SideConf> = {
  '/w01': { expand: ['opp', 'visit'] },
  '/w02': { expand: ['opp'], sel: 'opp-hc', session: 1 },
  '/w03': { expand: ['visit'], sel: 'visit-notes' },
  '/w04': { expand: ['quote'], sel: 'quote-contract', session: 4 },
  '/w05': { expand: ['visit'], sel: 'visit-week' },
  '/w09': { expand: [], sel: 'today' },
  '/w10': { expand: [], sel: 'skills' },
  '/w11': { expand: ['visit'], sel: 'visit-week' },
  '/w12': { expand: ['quote'], sel: 'quote-sheet', session: 2 },
  '/w13': { expand: ['pay'], sel: 'pay-remind' },
  '/w06': { expand: ['visit'], sel: 'visit-week' },
  '/w07': { expand: ['visit'], sel: 'visit-notes' },
  '/w14': { expand: ['lead'], sel: 'lead-new' },
  '/w15': { expand: ['lead'], sel: 'lead-new' },
  '/w16': { expand: [], sel: 'skills' },
  '/w17': { expand: [], session: 3 },
  '/w18': { expand: [], session: 3 },
  '/w19': { expand: ['quote'], sel: 'quote-contract', session: 4 },
  '/w20': { expand: ['pay'], sel: 'pay-remind' },
  '/w21': { expand: [], sel: 'today' },
  '/w22': { expand: [], session: 3 },
  '/w23': { expand: [], session: 3 },
  '/w24': { expand: [], sel: 'today' },
}
const PAGES: Record<string, () => ReactNode> = {
  '/w01': W01, '/w02': W02, '/w03': W03, '/w04': W04, '/w05': W05, '/w06': W06, '/w07': W07,
  '/w09': W09, '/w10': W10, '/w11': W11, '/w12': W12, '/w13': W13,
  '/w14': W14, '/w15': W15, '/w16': W16, '/w17': W17, '/w18': W18, '/w19': W19, '/w20': W20,
  '/w21': W21, '/w22': W22, '/w23': W23, '/w24': W24,
}
export const WB_PATHS = Object.keys(PAGES)

const STEPS: { n: number; label: string; links: [string, string][] }[] = [
  { n: 1, label: '技能卡', links: [['W01', '/w01']] },
  { n: 2, label: '对象对话', links: [['W02', '/w02']] },
  { n: 3, label: '确认/驳回', links: [['W03', '/w03']] },
  { n: 4, label: '开始初访 / 样品安排', links: [['W05', '/w05'], ['W11', '/w11']] },
  { n: 5, label: '报价测算', links: [['W16', '/w16'], ['华粮W12', '/w12']] },
  { n: 6, label: '签约审批', links: [['W04', '/w04']] },
  { n: 7, label: '回款预警', links: [['W13', '/w13']] },
]

function Tour({ path }: { path: string }) {
  const nav = useNavigate()
  const reset = () => { useWb.getState().resetDemo(); nav('/w01') }
  return <nav className="wb-tour" data-testid="tour"><b>演示导览</b>
    {STEPS.map((st) => { const on = st.links.some(([, p]) => p === path); return <span key={st.n} className={`wb-step ${on ? 'on' : ''}`}>
      <button onClick={() => { if (st.links[0][1] === '/w12') useWb.getState().setQuoteSheet('hualiang'); nav(st.links[0][1]) }}><i>{st.n}</i>{st.label}</button>
      {st.links.length > 1 && st.links.map(([t, p]) => <button key={p} className={`wb-sub ${p === path ? 'on' : ''}`} onClick={() => { if (p === '/w12') useWb.getState().setQuoteSheet('hualiang'); nav(p) }}>{t}</button>)}
      {st.n < 7 && <em>→</em>}</span> })}
    <span className="wb-tour-tip">示例数据 · 不调用外部服务</span>
    <button className="wb-btn ghost sm" data-testid="reset-demo" onClick={reset} title="清空本机保存的示例进度">重置演示（示例）</button>
  </nav>
}

export function Workbench() {
  const p = useLocation().pathname; const Page = PAGES[p] ?? W01; const toast = useWb((s) => s.toast)
  return <div className="wb-root"><Tour path={p} /><div className="wb-shell"><Sidebar conf={CONF[p] ?? CONF['/w01']} page={p} /><Page /></div>{toast && <div className="wb-toast">{toast}</div>}</div>
}
