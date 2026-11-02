import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Logo } from './Logo'
import { useV2, roles, type ActionCardData, type CardKind, type V2Role } from '../store/v2'

export const kindClass: Record<CardKind, string> = { 事实: 'v2-fact', 推断: 'v2-infer', 待核实: 'v2-verify' }

export function V2DemoBar() {
  const nav = useNavigate(); const loc = useLocation(); const s = useV2()
  const steps = [
    ['首页 · 线索', '/home'], ['统一收件箱', '/inbox'], ['建档与联系人', '/lead'], ['阶段变更', '/stage'], ['开始拜访', '/visit/start'],
    ['对象工作台', '/workspace'], ['会后确认', '/visit/review'], ['意向行动卡', '/intent'], ['签约工作台', '/contract'], ['管理桌面', '/manage'],
  ] as const
  const active = steps.findIndex(([, p]) => loc.pathname === p) + 1
  return <header className="v2-demo-bar">
    <div className="v2-brand"><Logo size={28} /><b>AI 销售助手 · Demo v2</b><span>卖方视角 · 示例数据</span></div>
    <div className="v2-role-switch" aria-label="演示角色">
      {roles.map((r) => <button key={r.key} className={s.role === r.key ? 'on' : ''} onClick={() => { s.setRole(r.key); nav(r.key === 'director' ? '/manage' : r.key === 'lead' ? '/inbox' : '/home') }}>{r.name}<small>{r.title}</small></button>)}
    </div>
    <div className="v2-step"><span>主路径 {active || s.step}/10</span><select value={active || s.step} onChange={(e) => { const n = Number(e.target.value); s.setStep(n); nav(steps[n - 1][1]) }}>{steps.map((x, i) => <option key={x[1]} value={i + 1}>{i + 1}. {x[0]}</option>)}</select></div>
  </header>
}

export function V2Shell({ children, title, eyebrow, compact = false }: { children: ReactNode; title: string; eyebrow?: string; compact?: boolean }) {
  const nav = useNavigate(); const loc = useLocation(); const s = useV2()
  const menu = [['首页', '/home'], ['收件箱', '/inbox'], ['商机工作台', '/workspace'], ['拜访', '/visit/start'], ['管理桌面', '/manage']] as const
  return <div className="v2-app"><V2DemoBar /><div className="v2-layout">
    <aside className="v2-side"><div className="v2-company"><span className="v2-company-dot" />{s.selectedCompany}<small>当前客户 · 示例公司</small></div>{menu.map(([label, path]) => <button key={path} className={loc.pathname === path || (path === '/workspace' && loc.pathname === '/visit/review') ? 'on' : ''} onClick={() => nav(path)}>{label}</button>)}<div className="v2-side-foot">数据范围<br /><b>华东大客户部（示例）</b></div></aside>
    <main className={compact ? 'v2-main compact' : 'v2-main'}><div className="v2-page-head"><div><p className="v2-eyebrow">{eyebrow || '销售工作台'}</p><h1>{title}</h1></div><div className="v2-head-actions"><button className="v2-ghost" onClick={() => nav('/screen')}>只读大屏</button><span className="v2-avatar">{roles.find((r) => r.key === s.role)?.name.slice(0, 1)}</span></div></div>{children}</main>
  </div>{s.toast && <div className="v2-toast">{s.toast}</div>}<EvidenceDrawer /></div>
}

export function Tag({ children, kind }: { children: ReactNode; kind?: CardKind }) { return <span className={`v2-tag ${kind ? kindClass[kind] : ''}`}>{children}</span> }

export function ActionCard({ card, compact = false }: { card: ActionCardData; compact?: boolean }) {
  const s = useV2()
  const act = (decision: ActionCardData['decision']) => { s.updateCard(card.id, { decision, process: '已处理', write: decision === '驳回' ? '未写入' : '写入成功' }); s.notify(decision === '驳回' ? '已驳回，需补充原因' : '已确认，写入结果成功') }
  return <article className={`v2-action-card ${compact ? 'compact' : ''}`}>
    <div className="v2-card-top"><div><Tag>{card.object}</Tag><Tag kind={card.kind}>{card.kind}</Tag>{card.staleReason && <Tag>依据已变</Tag>}</div><span className={`v2-urgency ${card.urgency}`}>{card.urgency}优先</span></div>
    <h3>{card.title}</h3><p className="v2-conclusion">{card.conclusion}</p>
    <div className="v2-evidence-line" onClick={() => s.openEvidence(card.id)}><span>依据</span>{card.evidence}<b>›</b></div>
    {!compact && <><div className="v2-card-grid"><div><small>下一步</small><b>{card.next}</b></div><div><small>责任人</small><b>{card.owner}</b></div><div><small>截止时间</small><b>{card.due}</b></div></div><div className="v2-state-row"><span>处理：{card.process}</span><span>决策：{card.decision}</span><span>写入：{card.write}</span></div><div className="v2-card-actions"><button className="v2-primary" onClick={() => act('确认')}>确认</button><button onClick={() => act('编辑后确认')}>编辑</button><button className="danger" onClick={() => act('驳回')}>驳回</button></div></>}
  </article>
}

export function EvidenceDrawer() {
  const s = useV2(); const card = s.cards.find((c) => c.id === s.drawerCard); if (!s.drawerOpen || !card) return null
  return <div className="v2-drawer-mask" onClick={s.closeEvidence}><aside className="v2-evidence-drawer" onClick={(e) => e.stopPropagation()}><div className="v2-drawer-head"><div><p>依据抽屉</p><h2>{card.title}</h2></div><button onClick={s.closeEvidence}>×</button></div><div className="v2-drawer-body"><Tag kind={card.kind}>{card.kind}</Tag><h3>结论</h3><p>{card.conclusion}</p><h3>来源与范围</h3><dl><dt>来源</dt><dd>{card.source}</dd><dt>更新时间</dt><dd>{card.evidence}</dd><dt>可见范围</dt><dd>内部可见 · 当前商机</dd><dt>数据新鲜度</dt><dd>更新于 10:20</dd></dl>{card.staleReason && <div className="v2-stale">{card.staleReason}，确认前请刷新依据。</div>}</div><div className="v2-drawer-foot"><button className="v2-ghost" onClick={s.closeEvidence}>关闭</button><button className="v2-primary" onClick={() => { s.closeEvidence(); s.notify('已标记为待核实') }}>标记待核实</button></div></aside></div>
}

export function StatusPill({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'purple' | 'orange' | 'green' }) { return <span className={`v2-status ${tone}`}>{children}</span> }

export function RoleName({ role }: { role?: V2Role }) { const s = useV2(); return <>{roles.find((r) => r.key === (role || s.role))?.name}</> }

