import { useNavigate } from 'react-router-dom'
import { useWb } from './store'
import { ALogo, Ico } from './ui'

export type ModKey = 'lead' | 'opp' | 'visit' | 'quote' | 'pay' | 'review'
export interface SideConf { expand: ModKey[]; sel?: string; session?: number }

const MODS: { key: ModKey; name: string; items: { id: string; label: string; to?: string; tag?: string; badge?: number; ico?: string }[] }[] = [
  { key: 'lead', name: '线索', items: [{ id: 'lead-new', label: '新线索' }, { id: 'lead-assign', label: '待分配' }, { id: 'lead-pool', label: '公海池' }] },
  { key: 'opp', name: '商机', items: [
    { id: 'opp-hc', label: '禾川食品（示例公司）', tag: '拜访·复访', to: '/w02' },
    { id: 'opp-hl', label: '华粮餐饮（示例公司）', tag: '商机', to: '/w12' },
    { id: 'opp-xy', label: '鲜源连锁（示例公司）', tag: '签约·意向', to: '/w13' }] },
  { key: 'visit', name: '拜访', items: [
    { id: 'visit-week', label: '本周日程', to: '/w11', ico: 'cal' },
    { id: 'visit-sample', label: '样品安排', to: '/w11', ico: 'box' },
    { id: 'visit-notes', label: '待写纪要', to: '/w03', badge: 2, ico: 'doc' }] },
  { key: 'quote', name: '报价与合同', items: [{ id: 'quote-sheet', label: '报价单', to: '/w12' }, { id: 'quote-contract', label: '合同审批', to: '/w04' }] },
  { key: 'pay', name: '履约与回款', items: [{ id: 'pay-deliver', label: '交付进度' }, { id: 'pay-pre', label: '打款前维护' }, { id: 'pay-remind', label: '回款提醒', to: '/w13' }] },
]
const SESSIONS = [
  { label: '禾川技术评估未答问题', scene: '复访准备', to: '/w02' },
  { label: '华粮年度报价测算', scene: '报价测算', to: '/w12' },
  { label: '禾川正式合同审批', scene: '签约审批', to: '/w04' },
]

export function Sidebar({ conf, page }: { conf: SideConf; page: string }) {
  const nav = useNavigate(); const s = useWb()
  const isOpen = (k: ModKey) => s.open[`${page}:${k}`] ?? conf.expand.includes(k)
  const go = (to?: string, label?: string) => { if (to) nav(to); else s.notify(`「${label}」为示例入口，本 Demo 未展开`) }
  return <aside className="wb-side" data-testid="sidebar">
    <div className="wb-brand"><ALogo size={26} /><b>AI 智能营销</b></div>
    <button className="wb-new" onClick={() => nav('/w01')}>＋ 新对话</button>
    <div className="wb-entries">
      <button className={`wb-entry ${conf.sel === 'today' ? 'on' : ''}`} onClick={() => nav('/w09')}><Ico n="task" />今日任务<span className="wb-badge">5</span></button>
      <button className={`wb-entry ${conf.sel === 'skills' ? 'on' : ''}`} onClick={() => nav('/w10')}><Ico n="layers" />能力中心</button>
    </div>
    <div className="wb-sep" />
    <div className="wb-group">业务模块</div>
    <div className="wb-mods">
      {MODS.map((m) => { const o = isOpen(m.key); return <div key={m.key}>
        <div className="wb-mod" onClick={() => s.toggle(`${page}:${m.key}`, conf.expand.includes(m.key))}>
          <span className="wb-caret">{o ? '▾' : '▸'}</span><span className="wb-mod-name">{m.name}</span>
          <span className="wb-mod-ico">＋</span><span className="wb-mod-ico">≡</span>
        </div>
        {o && <div className="wb-items">{m.items.map((it) => <button key={it.id} className={`wb-item ${conf.sel === it.id ? 'on' : ''}`} onClick={() => go(it.to, it.label)}>
          {it.ico && <Ico n={it.ico} />}<span className="wb-item-label">{it.label}</span>
          {it.tag && <span className="wb-pill sm">{it.tag}</span>}{it.badge && <span className="wb-badge">{it.badge}</span>}
        </button>)}</div>}
      </div> })}
      <div className="wb-mod single" onClick={() => s.notify('「复盘与管理」需切换到组长视角（示例）')}><Ico n="chart" /><span className="wb-mod-name">复盘与管理</span></div>
    </div>
    <div className="wb-sep" />
    <div className="wb-group">最近会话</div>
    <div className="wb-sessions">{SESSIONS.map((x, i) => <button key={x.label} title={x.scene} className={`wb-item ${conf.session === i + 1 ? 'on' : ''}`} onClick={() => nav(x.to)}><Ico n="chat" /><span className="wb-item-label">{x.label}</span><span className="wb-scene">{x.scene}</span></button>)}</div>
    <div className="wb-foot">
      <div className="wb-me"><span className="wb-ava user">张</span><b>张帆（示例）</b><small>· 一线销售</small></div>
      <div className="wb-lead">组长：王磊（示例）· 共 4 人</div>
      <button className="wb-switch" onClick={() => s.notify('组长视角为后续版本，当前为示例')}>切换到组长视角</button>
    </div>
  </aside>
}
