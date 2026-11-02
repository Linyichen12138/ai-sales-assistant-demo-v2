import { useNavigate } from 'react-router-dom'
import { PhoneFrame, NavBar } from '../../components/PhoneFrame'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { customer, reception, deliveryDoc } from '../../mock/data'

/** C-04 结束接待 · 接待摘要（UI-19） */
export default function C04Summary() {
  const nav = useNavigate()
  const s = useDemo()
  return (
    <PhoneFrame>
      <NavBar title="接待摘要" back="/c01" />
      <div className="ph-body">
        <div className="banner-ok big"><span className="ok-dot"><Icon name="check" size={14} stroke={3} color="#fff" /></span>接待已结束，摘要已生成</div>
        <div className="card">
          <div className="row" style={{ gap: 10 }}>
            <img className="av" src={customer.avatar} width={46} height={46} />
            <b style={{ fontSize: 17 }}>林女士 · 首访</b>
            <span className="tag t-green" style={{ marginLeft: 'auto' }}>已结束</span>
          </div>
          <div className="divider" style={{ margin: '12px 0 4px' }} />
          {[['clock', '#3B6BFF', '接待时长', reception.duration], ['calendar', '#8B5CF6', '接待时间', `${reception.startAt}–${reception.endAt}`], ['user', '#3B6BFF', '接待顾问', '张顾问']].map(([ic, c, k, v]) => (
            <div key={k} className="info-row"><Icon name={ic} size={18} color={c} stroke={2.2} /><span className="k">{k}</span><b>{v}</b></div>
          ))}
        </div>
        <div className="card">
          <div className="card-hd"><span className="ic ic-blue"><Icon name="list" size={14} /></span>本次摘要</div>
          <div className="kv"><span className="k">关注</span><span className="v">儿童房、交付</span></div>
          <div className="kv"><span className="k">抗性</span><span className="v">总价、交付</span></div>
          <div className="kv"><span className="k">关键原话</span><span className="v">「{reception.keyQuote.text}」<small className="light"> {reception.keyQuote.time}</small></span></div>
        </div>
        <div className="card">
          <div className="card-hd"><span className="ic ic-teal"><Icon name="file" size={14} /></span>已推送资料</div>
          <div className="file-row" style={{ background: '#F6F8FC' }}>
            <Icon name="file" size={18} color="#3B6BFF" />{deliveryDoc.title}
            {s.guidanceSent && <span className="tag t-orange" style={{ marginLeft: 6 }}>陈经理推送</span>}
            <Icon name="check" size={18} color="#1FBF75" stroke={2.6} style={{ marginLeft: 'auto' }} />
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><span className="ic ic-violet"><Icon name="sparkle" size={14} /></span>离场触点建议</div>
          <p className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>发送 AI 名片，客户离场后可随时咨询 AI 分身，访问轨迹实时回传。</p>
        </div>
      </div>
      <div className="ph-foot">
        <button className="btn btn-primary" onClick={() => { s.set({ cardShared: true }); nav('/c06') }} data-testid="send-ai-card"><Icon name="send" size={16} />发送 AI 名片</button>
      </div>
    </PhoneFrame>
  )
}
