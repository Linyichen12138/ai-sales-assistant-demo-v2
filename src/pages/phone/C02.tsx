import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame, NavBar, Skeleton, Check } from '../../components/PhoneFrame'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { customer, prediction } from '../../mock/data'

/** C-02 到访签到与客户预测（UI-02 / UI-03 / UI-04） */
export default function C02() {
  const nav = useNavigate()
  const s = useDemo()
  const [visitType, setVisitType] = useState<'首访' | '复访'>('首访')
  const [people, setPeople] = useState(2)
  const [agree, setAgree] = useState(s.signedIn)
  const [name, setName] = useState(customer.name)
  const [phone, setPhone] = useState(customer.phoneMasked)
  const [generating, setGenerating] = useState(s.signedIn && !s.predictionReady)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (!generating) return
    const t = setTimeout(() => setGenerating(false), 2200)
    return () => clearTimeout(t)
  }, [generating])

  const signIn = () => {
    if (!agree) { setShake(true); setTimeout(() => setShake(false), 600); s.showToast('请先确认客户授权', 'warn'); return }
    s.set({ signedIn: true })
    setGenerating(true)
    s.showToast('授权成功，已开始生成客户预测')
  }

  const header = (
    <div className="card row" style={{ gap: 12 }}>
      <img className="av" src={customer.avatar} width={48} height={48} />
      <b style={{ fontSize: 18, whiteSpace: 'nowrap' }}>{customer.name}</b>
      <span className="tag t-teal">{visitType}</span>
      {s.signedIn && <span className="tag t-green"><Icon name="check" size={12} stroke={2.6} />已授权</span>}
      {s.signedIn && !s.predictionReady && <span className="tag t-gray" style={{ marginLeft: 'auto' }}>同行 {people} 人</span>}
    </div>
  )

  // ------- UI-04 预测结果 -------
  if (s.predictionReady) {
    return (
      <PhoneFrame>
        <NavBar title="到访签到与客户预测" back="/c01" right={<button onClick={() => nav('/screen/c02')} data-testid="big-screen" className="row" style={{ gap: 2, color: '#3B3BF5', fontSize: 12 }}><Icon name="monitor" size={15} />大屏</button>} />
        <div className="ph-body">
          {header}
          <div className="grad pred-card">
            <div className="row between"><span style={{ opacity: .85 }}>客户预测</span><span className="tag t-white" style={{ fontWeight: 700 }}>置信度 <b className="num" style={{ fontSize: 15 }}>{prediction.confidence}%</b></span></div>
            <b style={{ fontSize: 23, display: 'block', margin: '6px 0 4px' }}>{prediction.type}</b>
            <span style={{ opacity: .85, fontSize: 13 }}>31–35 岁 · {'已婚，1 个 0–3 岁孩子'}</span>
            <svg className="pred-deco" width="90" height="70" viewBox="0 0 90 70"><rect x="6" y="38" width="18" height="32" rx="3" fill="#fff" opacity=".18" /><rect x="30" y="22" width="18" height="48" rx="3" fill="#fff" opacity=".24" /><rect x="54" y="6" width="18" height="64" rx="3" fill="#fff" opacity=".3" /></svg>
          </div>
          <div className="card">
            <div className="card-hd">预测依据</div>
            <div className="row" style={{ gap: 6 }}>
              {[['预算', 't-blue', '¥'], ['家庭', 't-teal', '⌂'], ['兴趣', 't-violet', '♥'], ['行为', 't-orange', '▮']].map(([k, c, ic]) => (
                <button key={k} className={`tag ${c}`} style={{ flex: 1, height: 32, justifyContent: 'center', fontSize: 13 }} onClick={() => s.showToast(`${k}：${prediction.reasons.find((r) => r.key === k)?.value}`, 'info')}><b>{ic}</b> {k}</button>
              ))}
            </div>
            <div className="ai-read"><b><Icon name="sparkle" size={14} color="#3B3BF5" /> AI 解读</b><p>{prediction.aiReading}</p></div>
          </div>
          <div className="card">
            <div className="card-hd">匹配推荐</div>
            {[
              ['file', '推荐产品', prediction.recommendedProduct, `（${prediction.recommendedProductNote}）`],
              ['user', '推荐顾问', prediction.recommendedSales, ''],
              ['list', '推荐策略', prediction.recommendedStrategy, ''],
            ].map(([ic, k, v, n]) => (
              <div className="kv" key={k} style={{ alignItems: 'center' }}>
                <span className="ic ic-blue" style={{ width: 26, height: 26, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={14} /></span>
                <span className="muted" style={{ width: 62 }}>{k}</span>
                <span className="v">{v}<small className="light" style={{ fontSize: 11 }}>{n}</small></span>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-hd">接待重点</div>
            <div className="row"><span className="tag t-blue" style={{ height: 30, padding: '0 12px' }}>☺ 儿童房</span><span className="tag t-violet" style={{ height: 30, padding: '0 12px' }}>⌂ 改善户型</span></div>
          </div>
        </div>
        <div className="ph-foot"><button className="btn btn-primary" onClick={() => nav('/c03')} data-testid="gen-prep">生成接待准备</button></div>
      </PhoneFrame>
    )
  }

  // ------- UI-03 授权成功 · 预测生成中 -------
  if (s.signedIn) {
    return (
      <PhoneFrame>
        <NavBar title="到访签到与客户预测" back="/c01" />
        <div className="ph-body">
          {header}
          <div className="card">
            <div className="card-hd">客户预测{generating ? <span className="tag t-blue" style={{ marginLeft: 'auto' }}><Icon name="refresh" size={12} style={{ animation: 'spin 1s linear infinite' }} />生成中</span> : <span className="tag t-green" style={{ marginLeft: 'auto' }}>已生成</span>}</div>
            {generating ? (
              <>
                <div className="row" style={{ gap: 12, marginBottom: 14 }}>
                  <div className="skel-line" style={{ width: 54, height: 54, borderRadius: 12 }} />
                  <div style={{ flex: 1 }}><Skeleton lines={2} h={14} /></div>
                </div>
                <Skeleton lines={4} h={12} />
                <p className="row" style={{ justifyContent: 'center', marginTop: 14, color: '#3B3BF5', fontSize: 13 }}><Icon name="refresh" size={14} style={{ animation: 'spin 1s linear infinite' }} />正在整理客户预测画像…</p>
              </>
            ) : (
              <div className="row" style={{ gap: 10 }}>
                <div className="grad" style={{ width: 54, height: 54, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sparkle" size={26} color="#fff" /></div>
                <div><b>预测已生成</b><p className="light" style={{ fontSize: 12, marginTop: 4 }}>客户类型、预测依据与匹配推荐已就绪</p></div>
              </div>
            )}
          </div>
          <div className="card">
            <div className="card-hd">匹配推荐</div>
            {generating ? <Skeleton lines={3} h={12} /> : <p className="muted" style={{ fontSize: 13 }}>推荐产品 · 推荐顾问 · 推荐策略 已生成</p>}
          </div>
        </div>
        <div className="ph-foot"><button className="btn btn-primary" disabled={generating} onClick={() => s.set({ predictionReady: true })} data-testid="view-prediction">{generating ? '预测生成中…' : '查看预测结果'}</button></div>
      </PhoneFrame>
    )
  }

  // ------- UI-02 签到授权 -------
  return (
    <PhoneFrame>
      <NavBar title="到访签到与客户预测" back="/c01" />
      <div className="ph-body">
        <div className="card">
          <div className="card-hd"><span className="ic ic-blue"><Icon name="user" size={14} /></span>客户信息</div>
          <label className="field"><span className="k">姓名</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="field"><span className="k">手机号</span><input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <div className="field"><span className="k">到访类型</span>
            <div className="seg" style={{ flex: 1 }}>
              {(['首访', '复访'] as const).map((v) => <button key={v} className={visitType === v ? 'on' : ''} onClick={() => setVisitType(v)}>{v}</button>)}
            </div>
          </div>
          <div className="field" style={{ borderBottom: 0 }}><span className="k">同行人数</span>
            <div className="stepper"><button onClick={() => setPeople(Math.max(1, people - 1))}>−</button><span>{people} 人</span><button onClick={() => setPeople(people + 1)}>+</button></div>
          </div>
          <div className={shake ? 'hl-flash' : ''} style={{ marginTop: 6 }}>
            <Check on={agree} onClick={() => setAgree(!agree)} testid="agree">确认授权：客户同意本次到访信息用于接待服务</Check>
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><span className="ic ic-violet"><Icon name="sparkle" size={14} /></span>客户预测</div>
          <div className="empty">
            <div className="empty-ic"><Icon name="sparkle" size={28} color="#9DB6FF" /></div>
            <p>签到后自动生成客户预测</p>
            <small>预测客户类型、预测依据与匹配推荐</small>
          </div>
        </div>
      </div>
      <div className="ph-foot"><button className="btn btn-primary" onClick={signIn} data-testid="sign-in">签到并开始预测</button></div>
    </PhoneFrame>
  )
}
