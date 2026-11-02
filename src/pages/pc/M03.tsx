import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PcFrame, Panel, Drawer, Modal } from '../../components/PcFrame'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { customer, customerProfile, deliveryDoc, guidance, reception, riskEvidence } from '../../mock/data'

/** M-03 实时客户详情与远程指导（UI-13 / UI-14 / UI-15 / UI-16） */
export default function M03() {
  const nav = useNavigate()
  const s = useDemo()
  const [send, setSend] = useState(false)
  const [ev, setEv] = useState(false)
  const [hl, setHl] = useState(false)
  const [channel, setChannel] = useState('站内提醒')
  const [content, setContent] = useState(guidance.content)
  const timeline = s.blockerMarked ? reception.timeline : reception.timeline.slice(0, 2)
  const confirmSend = () => {
    setSend(false)
    s.set({ guidanceSent: true, guidanceSeen: false })
    s.showToast('指导已发送至张顾问')
  }
  const markResp = () => {
    if (!s.guidanceSent) { s.showToast('请先发送指导，待顾问回应后再标记', 'warn'); return }
    s.set({ riskStatus: '已回应' })
    s.showToast('风险状态已更新为「已回应」')
  }
  const status = s.riskStatus
  return (
    <PcFrame title="实时客户详情与远程指导" active="作战室">
      <div className="panel p-row" style={{ padding: '14px 22px', fontSize: 18 }}>
        <button onClick={() => nav('/m02')} className="p-row" data-testid="crumb-back"><Icon name="back" size={22} />作战室</button>
        <span className="p-light">/</span><b>林女士</b><span className="p-light">/</span>
        <span className="ptag pt-teal">接待中</span>
        {s.guidanceSent && <span className="ptag pt-green" style={{ marginLeft: 'auto' }}><Icon name="check" size={14} />指导已发送 {guidance.sentAt}</span>}
      </div>
      <div className="p-grid" style={{ gridTemplateColumns: '483px minmax(0,1fr)', flex: 1 }}>
        <Panel title="客户画像">
          <div className="inner p-col" style={{ gap: 14, flex: 1 }}>
            <div className="p-row" style={{ gap: 20 }}>
              <img className="p-av" src={customer.avatar} width={140} height={140} style={{ border: '3px solid rgba(120,140,255,.5)', background: '#E9EDFF' }} />
              <b style={{ fontSize: 36 }}>林女士</b><span className="ptag pt-teal" style={{ fontSize: 16, height: 32 }}>接待中</span>
            </div>
            {[['home', '家庭', customerProfile.familyShort, '#3B8BFF'], ['cart', '预算', customerProfile.budget, '#8B5CF6'], ['star', '关注', customerProfile.focusPoints.join('、'), '#FF9F1A'], ['shield', '抗性', customerProfile.resistancePoints.join('、'), '#F5455C']].map(([ic, k, v, c]) => (
              <div key={k} className="inner p-row" style={{ gap: 18, padding: '18px 20px', background: 'rgba(19,33,92,.9)' }}>
                <Icon name={ic} size={24} color={c} /><span className="p-mute" style={{ width: 50, fontSize: 17 }}>{k}</span><b style={{ fontSize: 22 }}>{v}</b>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="沟通时间线">
          <div className="p-col" style={{ gap: 16 }}>
            {timeline.map((t) => (
              <div key={t.time} className="p-row" style={{ gap: 18 }}>
                <span style={{ width: 22, height: 22, borderRadius: 11, border: `4px solid ${t.highlight ? '#FF9F1A' : t.time === '10:30' ? '#2FD4C0' : '#3B8BFF'}`, background: '#0A1238', flexShrink: 0 }} />
                <div className={`inner p-row ${t.highlight ? 'tl-hl' : ''} ${t.highlight && hl ? 'hl-quote' : ''}`} style={{ flex: 1, gap: 30, padding: '18px 24px' }}>
                  <b className="p-num" style={{ fontSize: 34, color: t.highlight ? '#FFB547' : '#fff' }}>{t.time}</b>
                  <div>
                    <b style={{ fontSize: 20 }}>{t.highlight ? '关键原话：' : t.title}</b>
                    <p style={{ fontSize: t.highlight ? 26 : 16, fontWeight: t.highlight ? 800 : 400, color: t.highlight ? '#FFB547' : '#A8B3DE', marginTop: 4 }}>{t.highlight ? '“交付时间能确定吗？”' : t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            {!s.blockerMarked && <div className="inner p-mute" style={{ textAlign: 'center' }}>接待进行中，暂未标记卡点</div>}
          </div>
          <div className="p-row" style={{ gap: 18, marginTop: 'auto' }}>
            <div className="inner p-row" style={{ flex: 1, gap: 18, borderColor: '#FF9F1A', background: 'rgba(255,159,26,.1)', padding: '20px 24px' }}>
              <span className="big-ic" style={{ background: 'linear-gradient(135deg,#FFB547,#FF8A1A)' }}>!</span>
              <div><p className="p-mute">AI 识别卡点：</p><b style={{ fontSize: 26, color: '#FFB547' }}>{s.guidanceSent ? '已指导 · 待顾问回应' : '顾虑未回应'}</b></div>
            </div>
            <button className="inner p-row" style={{ flex: 1, gap: 18, padding: '20px 24px', borderColor: '#3B6BFF' }} onClick={() => s.showToast(`已打开《${deliveryDoc.title}》`)}>
              <span className="big-ic" style={{ background: 'linear-gradient(135deg,#5B7BFF,#6A3CF0)' }}><Icon name="file" size={28} color="#fff" /></span>
              <div style={{ textAlign: 'left' }}><p className="p-mute">推荐资料：</p><b style={{ fontSize: 26 }}>{deliveryDoc.title}</b></div>
              <Icon name="right" size={22} style={{ marginLeft: 'auto' }} />
            </button>
          </div>
          <div className="p-row" style={{ gap: 18 }}>
            <button className={`pbtn ${s.guidanceSent ? 'pbtn-ok' : 'pbtn-primary'}`} style={{ flex: 1.2, height: 64, fontSize: 20 }} onClick={() => s.guidanceSent ? s.showToast(`指导已于 ${guidance.sentAt} 发送`) : setSend(true)} data-testid="send-guidance">
              <Icon name={s.guidanceSent ? 'check' : 'send'} size={22} />{s.guidanceSent ? `已发送 ${guidance.sentAt}` : '发送指导'}
            </button>
            <button className="pbtn pbtn-ghost" style={{ flex: 1, height: 64, fontSize: 18 }} onClick={() => s.showToast('资料已推送至张顾问')}><Icon name="file" size={20} />推送资料</button>
            <button className="pbtn pbtn-ghost" style={{ flex: 1, height: 64, fontSize: 18 }} onClick={() => setEv(true)} data-testid="view-evidence"><Icon name="layers" size={20} />查看证据</button>
            <button className="pbtn pbtn-ghost" style={{ flex: 1, height: 64, fontSize: 18, borderColor: '#F5455C', color: '#FF8A9A' }} onClick={() => s.showToast('已标记风险，纳入控风险跟踪')}><Icon name="warn" size={20} />标记风险</button>
          </div>
        </Panel>
      </div>

      {send && (
        <Modal title="发送指导 · 张顾问" onClose={() => setSend(false)} testid="guidance-modal" width={700}
          footer={<><button className="pbtn pbtn-ghost" onClick={() => setSend(false)}>取消</button><button className="pbtn pbtn-primary" onClick={confirmSend} data-testid="confirm-send">确认发送</button></>}>
          <div className="p-field"><label>指导内容</label><input className="p-input" value={content} onChange={(e) => setContent(e.target.value)} /></div>
          <div className="p-field"><label>触达方式</label>
            <div className="p-row" style={{ gap: 30 }}>{guidance.channels.map((c) => (
              <button key={c} className="p-row" style={{ gap: 10, fontSize: 17 }} onClick={() => setChannel(c)}>
                <span style={{ width: 20, height: 20, borderRadius: 10, border: channel === c ? '6px solid #2FD4C0' : '2px solid #6F7AA8' }} />{c}
              </button>))}
            </div>
          </div>
          <div className="p-field"><label>附带资料</label>
            <div className="inner p-row"><span className="big-ic" style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#5B7BFF,#6A3CF0)' }}><Icon name="file" size={22} color="#fff" /></span><b>{guidance.attachment}</b><Icon name="right" size={18} style={{ marginLeft: 'auto' }} /></div>
          </div>
        </Modal>
      )}
      {ev && (
        <Drawer title="风险证据" onClose={() => { setEv(false); setHl(false) }} testid="evidence-drawer"
          footer={<>
            <button className="pbtn pbtn-ghost" style={{ height: 56 }} onClick={() => { setHl(true); setEv(false); setTimeout(() => setHl(false), 2400) }} data-testid="locate-quote"><Icon name="search" size={20} />定位原话</button>
            <button className="pbtn pbtn-primary" style={{ height: 56 }} onClick={markResp} data-testid="mark-responded"><Icon name="check" size={20} />{status === '已回应' ? '已回应' : '标记已回应'}</button>
          </>}>
          {[['原话', <b style={{ fontSize: 22 }}>“{riskEvidence.quote}”</b>], ['时间点', <b className="p-num" style={{ fontSize: 22 }}>{riskEvidence.timePoint}</b>], ['关联客户', <b style={{ fontSize: 20 }}>{riskEvidence.relatedCustomer}</b>], ['负责顾问', <b style={{ fontSize: 20 }}>{riskEvidence.owner}</b>],
            ['处理状态', <span className={`ptag ${status === '已回应' ? 'pt-green' : ''}`} style={status === '已回应' ? { height: 34, fontSize: 17 } : { height: 34, fontSize: 17, background: 'linear-gradient(90deg,#FF9F1A,#FF7A1A)', color: '#fff' }} data-testid="risk-status">{status}</span>]].map(([k, v]) => (
            <div key={k as string} className="inner p-row" style={{ gap: 20, padding: '18px 18px' }}><span className="p-mute" style={{ width: 70 }}>{k}</span><span style={{ width: 1, height: 26, background: 'rgba(120,140,255,.3)' }} />{v}</div>
          ))}
          {s.guidanceSent && <div className="inner p-mute">处理记录：{riskEvidence.record}</div>}
        </Drawer>
      )}
    </PcFrame>
  )
}
