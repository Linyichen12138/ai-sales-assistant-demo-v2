import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PcFrame, Panel } from '../../components/PcFrame'
import { useDemo } from '../../store/demo'
import { advisors, quadrants, coachingPlan } from '../../mock/data'

const QC: Record<string, string> = { 复制推广: '#2FD4C0', 过程改善: '#3B8BFF', 资源支持: '#8B5CF6', 重点辅导: '#FF9F1A' }
const DIMS = ['破冰', '挖需', '价值', '互动']
// 背景散点（其他销售/历史样本），固定坐标避免抖动
const DOTS = [[0.12, 0.3], [0.2, 0.36], [0.3, 0.42], [0.36, 0.22], [0.08, 0.6], [0.3, 0.55], [0.4, 0.86], [0.1, 0.7], [0.28, 0.66], [0.62, 0.36], [0.82, 0.3], [0.7, 0.22], [0.66, 0.58], [0.58, 0.74], [0.9, 0.78], [0.72, 0.9], [0.56, 0.9], [0.18, 0.84]]
const W = 1180, H = 820, TX = 85, TY = 3
// 头像位置按设计稿摆放（过程分 x / 成交 y 的象限归属与 mock 一致）
const POS: Record<string, [number, number]> = { zhang: [0.25, 0.68], sun: [0.42, 0.82], liu: [0.27, 0.24], he: [0.74, 0.22], zhao: [0.76, 0.64] }
const pos = (id: string) => ({ x: POS[id][0], y: POS[id][1] })

/** M-05 销售四象限（UI-32 / UI-33） */
export default function M05() {
  const nav = useNavigate()
  const s = useDemo()
  const [sel, setSel] = useState<string | null>(null)
  const [plan, setPlan] = useState(false)
  const a = advisors.find((x) => x.id === sel)
  const w = a ? 770 : W
  return (
    <PcFrame title="销售四象限" active="团队" zoom={1.06}>
      <div className="p-grid" style={{ gridTemplateColumns: a ? '860px minmax(0,1fr)' : 'minmax(0,1fr) 328px', gridTemplateRows: 'minmax(0,1fr)', flex: 1 }}>
        <Panel title={a ? '销售四象限' : undefined} style={{ position: 'relative' }}>
          <div style={{ position: 'relative', width: w, height: a ? 730 : H, margin: a ? '6px 0 0 50px' : '0 auto' }} data-testid="quadrant">
            {/* 象限底色 */}
            {(['过程改善', '复制推广', '重点辅导', '资源支持'] as const).map((k, i) => (
              <div key={k} className="quad" style={{ left: i % 2 ? '50%' : 0, top: i < 2 ? 0 : '50%', background: a ? `${QC[k]}14` : 'transparent', borderColor: a ? `${QC[k]}55` : 'transparent' }}>
                <span className="quad-tag" style={{ [i % 2 ? 'right' : 'left']: 20, [i < 2 ? 'top' : 'bottom']: 18, color: a ? QC[k] : '#fff', borderColor: a ? QC[k] : 'rgba(140,170,255,.5)', background: a ? `${QC[k]}22` : 'rgba(40,70,190,.55)' } as React.CSSProperties}>{k}</span>
              </div>
            ))}
            <div className="quad-ax-x" /><div className="quad-ax-y" />
            {DOTS.map(([x, y], i) => {
              const k = y < 0.5 ? (x < 0.5 ? '过程改善' : '复制推广') : x < 0.5 ? '重点辅导' : '资源支持'
              return <span key={i} className="quad-dot" style={{ left: `${x * 100}%`, top: `${y * 100}%`, background: a ? QC[k] : '#3B8BFF' }} />
            })}
            {advisors.map((v) => {
              const p = pos(v.id)
              const isZ = v.id === 'zhang'
              if (a && !isZ) return <span key={v.id} className="quad-dot" style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, width: 14, height: 14, background: QC[v.quad] }} />
              return (
                <button key={v.id} className={`quad-av ${isZ ? 'focus' : ''} ${sel === v.id ? 'on' : ''}`} style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }} onClick={() => setSel(v.id)} data-testid={`adv-${v.id}`}>
                  {a && isZ ? <><span className="quad-pin">{v.name}</span><span className="quad-me" /></> : <><img src={v.avatar} /><span>{v.name}</span></>}
                </button>
              )
            })}
          </div>
          <div className="quad-lab-y"><span>业绩高</span><b>成交<br /><em>{TY}</em> 套</b><span>业绩低</span></div>
          <div className="quad-lab-x"><span>过程弱</span><b>过程分 <em>{TX}</em></b><span>过程强</span></div>
        </Panel>
        {!a ? (
          <Panel title="象限说明">
            {(['复制推广', '过程改善', '资源支持', '重点辅导'] as const).map((k) => {
              const q = quadrants.find((x) => x.key === k)!
              return (
                <div key={k} className="inner" style={{ padding: '24px 26px', flex: 1 }}>
                  <p className="p-row" style={{ fontSize: 22, fontWeight: 700 }}><span style={{ width: 18, height: 18, borderRadius: 9, background: QC[k], boxShadow: `0 0 10px ${QC[k]}` }} />{k}</p>
                  <p className="p-mute" style={{ fontSize: 17, marginTop: 10, paddingLeft: 30 }}>{q.action}</p>
                  <p className="p-light" style={{ fontSize: 14, marginTop: 4, paddingLeft: 30 }}>{q.desc}</p>
                </div>
              )
            })}
            <p className="p-light" style={{ fontSize: 14 }}>点击销售头像查看详情</p>
          </Panel>
        ) : (
          <Panel title={`${a.name} · 详情`} extra={<button className="p-mute" onClick={() => setSel(null)} data-testid="adv-close">返回象限说明</button>} style={{ position: 'relative' }}>
            <div className="p-row" style={{ gap: 20 }}>
              <img className="p-av" src={a.avatar} width={150} height={150} style={{ border: '3px solid #5B7BFF' }} />
              {[['本月成交', a.deals, '套'], ['过程分', a.process, ''], ['服务分', a.service, '']].map(([k, v, u]) => (
                <div key={k as string} className="inner" style={{ flex: 1, textAlign: 'center', padding: '20px 0' }}><p className="p-mute">{k}</p><b className="p-num" style={{ fontSize: 50 }}>{v}</b>{u && <span style={{ fontSize: 18 }}> {u}</span>}</div>
              ))}
            </div>
            <div className="p-col" style={{ gap: 22, flex: 1, justifyContent: 'center' }}>
              {a.dims.map((d, i) => {
                const weak = a.id === 'zhang' && i === 1
                return (
                  <div key={i} className="p-row" style={{ gap: 18, fontSize: 21 }}>
                    <span style={{ width: 50 }}>{DIMS[i]}</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${d}%`, background: weak ? 'linear-gradient(90deg,#FF9F1A,#FFB547)' : ['#3B8BFF', '', '#3B6BFF', '#8B5CF6'][i] }} /></div>
                    <b className="p-num" style={{ width: 44, fontSize: 26, color: weak ? '#FFB547' : undefined }}>{d}</b>
                  </div>
                )
              })}
            </div>
            <div className="inner p-row" style={{ gap: 24, fontSize: 19 }}>
              <span>归类：</span><span className="ptag pt-solid" style={{ background: QC[a.quad], height: 40, padding: '0 26px', fontSize: 18, borderRadius: 20 }}>{a.quad}</span>
              <span style={{ marginLeft: 20 }}>理由：</span><b style={{ color: '#FFB547' }}>{a.reason}</b>
            </div>
            <div className="p-row" style={{ gap: 20 }}>
              <button className="pbtn pbtn-ghost" style={{ flex: 1, height: 64, fontSize: 21 }} onClick={() => nav('/m04')} data-testid="view-reception">查看接待</button>
              <button className={`pbtn ${s.coachingCreated && a.id === 'zhang' ? 'pbtn-ok' : 'pbtn-primary'}`} style={{ flex: 1, height: 64, fontSize: 21 }} onClick={() => setPlan(true)} data-testid="create-coaching">{s.coachingCreated && a.id === 'zhang' ? '辅导计划已创建' : '创建辅导计划'}</button>
            </div>
            {plan && (
              <div className="coach-pop" data-testid="coaching-pop">
                <div className="p-row" style={{ justifyContent: 'center', position: 'relative' }}><b style={{ fontSize: 22 }}>辅导计划</b><button style={{ position: 'absolute', right: 0, fontSize: 24, color: '#AFC0FF' }} onClick={() => setPlan(false)}>×</button></div>
                <div className="inner" style={{ padding: '6px 20px' }}>
                  {[['目标', a.id === 'zhang' ? coachingPlan.target : '短板维度 +10'], ['周期', coachingPlan.period], ['负责人', coachingPlan.owner], ['内容', coachingPlan.content]].map(([k, v]) => (
                    <div key={k} className="p-row" style={{ padding: '12px 0', fontSize: 18 }}><span className="p-mute" style={{ width: 90 }}>{k}</span><span>{v}</span></div>
                  ))}
                </div>
                <button className="pbtn pbtn-primary" style={{ height: 52, fontSize: 19 }} onClick={() => { s.set({ coachingCreated: true }); setPlan(false); s.showToast(`已为${a.name}创建辅导计划`) }} data-testid="coaching-confirm">确认创建</button>
              </div>
            )}
          </Panel>
        )}
      </div>
    </PcFrame>
  )
}
