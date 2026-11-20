import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { HECHUAN, LEADS, UNANSWERED, XIANYUAN, quoteOf } from './fixtures'
import { useWb } from './store'
import { Acts, AiAva, Card, Ico, Pill, UserAva } from './ui'

function Phone({ testid, children }: { testid: string; children: ReactNode }) {
  return <main className="wb-main" data-testid={testid}><div className="wb-phone">{children}</div></main>
}

export function W06() {
  const nav = useNavigate()
  const s = useWb()
  const xianyuan = s.visitTarget === 'xianyuan'
  return <Phone testid="page-w06">
    <header className="wb-phone-bar"><button data-testid="w06-back" onClick={() => nav('/w01')}>＜ 返回工作台</button><b>现场速记</b></header>
    <p className="wb-sub">{xianyuan ? XIANYUAN.company : HECHUAN.company} · 拜访 · 初访（示例）</p>
    <p>{xianyuan ? '鲜源连锁 · 门店补货（示例）' : HECHUAN.opp}</p>
    {!xianyuan && <Card><h3>未答问题（示例）</h3><ul className="wb-dots" data-testid="w06-unanswered">{UNANSWERED.map((x) => <li key={x}>{x}</li>)}</ul><p className="wb-src">责任人：刘峰（示例）· 与商机对话中的 3 项未答一致</p></Card>}
    {xianyuan && <Card><h3>本次速记对象</h3><p data-testid="w06-xianyuan">鲜源连锁初访（示例）。不写入禾川未答问题，也不改禾川报价。</p></Card>}
    <label className="wb-field">现场要点（示例）<textarea data-testid="field-note" value={s.noteText} onChange={(e) => s.setNoteText(e.target.value)} placeholder="记录现场要点，可含口述要点（示例）" /></label>
    <div className="wb-acts-row">
      <button className="wb-btn ghost" data-testid="voice-note" onClick={() => s.setNoteText(`${s.noteText}${s.noteText ? ' ' : ''}（语音示例）客户要看检测报告`)}>语音</button>
      <button className="wb-btn primary" data-testid="save-note" onClick={() => s.saveNote()}>保存速记</button>
      <button className="wb-btn ghost" data-testid="hold-sensitive" onClick={() => s.holdSensitive()}>敏感承诺转人工</button>
      <button className="wb-btn ghost" data-testid="ask-colleague" onClick={() => s.askColleague()}>问同事</button>
    </div>
    {s.noteSaved && <p className="wb-ok" data-testid="note-saved">草稿已保存（示例）。敏感承诺在确认前不会写入业务字段。</p>}
    {s.sensitiveHeld && <p data-testid="sensitive-held">敏感回答已转人工确认：价格承诺（示例）。未确认，不写入。</p>}
    {s.colleagueAsked && <p data-testid="colleague-asked">已向同事发起询问（示例），未写入业务字段。</p>}
    <p className="wb-src" data-testid="draft-count">离线草稿 · 已保存 {s.noteSaved ? 3 : 2} 条（示例）</p>
    <button className="wb-btn primary block" data-testid="to-w07" onClick={() => nav('/w07')}>进入访后确认</button>
  </Phone>
}

export function W07() {
  const nav = useNavigate()
  const [tab, setTab] = useState<'before' | 'after'>('after')
  const target = useWb((s) => s.visitTarget)
  const xianyuan = target === 'xianyuan'
  return <Phone testid="page-w07">
    <header className="wb-phone-bar"><button data-testid="w07-back" onClick={() => nav('/w01')}>＜ 返回工作台</button><b>访前准备 / 访后确认</b></header>
    <div className="wb-filters"><button className={tab === 'before' ? 'on' : ''} data-testid="tab-before" onClick={() => setTab('before')}>访前</button><button className={tab === 'after' ? 'on' : ''} data-testid="tab-after" onClick={() => setTab('after')}>访后确认</button></div>
    <p data-testid="w07-visit-type">{xianyuan ? XIANYUAN.company : HECHUAN.company} · 拜访类型：初访 · {xianyuan ? '联系人：门店经理（示例）' : '联系人：周敏（示例）'}</p>
    {tab === 'before' ? <Card><h3>访前重点（示例）</h3><ul className="wb-dots"><li>确认参会人与议题</li><li>敏感承诺不在现场写入</li></ul></Card> : <Card><h3>本次拜访摘要（示例数据）</h3>{xianyuan ? <p>门店补货节奏待确认（示例）。</p> : <ul className="wb-dots"><li>与周敏（示例）、刘峰（示例）讨论了需求范围与交付节奏（示例）。</li><li>对方初步认可产品方案，采购窗口仍待确认（示例）。</li><li>会后由张帆（示例）向刘峰（示例）补发技术资料。</li></ul>}</Card>}
    {!xianyuan && <>
      <Card><h3>跟进周敏确认采购窗口</h3><Acts id="w07-window" fields={[{ key: 'w07.window', label: '跟进说明（示例）', initial: '确认采购窗口（示例）' }]} /></Card>
      <Card><h3>补发技术资料给刘峰</h3><Acts id="w07-tech" fields={[{ key: 'w07.tech', label: '资料说明（示例）', initial: '补发技术资料（示例）' }]} /></Card>
    </>}
    <p className="wb-note">确认后回流 AI 工作台 · 未确认不会写入</p>
    <button className="wb-btn primary block" data-testid="finish-visit" onClick={() => nav('/w01')}>完成并返回工作台</button>
  </Phone>
}

function DemoComposer({ ph, testid }: { ph: string; testid?: string }) {
  const notify = useWb((s) => s.notify)
  const [v, setV] = useState('')
  const send = () => { notify('演示版不发送消息（示例）'); setV('') }
  return <div className="wb-composer"><input data-testid={testid} value={v} onChange={(e) => setV(e.target.value)} placeholder={ph} onKeyDown={(e) => { if (e.key === 'Enter') send() }} /><button className="wb-send" onClick={send} aria-label="发送"><Ico n="send" /></button></div>
}

function HcRail({ stage, children }: { stage: string; children?: ReactNode }) {
  return <Card>
    <h3>对象上下文</h3>
    <p className="wb-ctx-title">{HECHUAN.opp}</p>
    <dl className="wb-kv">
      <dt>阶段</dt><dd><Pill>{stage}</Pill></dd>
      <dt>联系人</dt><dd>周敏（示例）</dd>
      {children}
    </dl>
  </Card>
}

const SCORE_AXIS = [
  ['10月28日', '78'],
  ['10月30日', '82'],
  ['11月2日', '86'],
] as const

export function W14() {
  const nav = useNavigate()
  const selected = useWb((s) => s.selectedLead)
  const selectLead = useWb((s) => s.selectLead)
  const convertLead = useWb((s) => s.convertLead)
  const converted = useWb((s) => s.leadConverted)
  const lead = LEADS.find((x) => x.id === selected) ?? LEADS[0]
  const tone = (d: string) => d.startsWith('↑') ? 'up' : d.startsWith('↓') ? 'down' : 'flat'
  return <>
    <main className="wb-main" data-testid="page-w14">
      <h1 className="wb-title">线索列表</h1>
      <p className="wb-sub">共 4 条（示例）</p>
      <div className="wb-lead-list">{LEADS.map((x) => <button key={x.id} data-testid={`lead-${x.id}`} className={`wb-lead ${selected === x.id ? 'on' : ''}`} onClick={() => { selectLead(x.id); if (x.id === 'hechuan') nav('/w15') }}>
        <span className="wb-lead-name">{x.name}</span>
        <span className="wb-lead-meta">
          <span>来源 <b>{x.source}（示例）</b></span>
          <span>意向评分 <strong>{x.score}</strong>（示例） <em className={`wb-delta ${tone(x.delta)}`}>{x.delta}（示例）</em></span>
          {x.hint && <Pill>{x.hint}</Pill>}
        </span>
      </button>)}</div>
      <div className="wb-spacer" />
      <DemoComposer ph="针对选中线索提问..." testid="w14-ask" />
    </main>
    <aside className="wb-right">
      <Card>
        <h3>对象上下文</h3>
        {lead.id === 'hechuan' ? <>
          <p className="wb-ctx-title">{HECHUAN.opp}</p>
          <dl className="wb-kv" data-testid="w14-selected">
            <dt>阶段</dt><dd><Pill>线索</Pill></dd>
            <dt>联系人</dt><dd>周敏（示例）</dd>
            <dt>意向评分</dt><dd>86（示例） ↑8（示例）</dd>
            <dt>来源</dt><dd>展会（示例）</dd>
          </dl>
          <button className="wb-btn primary block" data-testid="w14-convert" onClick={() => { convertLead(); nav('/w02') }}>{converted ? '进入已有商机' : '转为商机'}</button>
          {converted && <p className="wb-note">商机已存在，再次进入不会重复创建（示例）。</p>}
        </> : <>
          <p data-testid="w14-selected">{lead.name}</p>
          <p>阶段：线索（示例）</p>
          <p>来源：{lead.source}（示例）</p>
          <p>评分：{lead.score} {lead.delta}（示例）</p>
          <p className="wb-sub">该线索保留在列表（示例），不进入禾川金额。</p>
        </>}
      </Card>
      {lead.id === 'hechuan' && <Card>
        <h3>待确认行动</h3>
        <div className="wb-card-h"><b>补充禾川采购窗口</b><span className="wb-kind">推断</span></div>
        <Acts id="w14-window" note={false} fields={[{ key: 'w14.window', label: '补充说明（示例）', initial: '补充禾川采购窗口（示例）' }]} />
      </Card>}
    </aside>
  </>
}

export function W15() {
  const nav = useNavigate()
  const convertLead = useWb((s) => s.convertLead)
  const converted = useWb((s) => s.leadConverted)
  return <>
    <main className="wb-main" data-testid="page-w15">
      <div className="wb-cal-head"><h1 className="wb-title">线索详情</h1><button className="wb-btn ghost" data-testid="back-leads" onClick={() => nav('/w14')}>返回列表</button></div>
      <div className="wb-name-row"><h2>禾川食品（示例公司）</h2><Pill>高意向</Pill></div>
      <div className="wb-score"><span>意向评分</span><strong>86</strong><em>（示例）</em><span className="wb-ok">↑8（示例）</span></div>
      <ol className="wb-tl" data-testid="score-axis">{SCORE_AXIS.map(([day, score], i) => <li key={day} data-state={i === 2 ? 'now' : 'past'}><i /><span>{day} {score}（示例）</span></li>)}</ol>
      <h3 className="wb-rt">客户关注点</h3>
      <div className="wb-concerns" data-testid="lead-concerns">
        <div><Ico n="flask" s={22} /><span>低钠配方（示例）</span></div>
        <div><Ico n="layers" s={22} /><span>供货稳定性（示例）</span></div>
        <div><Ico n="cal" s={22} /><span>账期（示例）</span></div>
      </div>
      <button className="wb-btn primary block" data-testid="convert-opp" onClick={() => { convertLead(); nav('/w02') }}>{converted ? '进入已有商机' : '转为商机'}</button>
      <div className="wb-spacer" />
      <DemoComposer ph="针对本线索提问..." />
    </main>
    <aside className="wb-right">
      <HcRail stage="线索">
        <dt>意向评分</dt><dd>86（示例）</dd>
        <dt>来源</dt><dd>展会（示例）</dd>
      </HcRail>
      <Card>
        <h3>待确认行动</h3>
        <div className="wb-card-h"><b>补充禾川采购窗口</b><span className="wb-kind">推断</span></div>
        <Acts id="w15-window" note={false} fields={[{ key: 'w15.window', label: '补充说明（示例）', initial: '补充禾川采购窗口（示例）' }]} />
      </Card>
    </aside>
  </>
}

const CAP_ROWS: [string, string, string][] = [
  ['bolt', '触发条件', '销售在对话中提到报价、毛利或年采购量（示例）'],
  ['box', '输入来源', '商机对象、历史报价单、原料价表（示例）'],
  ['users', '执行步骤', '前段工作流：查原料价 → 比对生产线。后段研判：研判毛利与回款周期。'],
  ['bar', '输出', '成本对比表、推荐报价、毛利与回款周期（示例）'],
  ['user', '人工确认点', '采纳前须销售确认，未经确认不写入'],
]

export function W16() {
  const nav = useNavigate()
  const setQuoteSheet = useWb((s) => s.setQuoteSheet)
  return <>
    <main className="wb-main" data-testid="page-w16">
      <h1 className="wb-title wb-cap-title"><span>能力详情 / 报价测算</span></h1>
      <div className="wb-name-row"><b className="wb-cap-name">报价测算</b><span className="wb-agent">Agent</span></div>
      <div className="wb-spec">{CAP_ROWS.map(([ico, title, body]) => <div key={title} className="wb-spec-row"><span className="wb-skill-ico"><Ico n={ico} s={18} /></span><div><b>{title}</b><p>{body}</p></div></div>)}</div>
      <button className="wb-btn primary block" data-testid="use-in-chat" onClick={() => nav('/w17')}>在对话中使用</button>
      <button className="wb-link" onClick={() => nav('/w10')}>返回能力中心</button>
    </main>
    <aside className="wb-right">
      <Card><h3>适用阶段</h3><dl className="wb-kv"><dt>适用范围</dt><dd>报价与合同</dd><dt>说明</dt><dd>在对话中调用，结果写入前需人工确认</dd></dl><p className="wb-sub">主路径会话：禾川报价测算（示例）</p></Card>
      <Card><h3>最近使用</h3><button className="wb-recent" onClick={() => { setQuoteSheet('hualiang'); nav('/w12') }}>华粮年度报价测算<em>›</em></button></Card>
      <Card><h3>待确认行动</h3>
        {[['w16-hl', '写入华粮报价测算结果'], ['w16-hc', '写入禾川报价计算结果'], ['w16-cost', '更新成本对比表（示例）']].map(([id, title]) => <div key={id} className="wb-mini-act"><b>{title}</b><Acts id={id} size="sm" note={false} fields={[{ key: `${id}.note`, label: '写入说明（示例）', initial: title }]} /></div>)}
      </Card>
    </aside>
  </>
}

const RUN_STEPS = ['查原料价', '比对生产线', '研判毛利'] as const

export function W17() {
  const nav = useNavigate()
  const local = useWb((s) => s.quoteUsesLocal)
  const step = useWb((s) => s.quoteStep)
  const advanceQuote = useWb((s) => s.advanceQuote)
  const stateOf = (i: number) => i < step ? 'done' : i === step ? 'run' : 'wait'
  const label = { done: '已完成', run: '进行中', wait: '等待中' }
  return <>
    <main className="wb-main" data-testid="page-w17">
      <h1 className="wb-title">禾川报价测算</h1>
      <p className="wb-ctx-obj">调用报价测算，按{HECHUAN.opp}测算</p>
      {local && <p className="wb-banner" data-testid="local-price">已改用本地价表（示例）。对象仍是禾川，未调用外部接口。</p>}
      <Card data-testid="run-card"><h3><Ico n="calc" /> 报价测算 · 运行中</h3>
        <ol className="wb-run" data-testid="run-steps">
          {RUN_STEPS.map((name, i) => { const st = stateOf(i); return <li key={name} data-state={st}><i />{name}<em>{label[st]}</em></li> })}
        </ol>
        {step >= 3 && <p className="wb-ok">三步已完成（示例）。可查看结果。</p>}
      </Card>
      <div className="wb-chiprow"><span className="wb-chip">报价测算</span><span>能力运行中…</span></div>
      <div className="wb-acts-row">
        <button className="wb-btn ghost" data-testid="quote-advance" onClick={() => advanceQuote()}>{step >= 3 ? '步骤已完成' : '推进下一步（示例）'}</button>
        <button className="wb-btn primary" data-testid="quote-finish" onClick={() => nav('/w18')}>示例：完成测算</button>
        <button className="wb-btn danger" data-testid="quote-fail" onClick={() => nav('/w22')}>示例：测算失败</button>
        <button className="wb-btn ghost" data-testid="why-call" onClick={() => nav('/w23')}>为什么调用</button>
      </div>
      <p className="wb-note">以上为确定性示例开关，不调用外部 AI 或业务接口。对象：{HECHUAN.opp} · 联系人周敏（示例） · 年供货 {HECHUAN.tons}</p>
      <div className="wb-spacer" />
      <DemoComposer ph="能力运行中..." />
    </main>
    <aside className="wb-right" data-testid="w17-rail">
      <HcRail stage="报价">
        <dt>报价金额</dt><dd data-testid="quote-computing">计算中（示例）</dd>
        <dt>年供货</dt><dd>{HECHUAN.tons}</dd>
      </HcRail>
      <Card><h3>待确认行动</h3><p className="wb-sub">结果出来前不写入。</p><Acts id="w17-hold" note={false} fields={[{ key: 'w17.hold', label: '备注（示例）', initial: '等待报价测算结果（示例）' }]} /></Card>
    </aside>
  </>
}

export function W18() {
  const nav = useNavigate()
  const pick = useWb((s) => s.linePick)
  const setLinePick = useWb((s) => s.setLinePick)
  const adoptHechuan = useWb((s) => s.adoptHechuan)
  const adopted = useWb((s) => s.hechuanAdopted)
  const adoptedLine = useWb((s) => s.adoptedLine)
  const setQuoteSheet = useWb((s) => s.setQuoteSheet)
  const addTask = useWb((s) => s.addTask)
  const q = quoteOf(pick)
  const a = quoteOf('A')
  const b = quoteOf('B')
  const adoptedNow = adopted && adoptedLine === pick
  return <>
    <main className="wb-main" data-testid="page-w18">
      <h1 className="wb-title">禾川报价测算</h1>
      <p className="wb-ctx-obj">调用报价测算，按{HECHUAN.opp}测算</p>
      <Card data-testid="hechuan-result" data-line={pick} data-cost={q.cost} data-profit={q.profit} data-margin={q.margin}>
        <h3><Ico n="calc" /> 报价测算结果</h3>
        <div className="wb-qrow"><span>报价合计</span><b data-testid="q-total">{q.priceText}（示例）</b></div>
        <div className="wb-qrow"><span>原料成本</span><b data-testid="q-material">{q.materialText}（示例）</b></div>
        <div className="wb-qrow wb-qrow-lines"><span>生产线成本对比</span>
          <div className="wb-line-picks" data-testid="line-pick">
            <button className={pick === 'A' ? 'wb-line primary' : 'wb-line'} data-testid="pick-a" onClick={() => setLinePick('A')}>产线 A {a.lineText}（示例）{pick === 'A' && <Pill>推荐</Pill>}</button>
            <button className={pick === 'B' ? 'wb-line primary' : 'wb-line'} data-testid="pick-b" onClick={() => setLinePick('B')}>产线 B {b.lineText}（示例）</button>
          </div>
        </div>
        <p className="wb-note">产线 A 与产线 B 互斥，当前只采用产线 {pick}（示例），两条产线成本不相加。</p>
        <div className="wb-qrow"><span>采用{pick}的总成本</span><b data-testid="q-cost">{q.costText}（示例）</b></div>
        <div className="wb-qrow"><span>采用{pick}的毛利</span><b data-testid="q-profit">{q.profitText} / {q.margin}（示例）</b></div>
        <div className="wb-qrow"><span>回款周期</span><b data-testid="q-term">{q.term}（示例）</b></div>
        <div className="wb-acts-row">
          <button className="wb-btn primary" data-testid="adopt" onClick={() => { adoptHechuan(); nav('/w04') }}>{adoptedNow ? '已采纳，查看 diff' : '采纳'}</button>
          <button className="wb-btn ghost" data-testid="revise" onClick={() => nav('/w17')}>修改</button>
          <button className="wb-btn ghost" data-testid="to-manual" onClick={() => { addTask({ id: 't-manual', title: '报价测算转人工跟进', group: 'pending', source: 'w22' }); nav('/w24') }}>转人工</button>
        </div>
      </Card>
    </main>
    <aside className="wb-right">
      <HcRail stage="报价">
        <dt>报价金额</dt><dd data-testid="w18-amount">{q.priceText}（示例）</dd>
        <dt>选用产线</dt><dd data-testid="ctx-line">产线 {pick}（示例）</dd>
        <dt>成本合计</dt><dd data-testid="ctx-cost">{q.costText}（示例）</dd>
        <dt>毛利额</dt><dd data-testid="ctx-profit">{q.profitText}（示例）</dd>
        <dt>毛利率</dt><dd data-testid="ctx-margin">{q.margin}（示例）</dd>
        <dt>年供货</dt><dd>{HECHUAN.tons}</dd>
        <dt>回款周期</dt><dd>{q.term}（示例）</dd>
      </HcRail>
      <p className="wb-note" data-testid="adopt-state">{adoptedNow ? `产线 ${pick} 已采纳（示例），再次采纳不会重复写入。` : adopted ? '已改选产线，尚未重新采纳（示例）。' : '未采纳。右侧金额只预览当前产线（示例）。'}</p>
      <button className="wb-link" data-testid="open-hechuan-sheet" onClick={() => { setQuoteSheet('hechuan'); nav('/w12') }}>查看禾川报价单落点</button>
      <Card><h3>待确认行动</h3><div className="wb-card-h"><b>将报价测算结果写入商机</b></div><Acts id="w18-write" note={false} fields={[{ key: 'w18.write', label: '写入说明（示例）', initial: `写入产线 ${pick}（示例）` }]} /></Card>
    </aside>
  </>
}

export function W19() {
  const nav = useNavigate()
  const submitted = useWb((s) => s.contractSubmitted)
  const reopen = useWb((s) => s.reopenContract)
  const step = useWb((s) => s.signStep)
  const advanceSign = useWb((s) => s.advanceSign)
  const nodes = [
    { key: 'submit', title: '提交', who: '', st: '已完成', state: 'done' as const, date: '10月20日（示例）' },
    { key: 'manager', title: '销售经理', who: '王磊（示例）', st: '已通过', state: 'done' as const, date: '10月21日（示例）' },
    { key: 'finance', title: '财务', who: '陈静（示例）', st: step === 0 ? '审核中' : '已通过', state: (step === 0 ? 'run' : 'done') as 'run' | 'done', date: '' },
    { key: 'stamp', title: '盖章', who: '法务·赵敏（示例）', st: step === 0 ? '未开始' : step === 1 ? '盖章中' : '已完成', state: (step === 0 ? 'wait' : step === 1 ? 'run' : 'done') as 'wait' | 'run' | 'done', date: '' },
  ]
  const financeLabel = step === 0 ? '财务审核中（示例）' : step === 1 ? '待法务盖章（示例）' : '审批已完成（示例）'
  return <>
    <main className="wb-main" data-testid="page-w19">
      <h1 className="wb-title">签约审批</h1>
      <p data-testid="contract-name">禾川食品 · 正式合同（示例）</p>
      <p data-testid="contract-amount">合同金额 ¥135 万（示例）</p>
      <p className="wb-sub">{submitted ? '已由写入前 diff 确认提交（示例）。' : '示例：当前展示提交后进度，可从写入前 diff 确认提交后进入。'}</p>
<ol className="wb-stepper" data-testid="approval-progress">
        {nodes.map((n, i) => <li key={n.key} data-state={n.state}><i>{n.state === 'done' ? '✓' : i + 1}</i><b>{n.title}</b><span>{n.who}</span><em>{n.st}</em></li>)}
      </ol>
      {step < 2 && <p className="wb-gap" data-testid="approval-gap">{step === 0 ? '还差「财务·陈静（示例）」「法务·赵敏（示例）」盖章。' : '还差「法务·赵敏（示例）」盖章。'}</p>}
      {step === 2 && <p className="wb-ok" data-testid="approval-gap">财务·陈静（示例）与法务·赵敏（示例）均已完成（示例）。</p>}
      <ol className="wb-tl wb-tl-log">
        <li data-state="past"><i /><div><b>已提交</b><p>合同已提交，进入审批流程。</p></div><span>10月20日（示例）</span></li>
        <li data-state="past"><i /><div><b>销售经理已通过</b><p>王磊（示例）已审核通过。</p></div><span>10月21日（示例）</span></li>
        <li data-state={step === 0 ? 'now' : 'past'}><i /><div><b>{step === 0 ? '财务审核中' : '财务已通过'}</b><p>陈静（示例）{step === 0 ? '正在审核中。' : '已审核通过（示例）。'}</p></div></li>
        <li data-state={step === 0 ? 'wait' : step === 1 ? 'now' : 'past'}><i /><div><b>{step === 2 ? '已盖章' : '待盖章'}</b><p>法务·赵敏（示例）盖章。</p></div></li>
      </ol>
      <div className="wb-acts-row">
        <button className="wb-btn ghost" data-testid="sign-advance" onClick={() => advanceSign()}>{step >= 2 ? '节点已全部通过' : '模拟当前节点通过（示例）'}</button>
        {step >= 2 && <button className="wb-btn primary" data-testid="sign-to-pay" onClick={() => nav('/w20')}>进入履约与回款</button>}
        <button className="wb-btn ghost" onClick={() => { reopen(); nav('/w04') }}>返回提交前 diff</button>
        <button className="wb-btn ghost" onClick={() => nav('/w13')}>去回款列表</button>
      </div>
    </main>
    <aside className="wb-right">
      <HcRail stage="签约">
        <dt>合同金额</dt><dd>¥135 万（示例）</dd>
        <dt>审批状态</dt><dd data-testid="finance-status">{financeLabel}</dd>
      </HcRail>
      <Card><h3>待确认行动</h3><div className="wb-card-h"><b>补充合同附件给陈静（示例）</b></div><Acts id="w19-attach" note={false} doneText="已记录补充附件（示例）" fields={[{ key: 'w19.attach', label: '附件说明（示例）', initial: '补充合同附件给陈静（示例）' }]} /></Card>
    </aside>
  </>
}

export function W20() {
  const nav = useNavigate()
  const addTask = useWb((s) => s.addTask)
  const tasks = useWb((s) => s.tasks)
  const added = tasks.some((t) => t.id === 't-xianyuan')
  return <>
    <main className="wb-main" data-testid="page-w20">
      <div className="wb-cal-head"><h1 className="wb-title">回款预警</h1><button className="wb-btn ghost" onClick={() => nav('/w13')}>返回列表</button></div>
      <Card className="wb-overdue" data-testid="xianyuan-card">
        <div className="wb-name-row"><h2>{XIANYUAN.company}</h2><Pill tone="risk">逾期</Pill></div>
        <p className="wb-meta-line"><span>{XIANYUAN.overdue}（示例）</span><span>金额 {XIANYUAN.amount}</span><span>联系人 {XIANYUAN.contact}</span></p>
      </Card>
      <Card><h3><Ico n="cal" /> AI 沟通计划</h3>
        <dl className="wb-kv" data-testid="collect-plan"><dt>何时</dt><dd>{XIANYUAN.when}</dd><dt>联系谁</dt><dd>{XIANYUAN.contact}</dd><dt>说什么</dt><dd>{XIANYUAN.say}</dd></dl>
        <button className="wb-btn primary block" data-testid="add-today" onClick={() => addTask({ id: 't-xianyuan', title: '鲜源催款电话', group: 'doing', source: 'w20' })}>加入今日任务</button>
        {added && <p className="wb-ok" data-testid="added-today">已加入今日任务（示例）。可在今日任务或任务中心看到「鲜源催款电话」。</p>}
        <button className="wb-link" onClick={() => nav('/w24')}>打开任务中心</button>
      </Card>
    </main>
    <aside className="wb-right">
      <Card><h3>待确认行动</h3>
        <div className="wb-card-h"><b>创建催款跟进任务</b><span className="wb-kind">推断</span></div>
        <p>鲜源连锁（示例公司）· 逾期回款</p>
        <p className="wb-sub">责任人　张帆（示例）</p>
        <Acts id="w20-task" note={false} fields={[{ key: 'w20.note', label: '催收说明（示例）', initial: '确认鲜源付款计划（示例）' }]} />
      </Card>
    </aside>
  </>
}

const W21_CARDS = [
  { id: 'infer', kind: '推断', title: '补发技术资料给刘峰（示例）', basis: '依据：复访纪要里刘峰的技术评估仍有 3 项未答（示例）', extra: '不确定性：检测报告、留样追溯和试产周期是否都要补发，尚未与刘峰确认（示例）' },
  { id: 'fact', kind: '事实', title: '跟进周敏（示例）确认采购窗口', basis: '依据：展会纪要与邮件确认（示例）', extra: '需确认部门：技术部（示例）' },
  { id: 'approve', kind: '待审批', title: '签约·正式合同 待王磊（示例）审批', basis: '依据：禾川报价测算口径为 ¥135 万，尚未提交组长审批（示例）', extra: '不确定性：王磊确认前，正式合同不会写入（示例）' },
] as const

export function W21() {
  const nav = useNavigate()
  const [open, setOpen] = useState<string>('fact')
  return <>
    <main className="wb-main" data-testid="page-w21">
      <div className="wb-cal-head"><h1 className="wb-title">今日任务</h1><button className="wb-btn ghost" onClick={() => nav('/w09')}>返回今日任务</button></div>
{W21_CARDS.map((c) => { const on = open === c.id; return <Card key={c.id} data-testid={`w21-${c.id}`} className={`wb-acard ${c.kind === '事实' ? 'fact' : c.kind === '待审批' ? 'approve' : 'infer'} ${on ? 'open' : ''}`}>
        <div className="wb-acard-h">
          <button className="wb-textbtn" data-testid={`w21-toggle-${c.id}`} onClick={() => setOpen(on ? '' : c.id)}>{on ? '▾' : '▸'} <span className={`wb-kind ${c.kind === '事实' ? 'fact' : c.kind === '待审批' ? 'approve' : ''}`}>{c.kind}</span> {c.title}</button>
          <Acts id={`w21-${c.id}`} size="sm" note={false} fields={[{ key: `w21.${c.id}`, label: '行动说明（示例）', initial: c.title }]} />
        </div>
        {on && <div data-testid={c.id === 'fact' ? 'w21-basis' : `w21-basis-${c.id}`} className="wb-basis"><p>{c.basis}</p><p>{c.extra}</p></div>}
      </Card> })}
    </main>
    <aside className="wb-right">
      <Card><h3>AI 建议优先级</h3>
        {[['确认采购窗口时间', '推断'], ['补充关键技术资料', '推断'], ['协调合同审批节点', '推断']].map(([t, k]) => <div key={t} className="wb-prio"><span>{t}</span><span className="wb-kind">{k}</span></div>)}
      </Card>
    </aside>
  </>
}

export function W22() {
  const nav = useNavigate()
  const addTask = useWb((s) => s.addTask)
  const setQuoteUsesLocal = useWb((s) => s.setQuoteUsesLocal)
  const [text, setText] = useState('')
  const [reply, setReply] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const send = () => {
    const v = text.trim()
    if (!v) { setReply(''); return }
    const follow = v.includes('毛利') && !v.includes('重算') ? '按你的回复，只保留毛利提醒（示例）。' : '将按禾川食品继续重算报价（示例）。'
    setReply(`已收到「${v}」。${follow}未调用外部服务。`)
  }
  return <>
    <main className="wb-main" data-testid="page-w22">
      <h1 className="wb-title">禾川报价测算</h1>
      <Card className="wb-alert" data-testid="fail-manual">
        <div><h3>测算失败转人工</h3><p>报价测算失败（示例）</p></div>
        <button className="wb-btn primary" data-testid="escalate" onClick={() => { addTask({ id: 't-manual', title: '报价测算转人工跟进', group: 'pending', source: 'w22' }); nav('/w24') }}>转人工</button>
      </Card>
      <Card data-testid="fail-external">
        <h3><Ico n="wrench" /> 外部系统调不通</h3>
        <p>原料价表接口不可用（示例）</p>
        <p className="wb-sub">行动清单</p>
        <button className={`wb-check ${checked.local ? 'on' : ''}`} data-testid="use-local" onClick={() => { setChecked((c) => ({ ...c, local: true })); setQuoteUsesLocal(true); nav('/w17') }}><i />改用本地价表（示例）</button>
        <button className={`wb-check ${checked.ops ? 'on' : ''}`} data-testid="notify-ops" onClick={() => { setChecked((c) => ({ ...c, ops: true })); nav('/w17') }}><i />通知运维（示例）</button>
        <Acts id="w22-ops" note={false} fields={[{ key: 'w22.ops', label: '运维说明（示例）', initial: '原料价表接口不可用（示例）' }]} />
      </Card>
      <Card data-testid="fail-clarify">
        <h3><Ico n="chat" /> AI 没听懂</h3>
        <p>你是要重算禾川报价，还是只要毛利提醒？（示例）</p>
        <div className="wb-composer"><input data-testid="w22-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="请输入你的回复..." onKeyDown={(e) => { if (e.key === 'Enter') send() }} /><button className="wb-send" data-testid="w22-send" onClick={send} aria-label="发送"><Ico n="send" /></button></div>
        {reply && <p data-testid="w22-reply">{reply}</p>}
        {reply && <button className="wb-link" data-testid="w22-continue" onClick={() => nav('/w17')}>返回运行中重试</button>}
      </Card>
      <p className="wb-note">对象仍是 {HECHUAN.opp}。示例故障，未调用外部服务。</p>
    </main>
    <aside className="wb-right">
      <HcRail stage="报价">
        <dt>状态</dt><dd data-testid="exception-state">异常处理中（示例）</dd>
      </HcRail>
    </aside>
  </>
}

export function W23() {
  const nav = useNavigate()
  return <>
    <main className="wb-main" data-testid="page-w23">
      <h1 className="wb-title">禾川报价测算</h1>
      <div className="wb-chat">
        <div className="wb-msg me"><div className="wb-bubble">帮我测算{HECHUAN.opp.replace('（示例）', '')}报价</div><UserAva /></div>
        <div className="wb-msg ai"><AiAva /><div className="wb-bubble"><p>已调用能力：<Pill>报价测算</Pill></p><p>正在基于目标、需求与成本模型进行报价测算...</p></div></div>
      </div>
      <h2 className="wb-title">为什么调用这个能力</h2>
      <Card data-testid="why-panel">
        <div className="wb-spec-row"><span className="wb-skill-ico"><Ico n="target" s={18} /></span><div><b>命中规则</b><p>对话提到年供货量与报价（示例）</p></div></div>
        <div className="wb-spec-row"><span className="wb-skill-ico"><Ico n="layers" s={18} /></span><div><b>模型判断</b><p>适合调用报价测算（示例）</p></div></div>
        <div className="wb-spec-row"><span className="wb-skill-ico"><Ico n="bar" s={18} /></span><div><b>置信度</b><p data-testid="confidence">0.86（示例）</p></div></div>
        <button className="wb-btn ghost" data-testid="switch-skill" onClick={() => nav('/w10')}>换一个能力</button>
      </Card>
      <div className="wb-acts-row">
        <button className="wb-btn ghost" data-testid="back-skill" onClick={() => nav('/w16')}>返回报价测算详情</button>
        <button className="wb-btn ghost" onClick={() => nav('/w17')}>返回运行中</button>
      </div>
      <div className="wb-spacer" />
      <DemoComposer ph="在对话中使用该能力..." />
    </main>
    <aside className="wb-right">
      <HcRail stage="报价" />
      <Card><h3>待确认行动</h3><b>将报价测算结果写入商机</b><p className="wb-sub">未经确认不会写入</p><Acts id="w23-write" note={false} fields={[{ key: 'w23.write', label: '写入说明（示例）', initial: '将报价测算结果写入商机（示例）' }]} /></Card>
    </aside>
  </>
}

const FILTERS = ['全部', '进行中', '待确认', '已完成', '已归档'] as const
const GROUPS: ['doing' | 'pending' | 'done' | 'archived', string][] = [['doing', '进行中'], ['pending', '待确认'], ['done', '已完成'], ['archived', '已归档']]

export function W24() {
  const nav = useNavigate()
  const tasks = useWb((s) => s.tasks)
  const completeTask = useWb((s) => s.completeTask)
  const archiveTask = useWb((s) => s.archiveTask)
  const filter = useWb((s) => s.taskFilter)
  const setTaskFilter = useWb((s) => s.setTaskFilter)
  const show = (label: string) => filter === '全部' ? label !== '已归档' : filter === label
  return <>
    <main className="wb-main" data-testid="page-w24">
      <div className="wb-cal-head"><h1 className="wb-title">任务中心</h1><button className="wb-btn ghost" onClick={() => nav('/w09')}>返回今日任务</button></div>
      <div className="wb-filters" data-testid="task-filters">{FILTERS.map((f) => <button key={f} className={filter === f ? 'on' : ''} data-testid={`filter-${f}`} onClick={() => setTaskFilter(f)}>{f}</button>)}</div>
      {GROUPS.filter(([, label]) => show(label)).map(([g, label]) => {
        const rows = tasks.filter((t) => t.group === g)
        return <Card key={g} data-testid={`group-${g}`}><h3>{label} <span className="wb-count">{rows.length}</span></h3>
          {rows.map((t) => <div key={t.id} className="wb-task" data-testid={`task-${t.id}`}>
            <button className="wb-textbtn" onClick={() => { if (g === 'pending') nav('/w21'); if (t.id === 't-xianyuan') nav('/w20') }}>{t.title}</button>
            <span className="wb-sub">{t.source === 'seed' ? '示例' : `来自 ${t.source}（示例）`}</span>
            {g !== 'done' && g !== 'archived' && <button className="wb-btn ghost sm" data-testid={`complete-${t.id}`} onClick={() => completeTask(t.id)}>完成</button>}
            {g === 'done' && <button className="wb-btn ghost sm" data-testid={`archive-${t.id}`} onClick={() => archiveTask(t.id)}>归档</button>}
            {g === 'pending' && <Acts id={t.id} size="sm" note={false} fields={[{ key: `${t.id}.note`, label: '处理说明（示例）', initial: t.title }]} />}
          </div>)}
          {rows.length === 0 && <p className="wb-sub">暂无（示例）</p>}
        </Card>
      })}
    </main>
    <aside className="wb-right">
      <Card><h3>AI 建议优先级</h3>
        {['先处理报价测算转人工跟进', '补发技术资料给刘峰（示例）', '跟进周敏（示例）确认采购窗口'].map((t, i) => <button key={t} className="wb-prio wb-textbtn" onClick={() => { if (i === 0) nav('/w22'); if (i === 2) nav('/w21') }}><span>{i + 1} {t}</span><em>›</em></button>)}
      </Card>
    </aside>
  </>
}
