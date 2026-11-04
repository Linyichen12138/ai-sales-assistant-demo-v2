import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ActionCard, StatusPill, Tag, V2Shell } from './components/v2'
import { company, contacts, opportunity, useV2 } from './store/v2'
import { Workbench, WB_PATHS } from './workbench/Workbench'

const routes = ['/home', '/inbox', '/leads', '/lead', '/lead/detail', '/stage', '/visit/start', '/visit/plan', '/workspace', '/visit/notes', '/visit/review', '/visit/followup', '/offline', '/intent', '/contract', '/manage', '/screen', '/interest', '/signup']

function Button({ children, onClick, ghost = false }: { children: React.ReactNode; onClick?: () => void; ghost?: boolean }) {
  return <button className={ghost ? 'v2-ghost' : 'v2-primary'} onClick={onClick}>{children}</button>
}

function Home() {
  const nav = useNavigate(); const s = useV2()
  return <V2Shell eyebrow="UI-101 · 线索" title="销售首页">
    <div className="v2-hero"><div><span className="v2-kicker">今日建议 · {company.name}</span><h2>把每一次客户变化，变成下一步行动</h2><p>示例数据 · 更新于 10:20 · 卖方视角</p></div><Button onClick={() => nav('/inbox')}>进入统一收件箱</Button></div>
    <div className="v2-metrics"><div><small>待确认行动卡</small><b>06</b><span>较昨日 +2</span></div><div><small>今日拜访</small><b>02</b><span>1 个待开始</span></div><div><small>停滞商机</small><b>03</b><span>需要人工介入</span></div></div>
    <div className="v2-section-head"><h2>今日建议</h2><button onClick={() => nav('/inbox')}>查看全部 →</button></div>
    <div className="v2-grid">{s.cards.slice(0, 3).map(c => <ActionCard key={c.id} card={c} compact />)}</div>
  </V2Shell>
}

function Inbox() {
  const nav = useNavigate(); const s = useV2()
  return <V2Shell eyebrow="UI-104 · 线索" title="统一收件箱">
    <div className="v2-filter-row"><StatusPill>全部 6</StatusPill><button>待确认 4</button><button>依据已变 1</button><button>本次拜访</button><span className="v2-filter-note">批量仅支持顺延 / 忽略，不做批量写入</span></div>
    <div className="v2-list">{s.cards.map(c => <ActionCard key={c.id} card={c} />)}</div>
    <div className="v2-inline-link"><button onClick={() => nav('/leads')}>打开线索池 →</button><button onClick={() => nav('/lead')}>去建档与联系人 →</button><button onClick={() => nav('/workspace')}>打开对象工作台 →</button></div>
  </V2Shell>
}

function Leads() { const nav = useNavigate(); return <V2Shell eyebrow="UI-102 · 线索" title="线索池"><div className="v2-filter-row"><StatusPill>我的线索 12</StatusPill><button>全部</button><button>待跟进 5</button><button>近 7 天新增 3</button><span className="v2-filter-note">仅展示华东大客户部（示例）</span></div><div className="v2-lead-table"><div className="v2-lead-row head"><span>客户 / 来源</span><span>当前状态</span><span>下一步</span><span>负责人</span></div>{[{name:'禾川食品（示例公司）',from:'展会名片 · 11-01',status:'高潜 · 待确认',next:'查看详情',owner:'张帆（示例）'},{name:'华粮餐饮（示例公司）',from:'官网表单 · 10-30',status:'依据已变',next:'补充证据',owner:'李悦（示例）'},{name:'东源食品（示例公司）',from:'转介绍 · 10-29',status:'待跟进',next:'安排首次联系',owner:'张帆（示例）'}].map((x,i)=><button className="v2-lead-row" key={x.name} onClick={()=>nav(i===0?'/lead/detail':'/lead')}><span><b>{x.name}</b><small>{x.from}</small></span><StatusPill tone={i===0?'purple':i===1?'orange':'blue'}>{x.status}</StatusPill><span>{x.next}</span><span>{x.owner}</span></button>)}</div><div className="v2-note">线索进入商机、联系人写入前，需由销售人工确认；不支持批量写入。</div></V2Shell> }

function LeadDetail() { const nav = useNavigate(); const s = useV2(); return <V2Shell eyebrow="UI-105 · 线索" title="线索详情"><div className="v2-object-card"><div className="v2-object-title"><div className="v2-company-mark">禾</div><div><h2>{company.name}</h2><p>食品调味料 · 华东区域 · 线索编号 HC-001</p></div><StatusPill tone="purple">高潜 · 待确认</StatusPill></div><div className="v2-kv"><span>来源</span><b>展会名片 · 11 月 1 日</b><span>最近互动</span><b>会议纪要 v3</b><span>建议阶段</span><b>进入商机</b></div></div><div className="v2-detail-grid"><div><h3>客户画像</h3><p>正在寻找稳定的辣椒酱供货商，关注批次质检与春节备货。</p><div className="v2-fact-list"><span>事实 · 2027 年供货窗口已明确</span><span>推断 · 采购与研发将共同评估</span><span>待核实 · 预算与审批节点</span></div></div><div><h3>下一步建议</h3><p>先补齐联系人，再开始拜访。敏感字段需人工确认。</p><Button onClick={()=>{s.notify('已确认线索，进入建档');nav('/lead')}}>确认并建档</Button></div></div><div className="v2-sticky-actions"><Button ghost onClick={()=>nav('/leads')}>返回线索池</Button><button className="v2-secondary-link" onClick={()=>s.openEvidence('AC-101')}>查看依据与版本 →</button></div></V2Shell> }

function Lead() {
  const nav = useNavigate()
  return <V2Shell eyebrow="UI-108 · 商机" title="建档与联系人">
    <div className="v2-object-card"><div className="v2-object-title"><div className="v2-company-mark">禾</div><div><h2>{company.name}</h2><p>食品调味料 · 华东区域 · 示例数据</p></div><StatusPill tone="purple">线索 → 商机</StatusPill></div><div className="v2-kv"><span>商机</span><b>{opportunity.name}</b><span>负责人</span><b>张帆（示例）</b><span>预计签约</span><b>2027 Q1</b></div></div>
    <div className="v2-section-head"><h2>联系人（3）</h2><button>＋ 添加联系人</button></div><div className="v2-contacts">{contacts.map(c => <div className="v2-contact" key={c.id}><div className="v2-avatar large">{c.name[0]}</div><div><b>{c.name}</b><small>{c.title}</small></div><span>{c.phone}</span></div>)}</div>
    <div className="v2-sticky-actions"><Button onClick={() => nav('/stage')}>确认并进入阶段变更</Button><Button ghost onClick={() => nav('/workspace')}>稍后处理</Button></div>
  </V2Shell>
}

function Stage() {
  const nav = useNavigate(); const s = useV2(); const signing = location.hash.includes('signup')
  return <V2Shell eyebrow="UI-109 · 商机" title="阶段变更确认">
    {signing && <div className="v2-warning">签约 · 敏感阶段需组长审批。提交后由王磊（示例）审核。</div>}
    <div className="v2-stage-rail"><div className="done">线索</div><div className="active">{signing ? '签约' : '商机'}</div><div>拜访</div><div>签约</div></div>
    <div className="v2-diff"><h2>请确认本次字段变化</h2><div><span>阶段</span><b>线索</b><i>→</i><strong>{signing ? '签约 · 意向' : '商机 · 待推进'}</strong></div><div><span>依据</span><p>客户已明确 2027 年供货窗口，会议纪要 v3 · 更新于 16:20</p></div><div><span>责任人</span><p>张帆（示例）</p></div></div>
    <div className="v2-sticky-actions"><Button onClick={() => { s.set({ stagePendingApproval: signing }); s.notify(signing ? '已提交组长审批' : '阶段已确认，进入拜访'); nav(signing ? '/contract' : '/visit/start') }}>确认变更</Button><Button ghost onClick={() => nav('/inbox')}>驳回并返回</Button></div>
    {!signing && <button className="v2-secondary-link" onClick={() => nav('/stage?variant=signup')}>查看签约待审批变体 →</button>}
  </V2Shell>
}

function VisitStart() {
  const nav = useNavigate(); const s = useV2()
  return <V2Shell eyebrow="UI-110 · 拜访" title="开始拜访">
    <div className="v2-visit-hero"><span className="v2-kicker">确认对象与参会联系人</span><h2>{company.name}</h2><p>{opportunity.name}</p><div className="v2-visit-meta"><span>拜访时间 · 今天 14:30</span><span>地点 · 上海市浦东新区（示例）</span></div></div>
    <div className="v2-section-head"><h2>参会联系人</h2><span>至少选择 1 位</span></div><div className="v2-select-list">{contacts.map((c, i) => <label key={c.id}><input type="checkbox" defaultChecked={i === 0 || i === 1} /><span><b>{c.name}</b><small>{c.title}</small></span><Tag kind={i === 1 ? '推断' : '事实'}>{i === 1 ? '建议邀请' : '已确认'}</Tag></label>)}</div><div className="v2-note">资料授权范围：仅限当前商机；敏感问题将转人工确认。</div>
    <div className="v2-sticky-actions"><Button ghost onClick={() => nav('/visit/plan')}>先看拜访方案</Button><Button onClick={() => { s.set({ visitStarted: true }); s.notify('拜访已开始'); nav('/workspace') }}>开始拜访</Button></div>
  </V2Shell>
}

function VisitPlan() { const nav = useNavigate(); const s = useV2(); return <V2Shell eyebrow="UI-112 · 拜访" title="拜访方案卡"><div className="v2-plan-card"><div><Tag kind="推断">建议方案 · 初访</Tag><h2>把样品评估聊清楚，再锁定交付节奏</h2><p>目标：确认需求、找出审批链、约定下一次动作。</p></div><div className="v2-plan-progress"><b>3</b><span>个重点</span></div></div><div className="v2-plan-steps">{[['01','确认评估标准','请客户描述合格样品与质检报告要求。'],['02','验证交付周期','确认春节备货量、交付窗口与产能约束。'],['03','锁定下一步','约定报价、复访或内部审批的责任人与时间。']].map(([n,t,d])=><div key={n}><b>{n}</b><span><strong>{t}</strong><small>{d}</small></span><Tag kind={n==='03'?'待核实':'推断'}>{n==='03'?'待确认':'建议'}</Tag></div>)}</div><div className="v2-note">价格、赔付、交付保证等敏感承诺，不由 AI 代写；需要现场转人工确认。</div><div className="v2-sticky-actions"><Button onClick={()=>{s.openGuidance()}}>查看现场指导（UI-121）</Button><Button ghost onClick={()=>nav('/visit/start')}>返回开始拜访</Button><button className="v2-secondary-link" onClick={()=>s.openEvidence('AC-102')}>查看依据（UI-122）</button></div></V2Shell> }

function VisitNotes() { const nav = useNavigate(); const s = useV2(); const [saved,setSaved]=useState(false); return <V2Shell eyebrow="UI-116 · 拜访" title="现场纪要"><div className="v2-note-status"><span className="v2-dot live"/>正在记录 · 禾川食品 · 今天 14:30</div><div className="v2-form-card"><label>本次结论<textarea defaultValue="客户认可样品方向，需补充批次质检报告；春节备货窗口待确认。" /></label><label>客户原话<textarea placeholder="记录关键原话（可选）" /></label><div className="v2-form-grid"><label>纪要类型<select defaultValue="事实"><option>事实</option><option>推断</option><option>待核实</option></select></label><label>下一步日期<input defaultValue="2026-11-04" /></label></div></div><div className="v2-sticky-actions"><Button onClick={()=>{setSaved(true);s.notify('纪要已保存为草稿')}}>{saved?'已保存草稿':'保存现场纪要'}</Button><Button ghost onClick={()=>nav('/visit/review')}>进入会后确认</Button></div><div className="v2-note">保存后仍不会写入商机字段；请在会后逐条确认。</div></V2Shell> }

function Followup() { const nav = useNavigate(); return <V2Shell eyebrow="UI-126 · 拜访" title="复访准备"><div className="v2-followup-hero"><Tag kind="事实">复访准备</Tag><h2>{company.name} · 第二次拜访</h2><p>建议时间：11 月 8 日 · 参会：采购经理、研发总监</p></div><div className="v2-prep-grid"><div><h3>上次未完成</h3><ul><li>补充辣椒酱批次质检报告</li><li>确认春节备货数量与交付窗口</li><li>约定报价审批节点</li></ul></div><div><h3>本次目标</h3><p>带齐质检资料，现场确认报价输入，形成可审批的下一步。</p><StatusPill tone="orange">1 项待核实</StatusPill></div></div><div className="v2-sticky-actions"><Button onClick={()=>nav('/visit/start')}>确认复访安排</Button><Button ghost onClick={()=>nav('/offline')}>离线草稿</Button></div></V2Shell> }

function Offline() { const s=useV2(); return <V2Shell eyebrow="UI-129 · 拜访" title="离线草稿"><div className="v2-offline-banner"><span className="v2-dot offline"/><div><b>当前为离线模式</b><p>网络恢复后仍需人工确认，草稿不会自动写入业务字段。</p></div></div><div className="v2-draft-list"><div><Tag kind="待核实">未同步</Tag><b>现场纪要 · 禾川食品</b><small>刚刚保存 · 1 条结论</small><button onClick={()=>s.notify('草稿已标记待同步')}>查看草稿 →</button></div><div><Tag>已同步</Tag><b>拜访方案卡</b><small>今天 13:50 · 3 个重点</small><button onClick={()=>s.notify('依据版本有效')}>查看依据 →</button></div></div><div className="v2-note">离线期间仅保存在本设备；恢复网络后由销售逐条确认同步。</div></V2Shell> }

function Workspace() {
  const nav = useNavigate(); const s = useV2()
  return <V2Shell eyebrow="UI-111 · 拜访" title="对象工作台">
    <div className="v2-object-head"><div><span className="v2-kicker">当前对象</span><h2>{company.name}</h2><p>{opportunity.name}</p></div><StatusPill tone="blue">拜访 · 初访</StatusPill></div><div className="v2-tabs"><button className="on">会前准备</button><button onClick={() => nav('/visit/review')}>会后确认</button><button onClick={() => nav('/inbox')}>依据与行动卡</button></div>
    <div className="v2-prep-grid"><div><h3>本次重点</h3><ul><li>确认样品评估标准</li><li>验证交付周期与产能</li><li>了解客户报价审批节点</li></ul></div><div><h3>数据新鲜度</h3><p className="v2-fresh">更新于 10:20</p><p>已有 2 条事实、1 条推断、1 条待核实</p></div></div><div className="v2-section-head"><h2>待处理行动卡</h2><button onClick={() => nav('/inbox')}>查看依据</button></div>{s.cards.slice(1, 3).map(c => <ActionCard key={c.id} card={c} compact />)}
    <Button onClick={() => nav('/visit/review')}>结束拜访并进入会后确认</Button>
  </V2Shell>
}

function Review() { const nav = useNavigate(); const s = useV2(); return <V2Shell eyebrow="UI-123 · 拜访" title="会后摘要确认"><div className="v2-review-banner">本次拜访已生成 3 条摘要，请逐条确认后再写入业务字段。</div><div className="v2-review-list">{[['客户需求','需要稳定的辣椒酱供货与批次质检报告','事实'],['客户顾虑','交付周期是否能覆盖春节备货','推断'],['我方承诺','确认后提供质检报告与交付方案','待核实']].map(([k,v,t])=><div key={k} className="v2-review-row"><div><Tag kind={t as '事实'|'推断'|'待核实'}>{t}</Tag><h3>{k}</h3><p>{v}</p></div><div><Button onClick={() => s.notify(`${k}已确认`)}>确认</Button><button onClick={() => s.notify('已驳回，请编辑原因')}>驳回</button></div></div>)}</div><Button onClick={() => { s.set({ reviewConfirmed: true }); s.notify('会后摘要已确认'); nav('/intent') }}>完成确认并生成任务</Button></V2Shell> }

function Intent() { const nav = useNavigate(); const s = useV2(); return <V2Shell eyebrow="UI-103 · 签约" title="意向行动卡"><div className="v2-object-card"><h2>意向 · {company.name}</h2><p>{opportunity.name}</p><div className="v2-progress"><span style={{ width: '68%' }} /></div><small>商机推进度 68% · 仍有 1 项待核实</small></div><ActionCard card={s.cards[3]} /><Button onClick={() => nav('/stage?variant=signup')}>申请进入签约阶段</Button></V2Shell> }

function Contract() { const nav = useNavigate(); return <V2Shell eyebrow="UI-127 · 签约" title="签约工作台"><div className="v2-contract-tabs"><button className="on">意向</button><button>正式合同</button><button>打款前维护</button></div><div className="v2-contract-card"><h2>禾川食品 · 2027 调味料供货商机</h2><p>当前状态：意向确认中 · 责任人：张帆（示例）</p><div className="v2-contract-actions"><Button onClick={() => nav('/manage')}>报价动作</Button><button onClick={() => nav('/stage?variant=signup')}>提交组长审批</button></div></div><div className="v2-warning soft">价格、赔付、交付保证等敏感承诺必须人工确认。</div></V2Shell> }

function Manage({ screen = false }: { screen?: boolean }) { const nav = useNavigate(); return <V2Shell eyebrow={screen ? 'UI-141 · 只读大屏' : 'UI-137 · 复盘与管理'} title={screen ? '华东大客户部（示例）' : '管理桌面'} compact><div className="v2-dashboard-head"><div><p>四段经营漏斗 · 只读横条</p><h2>团队经营概览</h2></div><div className="v2-dashboard-filter">华东大客户部（示例） · 近 30 日 ▾</div></div><div className="v2-funnel">{[['线索','42','100%'],['商机','27','64%'],['拜访','18','43%'],['签约','9','21%']].map(([k,n,w])=><div key={k}><span>{k}</span><b>{n}</b><i><em style={{ width: w }} /></i></div>)}</div><div className="v2-dash-grid"><div><h3>阶段停留</h3><p>商机 · 平均 6.2 天</p><p>拜访 · 平均 3.8 天</p><p>签约 · 平均 8.1 天</p></div><div><h3>需要介入对象</h3><p>禾川食品（示例公司） · 待审批</p><p>华粮餐饮（示例公司） · 依据已变</p></div></div>{!screen && <div className="v2-sticky-actions"><Button onClick={() => nav('/screen')}>打开只读大屏</Button><Button ghost onClick={() => nav('/home')}>返回销售首页</Button></div>}</V2Shell> }

function App() {
  const loc = useLocation(); const nav = useNavigate()
  useEffect(() => { if (!WB_PATHS.includes(loc.pathname) && !routes.includes(loc.pathname) && !loc.pathname.startsWith('/stage')) nav('/w01', { replace: true }) }, [loc.pathname, nav])
  const p = loc.pathname
  if (WB_PATHS.includes(p) || !routes.includes(p) && !p.startsWith('/stage')) return <Workbench />
  if (p === '/inbox') return <Inbox />; if (p === '/leads') return <Leads />; if (p === '/lead/detail') return <LeadDetail />; if (p === '/lead') return <Lead />; if (p === '/stage') return <Stage />; if (p === '/visit/start') return <VisitStart />; if (p === '/visit/plan') return <VisitPlan />; if (p === '/workspace') return <Workspace />; if (p === '/visit/notes') return <VisitNotes />; if (p === '/visit/review') return <Review />; if (p === '/visit/followup') return <Followup />; if (p === '/offline') return <Offline />; if (p === '/intent') return <Intent />; if (p === '/contract') return <Contract />; if (p === '/manage') return <Manage />; if (p === '/screen') return <Manage screen />; return <Home />
}

export default App
