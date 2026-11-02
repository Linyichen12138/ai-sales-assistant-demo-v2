import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame, NavBar, Check } from '../../components/PhoneFrame'
import { CROP } from '../../mock/images'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { receptionPrep } from '../../mock/data'

/** C-03 接待准备（UI-06 首访 / UI-29 复访） */
export default function C03() {
  const nav = useNavigate()
  const s = useDemo()
  const revisit = s.feedbackWritten
  const src = revisit ? receptionPrep.revisit : receptionPrep.first
  const [ask, setAsk] = useState(() => Object.fromEntries(src.toAsk.map((q) => [q.id, q.checked])))
  const [mat, setMat] = useState(() => Object.fromEntries(src.materials.map((q) => [q.id, q.checked])))
  const start = () => {
    if (revisit) { s.showToast('已设置 2026-10-31 复访接待提醒'); return }
    s.set({ receptionStarted: true })
    nav('/c04')
  }
  return (
    <PhoneFrame>
      <NavBar title={<>林女士 · 接待准备</>} sub={<span className={`tag ${revisit ? 't-violet' : 't-teal'}`}>{revisit ? '复访' : '首访'}</span>} back={revisit ? '/s01' : '/c02'} />
      <div className="ph-body">
        {revisit ? (
          <div className="grad revisit">
            <div className="row between"><b style={{ fontSize: 20 }}>复访承接</b><span className="tag t-glass">计划复访 {receptionPrep.revisit.planDate}</span></div>
            {([['上次关注', receptionPrep.revisit.last, 'file', '#3B6BFF'], ['本次变化', receptionPrep.revisit.change, 'users', '#14B8A6'], ['待验证', receptionPrep.revisit.verify, 'warn', '#F08A00'], ['推荐策略', receptionPrep.revisit.strategy, 'bulb', '#7C3AED']] as const).map(([k, v, ic, c], i) => (
              <div key={k}>
                {i > 0 && <div className="rv-arrow">↓</div>}
                <div className="rv-row"><span className="rv-ic" style={{ background: c }}><Icon name={ic} size={14} color="#fff" /></span><span style={{ color: c, fontWeight: 700 }}>{k}：</span><b>{v}</b></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="card-hd"><img className="ic-img" src={CROP['c03-known']} alt="" />已知</div>
            <div className="row wrap" style={{ gap: 6 }}>{receptionPrep.first.known.map((k, i) => <span key={k} className={`tag ${['t-teal', 't-violet', 't-orange', 't-blue'][i % 4]}`} style={{ height: 28 }}>{i < 3 && <img src={CROP[['tag-home', 'tag-child', 'tag-coin'][i]]} width={16} height={16} alt="" />}{k}</span>)}</div>
          </div>
        )}
        <div className="card">
          <div className="card-hd"><img className="ic-img" src={CROP['c03-ask']} alt="" />待问<span className="more light" style={{ color: '#9AA1B2' }}>{Object.values(ask).filter(Boolean).length}/{src.toAsk.length}</span></div>
          <div className="col">{src.toAsk.map((q) => <Check key={q.id} on={!!ask[q.id]} onClick={() => setAsk({ ...ask, [q.id]: !ask[q.id] })}>{q.text}</Check>)}</div>
        </div>
        <div className="card">
          <div className="card-hd"><img className="ic-img" src={CROP['c03-prep']} alt="" />准备</div>
          <div className="col">{src.materials.map((q) => <Check key={q.id} on={!!mat[q.id]} onClick={() => setMat({ ...mat, [q.id]: !mat[q.id] })}>{q.text}</Check>)}</div>
        </div>
        {!revisit && (
          <div className="card">
            <div className="card-hd"><img className="ic-img" src={CROP['c03-open']} alt="" />推荐开场</div>
            <div className="quote">{receptionPrep.first.opening}</div>
            <div className="ai-read" style={{ marginTop: 10 }}><b><img src={CROP['c03-strat']} width={20} height={20} alt="" style={{ verticalAlign: -4, marginRight: 4 }} />推荐策略</b><p>{receptionPrep.first.strategy}</p></div>
          </div>
        )}
      </div>
      <div className="ph-foot">
        <button className="btn btn-ghost" onClick={() => nav('/c10')} data-testid="view-knowledge"><Icon name="book" size={16} />查看产品知识</button>
        <button className="btn btn-primary" onClick={start} data-testid="start-reception">开始接待</button>
      </div>
    </PhoneFrame>
  )
}
