import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PcFrame, Panel } from '../../components/PcFrame'
import { LineChart, BarChart, Donut } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { useDemo } from '../../store/demo'
import { IMG } from '../../mock/images'
import { customer, customerProfile, liveCustomers, metrics } from '../../mock/data'

const TONE: Record<string, [string, string, string]> = {
  blue: ['rgba(59,107,255,.18)', '#3B6BFF', '#2F5BFF'],
  orange: ['rgba(255,159,26,.18)', '#FF9F1A', '#FF8A1A'],
  teal: ['rgba(47,212,192,.15)', '#2FD4C0', '#14B8A6'],
}

/** M-02 AI 作战室（UI-12） */
export default function M02() {
  const nav = useNavigate()
  const s = useDemo()
  const [mode, setMode] = useState<'历史' | '实时'>('实时')
  return (
    <PcFrame title="AI 作战室" active="作战室">
      <div className="p-grid" style={{ gridTemplateColumns: '420px minmax(0,1fr) 440px', flex: 1 }}>
        <div className="p-col" style={{ gap: 18, minHeight: 0 }}>
          <Panel title="到访趋势" extra={<span>今日 <b className="p-num" style={{ fontSize: 34, color: '#4FE6D2' }}>28</b></span>} style={{ flex: 1 }}>
            <LineChart labels={['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']} series={[{ data: [22, 35, 48, 80, 46, 60, 96], color: '#3B8BFF' }]} w={490} h={200} max={120} />
          </Panel>
          <Panel title="预约趋势" style={{ flex: 1 }}>
            <BarChart labels={['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']} data={[20, 35, 52, 84, 25, 34, 88]} w={490} h={200} />
          </Panel>
          <Panel title="抗性环图" style={{ flex: 1 }}>
            <div className="p-row" style={{ gap: 30 }}>
              <Donut data={metrics.resistance} size={190} thick={30} />
              <div className="p-col" style={{ flex: 1, gap: 10 }}>
                {metrics.resistance.map((r) => <div key={r.label} className="p-row" style={{ fontSize: 17 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: r.color }} /><span style={{ flex: 1 }}>{r.label}</span><b className="p-num">{r.value}%</b></div>)}
              </div>
            </div>
          </Panel>
        </div>

        <Panel style={{ minHeight: 0 }}>
          <div className="p-row">
            <div className="pt-range">{(['历史', '实时'] as const).map((m) => <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>{m}</button>)}</div>
            <span className="p-mute" style={{ marginLeft: 'auto' }}>在线 <b className="p-num" style={{ fontSize: 36, color: '#4FE6D2' }}>{metrics.online}</b> 人</span>
          </div>
          <div className="panel-hd"><span className="ph-bar" />销售现场实时客户列表</div>
          <div className="p-col" style={{ gap: 14 }}>
            {liveCustomers.map((c) => {
              const focus = c.focus && s.blockerMarked
              const tone = TONE[c.tone]
              return (
                <button key={c.name} className={`live-row ${focus ? 'hl-glow' : ''}`} style={{ background: tone[0], borderColor: tone[1] }}
                  onClick={() => c.focus ? nav('/m03') : s.showToast(`${c.name} · ${c.owner} 接待正常，暂无卡点`, 'info')} data-testid={c.focus ? 'live-lin' : undefined}>
                  <img className="p-av" src={c.avatar} width={72} height={72} style={{ border: `3px solid ${tone[1]}`, background: '#fff' }} />
                  <span className="ptag" style={{ background: tone[2], color: '#fff', height: 34, fontSize: 17, padding: '0 14px' }}>{c.group}</span>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <b style={{ fontSize: 22 }}>{c.name}</b>
                    <p className="p-mute" style={{ fontSize: 15 }}>{c.owner}</p>
                    {focus && <p style={{ fontSize: 15, marginTop: 6, whiteSpace: "nowrap" }}><span className="dot-red" />反复询问交付条件 <span className="p-num" style={{ marginLeft: 12 }}>32:18</span></p>}
                  </div>
                  <span className="pbtn pbtn-sm" style={{ background: tone[2], height: 42, fontSize: 17, minWidth: 130 }}>{c.focus ? (focus ? '优先核查' : (s.guidanceSent ? '已指导' : '接待中')) : c.status}</span>
                </button>
              )
            })}
          </div>
          <img src={IMG.aerial} style={{ width: '100%', flex: 1, minHeight: 0, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(120,140,255,.22)' }} />
        </Panel>

        <div className="p-col" style={{ gap: 18, minHeight: 0 }}>
          <Panel title="客户画像">
            <div className="p-row" style={{ gap: 22, alignItems: 'stretch' }}>
              <img src={customer.portrait} style={{ width: 200, height: 250, objectFit: 'cover', borderRadius: 12, background: 'linear-gradient(180deg,#9DB6FF,#5B7BFF)' }} />
              <div className="p-col" style={{ flex: 1, gap: 18, justifyContent: 'center' }}>
                <b style={{ fontSize: 34 }}>林女士</b>
                <div style={{ height: 1, background: 'rgba(120,140,255,.3)' }} />
                {[['职业', customer.occupation], ['预算', customerProfile.budget], ['关注', customerProfile.focusPoints.join('、')]].map(([k, v]) => <div key={k} className="p-row" style={{ fontSize: 17 }}><span className="p-mute" style={{ width: 46 }}>{k}</span>{v}</div>)}
              </div>
            </div>
          </Panel>
          <Panel title="辅助信息" style={{ flex: 1 }}>
            {[['file', '最近关键原话', s.blockerMarked ? '「交付时间能确定吗？」· 接待 18:24' : '暂无'], ['home', '推荐户型', '300㎡改善户型 · 匹配意向 300–350㎡'], ['users', '同行人数', '首访 2 人']].map(([ic, k, v]) => (
              <div key={k} className="inner p-row"><span className="p-ic"><Icon name={ic} size={18} /></span><span className="p-mute" style={{ width: 104, flexShrink: 0 }}>{k}</span><b style={{ fontSize: 16 }}>{v}</b></div>
            ))}
            <button className="ai-advice" onClick={() => nav('/m03')} data-testid="ai-advice"><Icon name="bulb" size={26} />AI 建议：{s.blockerMarked ? '补充核实资料' : '关注 B 组接待进展'}<Icon name="right" size={22} style={{ marginLeft: 'auto' }} /></button>
          </Panel>
        </div>
      </div>
    </PcFrame>
  )
}
