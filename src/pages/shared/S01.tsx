import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PhoneFrame, NavBar, Sheet, BottomNav } from '../../components/PhoneFrame'
import { PcFrame, Panel } from '../../components/PcFrame'
import { LineChart } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { useDemo, useScores } from '../../store/demo'
import { customer, customerProfile, intent, receptionPrep, receptionRecords, reception, tasks } from '../../mock/data'

/** S-01 客户详情与跟进任务：销售顾问看手机端（UI-25/27/28），销售经理看 PC 端（UI-37） */
export default function S01() {
  const role = useDemo((s) => s.role)
  return role === 'manager' ? <S01Pc /> : <S01Phone />
}

const SRC_TAGS: [string, string][] = [['互联网画像', 't-blue'], ['接待', 't-teal'], ['跟进', 't-violet'], ['盘客', 't-orange']]

function S01Phone() {
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()
  const s = useDemo()
  const sc = useScores()
  const [tab, setTab] = useState(sp.get('tab') ?? (s.feedbackWritten ? '轨迹' : s.tasksGenerated ? '任务' : '画像'))
  const [fb, setFb] = useState(sp.get('feedback') === '1' && !s.feedbackWritten)
  const [verify, setVerify] = useState('预算是否调整')
  const [calc, setCalc] = useState(false)
  const [bannerOff, setBannerOff] = useState(false)
  useEffect(() => {
    const t = sp.get('tab')
    if (t === 'task') setTab('任务')
    if (sp.get('feedback') === '1' && !s.feedbackWritten) { setTab('任务'); setFb(true) }
  }, [sp])
  const submit = () => {
    setFb(false); setCalc(true)
    setTimeout(() => {
      s.set({ feedbackWritten: true, riskStatus: '已回应' })
      setCalc(false); setTab('轨迹'); setSp({})
      s.showToast('意向已重新计算：82 → 85')
    }, 1600)
  }
  const tabKey = tab === 'task' ? '任务' : tab
  return (
    <PhoneFrame>
      <NavBar title="客户详情" back="/c01" />
      <div className="ph-body">
        {s.feedbackWritten && !bannerOff && tabKey === '轨迹' && (
          <div className="banner-ok" style={{ background: '#E9EDFF', color: '#3B3BF5' }}><Icon name="check" size={16} stroke={2.6} color="#1FBF75" />意向已重新计算<button style={{ marginLeft: 'auto' }} onClick={() => setBannerOff(true)}><Icon name="close" size={16} /></button></div>
        )}
        <div className="card">
          <div className="row" style={{ gap: 14 }}>
            <img className="av" src={customer.portrait} width={72} height={72} style={{ background: '#EEF1FF' }} />
            <div>
              <div className="row" style={{ gap: 10 }}><b style={{ fontSize: 25 }}>林女士</b><span className="s01-a">A类</span></div>
              <p className="light" style={{ fontSize: 14, marginTop: 8 }}>负责人 <b style={{ color: '#1A1D2E', marginLeft: 8 }}>张顾问</b></p>
            </div>
          </div>
          <div className="row s01-src">{SRC_TAGS.map(([t, c], i) => <span key={t} className="row" style={{ gap: 6 }}>{i > 0 && <i className="s01-sep" />}<span className={`tag ${c} s01-pill`}>{t}</span></span>)}</div>
        </div>
        <div className="tabs" style={{ background: 'transparent' }}>
          {['画像', '接待', '轨迹', '任务'].map((t) => <button key={t} className={tabKey === t ? 'on' : ''} onClick={() => setTab(t)} data-testid={`s01-tab-${t}`}>{t}</button>)}
        </div>

        {tabKey === '画像' && (
          <div className="card">
            {[['客户类型', customerProfile.customerType], ['年龄', customerProfile.ageRange], ['家庭', customerProfile.familyStatus], ['预算', customerProfile.budget], ['意向面积', customerProfile.areaPreference], ['关注点', customerProfile.focusPoints.join('、')], ['抗性点', customerProfile.resistancePoints.join('、')], ['认可点', customerProfile.recognizedPoints.join('、')]].map(([k, v]) => (
              <div className="kv" key={k}><span className="k">{k}</span><span className="v">{v}</span></div>
            ))}
          </div>
        )}
        {tabKey === '接待' && (
          <div className="card">
            <div className="card-hd"><span className="ic ic-blue"><Icon name="clock" size={14} /></span>首访 2 人 · {reception.startAt}–{reception.endAt}</div>
            {reception.timeline.map((t) => (
              <div className="trail-row" key={t.time}><span className="trail-dot" /><b className="num">{t.time}</b><span style={{ fontSize: 13 }}>{t.title}</span><small className="light" style={{ marginLeft: 'auto', maxWidth: 150, textAlign: 'right' }}>{t.desc}</small></div>
            ))}
          </div>
        )}
        {tabKey === '轨迹' && (
          <>
            <div className="card">
              <div className="card-hd">意向轨迹</div>
              {intent.trail.filter((_, i) => i < 2 || s.feedbackWritten).map((t, i, arr) => (
                <div key={t.time} className={`itl ${i === arr.length - 1 && s.feedbackWritten ? 'on' : ''}`}><span className="itl-dot" /><div><b className="num">{t.time}</b><p>{t.label}</p></div></div>
              ))}
            </div>
            <div className="card">
              <div className="card-hd">评分变化</div>
              {[['chart', 'AI 评分', intent.aiScoreBefore, sc.aiScore, '#3B6BFF'], ['star', '诚意度', intent.sincerityBefore, sc.sincerity, '#8B5CF6'], ['target', '匹配度', intent.match, intent.match, '#3B6BFF']].map(([ic, k, a, b, c]) => (
                <div className="score-row" key={k as string}>
                  <span className="ic" style={{ background: '#EEF1FF', color: c as string }}><Icon name={ic as string} size={14} /></span>
                  <span style={{ flex: 1, fontSize: 14 }}>{k}</span>
                  <b className="num" style={{ fontSize: 20 }}>{a}</b>
                  {a !== b && <><span className="light">→</span><b className="num" style={{ fontSize: 20, color: '#13B37A' }} data-testid={`score-${k}`}>{b}</b><span style={{ color: '#13B37A', fontSize: 12 }}>▲</span></>}
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-hd">变化原因</div>
              <div className="notice row" style={{ background: "#FFF4E5", borderColor: "#FFD9A8", color: "#1A1D2E", borderStyle: "solid" }}><Icon name="file" size={14} color="#F08A00" />{intent.changeReason}</div>
              {s.feedbackWritten && <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>本次反馈：{intent.feedback}</p>}
            </div>
          </>
        )}
        {tabKey === '任务' && (
          <>
            {s.tasksGenerated ? (
              <div className="banner-ok big" style={{ background: '#ECEEFF', color: '#3B3BF5' }}><span className="ok-dot" style={{ background: '#3B3BF5' }}><Icon name="check" size={14} stroke={3} color="#fff" /></span>已生成 2 条跟进任务</div>
            ) : <div className="empty">盘客后可一键生成跟进任务</div>}
            {s.tasksGenerated && tasks.map((t, i) => (
              <div className="card" key={t.taskId}>
                <div className="row" style={{ marginBottom: 6 }}><span className={`tag ${t.priority === '高' ? 't-red' : 't-orange'}`} style={{ background: t.priority === '高' ? '#F5455C' : '#FF9F1A', color: '#fff' }}>{t.priority}</span><b style={{ fontSize: 16 }}>{t.title}</b>
                  {i === 0 && s.feedbackWritten && <span className="tag t-green" style={{ marginLeft: 'auto' }}>已完成</span>}</div>
                <div className="kv kv-ic"><span className="k"><Icon name="user" size={16} />负责人</span><span className="v">{t.owner}</span></div>
                <div className="kv kv-ic"><span className="k"><Icon name="calendar" size={16} />截止</span><span className="v" style={{ fontWeight: 600 }}>{t.dueAt}</span></div>
                <div className="kv kv-ic"><span className="k"><Icon name="target" size={16} />目标</span><span className="v">{t.goal}</span></div>
              </div>
            ))}
          </>
        )}
        {calc && <div className="ph-mask center"><div className="ph-dialog" style={{ textAlign: 'center' }}><span className="spin" style={{ width: 32, height: 32, borderWidth: 3, borderColor: '#E3E8F2', borderTopColor: '#3B3BF5' }} /><p style={{ marginTop: 12, fontWeight: 600 }}>正在重新计算意向…</p></div></div>}
      </div>
      {tabKey === '任务' && s.tasksGenerated && !s.feedbackWritten ? (
        <div className="ph-foot">
          <button className="btn btn-ghost btn-sm" style={{ flex: '0 0 92px' }} onClick={() => s.showToast('新建任务为演示占位', 'info')}>新建任务</button>
          <button className="btn btn-primary btn-sm" onClick={() => setFb(true)} data-testid="write-feedback">完成并回写反馈</button>
          <button className="btn btn-ghost btn-sm" style={{ flex: '0 0 72px' }} onClick={() => s.showToast('已延期 1 天', 'info')}>延期</button>
        </div>
      ) : s.feedbackWritten ? (
        <div className="ph-foot"><button className="btn btn-primary" onClick={() => nav('/c03')} data-testid="view-revisit">查看复访准备</button></div>
      ) : <BottomNav active="客户" />}

      {fb && (
        <Sheet title="完成并回写反馈" onClose={() => setFb(false)} footer={<button className="btn btn-primary" onClick={submit} data-testid="feedback-submit">提交并重新计算意向</button>}>
          <p className="muted" style={{ fontSize: 13, marginTop: -6 }}>任务：{tasks[0].title}</p>
          <b style={{ fontSize: 14 }}>本次反馈</b>
          <textarea className="ta" defaultValue={intent.feedback} />
          <b style={{ fontSize: 14 }}>待验证变化</b>
          <div className="row" style={{ gap: 10 }}>
            {['预算是否调整', '居住人数'].map((v) => <button key={v} className={`radio ${verify === v ? 'on' : ''}`} onClick={() => setVerify(v)}><span />{v}</button>)}
          </div>
          <b style={{ fontSize: 14 }}>计划复访</b>
          <div className="date-row"><Icon name="clock" size={16} />{receptionPrep.revisit.planDate}<Icon name="right" size={14} color="#9AA1B2" style={{ marginLeft: 'auto' }} /></div>
        </Sheet>
      )}
    </PhoneFrame>
  )
}

function S01Pc() {
  const nav = useNavigate()
  const s = useDemo()
  const sc = useScores()
  const done = s.feedbackWritten
  return (
    <PcFrame title="客户详情与跟进任务" active="客户" zoom={1}>
      <div className="p-grid" style={{ gridTemplateColumns: '580px 1fr', height: 228 }}>
        <Panel>
          <div className="p-row" style={{ gap: 24, height: '100%' }}>
            <img className="p-av" src={customer.portrait} width={150} height={150} style={{ border: '3px solid rgba(120,140,255,.5)', background: '#1C2A73' }} />
            <div className="p-col" style={{ gap: 14 }}>
              <b style={{ fontSize: 26 }}>客户详情 / 林女士</b>
              <div className="p-row"><span className="ptag pt-solid" style={{ fontSize: 18, height: 40, padding: '0 22px', borderRadius: 8 }}>A类</span><span className="p-mute">负责人</span><b>张顾问</b></div>
              <div className="p-row" style={{ gap: 8 }}>{SRC_TAGS.map(([t]) => <span key={t} className="ptag pt-gray s01-ptag">{t}</span>)}</div>
            </div>
          </div>
        </Panel>
        <Panel title="复访准备" extra={<div className="inner" style={{ padding: '8px 16px' }}><span className="p-mute">计划复访</span><b className="p-num" style={{ fontSize: 26, color: '#4FE6D2', marginLeft: 12 }}>{receptionPrep.revisit.planDate}</b></div>}>
          <div className="p-row" style={{ gap: 10 }}>
            {[['上次关注', receptionPrep.revisit.last], ['本次变化', receptionPrep.revisit.change], ['待验证', receptionPrep.revisit.verify], ['推荐策略', receptionPrep.revisit.strategy]].map(([k, v], i) => (
              <div key={k} className="p-row" style={{ flex: i === 3 ? 1.6 : 1, gap: 10 }}>
                <div className="inner" style={{ flex: 1 }}><p className="p-mute" style={{ fontSize: 14 }}>{k}</p><b style={{ fontSize: 17, marginTop: 8, display: 'block' }}>{v}</b></div>
                {i < 3 && <Icon name="right" size={18} color="#6F7AA8" />}
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="p-grid" style={{ gridTemplateColumns: '580px 1fr 1fr', flex: 1 }}>
        <Panel title="客户画像">
          <div className="inner p-row"><Icon name="sparkle" size={22} color="#4FE6D2" /><b style={{ fontSize: 20 }}>{customerProfile.customerType}</b></div>
          <div className="inner"><p className="p-mute">预算</p><b className="p-num" style={{ fontSize: 34, color: '#4FE6D2' }}>{customerProfile.budget}</b><span className="p-mute" style={{ marginLeft: 8 }}>· {customerProfile.areaPreference}</span></div>
          {[['关注点', customerProfile.focusPoints.join('、'), '#FF9F1A'], ['抗性点', customerProfile.resistancePoints.join('、'), '#F5455C'], ['认可点', customerProfile.recognizedPoints.join('、'), '#1FD18B']].map(([k, v, c]) => (
            <div key={k} className="p-row inner" style={{ padding: '10px 14px' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: c }} /><span className="p-mute" style={{ width: 70 }}>{k}</span>{v}</div>
          ))}
        </Panel>
        <Panel title="接待记录" extra={<span>查看更多 ›</span>}>
          <div className="p-tl">
            {receptionRecords.filter((r, i) => i < 3 || done || r.type !== '电话回访').map((r, i) => (
              <div key={r.type} className="p-tl-row" style={i === 0 ? { background: 'rgba(59,107,255,.15)', borderRadius: 10, padding: '10px 10px 16px' } : { padding: '10px 10px 16px' }}>
                <span className="p-tl-dot" />
                <span className="p-num" style={{ width: 56, color: i === 0 ? '#8FB0FF' : '#A8B3DE' }}>{r.date}</span>
                <b style={{ width: 90 }}>{r.type}</b>
                <span className="p-num p-mute" style={{ width: 120 }}>{r.time}</span>
                <span className="p-mute" style={{ marginLeft: 'auto' }}>张顾问</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="意向轨迹">
          <div className="p-row" style={{ justifyContent: 'space-between', padding: '0 20px' }}>
            {intent.trail.map((t, i) => (
              <div key={t.time} className="p-row" style={{ flex: i < 2 ? 1 : 0 }}>
                <div style={{ textAlign: 'center', opacity: i === 2 && !done ? .35 : 1 }}>
                  <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 9, border: `4px solid ${['#2FD4C0', '#8B5CF6', '#FF9F1A'][i]}` }} />
                  <p className="p-num" style={{ fontSize: 15 }}>{t.time}</p><p style={{ fontSize: 14 }}>{t.label.replace('首访', '').replace('盘客', '')}</p>
                </div>
                {i < 2 && <div style={{ flex: 1, borderTop: '1px dashed rgba(120,140,255,.4)', margin: '0 10px 30px' }} />}
              </div>
            ))}
          </div>
          <div className="p-row" style={{ gap: 12, flex: 1 }}>
            {[['AI 评分', intent.aiScoreBefore, sc.aiScore, [52, 58, 66, 72, 78, 82, sc.aiScore], '#2FD4C0'], ['诚意度', intent.sincerityBefore, sc.sincerity, [50, 56, 62, 68, 72, 76, sc.sincerity], '#B79BFF']].map(([k, a, b, d, c]) => (
              <div key={k as string} className="inner" style={{ flex: 1, padding: 12 }}>
                <p className="p-mute" style={{ fontSize: 14 }}>{k}</p>
                <b className="p-num" style={{ fontSize: 28 }}>{a}{a !== b && <> → <span style={{ color: '#2FE0A0' }}>{b}</span> ↗</>}</b>
                <LineChart labels={['', '', '', '', '', '', '']} series={[{ data: d as number[], color: c as string }]} w={230} h={100} max={100} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="p-grid" style={{ gridTemplateColumns: '1fr 640px', height: 230 }}>
        <Panel title="跟进任务">
          <table className="ptable">
            <thead><tr><th>任务内容</th><th>负责人</th><th>计划时间</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
              {tasks.map((t, i) => (
                <tr key={t.taskId}>
                  <td><Icon name={i === 0 && done ? 'check' : 'clock'} size={16} color={i === 0 && done ? '#2FE0A0' : '#8FB0FF'} /> {t.title}</td>
                  <td>{t.owner}</td><td className="p-num">{t.dueAt}</td>
                  <td>{s.tasksGenerated ? (i === 0 && done ? <span className="ptag pt-green">已完成</span> : <span className="ptag pt-orange">进行中</span>) : <span className="ptag pt-gray">待生成</span>}</td>
                  <td className="p-mute">···</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <div className="p-col" style={{ gap: 18 }}>
          <Panel style={{ flex: 1 }}><p className="p-mute"><Icon name="file" size={16} /> 本次反馈</p><b style={{ fontSize: 18 }}>{done ? intent.feedback : '暂无回写反馈'}</b></Panel>
          <div className="p-row" style={{ gap: 18 }}>
            <button className="pbtn pbtn-primary" style={{ flex: 1, height: 56 }} onClick={() => nav('/m04')} data-testid="pc-view-analysis"><Icon name="chart" size={18} />查看接待分析</button>
            <button className="pbtn pbtn-ghost" style={{ flex: 1, height: 56 }} onClick={() => s.showToast('新建任务为演示占位')}><Icon name="plus" size={18} />新建任务</button>
          </div>
        </div>
      </div>
    </PcFrame>
  )
}
