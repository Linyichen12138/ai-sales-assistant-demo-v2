import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PcFrame, Panel, Drawer } from '../../components/PcFrame'
import { Ring, LineChart } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { IMG } from '../../mock/images'
import { analysis, riskEvidence } from '../../mock/data'

const BAR = ['#3B8BFF', '#2FD4C0', '#8B5CF6', '#FF9F1A', '#1FD18B']

/** M-04 接待分析报告（UI-30 / UI-31） */
export default function M04() {
  const nav = useNavigate()
  const s = useDemo()
  const [ev, setEv] = useState(false)
  const responded = s.riskStatus === '已回应'
  return (
    <PcFrame title="接待分析报告" active="客户">
      <div className="panel p-row" style={{ padding: '12px 22px', fontSize: 17 }}>
        <span className="ph-bar" /><button onClick={() => nav('/s01')}>接待分析</button><span className="p-light">/</span><span>林女士</span><span className="p-light">/</span><span>张顾问</span>
        <span className="ptag pt-gray" style={{ marginLeft: 'auto', height: 34, padding: '0 16px', fontSize: 15 }}>管理者视图</span>
      </div>
      <div className="p-grid" style={{ gridTemplateColumns: '720px minmax(0,1fr)', gridTemplateRows: 'minmax(0,1fr)', flex: 1 }}>
        <div className="p-col" style={{ gap: 18, minHeight: 0, minWidth: 0 }}>
          <Panel title="五维评分" style={{ flex: 1.3 }}>
            <div className="p-row" style={{ gap: 30, flex: 1 }}>
              <div style={{ width: 230, textAlign: 'center', borderRight: '1px solid rgba(120,140,255,.25)', paddingRight: 24 }}>
                <p style={{ fontSize: 24, fontWeight: 700 }}>服务分</p>
                <Ring value={analysis.serviceScore} size={190} thick={14}><b className="p-num" style={{ fontSize: 76 }} data-testid="service-score">{analysis.serviceScore}</b></Ring>
              </div>
              <div className="p-col" style={{ flex: 1, gap: 22 }}>
                {analysis.dims.map((d, i) => (
                  <div key={d.key} className="p-row" style={{ gap: 18, fontSize: 20 }}>
                    <span style={{ width: 50 }}>{d.key}</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${d.score}%`, background: d.weak ? 'linear-gradient(90deg,#FF9F1A,#FFB547)' : `linear-gradient(90deg, ${BAR[i]}, ${BAR[i]}cc)` }} /></div>
                    <b className="p-num" style={{ width: 44, fontSize: 28 }}>{d.score}</b>
                    <span style={{ width: 60 }}>{d.weak && <span className="ptag pt-orange">偏弱</span>}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <Panel title="团队比较" style={{ flex: 0.7 }}>
            {[['张顾问', 75, 'linear-gradient(90deg,#5B3BF5,#8FB0FF)'], ['团队均值', 80, 'linear-gradient(90deg,#14B8A6,#4FE6D2)']].map(([k, v, bg]) => (
              <div key={k as string} className="p-row" style={{ gap: 16, fontSize: 18 }}>
                <span style={{ width: 90 }}>{k}</span><span className="p-mute" style={{ width: 40 }}>挖需</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${v}%`, background: bg as string }} /></div>
                <b className="p-num" style={{ width: 40, fontSize: 24 }}>{v}</b>
              </div>
            ))}
            <div className="p-row p-light" style={{ paddingLeft: 146, paddingRight: 56, justifyContent: 'space-between', fontSize: 13 }}>{[0, 20, 40, 60, 80, 100].map((n) => <span key={n}>{n}</span>)}</div>
          </Panel>
        </div>
        <div className="p-col" style={{ gap: 18, minHeight: 0, minWidth: 0 }}>
          <Panel title="客户问题 vs 销售回应">
            <div className="p-row" style={{ gap: 24 }}>
              <div className="inner p-row" style={{ flex: 1, gap: 18, borderColor: '#2FD4C0', background: 'rgba(47,212,192,.1)' }}>
                <img className="p-av" src={IMG.avLin} width={80} height={80} /><div><p className="p-mute">客户：</p><b style={{ fontSize: 26, color: '#4FE6D2', whiteSpace: 'nowrap' }}>{analysis.issueCustomer}</b></div>
              </div>
              <span style={{ color: '#3B8BFF', fontSize: 30, fontWeight: 900 }}>›››</span>
              <div className="inner p-row" style={{ flex: 1, gap: 18, borderColor: '#3B6BFF' }}>
                <img className="p-av" src={IMG.avZhang} width={80} height={80} /><div><p className="p-mute">销售：</p><b style={{ fontSize: 26, color: '#8FB0FF', whiteSpace: 'nowrap' }}>{analysis.issueSales}</b></div>
              </div>
            </div>
            <div className="inner p-row" style={{ borderColor: '#FF9F1A', background: 'rgba(255,159,26,.1)', fontSize: 18 }}><span className="big-ic" style={{ width: 34, height: 34, fontSize: 20, background: '#FF9F1A' }}>!</span><b style={{ color: '#FFB547' }}>偏题提示：</b>{analysis.offTopic}</div>
          </Panel>
          <Panel title="改进动作">
            <div className="inner p-row" style={{ gap: 22, padding: '18px 24px', background: 'linear-gradient(90deg, rgba(59,80,255,.35), rgba(91,59,245,.2))' }}>
              <span className="big-ic" style={{ background: 'linear-gradient(135deg,#5B7BFF,#6A3CF0)' }}><Icon name="file" size={28} color="#fff" /></span>
              <b style={{ fontSize: 28 }}>{analysis.improvement.replace('，', '，')}</b>
            </div>
          </Panel>
          <Panel title="评分趋势" style={{ flex: 1 }}>
            <LineChart labels={analysis.trendLabels} series={[{ data: analysis.trend, color: '#5B7BFF' }]} w={620} h={100} max={100} />
          </Panel>
        </div>
      </div>
      <div className="panel p-row" style={{ padding: '14px 22px', gap: 20 }}>
        <span className="big-ic" style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#5B7BFF,#6A3CF0)' }}><Icon name="chat" size={22} color="#fff" /></span>
        <b style={{ fontSize: 22 }}>关键证据</b>
        <div className="inner p-row" style={{ flex: 1, gap: 20, padding: '10px 18px' }}>
          <b style={{ fontSize: 20 }}>“{riskEvidence.quote}”</b><span className="p-light">|</span><span className="p-num">{riskEvidence.timePoint}</span>
          <span className={`ptag ${responded ? 'pt-green' : 'pt-orange'}`} data-testid="m04-risk">{s.riskStatus}</span>
          <button className="pbtn pbtn-ghost pbtn-sm" style={{ marginLeft: 'auto' }} onClick={() => setEv(true)} data-testid="view-quote">查看原话</button>
        </div>
        <button className={`pbtn ${s.analysisConfirmed ? 'pbtn-ok' : 'pbtn-ghost'}`} style={{ height: 56, width: 220, fontSize: 18 }} onClick={() => { s.set({ analysisConfirmed: true }); s.showToast('分析结论已确认') }} data-testid="confirm-analysis">{s.analysisConfirmed ? '结论已确认' : '确认结论'}</button>
        <button className={`pbtn ${s.improveTaskCreated ? 'pbtn-ok' : 'pbtn-primary'}`} style={{ height: 56, width: 240, fontSize: 18 }} onClick={() => { s.set({ improveTaskCreated: true, analysisConfirmed: true }); s.showToast('已生成改进任务：挖需能力提升'); setTimeout(() => nav('/m05'), 900) }} data-testid="gen-improve">{s.improveTaskCreated ? '改进任务已生成' : '生成改进任务'}</button>
      </div>
      {ev && (
        <Drawer title="风险证据" onClose={() => setEv(false)} testid="m04-evidence">
          {[['原话', `“${riskEvidence.quote}”`], ['时间点', riskEvidence.timePoint], ['关联客户', riskEvidence.relatedCustomer], ['负责顾问', riskEvidence.owner]].map(([k, v]) => (
            <div key={k} className="inner p-row" style={{ gap: 0, padding: 0 }}><span className="p-mute" style={{ width: 120, flexShrink: 0, whiteSpace: 'nowrap', padding: 20, borderRight: '1px solid rgba(120,140,255,.18)' }}>{k}</span><b style={{ fontSize: 20, padding: '0 20px' }}>{v}</b></div>
          ))}
          <div className="inner p-row" style={{ gap: 0, padding: 0 }}><span className="p-mute" style={{ width: 120, flexShrink: 0, whiteSpace: 'nowrap', padding: 20, borderRight: '1px solid rgba(120,140,255,.18)' }}>处理状态</span><span style={{ padding: '0 20px' }}><span className={`ptag ${responded ? 'pt-green' : 'pt-orange'}`} style={{ height: 38, fontSize: 18, padding: '0 20px', borderRadius: 19 }}>{s.riskStatus}</span></span></div>
          <div className="inner p-row" style={{ gap: 0, padding: 0 }}><span className="p-mute" style={{ width: 120, flexShrink: 0, whiteSpace: 'nowrap', padding: 20, borderRight: '1px solid rgba(120,140,255,.18)' }}>处理记录</span><span style={{ fontSize: 17, padding: '0 20px' }}>{s.guidanceSent ? riskEvidence.record : '暂无'}{responded && <><br /><span className="p-mute" style={{ fontSize: 15 }}>16:00 张顾问回写反馈 · 客户愿意带家人复访</span></>}</span></div>
        </Drawer>
      )}
    </PcFrame>
  )
}
