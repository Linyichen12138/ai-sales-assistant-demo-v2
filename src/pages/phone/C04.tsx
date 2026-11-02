import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PhoneFrame, Sheet } from '../../components/PhoneFrame'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { IMG } from '../../mock/images'
import { customer, deliveryDoc, guidance, reception } from '../../mock/data'

function fmt(sec: number) {
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`
}

/** C-04 接待中（UI-10 / UI-17 / UI-18） */
export default function C04() {
  const nav = useNavigate()
  const s = useDemo()
  const [sec, setSec] = useState(32 * 60 + 18)
  const [doc, setDoc] = useState(false)
  const [asked, setAsked] = useState(false)
  useEffect(() => {
    if (!s.receptionStarted) s.set({ receptionStarted: true })
    const t = setInterval(() => setSec((x) => x + 1), 1000)
    return () => clearInterval(t)
  }, [])
  if (s.receptionEnded) return <Navigate to="/c04/summary" replace />
  const mark = () => {
    if (s.blockerMarked) { s.showToast('卡点已同步至作战室'); return }
    s.set({ blockerMarked: true })
    s.showToast('卡点已同步至作战室')
  }
  const end = () => { s.set({ receptionEnded: true, guidanceSeen: true }); nav('/c04/summary') }
  const popup = s.guidanceSent && !s.guidanceSeen
  return (
    <PhoneFrame>
      <div className="ph-body" style={{ paddingTop: 8 }}>
        <div className="grad live-hd">
          <div style={{ position: 'relative' }}>
            <img className="av" src={customer.avatar} width={52} height={52} style={{ border: '2px solid #fff' }} />
            <span className="live-dot" />
          </div>
          <b style={{ fontSize: 20 }}>{customer.name}</b>
          <span className="tag t-glass" style={{ height: 26 }}>接待中</span>
          <span className="num live-timer">{fmt(sec)}</span>
        </div>

        {s.guidanceSent && (
          <button className="card guide-card" onClick={() => setDoc(true)} data-testid="guide-card">
            <Icon name="bell" size={18} color="#FF9F1A" />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <b style={{ fontSize: 13 }}>陈经理远程指导 · {guidance.sentAt}</b>
              <p style={{ fontSize: 13, marginTop: 2 }}>{guidance.content} · 附《{guidance.attachment}》</p>
            </div>
            <Icon name="right" size={16} color="#9AA1B2" />
          </button>
        )}

        <div className="card">
          <div className="card-hd"><span className="ic ic-blue"><Icon name="target" size={14} /></span>当前关注</div>
          <div className="row" style={{ gap: 8 }}>
            <span className="tag t-blue" style={{ height: 32, padding: '0 12px', fontSize: 13 }}><Icon name="file" size={13} />交付条件</span>
            <span className="tag t-violet" style={{ height: 32, padding: '0 12px', fontSize: 13 }}><Icon name="home" size={13} />儿童房</span>
          </div>
        </div>

        <div className="card row" style={{ alignItems: 'stretch', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="card-hd"><span className="ic ic-green"><Icon name="chat" size={14} /></span>已问</div>
            <div className="ask-row green"><Icon name="check" size={14} color="#1FBF75" stroke={2.6} />预算</div>
            {asked && <div className="ask-row green" style={{ marginTop: 6 }}><Icon name="check" size={14} color="#1FBF75" stroke={2.6} />出行要求</div>}
          </div>
          <div style={{ width: 1, background: '#EEF1F7' }} />
          <div style={{ flex: 1 }}>
            <div className="card-hd"><span className="ic ic-orange"><Icon name="clock" size={14} /></span>待问</div>
            {asked ? <p className="light" style={{ fontSize: 12, padding: 8 }}>已全部问完</p> : (
              <button className="ask-row orange" onClick={() => { setAsked(true); s.showToast('已记录：出行要求') }}><span className="ring" />出行要求<Icon name="right" size={12} style={{ marginLeft: 'auto' }} /></button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-hd"><span className="ic ic-blue"><Icon name="sparkle" size={14} /></span><span style={{ color: '#3B3BF5' }}>AI 实时提示</span></div>
          <div className="ai-tip"><Icon name="sparkle" size={16} color="#3B3BF5" />{reception.aiTip}</div>
          <div className="row" style={{ marginTop: 10, gap: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setDoc(true)} data-testid="view-doc">查看资料</button>
            <button className={`btn btn-sm ${s.blockerMarked ? 'btn-soft' : 'btn-primary'}`} onClick={mark} data-testid="mark-blocker">
              <Icon name="check" size={14} stroke={2.6} />{s.blockerMarked ? '已标记卡点' : '标记卡点'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-hd"><span className="ic ic-violet"><Icon name="chat" size={14} /></span>关键原话</div>
          <div className="quote" style={{ fontSize: 16 }}>{reception.keyQuote.text}</div>
          <p className="light" style={{ textAlign: 'right', fontSize: 12, marginTop: 6 }}>{reception.keyQuote.time}</p>
        </div>

        <div className="card">
          <div className="card-hd"><span className="ic ic-red"><Icon name="warn" size={14} /></span>客户抗性</div>
          <span className="tag t-orange" style={{ height: 30, padding: '0 12px', fontSize: 13 }}><Icon name="warn" size={13} />{reception.resistance}</span>
        </div>
      </div>
      <div className="ph-foot">
        <button className="btn btn-ghost" onClick={end} data-testid="end-reception">结束接待</button>
        <button className="btn btn-primary" onClick={() => { s.set({ receptionEnded: true, guidanceSeen: true }); nav('/c04/summary') }} data-testid="send-card-c04"><Icon name="user" size={16} />发 AI 名片</button>
      </div>

      {popup && (
        <div className="ph-mask center" data-testid="guidance-popup">
          <div className="ph-dialog gd-dialog">
            <div className="gd-hd"><img src={IMG.cropBell} width={50} height={47} alt="" /><b>收到远程指导</b></div>
            <div className="gd-body">
              <div className="row" style={{ gap: 12 }}>
                <img className="av" src={IMG.avChen} width={64} height={64} alt="" />
                <span style={{ fontSize: 17, fontWeight: 800, color: '#151A2D' }}>{guidance.from}</span><span className="muted" style={{ fontSize: 14, marginLeft: -4 }}>发来指导</span>
              </div>
              <p className="gd-title">{guidance.content}</p>
              <div className="file-row gd-file"><img src={IMG.cropDoc} width={28} height={33} alt="" /><span>{guidance.attachment}</span><Icon name="right" size={16} color="#9AA1B2" style={{ marginLeft: 'auto' }} /></div>
              <p className="light" style={{ fontSize: 12, marginTop: 10 }}>{guidance.sentAt} · 站内提醒</p>
            <div className="row" style={{ gap: 10, marginTop: 14 }}>
              <button className="btn btn-ghost" onClick={() => s.set({ guidanceSeen: true })} data-testid="guidance-ok">知道了</button>
              <button className="btn btn-primary" onClick={() => { s.set({ guidanceSeen: true }); setDoc(true) }} data-testid="guidance-view">查看资料</button>
            </div>
            </div>
          </div>
        </div>
      )}

      {doc && (
        <Sheet title={<span className="doc-title2">产品知识资料 · {deliveryDoc.title}{s.guidanceSent && <span className="tag t-orange doc-push"><Icon name="send" size={13} />陈经理推送</span>}</span>} onClose={() => setDoc(false)}
          footer={<>
            <button className="btn btn-gray" onClick={() => setDoc(false)} data-testid="doc-close">关闭</button>
            <button className="btn btn-primary" onClick={() => { setDoc(false); s.showToast('已发送给林女士') }} data-testid="doc-send">发给客户</button>
          </>}>
          <img src={deliveryDoc.img} style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 10 }} />
          {deliveryDoc.items.map((it, i) => (
            <div key={it} className={`doc-item di-${i}`}><span className="num">{i + 1}</span><b>{it}</b><Icon name="right" size={14} color="#9AA1B2" style={{ marginLeft: 'auto' }} /></div>
          ))}
        </Sheet>
      )}
    </PhoneFrame>
  )
}
