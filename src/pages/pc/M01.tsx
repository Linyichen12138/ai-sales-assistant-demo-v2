import { useNavigate, useSearchParams } from 'react-router-dom'
import { PcFrame, Panel, Drawer } from '../../components/PcFrame'
import { Donut, LineChart } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { metrics, fourPan, customerDynamics, weekAdvices, pdca } from '../../mock/data'

const KPI = [
  { icon: 'users', c: '#3B8BFF', bars: [3, 5, 4, 7, 6, 9, 11] },
  { icon: 'star', c: '#FF9F1A', bars: [4, 3, 6, 5, 8, 7, 10] },
  { icon: 'chart', c: '#2FD4C0', spark: [3, 5, 4, 7, 6, 9] },
  { icon: 'list', c: '#8B5CF6' },
]
const FP_IC: Record<string, [string, string]> = { 盘客户: ['users', '#2FD4C0'], 盘产品知识: ['book', '#8B5CF6'], 盘团队: ['user', '#3B8BFF'], 盘产品: ['layers', '#FF9F1A'], 控风险: ['shield', '#F5455C'] }
const INTENT_C = ['#3B6BFF', '#2FD4C0', '#FF9F1A', '#8B5CF6']
const FUN_C = ['linear-gradient(90deg,#3B6BFF,#5B9BFF)', 'linear-gradient(90deg,#14B8A6,#4FE6D2)', 'linear-gradient(90deg,#FF9F1A,#FFC24D)', 'linear-gradient(90deg,#F5455C,#FF7A8A)']

function Bars({ data, c }: { data: number[]; c: string }) {
  return <span className="mini-bars">{data.map((v, i) => <i key={i} style={{ height: v * 4, background: c, opacity: 0.45 + i * 0.08 }} />)}</span>
}

function Funnel({ big }: { big?: boolean }) {
  return (
    <div className="p-row" style={{ gap: 30, flex: 1, justifyContent: 'center' }}>
      <div className="p-col" style={{ gap: 6, alignItems: 'center' }}>
        {metrics.funnel.map((f, i) => <div key={f.label} className="fun-seg" style={{ width: (big ? 300 : 220) - i * (big ? 56 : 42), background: FUN_C[i], height: big ? 46 : 36 }} />)}
      </div>
      <div className="p-col" style={{ gap: big ? 16 : 10 }}>
        {metrics.funnel.map((f, i) => (
          <div key={f.label} className="p-row" style={{ gap: 18, fontSize: big ? 19 : 16 }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: ['#3B8BFF', '#2FD4C0', '#FF9F1A', '#F5455C'][i] }} />
            <span style={{ width: 70 }}>{f.label}</span>{!big && <span className="p-mute" style={{ width: 60 }}>{f.pct}</span>}
            <b className="p-num" style={{ fontSize: big ? 26 : 20, color: ['#8FB0FF', '#4FE6D2', '#FFB547', '#FF7A8A'][i] }}>{f.value}</b>
          </div>
        ))}
      </div>
    </div>
  )
}

/** M-01 销售经营驾驶舱（UI-34 / UI-35 / UI-36） */
export default function M01() {
  const nav = useNavigate()
  const s = useDemo()
  const [sp, setSp] = useSearchParams()
  const panel = sp.get('panel') // fourpan | advice
  const [drawerOpen, setDrawer] = [sp.get('drawer') !== '0', (v: boolean) => setSp(v ? { panel: 'fourpan' } : { panel: 'fourpan', drawer: '0' })]
  const fp = fourPan.map((f) => (f.key === '盘团队' && !s.coachingCreated ? { ...f, action: '建议创建辅导计划' } : f))
  const intent = metrics.intentDist.map((d, i) => ({ ...d, color: INTENT_C[i], label: d.label.replace(' 类', '') }))

  if (panel === 'advice') {
    return (
      <PcFrame title="销售经营驾驶舱" active="驾驶舱">
        <Panel title="本周经营建议" style={{ flex: 0.9 }}>
          <div className="p-row" style={{ gap: 0, flex: 1, alignItems: 'stretch' }}>
            {weekAdvices.map((w, i) => (
              <div key={w.k} className="p-row" style={{ flex: 1, gap: 0, alignItems: 'center' }}>
                <div className="adv-card" style={{ ['--c' as string]: ['#3B8BFF', '#8B5CF6', '#2FD4C0', '#1FD18B'][i] }} data-testid={`advice-${i}`}>
                  <span className="adv-ic"><Icon name={['chart', 'file', 'bulb', 'target'][i]} size={34} color="#fff" /></span>
                  <p style={{ fontSize: 22, fontWeight: 700 }}>{w.k}：</p>
                  <p style={{ fontSize: 21, lineHeight: 1.6 }}>{w.v}</p>
                </div>
                {i < 3 && <span className="adv-arrow">➤</span>}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="PDCA 经营迭代" style={{ flex: 1.15 }}>
          <div className="p-row" style={{ flex: 1, gap: 80 }}>
            <div className="pdca">
              {pdca.map((p, i) => <span key={p.k} className={`pdca-n n${i}`}>{p.k}</span>)}
              <svg className="pdca-arc" viewBox="0 0 400 340"><defs><marker id="ah" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#5B9BFF" /></marker></defs>
                <path d="M120,110 Q150,60 190,55" stroke="#2FD4C0" strokeWidth="4" fill="none" markerEnd="url(#ah)" />
                <path d="M250,60 Q300,80 315,120" stroke="#8B5CF6" strokeWidth="4" fill="none" markerEnd="url(#ah)" />
                <path d="M320,210 Q300,260 260,275" stroke="#8B5CF6" strokeWidth="4" fill="none" markerEnd="url(#ah)" />
                <path d="M140,280 Q90,260 85,210" stroke="#2FD4C0" strokeWidth="4" fill="none" markerEnd="url(#ah)" />
              </svg>
            </div>
            <div className="p-col" style={{ flex: 1, gap: 10 }}>
              {pdca.map((p, i) => (
                <div key={p.k} className="inner p-row" style={{ gap: 20, padding: i === 0 ? '18px 24px' : '10px 24px', borderColor: i === 0 ? '#3B6BFF' : undefined }}>
                  <span className="big-ic" style={{ width: i === 0 ? 64 : 44, height: i === 0 ? 64 : 44, background: 'linear-gradient(135deg,#5B7BFF,#6A3CF0)' }}><Icon name={['file', 'book', 'chat', 'cycle'][i]} size={i === 0 ? 30 : 22} color="#fff" /></span>
                  <span style={{ fontSize: i === 0 ? 24 : 18, fontWeight: i === 0 ? 700 : 400 }}><b style={{ color: '#8FB0FF', marginRight: 10 }}>{p.k}</b>{i === 0 ? <>交付条件说明已沉淀为产品知识，本周调用 <b className="p-num" style={{ color: '#4FE6D2', fontSize: 34 }}>12</b> 次</> : p.v}</span>
                </div>
              ))}
              <button className="pbtn pbtn-primary" style={{ alignSelf: 'flex-end', height: 50, width: 200, fontSize: 19 }} onClick={() => nav('/m02')} data-testid="back-warroom">返回作战室 ›</button>
            </div>
          </div>
        </Panel>
      </PcFrame>
    )
  }

  if (panel === 'fourpan') {
    return (
      <PcFrame title="销售经营驾驶舱" active="四盘一控" zoom={1}>
        <div className="p-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))', paddingRight: drawerOpen ? 650 : 0 }}>
          {metrics.kpis.slice(0, 3).map((k, i) => (
            <div key={k.label} className="panel p-row" style={{ gap: 18 }}>
              <span className="kpi-ic" style={{ background: `${KPI[i].c}33`, color: KPI[i].c }}><Icon name={KPI[i].icon} size={30} /></span>
              <div><p className="p-mute">{k.label}</p><b className="p-num" style={{ fontSize: 40 }}>{k.value}{k.unit === '%' && '%'}</b></div>
              <span style={{ marginLeft: 'auto' }}>{KPI[i].bars ? <Bars data={KPI[i].bars!} c={KPI[i].c} /> : null}</span>
            </div>
          ))}
        </div>
        <div style={{ paddingRight: drawerOpen ? 650 : 0, display: 'flex', flexDirection: 'column', gap: 18, flex: 1, minHeight: 0 }}>
          <Panel title="四盘一控">
            <div className="p-grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
              {fp.map((f) => (
                <button key={f.key} className={`inner fp-card ${f.danger ? 'danger' : ''}`} onClick={() => setDrawer(true)} data-testid={`fp-${f.key}`}>
                  <p className="p-row" style={{ gap: 8, fontSize: 17, fontWeight: 700 }}><Icon name={FP_IC[f.key][0]} size={22} color={FP_IC[f.key][1]} />{f.key}</p>
                  <p className="p-row" style={{ justifyContent: 'space-between', margin: '10px 0' }}><b className="p-num" style={{ fontSize: 34 }}>{f.count}</b><Bars data={[3, 4, 3, 5, 6, 7]} c={FP_IC[f.key][1]} /></p>
                  <p className="p-mute" style={{ fontSize: 14 }}>较上期 <span style={{ color: f.up ? '#1FD18B' : '#F5455C' }}>{f.delta}</span></p>
                </button>
              ))}
            </div>
          </Panel>
          <div className="p-grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', flex: 1 }}>
            <Panel title="到访客户趋势"><LineChart labels={metrics.todayTrend.labels} series={[{ data: [30, 50, 82, 60, 80, 100], color: '#3B8BFF' }, { data: [10, 20, 28, 26, 32, 36], color: '#2FD4C0' }]} w={560} h={200} max={120} /></Panel>
            <Panel title="客户来源分布">
              <div className="p-row" style={{ gap: 30, flex: 1 }}>
                <Donut data={metrics.source} size={190} thick={30} />
                <div className="p-col" style={{ flex: 1, gap: 10 }}>{metrics.source.map((d) => <div key={d.label} className="p-row" style={{ fontSize: 16 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: d.color }} />{d.label}<b style={{ marginLeft: 'auto' }}>{d.value}%</b></div>)}</div>
              </div>
            </Panel>
            <Panel title="客户动态">
              <table className="ptable"><thead><tr><th>时间</th><th>客户</th><th>动态</th></tr></thead><tbody>{customerDynamics.map((d) => <tr key={d.time}><td>{d.time}</td><td>{d.type}</td><td>{d.text}</td></tr>)}</tbody></table>
            </Panel>
            <Panel title="转化漏斗"><Funnel /></Panel>
          </div>
        </div>
        {drawerOpen && (
          <Drawer title={<>四盘一控 · 问题 → 判断 → 行动</>} onClose={() => setDrawer(false)} testid="fourpan-drawer">
            <div className="p-row" style={{ gap: 10 }}>
              {[['问题', '交付顾虑', '#6A3CF0', 'warn'], ['判断', '高频出现', '#2F4CFF', 'bulb'], ['行动', '补充交付资料', '#14B8A6', 'target']].map(([k, v, c, ic], i) => (
                <div key={k} className="p-row" style={{ flex: 1, gap: 10 }}>
                  <div className="inner" style={{ flex: 1, textAlign: 'center', borderColor: c, background: `${c}55`, padding: '16px 6px' }}>
                    <p className="p-row" style={{ justifyContent: 'center', gap: 6, fontSize: 19, fontWeight: 700 }}><Icon name={ic} size={20} />{k}</p><p style={{ fontSize: 17, marginTop: 8 }}>{v}</p>
                  </div>{i < 2 && <span style={{ color: '#3B8BFF' }}>➤</span>}
                </div>
              ))}
            </div>
            {fp.map((f) => (
              <div key={f.key} className={`inner p-row ${f.danger ? 'fp-danger' : ''}`} style={{ gap: 16, padding: '18px 18px' }} data-testid={`fpd-${f.key}`}>
                <span className="kpi-ic" style={{ width: 50, height: 50, background: `${FP_IC[f.key][1]}33`, color: FP_IC[f.key][1] }}><Icon name={FP_IC[f.key][0]} size={24} /></span>
                <b style={{ width: 100, fontSize: 17 }}>{f.key}</b>
                <span style={{ fontSize: f.danger ? 19 : 15, color: f.danger ? '#FF6B7D' : undefined, fontWeight: f.danger ? 700 : 400, borderLeft: '1px solid rgba(120,140,255,.25)', paddingLeft: 16 }}>
                  {f.key === '盘团队' ? `张顾问挖需偏弱，${s.coachingCreated ? '已创建辅导计划' : '建议创建辅导计划'}` : f.key === '盘客户' ? f.problem : f.key === '盘产品知识' ? `${f.problem}，需强化异议回应` : f.key === '盘产品' ? `${f.problem}，${f.judge}` : f.problem}
                </span>
              </div>
            ))}
          </Drawer>
        )}
      </PcFrame>
    )
  }

  return (
    <PcFrame title="销售经营驾驶舱" active="驾驶舱" zoom={1}>
      <div className="p-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {metrics.kpis.map((k, i) => (
          <div key={k.label} className="panel p-row" style={{ gap: 18, padding: '18px 22px' }} data-testid={`kpi-${i}`}>
            <span className="kpi-ic" style={{ background: `${KPI[i].c}33`, color: KPI[i].c }}><Icon name={KPI[i].icon} size={32} /></span>
            <div><p style={{ fontSize: 17 }}>{k.label === '到访转化率' ? '转化率' : k.label === '跟进任务' ? '待办任务' : k.label}</p><b className="p-num" style={{ fontSize: 46 }}>{k.value}</b>{k.unit === '%' && <b style={{ fontSize: 26 }}>%</b>}</div>
            <span style={{ marginLeft: 'auto' }}>
              {KPI[i].bars && <Bars data={KPI[i].bars!} c={KPI[i].c} />}
              {KPI[i].spark && <svg width="130" height="50"><polyline points="0,44 22,34 44,38 66,22 88,26 110,12 130,6" fill="none" stroke="#2FD4C0" strokeWidth="2.5" /></svg>}
              {i === 3 && <span style={{ display: 'block', width: 170 }}><span className="p-row" style={{ justifyContent: 'space-between', fontSize: 14 }}>完成率<b style={{ color: '#4FE6D2', fontSize: 20 }}>78%</b></span><span className="prog"><i style={{ width: '78%' }} /></span></span>}
            </span>
          </div>
        ))}
      </div>
      <Panel title="到访 / 预约趋势" extra={<><span className="p-row" style={{ gap: 6 }}><i className="lg-dot" style={{ background: '#3B8BFF' }} />到访</span><span className="p-row" style={{ gap: 6, marginLeft: 16 }}><i className="lg-dot" style={{ background: '#8B5CF6' }} />预约</span></>}>
        <LineChart labels={metrics.visitTrend.labels} series={[{ data: [28, 44, 88, 52, 58, 88, 58], color: '#3B8BFF' }, { data: [10, 18, 34, 24, 30, 50, 38], color: '#8B5CF6' }]} w={1620} h={200} max={100} />
      </Panel>
      <div className="p-grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', flex: 1 }}>
        <Panel title="客户意向分布" extra={<span className="p-light">点击 A 类查看高潜客户</span>}>
          <div className="p-row" style={{ gap: 60, flex: 1, justifyContent: 'center' }}>
            <Donut data={intent} size={200} thick={34} onPick={(l) => { if (l === 'A') { s.showToast('A 类高潜客户：林女士 等 6 组'); nav('/s01') } }} />
            <div className="p-col" style={{ gap: 14 }}>
              {intent.map((d) => (
                <button key={d.label} className="p-row" style={{ gap: 20, fontSize: 19, color: '#fff' }} onClick={() => d.label === 'A' && nav('/s01')} data-testid={`intent-${d.label}`}>
                  <span style={{ width: 14, height: 14, borderRadius: 7, background: d.color }} /><span style={{ width: 60, textAlign: 'left' }}>{d.label}</span><b style={{ width: 50 }}>{d.value}%</b>{d.label === 'A' && <span className="ptag pt-blue">查看</span>}
                </button>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title={<>转化漏斗 <span className="p-mute" style={{ fontSize: 15, fontWeight: 400 }}>（近30日）</span></>}><Funnel big /></Panel>
      </div>
      <Panel title="四盘一控">
        <div className="p-grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
          {fp.map((f) => (
            <button key={f.key} className={`inner fp-card p-row ${f.danger ? 'danger' : ''}`} style={{ gap: 14, padding: '12px 18px' }} onClick={() => nav('/m01?panel=fourpan')} data-testid={`fp-${f.key}`}>
              <span className="kpi-ic" style={{ width: 44, height: 44, background: `${FP_IC[f.key][1]}33`, color: FP_IC[f.key][1] }}><Icon name={FP_IC[f.key][0]} size={22} /></span>
              <b style={{ fontSize: 17 }}>{f.key}</b><span style={{ marginLeft: 'auto' }}><Bars data={[2, 3, 4, 5, 6, 7]} c={FP_IC[f.key][1]} /></span>
              {f.danger && <span className="fp-badge">2</span>}
            </button>
          ))}
        </div>
      </Panel>
      <div className="panel p-row" style={{ gap: 18, padding: '16px 24px' }}>
        <Icon name="bulb" size={30} color="#FFD24D" />
        <b style={{ fontSize: 22 }}>本周经营建议：</b><span style={{ fontSize: 21 }}>{metrics.weekAdvice}</span>
        <button className="pbtn pbtn-primary" style={{ marginLeft: 'auto', height: 44, width: 170 }} onClick={() => nav('/m01?panel=advice')} data-testid="advice-detail">查看详情 ›</button>
        <span className="p-light" style={{ fontSize: 28 }}>|</span>
        <span className="p-row" style={{ gap: 8, fontSize: 18 }}><span className="dot-live" />实时状态 · 在线 <b className="p-num" style={{ color: '#4FE6D2', fontSize: 24 }}>{metrics.online}</b> 人</span>
      </div>
    </PcFrame>
  )
}
