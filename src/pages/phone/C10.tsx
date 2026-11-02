import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PhoneFrame, NavBar, Skeleton } from '../../components/PhoneFrame'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { faqs, goldenSentences, knowledgeCards, methodology } from '../../mock/data'
import { IMG } from '../../mock/images'

const TABS = [
  { k: 'info', t: '查信息', sub: '产品知识库' },
  { k: 'learn', t: '学方法', sub: '销冠方法论' },
  { k: 'use', t: '用金句', sub: '场景金句' },
]

/** C-10 金句广场与产品知识助手（UI-07 / UI-08 / UI-09） */
export default function C10() {
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const s = useDemo()
  const [tab, setTab] = useState(sp.get('tab') ?? 'info')
  const [openFaq, setOpenFaq] = useState(0)
  const [scene, setScene] = useState('价格异议')
  const [rewriting, setRewriting] = useState(false)
  const [rewritten, setRewritten] = useState(false)
  const from = sp.get('from') === 'c04' ? '/c04' : '/c03'
  const g = goldenSentences.find((x) => x.scene === scene)!
  const fav = s.favorites.includes(g.id)
  const doRewrite = () => { setRewriting(true); setRewritten(false); setTimeout(() => { setRewriting(false); setRewritten(true) }, 1200) }
  const toggleFav = () => {
    s.set({ favorites: fav ? s.favorites.filter((x) => x !== g.id) : [...s.favorites, g.id] })
    s.showToast(fav ? '已取消收藏' : '已收藏到我的金句')
  }
  const cur = TABS.find((t) => t.k === tab)!
  return (
    <PhoneFrame>
      <NavBar title="金句广场与产品知识助手" back={from} />
      <div className="crumb">
        <span>接待准备</span><Icon name="right" size={12} /><b>产品知识助手</b>
        <span className="tag t-violet" style={{ marginLeft: 'auto' }}>当前客户：林女士</span>
      </div>
      <div className="tabs tabs-pill">
        {TABS.map((t) => <button key={t.k} className={tab === t.k ? 'on' : ''} onClick={() => { setTab(t.k); setRewritten(false) }} data-testid={`c10-tab-${t.k}`}>{t.t}</button>)}
      </div>
      <div className="ph-body">
        <div className="sec-title sec-big"><b>{cur.t}：</b>{cur.sub}</div>
        {tab === 'info' && (
          <>
            {knowledgeCards.map((k) => (
              <button key={k.id} className="card know-card" onClick={() => s.showToast(`已打开「${k.title}」`, 'info')}>
                <span className={`kc-ic ${k.id === knowledgeCards[0].id ? 'ic-blue' : 'ic-teal'}`}><Icon name={k.id === knowledgeCards[0].id ? 'grid' : 'pin'} size={22} /></span>
                <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                  <b style={{ fontSize: 16 }}>{k.title}</b>
                  <p className="muted" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>{k.items.join('、')}</p>
                </div>
                <img src={k.img} width={92} height={68} style={{ borderRadius: 8, objectFit: 'cover' }} />
                <Icon name="right" size={16} color="#9AA1B2" />
              </button>
            ))}
            <div className="card">
              <div className="card-hd"><span className="ic ic-blue"><Icon name="chat" size={14} /></span>百问百答</div>
              {faqs.map((f, i) => (
                <div key={f.q} className="faq">
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                    <span className="qa q">Q</span>{f.q}<Icon name={openFaq === i ? 'down' : 'right'} size={14} color="#9AA1B2" style={{ marginLeft: 'auto' }} />
                  </button>
                  {openFaq === i && <div className="faq-a"><span className="qa a">A</span>{f.a}</div>}
                </div>
              ))}
            </div>
          </>
        )}
        {tab === 'learn' && (
          <>
            <div className="card c10-card">
              <div className="c10-hd"><img src={IMG.cropMLogic} width={42} height={42} alt="" />沟通逻辑</div>
              <div className="row" style={{ gap: 4 }}>
                {methodology.logic.map((l, i) => (
                  <div key={l} className="row" style={{ gap: 4, flex: 1 }}>
                    <div className={`logic-tile lt-${i}`}><span className="num">{i + 1}</span>{l}</div>
                    {i < 2 && <Icon name="right" size={16} stroke={2.4} color="#5B6275" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="card c10-card">
              <div className="c10-hd"><img src={IMG.cropMLayers} width={42} height={42} alt="" />展开顺序</div>
              <div className="row" style={{ gap: 4 }}>
                {methodology.order.map((o, i) => (
                  <div key={o} className="row" style={{ gap: 4, flex: o.length > 2 ? 1.25 : 1 }}><span className="order-btn">{o}</span>{i < 2 && <Icon name="right" size={16} stroke={2.4} color="#5B6275" />}</div>
                ))}
              </div>
            </div>
            <div className="card c10-card">
              <div className="c10-hd"><img src={IMG.cropMTarget} width={42} height={42} alt="" />侧重点</div>
              <div className="emph-box">{(() => { const t = methodology.emphasis; const k = t.indexOf('孩子成长空间'); return k >= 0 ? <>{t.slice(0, k)}<em>{'孩子成长空间'}</em>{t.slice(k + '孩子成长空间'.length)}</> : t })()}</div>
              <p className="muted" style={{ fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>{methodology.case}</p>
            </div>
          </>
        )}
        {tab === 'use' && (
          <>
            <div className="row" style={{ gap: 8 }}>
              {goldenSentences.map((x) => <button key={x.id} className={`pill pill-grad ${scene === x.scene ? 'on' : ''}`} onClick={() => { setScene(x.scene); setRewritten(false) }}>{x.scene}</button>)}
            </div>
            <div className="card gs-card">
              <span className="gs-quote" aria-hidden>”</span>
              <div className="row between" style={{ marginBottom: 10 }}>
                <span className="tag t-teal" style={{ height: 26, padding: '0 10px', fontSize: 12.5 }}>应用场景：{g.scene}</span>
                <button className={`gs-fav ${fav ? 'on' : ''}`} onClick={toggleFav}>{fav ? <img src={IMG.cropStar} width={18} height={18} alt="" /> : <Icon name="star" size={15} />}{fav ? '已收藏' : '收藏'}</button>
              </div>
              <p className="gs-text">{g.text}</p>
              <p className="light gs-src">来源：{g.source}</p>
            </div>
            <div className="card gs-ai">
              <div className="gs-ai-hd"><img src={IMG.cropSparkleSm} width={24} height={24} alt="" />AI 改写 · 面向林女士</div>
              <div className="gs-ai-in">
                {rewriting ? <Skeleton lines={2} /> : rewritten ? <p style={{ fontSize: 16, lineHeight: 1.7, fontWeight: 500 }}>{g.rewrite}</p>
                  : <p className="light" style={{ fontSize: 13 }}>点击「AI 改写」，结合林女士画像生成客户化表达</p>}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="ph-foot">
        {tab === 'use' ? (
          <>
            <button className="btn btn-sm btn-violet-soft" onClick={doRewrite} data-testid="ai-rewrite"><img src={IMG.cropSparkleSm} width={18} height={18} alt="" />AI 改写</button>
            <button className="btn btn-sm btn-orange-soft" onClick={toggleFav}>{fav ? <img src={IMG.cropStar} width={18} height={18} alt="" /> : <Icon name="star" size={15} />}{fav ? '已收藏' : '收藏'}</button>
            <button className="btn btn-primary btn-sm" style={{ flex: 1.6 }} onClick={() => nav(from)} data-testid="back-prep"><Icon name="back" size={16} stroke={2.4} />{from === '/c04' ? '返回接待' : '返回接待准备'}</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => nav(from)}>{from === '/c04' ? '返回接待' : '返回接待准备'}</button>
            <button className="btn btn-primary" onClick={() => setTab(tab === 'info' ? 'learn' : 'use')} data-testid="c10-next">下一步：{tab === 'info' ? '学方法' : '用金句'}</button>
          </>
        )}
      </div>
    </PhoneFrame>
  )
}
