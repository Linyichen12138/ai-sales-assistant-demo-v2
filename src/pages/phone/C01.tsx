import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame, BottomNav, Skeleton } from '../../components/PhoneFrame'
import { CROP } from '../../mock/images'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { customer, workbench, TODAY_LABEL } from '../../mock/data'

/** C-01 销售顾问工作台（UI-01 / UI-26） */
export default function C01() {
  const nav = useNavigate()
  const s = useDemo()
  const [loading, setLoading] = useState(false)
  const after = s.tasksGenerated
  const received = s.receptionEnded
  const refresh = () => { setLoading(true); setTimeout(() => { setLoading(false); s.showToast('已刷新') }, 800) }
  const goVisit = () => {
    if (!s.signedIn) nav('/c02')
    else if (!s.receptionStarted) nav('/c03')
    else if (!s.receptionEnded) nav('/c04')
    else nav('/s01')
  }
  const recent = after ? [{ name: '林女士', level: s.feedbackWritten ? '意向A · 85' : '意向A', time: s.feedbackWritten ? '16:00' : '14:20', avatar: customer.avatar, lin: true }, ...workbench.recent.slice(0, 1)] : workbench.recent
  return (
    <PhoneFrame>
      <div className="ph-body" style={{ paddingTop: 14 }}>
        <div className="row between" style={{ padding: '2px 4px 4px' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>销售顾问工作台</h1>
            <p className="light" style={{ marginTop: 4, fontSize: 13 }}>{TODAY_LABEL}</p>
          </div>
          <button onClick={refresh} data-testid="refresh"><Icon name="refresh" size={22} color="#5B6275" style={loading ? { animation: 'spin 1s linear infinite' } : undefined} /></button>
        </div>

        <div className="card">
          <div className="card-hd"><img className="ic-img" src={CROP['c01-visit']} alt="" />今日到访</div>
          {loading ? <Skeleton lines={3} h={14} /> : (
            <button className="grad visit-card" onClick={goVisit} data-testid="visit-card">
              <img className="av" src={customer.avatar} width={64} height={64} style={{ border: '3px solid rgba(255,255,255,.6)' }} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div className="row"><b style={{ fontSize: 20 }}>{customer.name}</b><span style={{ opacity: .85 }}>{received ? '已接待' : customer.appointmentTime}</span></div>
                <div className="row" style={{ marginTop: 8, gap: 6 }}>
                  <span className="tag t-white">首访</span>
                  {after ? <span className="tag t-white" style={{ color: '#13A866' }}>意向 A</span> : <span className="tag t-white" style={{ color: '#0FA391' }}>高潜</span>}
                  {!after && <span className="tag t-white" style={{ color: '#7C4DEB' }}>{s.predictionReady ? '已预测' : '待预测'}</span>}
                </div>
              </div>
              <Icon name="right" size={22} color="#fff" />
            </button>
          )}
        </div>

        <div className="card">
          <div className="card-hd"><img className="ic-img" src={CROP['c01-todo']} alt="" />待跟进</div>
          <div className="row" style={{ gap: 10 }}>
            <button className="follow-box blue" onClick={() => nav(after ? '/s01?feedback=1' : '/s01')} data-testid="follow-today">
              <span className="muted">今日</span>
              <span className="row" style={{ alignItems: 'baseline', gap: 4 }}><b className="num" style={{ fontSize: 38, color: '#3B3BF5' }}>{after ? 5 : workbench.followToday}</b>条</span>
              {after && <span className="plus2" data-testid="plus2-lin">+2 林女士</span>}
              <Icon name="file" size={26} color="#9DB6FF" style={{ position: 'absolute', right: 12, top: 24 }} />
            </button>
            <button className="follow-box pink" onClick={() => s.showToast('逾期任务：王女士 价格异议回访')}>
              <span className="muted">逾期</span>
              <span className="row" style={{ alignItems: 'baseline', gap: 4 }}><b className="num" style={{ fontSize: 38, color: '#F5455C' }}>{workbench.followOverdue}</b>条</span>
              <Icon name="clock" size={26} color="#F5889E" style={{ position: 'absolute', right: 12, top: 24 }} />
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-hd"><img className="ic-img" src={CROP['c01-risk']} alt="" />风险提醒</div>
          <div className="col">
            {after && (
              <button className="risk-row" onClick={() => nav('/s01')}>
                <span className="dot" style={{ color: '#FF9F1A' }} />林女士：交付顾虑{s.riskStatus}<span className="tag t-red" style={{ height: 18, fontSize: 11 }}>新</span>
                <span className="go">去处理 <Icon name="right" size={12} /></span>
              </button>
            )}
            {workbench.risks.map((r) => (
              <button key={r.name} className="risk-row" onClick={() => s.showToast('已打开王女士价格异议记录')}>
                <span className="dot" style={{ color: '#F5455C' }} />{r.name}：{r.text}
                <span className="go">去处理 <Icon name="right" size={12} /></span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-hd"><img className="ic-img" src={CROP['c01-recent']} alt="" />最近客户</div>
          {recent.map((r) => (
            <button key={r.name} className="list-row" onClick={() => ('lin' in r ? nav('/s01') : s.showToast(`${r.name}：${r.level}`))}>
              <img className="av" src={r.avatar} width={36} height={36} />
              <b>{r.name}</b>
              <span className={`tag ${r.level.startsWith('意向A') ? 't-blue' : 't-teal'}`}>{r.level.replace('意向', '意向 ')}</span>
              <span className="light" style={{ marginLeft: 'auto', fontSize: 12 }}>{r.time}</span>
              <Icon name="right" size={14} color="#9AA1B2" />
            </button>
          ))}
        </div>
      </div>
      <BottomNav active="工作台" />
    </PhoneFrame>
  )
}
