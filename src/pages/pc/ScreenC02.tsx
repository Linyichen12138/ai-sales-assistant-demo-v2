import { useNavigate } from 'react-router-dom'
import { PcFrame, Panel } from '../../components/PcFrame'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { IMG } from '../../mock/images'
import { customer, prediction } from '../../mock/data'

const RC: [string, string][] = [['#FF9F1A', '¥'], ['#6A3CF0', 'home'], ['#1FBF75', '♥'], ['#F5455C', 'user']]

/** C-02 预测结果 · 大屏视图（UI-05） */
export default function ScreenC02() {
  const nav = useNavigate()
  const s = useDemo()
  return (
    <PcFrame title="到访签到与客户预测" active="客户">
      <div className="p-grid" style={{ gridTemplateColumns: '328px minmax(0,1fr) 483px', gridTemplateRows: 'minmax(0,1fr)', flex: 1 }}>
        <Panel title="客户信息">
          <div className="inner p-col" style={{ alignItems: 'center', flex: 1, gap: 14, paddingTop: 30 }}>
            <img className="p-av" src={customer.avatar} width={200} height={200} style={{ border: '4px solid #5B7BFF' }} />
            <b style={{ fontSize: 38 }}>{customer.name}</b>
            <span className="p-mute" style={{ fontSize: 18 }}>{customer.customerId}</span>
            <span style={{ fontSize: 22 }}>{customer.phoneMasked}</span>
            <div style={{ width: '80%', borderTop: '1px solid rgba(120,140,255,.25)', margin: '10px 0' }} />
            <span className="ptag pt-teal sc-pill"><Icon name="user" size={20} />首访</span>
            <span className="ptag pt-blue sc-pill"><Icon name="users" size={20} />同行 2 人</span>
            <span className="ptag pt-violet sc-pill"><Icon name="shield" size={20} />{s.signedIn ? '已授权' : '待授权'}</span>
          </div>
        </Panel>
        <Panel title="客户预测">
          <div className="sc-hero">
            <b style={{ fontSize: 44 }}>{prediction.type}</b>
            <span className="sc-conf">置信度 <b className="p-num" style={{ fontSize: 36, color: '#4FE6D2' }}>{prediction.confidence}%</b></span>
            <img src={IMG.build1} className="sc-build" alt="" />
          </div>
          <div className="panel-hd" style={{ fontSize: 20 }}><span className="ph-bar" />预测依据</div>
          <div className="p-grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', flex: 1 }}>
            {prediction.reasons.map((r, i) => (
              <div key={r.key} className="inner" style={{ padding: '24px 26px' }}>
                <p className="p-row" style={{ gap: 16, fontSize: 24, fontWeight: 700 }}><span className="sc-ic" style={{ background: RC[i][0] }}>{RC[i][1].length === 1 ? RC[i][1] : <Icon name={RC[i][1]} size={26} color="#fff" />}</span>{r.key}</p>
                <p style={{ fontSize: i === 0 ? 30 : 20, fontWeight: i === 0 ? 800 : 400, whiteSpace: i === 0 ? 'nowrap' : undefined, marginTop: 18, lineHeight: 1.5 }}>{r.value.replace('1个0–3岁', '1 个 0–3 岁')}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="匹配推荐">
          <div className="inner p-row sc-rec" style={{ borderColor: '#3B6BFF' }}>
            <div style={{ flex: 1 }}><p className="sc-k" style={{ ['--c' as string]: '#FF9F1A' }}>推荐产品</p><b style={{ fontSize: 34, whiteSpace: 'nowrap' }}>300<span style={{ fontSize: 18 }}>㎡改善户型</span></b><p className="p-mute" style={{ marginTop: 10 }}>{prediction.recommendedProductNote}</p></div>
            <img src={IMG.floorplanDark} width={200} height={150} style={{ objectFit: 'cover', borderRadius: 8 }} />
          </div>
          <div className="inner p-row sc-rec">
            <div style={{ flex: 1 }}><p className="sc-k" style={{ ['--c' as string]: '#8B5CF6' }}>推荐顾问</p><b style={{ fontSize: 36 }}>{prediction.recommendedSales}</b><p className="p-mute" style={{ marginTop: 10 }}>{prediction.recommendedSalesNote}</p></div>
            <img src={IMG.avZhang} width={150} height={150} style={{ borderRadius: '50%', objectFit: 'cover', border: '3px solid #5B7BFF' }} />
          </div>
          <div className="inner p-row sc-rec">
            <div style={{ flex: 1 }}><p className="sc-k" style={{ ['--c' as string]: '#2FD4C0' }}>推荐策略</p><b style={{ fontSize: 28 }}>{prediction.recommendedStrategy}</b><p className="p-mute" style={{ marginTop: 10 }}>{prediction.recommendedStrategyNote}</p></div>
            <span className="sc-doc"><Icon name="list" size={60} color="#4FE6D2" /><span className="sc-ok"><Icon name="check" size={22} color="#fff" /></span></span>
          </div>
          <button className="pbtn pbtn-primary" style={{ height: 52, fontSize: 18 }} onClick={() => nav('/c02')} data-testid="screen-back">返回手机端</button>
        </Panel>
      </div>
    </PcFrame>
  )
}
