import { useState, type ReactNode } from 'react'
import { useWb, type Decision } from './store'

export function ALogo({ size = 26 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" aria-label="A logo"><path d="M16 3 L29 29 H22.5 L16 15.5 L9.5 29 H3 Z" fill="#B75A3B" /><path d="M11.5 23 H20.5 L18.6 19.2 H13.4 Z" fill="#E98F70" /></svg>
}
export function AiAva() { return <span className="wb-ava ai"><ALogo size={22} /></span> }
export function UserAva() { return <span className="wb-ava user">张</span> }

const P: Record<string, string> = {
  task: 'M4 5h16v15H4z M8 3v4 M16 3v4 M8 12l3 3 5-5',
  layers: 'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5',
  cal: 'M4 6h16v14H4z M4 10h16 M8 4v4 M16 4v4',
  box: 'M4 8l8-4 8 4v9l-8 4-8-4z M4 8l8 4 8-4 M12 12v9',
  doc: 'M6 3h9l4 4v14H6z M9 11h7 M9 15h7',
  chart: 'M5 20V10 M12 20V5 M19 20v-7',
  chat: 'M4 5h16v11H9l-5 4z',
  bar: 'M5 20v-6 M10 20V9 M15 20V12 M20 20V5',
  hand: 'M3 12l5-5 4 3 4-3 5 5-9 8z',
  calc: 'M6 3h12v18H6z M9 7h6 M9 12h1 M14 12h1 M9 16h1 M14 16h1',
  shield: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z M12 8v5 M12 16v.5',
  bell: 'M6 16h12l-2-3V9a4 4 0 0 0-8 0v4z M10 19h4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c1-4 4-6 8-6s7 2 8 6',
  flag: 'M5 21V4 M5 4h11l-2 4 2 4H5',
  building: 'M5 21V4h9v17 M14 9h5v12 M8 8h3 M8 12h3 M8 16h3',
  send: 'M3 11l18-8-8 18-2-8z',
  spark: 'M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z',
  warn: 'M12 4l9 16H3z M12 10v4 M12 17v.5',
}
export function Ico({ n, s = 16 }: { n: string; s?: number }) {
  return <svg className="wb-ico" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={P[n] || P.doc} /></svg>
}
export function Pill({ children, tone = 'terra' }: { children: ReactNode; tone?: 'terra' | 'coral' | 'ok' | 'risk' | 'muted' }) { return <span className={`wb-pill ${tone}`}>{children}</span> }
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) { return <section className={`wb-card ${className}`}>{children}</section> }

export interface ActField { key: string; label: string; initial: string }

/** 行动卡：确认写入 / 可编辑字段 / 驳回必填理由。草稿在确认前不进入 committed。 */
export function Acts({ id, size = 'md', note = true, onConfirm, doneText = '已写入（示例）', confirmLabel = '确认写入', fields }: { id: string; size?: 'sm' | 'md' | 'lg'; note?: boolean; onConfirm?: () => boolean | void; doneText?: string; confirmLabel?: string; fields?: ActField[] }) {
  const s = useWb(); const d: Decision = s.decisions[id] ?? '待确认'
  const [rejecting, setRejecting] = useState(false)
  const reason = s.reasons[id] ?? ''
  const form: ActField[] = fields?.length ? fields : [{ key: `${id}.note`, label: '行动说明（示例）', initial: '' }]
  const beginEdit = () => {
    const st = useWb.getState()
    for (const f of form) if (st.drafts[f.key] === undefined) st.setDraft(f.key, st.committed[f.key] ?? f.initial)
    st.setDecision(id, '编辑中')
    setRejecting(false)
  }
  if (d === '已写入' || d === '已驳回') return <div className={`wb-acts done ${size}`} data-testid={`acts-${id}`}>
    <span className={d === '已写入' ? 'wb-ok' : 'wb-rej'}>{d === '已写入' ? `✓ ${doneText}` : `✕ 已驳回，未写入${reason ? `：${reason}` : ''}`}</span>
    <button className="wb-btn ghost sm" onClick={() => s.setDecision(id, '待确认')}>撤销</button>
  </div>
  return <div className={`wb-acts ${size}`} data-testid={`acts-${id}`}>
    {d === '编辑中' && <div className="wb-edit" data-testid={`edit-form-${id}`}>
      {form.map((f) => <label key={f.key} className="wb-field">{f.label}
        <input data-testid={`field-${f.key}`} value={s.drafts[f.key] ?? ''} onChange={(e) => s.setDraft(f.key, e.target.value)} />
      </label>)}
      <small className="wb-note">编辑中 · 未经确认不会写入</small>
    </div>}
    {rejecting && <div className="wb-reject" data-testid={`reject-form-${id}`}>
      <label className="wb-field">驳回原因（必填）
        <textarea data-testid={`reason-${id}`} value={reason} onChange={(e) => s.setReason(id, e.target.value)} placeholder="请填写驳回原因（示例）" />
      </label>
      <div className="wb-acts-row">
        <button className="wb-btn primary" data-testid={`reject-submit-${id}`} disabled={!reason.trim()} onClick={() => { s.setDecision(id, '已驳回'); setRejecting(false) }}>提交驳回</button>
        {!reason.trim() && <span className="wb-err">填写原因后才能提交</span>}
      </div>
    </div>}
    <div className="wb-acts-row">
      <button className="wb-btn primary" data-testid={`confirm-${id}`} onClick={() => { if (onConfirm && onConfirm() === false) return; if (d === '编辑中') s.confirmFields(form.map((f) => f.key)); s.setDecision(id, '已写入') }}>{confirmLabel}</button>
      <button className={`wb-btn ghost ${d === '编辑中' ? 'on' : ''}`} data-testid={`edit-${id}`} onClick={beginEdit}>编辑</button>
      <button className="wb-btn danger" data-testid={`reject-${id}`} onClick={() => { setRejecting(true); s.setDecision(id, '待确认') }}>驳回</button>
    </div>
    {note && d !== '编辑中' && !rejecting && <small className="wb-note">未经确认不会写入</small>}
  </div>
}
