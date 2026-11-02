import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame, NavBar, Skeleton, Sheet, BottomNav } from '../../components/PhoneFrame'
import { Icon } from '../../components/Icon'
import { useDemo, useScores } from '../../store/demo'
import { analysis, customer, customerProfile, intent, review, tasks } from '../../mock/data'
import { IMG } from '../../mock/images'

/** C-05 智能盘客（UI-23 客户画像 / 接待概况 / 意向判断；UI-24 团队补充判断 / 盘客纪要） */
export default function C05() {
  const nav = useNavigate()
  const s = useDemo()
  const sc = useScores()
  const [adjust, setAdjust] = useState(false)
  const [addOp, setAddOp] = useState(false)
  const [rec, setRec] = useState(false)
  const [genMin, setGenMin] = useState(false)
  const [genTask, setGenTask] = useState(false)
  const adopt = () => { s.set({ intentAdopted: true }); s.showToast('已采纳 AI 建议：意向 A') }
  const minutes = () => { setGenMin(true); setTimeout(() => { setGenMin(false); s.set({ minutesGenerated: true }) }, 1500) }
  const genTasks = () => {
    setGenTask(true)
    setTimeout(() => { s.set({ tasksGenerated: true }); setGenTask(false); s.showToast('已生成 2 条跟进任务'); nav('/s01?tab=task') }, 1400)
  }
  const minIcons = [IMG.cropMin1, IMG.cropMin2, IMG.cropMin3] // 定稿 UI-24 3D 图标裁切
  return (
    <PhoneFrame>
      <NavBar title="智能盘客 · 林女士" back="/c06/trail" right={s.intentAdopted ? <span className="tag t-green">意向 A 已采纳</span> : <span className="tag t-blue">14:00 团队盘客</span>} />
      <div className="ph-body">
        {/* 1. 客户画像 */}
        <div className="card c5">
          <div className="c5-hd">客户画像</div>
          <div className="row c5-metrics">
            <img className="av" src={customer.avatar} width={64} height={64} alt="" />
            <div className="c5-m"><small>意向</small><b className="num c5-grad">{intent.level}</b></div>
            <div className="c5-m"><small>匹配度</small><b className="num" style={{ color: '#7C4DFF' }}>{sc.match}</b></div>
            <div className="c5-m"><small>诚意度</small><b className="num" style={{ color: '#151A2D' }}>{sc.sincerity}</b></div>
          </div>
          <div className="c5-line"><span className="k">认知程度</span><span className="c5-pill p-blue">{customerProfile.cognition}</span></div>
        </div>

        {/* 2. 接待概况 */}
        <div className="card c5">
          <div className="c5-hd">接待概况</div>
          <div className="row c5-score"><span className="k">服务分</span><b className="num">{analysis.serviceScore}</b></div>
          <div className="c5-line"><span className="k">认可点</span><span className="c5-pill p-green"><i className="c5-dot ok"><Icon name="check" size={11} stroke={3} color="#fff" /></i>{customerProfile.recognizedPoints.join('、')}</span></div>
          <div className="c5-line"><span className="k">抗性点</span><span className="c5-pill p-orange"><i className="c5-dot warn">!</i>{customerProfile.resistancePoints.join('、')}</span></div>
        </div>

        {/* 3. 意向判断 */}
        <div className="card c5">
          <div className="c5-hd">意向判断</div>
          <div className="c5-ai">
            <div className="row" style={{ gap: 10, alignItems: 'center' }}>
              <img src={IMG.cropSparkleLg} width={44} height={44} alt="" />
              <span className="c5-ai-k">AI 建议：</span><b className="c5-ai-v">{intent.aiSuggestion}</b>
              <span className="c5-ai-s">意向评分 <b className="num">{sc.aiScore}</b></span>
            </div>
            <p className="light" style={{ fontSize: 12, margin: '6px 0 10px' }}>判断依据：预算明确、家庭改善需求强、高频查看交付资料</p>
            <div className="row" style={{ gap: 10 }}>
              <button className={`btn ${s.intentAdopted ? 'btn-soft' : 'btn-primary'}`} style={{ flex: 1 }} onClick={adopt} data-testid="adopt">
                {s.intentAdopted ? <><Icon name="check" size={14} stroke={2.6} />意向 A 已采纳</> : '采纳'}
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAdjust(true)}>调整</button>
            </div>
          </div>
        </div>

        {/* 团队补充判断 */}
        <div className="card c5">
          <div className="row between"><div className="c5-hd" style={{ margin: 0 }}>团队补充判断</div>
            <button className="c5-chip" onClick={() => setAddOp(true)} data-testid={s.opinionAdded ? undefined : 'add-opinion'}>添加成员意见</button></div>
          <div className="col" style={{ marginTop: 6 }}>
            {review.opinions.map((o) => (
              <div key={o.who} className="c5-op"><img className="av" src={o.avatar} width={40} height={40} alt="" /><b>{o.who}：</b><span>{o.text}</span></div>
            ))}
          </div>
          {s.opinionAdded ? (
            <>
              <div className="c5-voice"><span className="c5-play"><Icon name="play" size={14} fill="#fff" color="#fff" /></span><b>语音记录</b><span className="light">{review.voice.length}</span><span className="c5-wave"><i /><i /><i /><i /><i /><i /><i /></span></div>
              <div className="c5-note"><img src={IMG.cropNote} width={18} height={24} alt="" />{review.voice.summary}</div>
            </>
          ) : <p className="light" style={{ fontSize: 12, marginTop: 8 }}>可添加文字或语音意见，团队共同判断</p>}
        </div>

        {/* 盘客纪要 */}
        <div className="card c5">
          <div className="row between"><div className="c5-hd" style={{ margin: 0 }}>盘客纪要</div>
            {!s.minutesGenerated && !genMin && <button className="c5-chip" onClick={minutes} data-testid="gen-minutes">生成纪要</button>}</div>
          <div style={{ marginTop: 8 }}>
            {genMin ? <><p className="light" style={{ fontSize: 12, marginBottom: 8 }}>正在汇总成员意见…</p><Skeleton lines={3} /></> : s.minutesGenerated ? (
              review.minutes.map((m, i) => (
                <div className="c5-min" key={m.k}><img className="c5-mi" src={minIcons[i]} width={40} height={40} alt="" /><div style={{ flex: 1 }}><b>{m.k}</b><p>{m.v}</p></div><Icon name="right" size={16} color="#A0A7BA" /></div>
              ))
            ) : <p className="light" style={{ fontSize: 12 }}>汇总成员意见与语音记录，生成讨论总结、购买决策与价格比较</p>}
          </div>
        </div>

        {s.minutesGenerated && (
          <div className="card">
            <div className="card-hd"><span className="ic ic-orange"><Icon name="flag" size={14} /></span>待生成跟进任务</div>
            {tasks.map((t) => <div key={t.taskId} className="kv"><span className="k">{t.priority}优先</span><span className="v">{t.title} · {t.goal}</span></div>)}
          </div>
        )}
      </div>
      <div className="ph-foot">
        <button className="btn btn-primary" disabled={genTask} onClick={() => {
          if (!s.intentAdopted) adopt()
          if (!s.opinionAdded) s.set({ opinionAdded: true })
          if (!s.minutesGenerated) s.set({ minutesGenerated: true })
          genTasks()
        }} data-testid="gen-tasks">{genTask ? <><span className="spin" />正在生成跟进任务…</> : '生成跟进任务'}</button>
      </div>
      <BottomNav active="盘客" />

      {addOp && (
        <Sheet title="添加成员意见" onClose={() => { setAddOp(false); setRec(false) }}
          footer={<>
            <button className="btn btn-ghost" onClick={() => { setAddOp(false); setRec(false) }}>取消</button>
            <button className="btn btn-primary" onClick={() => { s.set({ opinionAdded: true }); setAddOp(false); setRec(false); s.showToast('意见已添加') }} data-testid="opinion-submit">提交意见</button>
          </>}>
          <div className="field"><span className="k">文字意见</span><input placeholder="输入你的判断…" defaultValue={review.voice.summary} /></div>
          <button className={`rec-btn ${rec ? 'on' : ''}`} onClick={() => setRec(!rec)}><Icon name="mic" size={26} color="#fff" /></button>
          <p className="light" style={{ textAlign: 'center', fontSize: 12 }}>{rec ? `语音意见 ${review.voice.length} · 点击停止` : '按下添加语音意见'}</p>
        </Sheet>
      )}
      {adjust && (
        <Sheet title="调整意向等级" onClose={() => setAdjust(false)} footer={<button className="btn btn-primary" onClick={() => setAdjust(false)}>确定</button>}>
          <div className="row" style={{ gap: 8 }}>{['A', 'B', 'C', '无效'].map((l) => <button key={l} className={`pill ${l === 'A' ? 'on' : ''}`} style={{ flex: 1 }}>{l}</button>)}</div>
          <p className="light" style={{ fontSize: 12 }}>调整原因将记录在意向轨迹中</p>
        </Sheet>
      )}
    </PhoneFrame>
  )
}
