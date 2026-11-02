import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PhoneFrame, NavBar } from '../../components/PhoneFrame'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { IMG } from '../../mock/images'
import { aiCard, customer, deliveryDoc, visitTrail, PROJECT_NAME } from '../../mock/data'

/** C-06 AI 名片 / AI 分身 / 授权与访问轨迹（UI-20 / UI-21 / UI-22） */
export default function C06() {
  const loc = useLocation()
  if (loc.pathname.endsWith('/chat')) return <Chat />
  if (loc.pathname.endsWith('/trail')) return <Trail />
  return <Card />
}

function Card() {
  const nav = useNavigate()
  const s = useDemo()
  return (
    <PhoneFrame>
      <NavBar title="AI 名片" back="/c04/summary" right={<span className="tag t-violet">客户预览</span>} />
      <div className="ph-body">
        <div className="grad card-hero">
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 24 }}>张顾问</b>
            <p style={{ opacity: .9, marginTop: 6 }}>{PROJECT_NAME} · 销售顾问</p>
            <p style={{ opacity: .75, marginTop: 4, fontSize: 12 }}>改善家庭置换 · 服务 126 组家庭</p>
            <button className="tag t-white" style={{ height: 30, padding: '0 14px', marginTop: 14, fontSize: 13 }} onClick={() => s.showToast('分享成功')} data-testid="forward-card"><Icon name="share" size={14} />转发名片</button>
          </div>
          <img src={IMG.zhangCard} width={110} height={138} style={{ objectFit: 'cover', borderRadius: 12 }} />
        </div>
        <div className="card">
          <div className="card-hd"><span className="ic ic-blue"><Icon name="file" size={14} /></span>项目资料</div>
          <div className="row" style={{ gap: 8 }}>
            {aiCard.materials.map((m) => (
              <button key={m.title} className="mat" onClick={() => s.showToast(`已打开「${m.title}」资料`, 'info')}>
                <img src={m.img} />
                <span>{m.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="card row" style={{ gap: 10 }}>
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 15 }}>AI 分身</b>
            <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>有问题可随时问我的 AI 分身</p>
            <p className="light" style={{ fontSize: 12, marginTop: 4 }}>基于张顾问个人知识库与项目资料回答</p>
          </div>
          <img src={IMG.robot} width={110} height={78} style={{ objectFit: 'cover', borderRadius: 10 }} />
        </div>
      </div>
      <div className="ph-foot"><button className="btn btn-primary" onClick={() => nav('/c06/chat')} data-testid="chat-ai"><Icon name="chat" size={16} />与 AI 分身聊聊</button></div>
    </PhoneFrame>
  )
}

type Msg = { from: 'me' | 'ai'; text: string; attach?: boolean; basis?: string; handoff?: boolean }

function Chat() {
  const nav = useNavigate()
  const s = useDemo()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [typing, setTyping] = useState(false)
  const [asked2, setAsked2] = useState(false)
  const [auth, setAuth] = useState(false)
  const [input, setInput] = useState('')
  const box = useRef<HTMLDivElement>(null)
  const push = (q: string, a: Msg) => {
    setMsgs((m) => [...m, { from: 'me', text: q }])
    setTyping(true)
    setTimeout(() => { setTyping(false); setMsgs((m) => [...m, a]) }, 900)
  }
  useEffect(() => {
    const c = aiCard.chat[0]
    const t = setTimeout(() => push(c.q, { from: 'ai', text: c.a, attach: true, basis: c.basis }), 300)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => { box.current?.scrollTo({ top: 99999, behavior: 'smooth' }) }, [msgs, typing])
  const ask2 = () => {
    if (asked2) return
    setAsked2(true)
    const c = aiCard.chat[1]
    push(c.q, { from: 'ai', text: c.a, handoff: true })
  }
  const send = () => {
    if (!input.trim()) { ask2(); return }
    const q = input
    setInput('')
    push(q, { from: 'ai', text: '已收到您的问题，我会结合项目资料回复；需要确认的内容已同步给张顾问。', basis: '个人知识库 / 项目资料' })
  }
  return (
    <PhoneFrame>
      <NavBar title="张顾问的 AI 分身" back="/c06" right={<span className="tag t-violet">客户预览</span>} />
      <div className="ph-body chat" ref={box}>
        <p className="light" style={{ textAlign: 'center', fontSize: 12 }}>13:30 · 林女士 打开了 AI 名片</p>
        {msgs.map((m, i) => m.from === 'me' ? (
          <div key={i} className="bubble-me">{m.text}</div>
        ) : (
          <div key={i} className="row" style={{ alignItems: 'flex-start', gap: 8 }}>
            <img src={IMG.robotS} width={32} height={32} style={{ borderRadius: 16 }} />
            <div className="bubble-ai">
              <p>{m.text}</p>
              {m.attach && <button className="file-row" style={{ marginTop: 8, width: '100%' }} onClick={() => s.showToast(`已打开 ${deliveryDoc.file}`, 'info')}><Icon name="file" size={20} color="#F5455C" /><span style={{ flex: 1, textAlign: 'left' }}>{deliveryDoc.file}<small className="light" style={{ display: 'block', fontWeight: 400 }}>{deliveryDoc.size}</small></span></button>}
              {m.basis && <p className="light" style={{ fontSize: 11, marginTop: 6 }}>回答依据：{m.basis}</p>}
              {m.handoff && <span className="tag t-orange" style={{ marginTop: 8 }}><Icon name="user" size={12} />需要顾问进一步确认</span>}
            </div>
          </div>
        ))}
        {typing && <div className="row" style={{ gap: 8 }}><img src={IMG.robotS} width={32} height={32} style={{ borderRadius: 16 }} /><div className="bubble-ai typing"><span /><span /><span /></div></div>}
        {!asked2 && msgs.length >= 2 && (
          <button className="suggest" onClick={ask2} data-testid="ask-elder">试试问：如果家里老人也要住，能调整户型吗？</button>
        )}
      </div>
      <div className="chat-ops">
        <button className="tag t-gray" style={{ height: 30, padding: '0 12px' }} onClick={() => s.showToast('已为您通知张顾问，稍后联系您')}><Icon name="user" size={13} />转人工</button>
        <button className="tag t-blue" style={{ height: 30, padding: '0 12px' }} onClick={() => setAuth(true)} data-testid="phone-auth"><Icon name="phone" size={13} />手机号授权</button>
      </div>
      <div className="chat-input">
        <input placeholder="请输入问题" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
        <button onClick={send}><Icon name="send" size={18} color="#fff" /></button>
      </div>
      {auth && (
        <div className="ph-mask center" data-testid="auth-dialog">
          <div className="ph-dialog">
            <b style={{ fontSize: 17 }}>手机号授权</b>
            <p className="muted" style={{ fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>授权后张顾问可通过手机号为您提供专属服务，您的浏览记录仅用于服务跟进。</p>
            <div className="file-row" style={{ marginTop: 12 }}><Icon name="phone" size={18} color="#3B6BFF" />{customer.phoneMasked}<span className="tag t-green" style={{ marginLeft: 'auto' }}>本机号码</span></div>
            <div className="row" style={{ gap: 10, marginTop: 16 }}>
              <button className="btn btn-ghost" onClick={() => setAuth(false)}>暂不授权</button>
              <button className="btn btn-primary" onClick={() => { s.set({ phoneAuthorized: true }); s.showToast('授权成功'); nav('/c06/trail') }} data-testid="auth-confirm">同意授权</button>
            </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  )
}

function Trail() {
  const nav = useNavigate()
  return (
    <PhoneFrame>
      <NavBar title="客户触达 · 林女士" back="/c06/chat" />
      <div className="ph-body">
        <div className="card row" style={{ gap: 10 }}>
          <img className="av" src={customer.avatar} width={46} height={46} />
          <div style={{ flex: 1 }}>
            <div className="row"><b style={{ fontSize: 16 }}>林女士</b><span className="tag t-green"><Icon name="check" size={12} stroke={2.6} />已授权</span></div>
            <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>{customer.phoneMasked} · 授权时间 {visitTrail.authorizedAt}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><span className="ic ic-blue"><Icon name="eye" size={14} /></span>最近访问轨迹</div>
          <div className="trail">
            {visitTrail.items.map((t) => (
              <div key={t.label} className="trail-row">
                <span className="trail-dot" />
                <b>{t.label}</b>
                <span className="tag t-blue">{t.count} 次</span>
                <span className="light" style={{ marginLeft: 'auto', fontSize: 12 }}>{t.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="signal">
          <Icon name="sparkle" size={20} color="#FF9F1A" />
          <div><b>隐藏信号</b><p>{visitTrail.signal}</p></div>
        </div>
        <div className="card">
          <div className="card-hd"><span className="ic ic-violet"><Icon name="chat" size={14} /></span>AI 分身对话摘要</div>
          <p className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>13:30–13:41 咨询 2 个问题：交付时间（已回答并发送资料）、老人同住户型调整（已转张顾问确认）。</p>
        </div>
      </div>
      <div className="ph-foot"><button className="btn btn-primary" onClick={() => nav('/c05')} data-testid="go-review">继续盘客</button></div>
    </PhoneFrame>
  )
}
