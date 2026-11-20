import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { HECHUAN, HECHUAN_QUOTE, LEADS, UNANSWERED, XIANYUAN } from './fixtures'
import { useWb } from './store'
import { Acts, Card, Pill } from './ui'

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

export function W14() {
  const nav = useNavigate()
  const selected = useWb((s) => s.selectedLead)
  const selectLead = useWb((s) => s.selectLead)
  const lead = LEADS.find((x) => x.id === selected) ?? LEADS[0]
  return <>
    <main className="wb-main" data-testid="page-w14">
      <h1 className="wb-title">线索列表</h1>
      <p className="wb-sub">共 4 条（示例）。点禾川卡进入线索详情。</p>
      <div className="wb-lead-list">{LEADS.map((x) => <button key={x.id} data-testid={`lead-${x.id}`} className={`wb-lead ${selected === x.id ? 'on' : ''}`} onClick={() => { selectLead(x.id); if (x.id === 'hechuan') nav('/w15') }}>
        <b>{x.name}</b><span>{x.source}</span><strong>{x.score}</strong><em>{x.delta}</em>{x.hint && <Pill>{x.hint}</Pill>}
      </button>)}</div>
      <p className="wb-disclaim">示例数据</p>
    </main>
    <aside className="wb-right">
      <Card><h3>当前线索</h3><p data-testid="w14-selected">{lead.name}</p><p>阶段：线索</p><p>来源：{lead.source}</p><p>评分：{lead.score} {lead.delta}</p>
        {lead.id === 'hechuan' ? <p>联系人：周敏（示例）</p> : <p>该线索无独立终稿详情，保留在列表（示例），不进入禾川金额。</p>}</Card>
      {lead.id === 'hechuan' && <Card><h3>转为商机</h3><p>完整操作在禾川线索详情。</p><button className="wb-btn primary" onClick={() => nav('/w15')}>打开禾川详情</button>
        <Acts id="w14-window" fields={[{ key: 'w14.window', label: '补充说明（示例）', initial: '补充禾川采购窗口（示例）' }]} /></Card>}
    </aside>
  </>
}

export function W15() {
  const nav = useNavigate()
  const convertLead = useWb((s) => s.convertLead)
  return <>
    <main className="wb-main" data-testid="page-w15">
      <div className="wb-cal-head"><h1 className="wb-title">线索详情 · 禾川食品（示例公司）</h1><button className="wb-btn ghost" data-testid="back-leads" onClick={() => nav('/w14')}>返回列表</button></div>
      <Card><h2>意向评分 86（示例） <span className="wb-ok">↑8</span></h2>
        <ol className="wb-axis" data-testid="score-axis"><li>10月28日 78（示例）</li><li>10月30日 82（示例）</li><li>11月2日 86（示例）</li></ol></Card>
      <Card><h3>客户关注点（示例）</h3><ul className="wb-dots" data-testid="lead-concerns"><li>低钠配方</li><li>供货稳定性</li><li>账期</li></ul></Card>
      <button className="wb-btn primary" data-testid="convert-opp" onClick={() => { convertLead(); nav('/w02') }}>转为商机</button>
    </main>
    <aside className="wb-right">
      <Card><h3>当前对象</h3><dl className="wb-kv"><dt>阶段</dt><dd>线索</dd><dt>联系人</dt><dd>周敏（示例）</dd><dt>评分</dt><dd>86（示例）</dd><dt>来源</dt><dd>展会</dd></dl></Card>
    </aside>
  </>
}

export function W16() {
  const nav = useNavigate()
  return <>
    <main className="wb-main" data-testid="page-w16">
      <h1 className="wb-title">能力详情 / 报价测算</h1>
      <Pill>Agent · 示例</Pill>
      <Card><h3>触发条件</h3><p>对话提到年供货量、报价或产线对比（示例）。</p></Card>
      <Card><h3>输入来源</h3><p>当前商机对象、年供货 300 吨（示例）、已确认的需求口径。</p></Card>
      <Card><h3>执行步骤</h3><ol className="wb-dots"><li>查原料价</li><li>比对生产线</li><li>研判毛利与回款周期</li></ol></Card>
      <Card><h3>输出</h3><p>成本对比、推荐报价、毛利与回款周期。采纳前须销售确认，未经确认不写入。</p></Card>
      <button className="wb-btn primary" data-testid="use-in-chat" onClick={() => nav('/w17')}>在对话中使用</button>
      <button className="wb-btn ghost" onClick={() => nav('/w10')}>返回能力中心</button>
    </main>
    <aside className="wb-right">
      <Card><h3>适用范围</h3><p>报价与合同。报价不是阶段。</p><p>主路径会话：禾川报价测算（示例）</p><p className="wb-sub">历史记录另有华粮年度报价测算（支线，示例），不作为本次默认会话。</p></Card>
    </aside>
  </>
}

export function W17() {
  const nav = useNavigate()
  const local = useWb((s) => s.quoteUsesLocal)
  return <>
    <main className="wb-main" data-testid="page-w17">
      <h1 className="wb-title">禾川报价测算</h1>
      <p className="wb-sub">对象：{HECHUAN.opp} · 联系人周敏（示例） · 年供货 {HECHUAN.tons}</p>
      {local && <p className="wb-banner" data-testid="local-price">已改用本地价表（示例）。对象仍是禾川，未调用外部接口。</p>}
      <Card data-testid="run-card"><h3>能力运行中</h3>
        <ol className="wb-run" data-testid="run-steps">
          <li data-state="done">查原料价 · 已完成</li>
          <li data-state="run">比对生产线 · 进行中</li>
          <li data-state="wait">研判毛利 · 等待中</li>
        </ol>
      </Card>
      <div className="wb-chiprow"><span className="wb-chip">报价测算</span><span>能力运行中…</span></div>
      <div className="wb-acts-row">
        <button className="wb-btn primary" data-testid="quote-finish" onClick={() => nav('/w18')}>示例：完成测算</button>
        <button className="wb-btn danger" data-testid="quote-fail" onClick={() => nav('/w22')}>示例：测算失败</button>
        <button className="wb-btn ghost" data-testid="why-call" onClick={() => nav('/w23')}>为什么调用</button>
      </div>
      <p className="wb-note">以上为确定性示例开关，不调用外部 AI 或业务接口。</p>
    </main>
    <aside className="wb-right" data-testid="w17-rail">
      <Card><h3>当前对象</h3><p>{HECHUAN.company}</p><p>阶段：拜访 · 复访</p><p>联系人：周敏（示例）</p><p>年供货：{HECHUAN.tons}</p><p data-testid="quote-computing">报价金额：计算中（示例）</p></Card>
    </aside>
  </>
}

export function W18() {
  const nav = useNavigate()
  const pick = useWb((s) => s.linePick)
  const setLinePick = useWb((s) => s.setLinePick)
  const adoptHechuan = useWb((s) => s.adoptHechuan)
  const setQuoteSheet = useWb((s) => s.setQuoteSheet)
  const addTask = useWb((s) => s.addTask)
  const q = HECHUAN_QUOTE
  const useA = pick === 'A'
  return <>
    <main className="wb-main" data-testid="page-w18">
      <h1 className="wb-title">报价测算结果 · 禾川报价测算</h1>
      <p className="wb-sub">{HECHUAN.opp} · 账期 {q.term}（示例） · 推荐产线 A。产线 A 与 B 互斥，只能采纳其一。</p>
      <table className="wb-table" data-testid="hechuan-result"><tbody>
        <tr><td>报价合计</td><td data-testid="q-total">{q.total}（示例）</td></tr>
        <tr><td>原料成本</td><td data-testid="q-material">{q.material}（示例）</td></tr>
        <tr><td>产线 A</td><td data-testid="q-line-a">{q.lineA}（示例）</td></tr>
        <tr><td>产线 B</td><td data-testid="q-line-b">{q.lineB}（示例）</td></tr>
        <tr><td>采用{pick}的总成本</td><td data-testid="q-cost">{useA ? q.costA : q.costB}（示例）</td></tr>
        <tr><td>采用{pick}的毛利</td><td data-testid="q-profit">{useA ? `${q.profitA} / ${q.marginA}` : `${q.profitB} / ${q.marginB}`}（示例）</td></tr>
        <tr><td>回款周期</td><td data-testid="q-term">{q.term}（示例）</td></tr>
      </tbody></table>
      <div className="wb-acts-row" data-testid="line-pick">
        <button className={`wb-btn ${pick === 'A' ? 'primary' : 'ghost'}`} data-testid="pick-a" onClick={() => setLinePick('A')}>产线 A（推荐）</button>
        <button className={`wb-btn ${pick === 'B' ? 'primary' : 'ghost'}`} data-testid="pick-b" onClick={() => setLinePick('B')}>产线 B（对比，不推荐）</button>
      </div>
      <div className="wb-acts-row">
        <button className="wb-btn primary" data-testid="adopt" onClick={() => { adoptHechuan(); nav('/w04') }}>采纳</button>
        <button className="wb-btn ghost" data-testid="revise" onClick={() => nav('/w17')}>修改</button>
        <button className="wb-btn ghost" data-testid="to-manual" onClick={() => { addTask({ id: 't-manual', title: '报价测算转人工跟进', group: 'pending', source: 'w22' }); nav('/w24') }}>转人工</button>
      </div>
    </main>
    <aside className="wb-right">
      <Card><h3>当前对象</h3><p>{HECHUAN.company}</p><p>阶段：拜访 · 复访</p><p data-testid="w18-amount">预计金额 {q.total}（示例）</p>
        <button className="wb-link" data-testid="open-hechuan-sheet" onClick={() => { setQuoteSheet('hechuan'); nav('/w12') }}>查看禾川报价单落点</button></Card>
      <Card><h3>将报价测算结果写入商机</h3><p className="wb-note">未经确认不会写入。采纳后进入禾川写入前 diff。</p></Card>
    </aside>
  </>
}

export function W19() {
  const nav = useNavigate()
  const submitted = useWb((s) => s.contractSubmitted)
  const reopen = useWb((s) => s.reopenContract)
  return <>
    <main className="wb-main" data-testid="page-w19">
      <h1 className="wb-title">签约审批</h1>
      <p data-testid="contract-name">禾川食品 · 正式合同（示例）</p>
      <p data-testid="contract-amount">合同金额 ¥135 万（示例）</p>
      <p className="wb-sub">{submitted ? '已由写入前 diff 确认提交（示例）。' : '示例：当前展示提交后进度，可从写入前 diff 确认提交后进入。'}</p>
      <ol className="wb-progress" data-testid="approval-progress">
        <li data-state="done">1 提交 · 已完成 · 10月20日（示例）</li>
        <li data-state="done">2 销售经理 王磊（示例） · 已通过 · 10月21日（示例）</li>
        <li data-state="run">3 财务 陈静（示例） · 审核中</li>
        <li data-state="wait">4 盖章 法务 · 赵敏（示例） · 未开始</li>
      </ol>
      <p data-testid="approval-gap">还差「财务 · 陈静（示例）」「法务 · 赵敏（示例）」盖章。</p>
      <div className="wb-acts-row">
        <button className="wb-btn ghost" onClick={() => { reopen(); nav('/w04') }}>返回提交前 diff</button>
        <button className="wb-btn ghost" onClick={() => nav('/w13')}>去回款列表</button>
      </div>
    </main>
    <aside className="wb-right">
      <Card><h3>审批状态</h3><p data-testid="finance-status">财务审核中（示例）</p><p>对象：{HECHUAN.company}</p><Acts id="w19-attach" doneText="已记录补充附件（示例）" fields={[{ key: 'w19.attach', label: '附件说明（示例）', initial: '补充合同附件给陈静（示例）' }]} /></Card>
    </aside>
  </>
}

export function W20() {
  const nav = useNavigate()
  const addTask = useWb((s) => s.addTask)
  const [added, setAdded] = useState(false)
  return <>
    <main className="wb-main" data-testid="page-w20">
      <div className="wb-cal-head"><h1 className="wb-title">回款预警与催收计划</h1><button className="wb-btn ghost" onClick={() => nav('/w13')}>返回列表</button></div>
      <Card data-testid="xianyuan-card"><h2>{XIANYUAN.company}</h2><p>{XIANYUAN.overdue} · {XIANYUAN.amount}</p><p>联系人：{XIANYUAN.contact}（鲜源，不是禾川财务）</p></Card>
      <Card><h3>AI 沟通计划（示例）</h3><dl className="wb-kv" data-testid="collect-plan"><dt>何时</dt><dd>{XIANYUAN.when}</dd><dt>联系谁</dt><dd>{XIANYUAN.contact}</dd><dt>说什么</dt><dd>{XIANYUAN.say}</dd></dl>
        <button className="wb-btn primary" data-testid="add-today" onClick={() => { addTask({ id: 't-xianyuan', title: '鲜源催款电话', group: 'doing', source: 'w20' }); setAdded(true) }}>加入今日任务</button>
        {added && <p className="wb-ok" data-testid="added-today">已加入今日任务（示例）。可在今日任务或任务中心看到「鲜源催款电话」。</p>}</Card>
    </main>
    <aside className="wb-right">
      <Card><h3>创建催款跟进任务</h3><p>责任人：张帆（示例） · 推断</p><Acts id="w20-task" fields={[{ key: 'w20.note', label: '催收说明（示例）', initial: '确认鲜源付款计划（示例）' }]} /></Card>
    </aside>
  </>
}

const W21_CARDS = [
  { id: 'infer', kind: '推断', title: '补发技术资料给刘峰（示例）', open: false },
  { id: 'fact', kind: '事实', title: '跟进周敏确认采购窗口', open: true },
  { id: 'approve', kind: '待审批', title: '签约 · 正式合同待王磊审批（示例）', open: false },
] as const

export function W21() {
  const nav = useNavigate()
  const [open, setOpen] = useState<string>('fact')
  return <>
    <main className="wb-main" data-testid="page-w21">
      <div className="wb-cal-head"><h1 className="wb-title">今日任务</h1><button className="wb-btn ghost" onClick={() => nav('/w09')}>返回今日任务</button></div>
      <p className="wb-sub">行动卡片三态（示例）。这是待确认区的展开，不是另一套任务系统。</p>
      {W21_CARDS.map((c) => <Card key={c.id} data-testid={`w21-${c.id}`}>
        <div className="wb-card-h"><button className="wb-textbtn" data-testid={`w21-toggle-${c.id}`} onClick={() => setOpen(open === c.id ? '' : c.id)}><span className={`wb-kind ${c.kind === '事实' ? 'fact' : c.kind === '待审批' ? 'approve' : ''}`}>{c.kind}</span> {c.title}</button></div>
        {open === c.id && c.id === 'fact' && <div data-testid="w21-basis"><p>依据：展会纪要与邮件确认（示例）</p><p>需确认部门：技术部（示例）</p></div>}
        {open === c.id && c.id !== 'fact' && <p className="wb-sub">收起态的依据可展开查看。当前示例展开以「跟进周敏确认采购窗口」为准。</p>}
        <Acts id={`w21-${c.id}`} fields={[{ key: `w21.${c.id}`, label: '行动说明（示例）', initial: c.title }]} />
      </Card>)}
    </main>
    <aside className="wb-right">
      <Card><h3>AI 建议优先级</h3>{['先处理跟进周敏确认采购窗口', '再补发技术资料', '签约审批仍待王磊'].map((t, i) => <div key={t} className="wb-prio"><span>{i + 1}. {t}</span><span className="wb-kind">推断</span></div>)}</Card>
    </aside>
  </>
}

export function W22() {
  const nav = useNavigate()
  const addTask = useWb((s) => s.addTask)
  const setQuoteUsesLocal = useWb((s) => s.setQuoteUsesLocal)
  const [text, setText] = useState('')
  const [reply, setReply] = useState('')
  return <>
    <main className="wb-main" data-testid="page-w22">
      <h1 className="wb-title">禾川报价测算 · 异常</h1>
      <p className="wb-sub">对象仍是 {HECHUAN.opp}。示例故障，未调用外部服务。</p>
      <Card data-testid="fail-manual"><h3>测算失败转人工</h3><p>原料价比对未完成（示例）。</p><button className="wb-btn primary" data-testid="escalate" onClick={() => { addTask({ id: 't-manual', title: '报价测算转人工跟进', group: 'pending', source: 'w22' }); nav('/w24') }}>转人工</button></Card>
      <Card data-testid="fail-external"><h3>外部系统调不通</h3><p>原料价表接口不可用（示例）。可改用本地价表或通知运维。</p>
        <div className="wb-acts-row">
          <button className="wb-btn primary" data-testid="use-local" onClick={() => { setQuoteUsesLocal(true); nav('/w17') }}>改用本地价表</button>
          <button className="wb-btn ghost" data-testid="notify-ops" onClick={() => nav('/w17')}>通知运维后返回运行</button>
        </div>
        <Acts id="w22-ops" fields={[{ key: 'w22.ops', label: '运维说明（示例）', initial: '原料价表接口不可用（示例）' }]} />
      </Card>
      <Card data-testid="fail-clarify"><h3>AI 没听懂</h3><p>你是要重算禾川报价，还是只要毛利提醒？（示例）</p>
        <label className="wb-field">回复<textarea data-testid="w22-input" value={text} onChange={(e) => setText(e.target.value)} /></label>
        <button className="wb-btn primary" data-testid="w22-send" onClick={() => setReply(text.trim() ? `已收到「${text.trim()}」。将按禾川食品继续重算报价（示例），未调用外部服务。` : '')}>发送</button>
        {reply && <p data-testid="w22-reply">{reply}</p>}
        <button className="wb-link" onClick={() => nav('/w17')}>返回运行中</button>
      </Card>
    </main>
    <aside className="wb-right"><Card><h3>状态</h3><p data-testid="exception-state">异常处理中（示例）</p><p>{HECHUAN.company}</p><p>阶段：拜访 · 复访</p></Card></aside>
  </>
}

export function W23() {
  const nav = useNavigate()
  return <>
    <main className="wb-main" data-testid="page-w23">
      <h1 className="wb-title">为什么调用这个能力</h1>
      <p>已调用「报价测算」（示例）。对象：{HECHUAN.opp}</p>
      <Card data-testid="why-panel"><dl className="wb-kv">
        <dt>命中规则</dt><dd>对话提到年供货量与报价（示例）</dd>
        <dt>模型判断</dt><dd>适合调用报价测算（示例）</dd>
        <dt>置信度</dt><dd data-testid="confidence">0.86（示例）</dd>
      </dl></Card>
      <div className="wb-acts-row">
        <button className="wb-btn primary" data-testid="switch-skill" onClick={() => nav('/w10')}>换一个能力</button>
        <button className="wb-btn ghost" data-testid="back-skill" onClick={() => nav('/w16')}>返回报价测算详情</button>
        <button className="wb-btn ghost" onClick={() => nav('/w17')}>返回运行中</button>
      </div>
    </main>
    <aside className="wb-right"><Card><h3>当前对象</h3><p>{HECHUAN.company}</p><p>阶段：拜访 · 复访</p><p>待确认：将报价测算结果写入商机（未经确认不会写入）</p></Card></aside>
  </>
}

export function W24() {
  const nav = useNavigate()
  const tasks = useWb((s) => s.tasks)
  const completeTask = useWb((s) => s.completeTask)
  const groups: ['doing' | 'pending' | 'done', string][] = [['doing', '进行中'], ['pending', '待确认'], ['done', '已完成']]
  return <>
    <main className="wb-main" data-testid="page-w24">
      <div className="wb-cal-head"><h1 className="wb-title">任务中心</h1><button className="wb-btn ghost" onClick={() => nav('/w09')}>返回今日任务</button></div>
      {groups.map(([g, label]) => <Card key={g}><h3>{label}</h3>
        {tasks.filter((t) => t.group === g).map((t) => <div key={t.id} className="wb-task" data-testid={`task-${t.id}`}>
          <button className="wb-textbtn" onClick={() => { if (g === 'pending') nav('/w21'); if (t.id === 't-xianyuan') nav('/w20') }}>{t.title}</button>
          <span className="wb-sub">{t.source === 'seed' ? '示例' : `来自 ${t.source}（示例）`}</span>
          {g !== 'done' && <button className="wb-btn ghost sm" data-testid={`complete-${t.id}`} onClick={() => completeTask(t.id)}>完成</button>}
          {g === 'pending' && <Acts id={t.id} size="sm" fields={[{ key: `${t.id}.note`, label: '处理说明（示例）', initial: t.title }]} />}
        </div>)}
        {tasks.every((t) => t.group !== g) && <p className="wb-sub">暂无（示例）</p>}
      </Card>)}
    </main>
    <aside className="wb-right"><Card><h3>AI 建议优先级</h3><p>先处理报价测算转人工跟进（若已从异常转入，示例）</p><p className="wb-kind">推断</p></Card></aside>
  </>
}
