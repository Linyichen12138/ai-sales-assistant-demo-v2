import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HECHUAN, HECHUAN_QUOTE, HUALIANG, XIANYUAN } from './fixtures'
import { useWb } from './store'
import { Acts, AiAva, Card, Ico, Pill, UserAva } from './ui'

const OPP = '禾川食品 · 2027 调味料供货商机（示例）'

function Composer({ ph }: { ph: string }) {
  const notify = useWb((s) => s.notify); const [v, setV] = useState('')
  return <div className="wb-composer"><input value={v} onChange={(e) => setV(e.target.value)} placeholder={ph} onKeyDown={(e) => { if (e.key === 'Enter') { notify('演示版不发送消息（示例）'); setV('') } }} /><button className="wb-send" onClick={() => { notify('演示版不发送消息（示例）'); setV('') }}><Ico n="send" /></button></div>
}
function Ctx({ text, pill }: { text: string; pill: string }) { return <div className="wb-ctx"><span className="wb-ctx-obj">{text}</span><Pill>{pill}</Pill></div> }
function Msg({ who, children }: { who: 'ai' | 'me'; children: React.ReactNode }) {
  return <div className={`wb-msg ${who}`}>{who === 'ai' && <AiAva />}<div className="wb-bubble">{children}</div>{who === 'me' && <UserAva />}</div>
}

/* ---------- W01 默认态 ---------- */
export function W01() {
  const nav = useNavigate(); const notify = useWb((s) => s.notify)
  const skills = [
    { n: 'bar', t: '商机研判', d: '梳理商机进展与关键判断', to: '' },
    { n: 'cal', t: '复访方案', d: '制定复访目标、议题与安排', to: '/w02' },
    { n: 'doc', t: '会后摘要', d: '基于拜访内容生成纪要要点', to: '/w03' },
    { n: 'hand', t: '签约节点', d: '梳理签约前的关键事项与时间', to: '/w04' },
  ]
  return <>
    <main className="wb-main" data-testid="page-w01">
      <Ctx text={OPP} pill="拜访 · 复访" />
      <div className="wb-hero"><h1>今天先从哪件事开始？</h1><p>当前对象：禾川食品（示例公司）</p></div>
      <div className="wb-skill-grid">{skills.map((k) => <button key={k.t} className={`wb-skill ${k.t === '复访方案' ? 'hint' : ''}`} onClick={() => k.to ? nav(k.to) : notify('「商机研判」示例：主路径请点「复访方案」')}><span className="wb-skill-ico"><Ico n={k.n} s={26} /></span><span><b>{k.t}</b><small>{k.d}</small></span></button>)}</div>
      <div className="wb-spacer" />
      <Composer ph="问问禾川这单..." />
      <p className="wb-disclaim">内容由 AI 生成，请核查重要信息 · 示例数据</p>
    </main>
    <aside className="wb-right">
      <Card><h3>当前对象</h3><dl className="wb-kv">
        <dt>公司</dt><dd>禾川食品（示例公司）</dd><dt>商机</dt><dd>{OPP}</dd><dt>阶段</dt><dd><Pill>拜访 · 复访</Pill></dd>
        <dt>联系人</dt><dd>采购经理周敏（示例）<br />研发总监刘峰（示例，技术评估人）<br />财务负责人马丽（示例，预算审批人）</dd><dt>更新时间</dt><dd>10月22日（示例）</dd></dl></Card>
      <Card><div className="wb-card-h"><h3>待确认行动 <span className="wb-badge">3</span></h3><small>未经确认不会写入</small></div>
        {[['w01-a', '补发技术资料给刘峰（示例）'], ['w01-b', '跟进周敏（示例）确认采购窗口'], ['w01-c', '签约 · 正式合同 待组长王磊（示例）审批']].map(([id, t]) => <div key={id} className="wb-todo"><p>{t}</p><Acts id={id} size="sm" note={false} /></div>)}</Card>
      <Card><h3>风险 <span className="wb-badge">1</span></h3><div className="wb-risk-row"><span className="wb-risk-dot">!</span>复访已停滞 9 天（示例）</div></Card>
    </aside>
  </>
}

/* ---------- W02 对象上下文对话 ---------- */
export function W02() {
  const nav = useNavigate(); const d = useWb((s) => s.decisions['w02-card']); const converted = useWb((s) => s.leadConverted)
  return <>
    <main className="wb-main" data-testid="page-w02">
      {converted && <p className="wb-banner" data-testid="lead-converted">已由线索转为商机（示例）。阶段已离开线索，当前为商机上下文 · {HECHUAN.stageVisit}</p>}
      <div className="wb-chat">
        <Msg who="me">刘峰（示例）的技术评估还有哪些未答问题？</Msg>
        <Msg who="ai"><p>刘峰（示例）的技术评估目前还有 3 项未答问题：</p><ul className="wb-dots"><li>低钠配方的稳定性检测报告</li><li>批次留样与追溯流程</li><li>新品试产的交付周期</li></ul><p className="wb-src">依据：复访纪要（示例数据）· 更新于 10月22日（示例）</p></Msg>
        <div className="wb-msg ai"><span className="wb-ava-gap" /><div className="wb-action">
          <h3><span className="wb-skill-ico sm"><Ico n="doc" /></span>补发技术资料</h3>
          <p>向禾川食品（示例公司）补发技术资料，重点提供：低钠配方的稳定性检测报告、批次留样与追溯流程、新品试产的交付周期。</p>
          <p><b>预计金额 ¥135 万（示例）| 需求数量 300 吨（示例）</b></p>
          <Acts id="w02-card" size="lg" doneText="已生成补发资料任务（示例）" />
          {d === '已写入' && <button className="wb-link" onClick={() => nav('/w03')}>下一步：整理复访纪要并确认写入 →</button>}
          {d !== '已写入' && <button className="wb-link" onClick={() => nav('/w03')}>查看复访纪要行动卡（确认 / 驳回）→</button>}
        </div></div>
      </div>
      <Composer ph="输入你的问题或指令..." />
    </main>
    <aside className="wb-right plain">
      <h3 className="wb-rt">当前对象</h3>
      <Card><div className="wb-obj"><span className="wb-skill-ico"><Ico n="building" s={20} /></span><b>禾川食品（示例公司）</b></div><dl className="wb-kv tight"><dd>预计金额 ¥135 万（示例）</dd><dd>需求数量 300 吨（示例）</dd><dd>预计签约 11月30日（示例）</dd></dl></Card>
      <h3 className="wb-rt">联系人</h3>
      {[['周敏（示例）', '采购经理'], ['刘峰（示例）', '研发总监 · 技术评估人'], ['马丽（示例）', '财务负责人 · 预算审批人']].map(([n, t]) => <Card key={n} className="wb-contact"><span className="wb-skill-ico"><Ico n="user" s={20} /></span><span><b>{n}</b><small>{t}</small></span><em>›</em></Card>)}
      <h3 className="wb-rt">待确认行动</h3>
      <Card className="wb-contact"><span className="wb-skill-ico"><Ico n="doc" s={20} /></span><span><b>补发技术资料</b><small>{d === '已写入' ? '已确认写入（示例）' : d === '已驳回' ? '已驳回' : '完善低钠配方检测、批次追溯与试产周期'}</small></span><em>›</em></Card>
    </aside>
  </>
}

/* ---------- W03 行动卡确认/驳回（写入前 diff） ---------- */
export function W03() {
  const nav = useNavigate(); const s = useWb(); const d = s.decisions['w03-card'] ?? '待确认'
  const points = s.committed['w03.points']
  const next = s.committed['w03.next']
  const [diff, setDiff] = useState(false); const [rej, setRej] = useState(false)
  const reason = s.reasons['w03-card'] ?? ''
  const beginEdit = () => {
    if (s.drafts['w03.points'] === undefined) s.setDraft('w03.points', points)
    if (s.drafts['w03.next'] === undefined) s.setDraft('w03.next', next)
    s.setDecision('w03-card', '编辑中'); setDiff(false); setRej(false)
  }
  return <>
    <main className="wb-main" data-testid="page-w03">
      <Ctx text={OPP} pill="拜访 · 复访" />
      <div className="wb-chat">
        <Msg who="ai"><p>我已整理本次复访的关键信息，请确认是否写入拜访纪要。</p></Msg>
        <div className="wb-msg ai"><span className="wb-ava-gap" /><table className="wb-table kv"><tbody>
          <tr><th>客户</th><td>禾川食品（示例公司）</td></tr><tr><th>拜访人</th><td>张帆（示例）</td></tr>
          <tr><th>拜访时间</th><td>2025-01-15（示例）</td></tr>
          <tr><th>沟通要点</th><td data-testid="w03-committed-points">{points}</td></tr>
          <tr><th>下一步</th><td data-testid="w03-committed-next">{next}</td></tr></tbody></table></div>
        <Msg who="me">采购窗口的时间我想再确认一下，先不写入。</Msg>
        <Msg who="ai">已为你生成跟进确认的行动卡，请确认、编辑或驳回。</Msg>
      </div>
      <Composer ph="请输入你的要求..." />
    </main>
    <aside className="wb-right wide">
      <Card className="wb-detail">
        <Pill tone="terra">未经确认不会写入</Pill>
        <h2>跟进周敏（示例）确认采购窗口</h2>
        <dl className="wb-kv">
          <dt>结论：</dt><dd>需与周敏（示例）确认采购窗口的具体时间。</dd>
          <dt>依据：</dt><dd>本次复访中（2025-01-15，示例），客户表示采购计划预计在 3 月启动，仍需进一步确认。</dd>
          <dt>影响：</dt><dd>明确时间后可安排样品、报价及后续资源，避免进度迟误。</dd>
          <dt>下一步：</dt><dd>尽快联系周敏（示例），确认采购窗口时间。</dd>
          <dt>责任人：</dt><dd>张帆（示例）</dd><dt>权限：</dt><dd><b>可写入拜访纪要</b></dd></dl>
        {d === '待确认' || d === '编辑中' ? <>
          {d === '编辑中' && <div className="wb-edit" data-testid="edit-form-w03">
            <label className="wb-field">沟通要点（示例）<textarea data-testid="field-w03.points" value={s.drafts['w03.points'] ?? ''} onChange={(e) => s.setDraft('w03.points', e.target.value)} /></label>
            <label className="wb-field">下一步（示例）<input data-testid="field-w03.next" value={s.drafts['w03.next'] ?? ''} onChange={(e) => s.setDraft('w03.next', e.target.value)} /></label>
            <small className="wb-note">编辑中 · 未经确认不会写入。左侧纪要仍是已确认内容。</small>
          </div>}
          {!diff && <div className="wb-acts-row lg"><button className="wb-btn primary" data-testid="w03-open-diff" onClick={() => { setDiff(true); setRej(false) }}>确认写入</button><button className="wb-btn ghost" data-testid="w03-edit" onClick={beginEdit}>编辑</button><button className="wb-btn danger solid" data-testid="w03-reject" onClick={() => { setRej(true); setDiff(false) }}>驳回</button></div>}
          {diff && <div className="wb-diff" data-testid="w03-diff"><h4>写入前 diff · 拜访纪要（示例数据）</h4>
            <table className="wb-table"><thead><tr><th>字段</th><th>已确认</th><th>待确认新值</th></tr></thead><tbody>
              <tr><td>沟通要点</td><td className="old">{points}</td><td className="new">{s.drafts['w03.points'] ?? points}</td></tr>
              <tr><td>下一步</td><td className="old">{next}</td><td className="new">{s.drafts['w03.next'] ?? next}</td></tr></tbody></table>
            <div className="wb-acts-row"><button className="wb-btn primary" data-testid="w03-commit" onClick={() => { s.confirmFields(['w03.points', 'w03.next']); s.setDecision('w03-card', '已写入'); setDiff(false) }}>确认无误，写入</button><button className="wb-btn ghost" onClick={() => setDiff(false)}>返回</button></div></div>}
          {rej && <div className="wb-reject"><label className="wb-field">驳回原因（必填）<textarea data-testid="reason-w03-card" value={reason} onChange={(e) => s.setReason('w03-card', e.target.value)} placeholder="请输入驳回原因..." /></label>
            <div className="wb-acts-row"><button className="wb-btn primary" data-testid="reject-submit-w03" disabled={!reason.trim()} onClick={() => { s.setDecision('w03-card', '已驳回'); setRej(false) }}>提交驳回</button>{!reason.trim() && <span className="wb-err">填写原因后才能提交</span>}</div></div>}
        </> : <div className="wb-result">
          <p className={d === '已写入' ? 'wb-ok' : 'wb-rej'} data-testid="w03-result">{d === '已写入' ? '✓ 已写入拜访纪要（示例）' : `✕ 已驳回：${reason || '（示例原因）'}，未写入`}</p>
          <div className="wb-acts-row"><button className="wb-btn primary" onClick={() => { s.setVisitTarget('hechuan'); nav('/w05') }}>下一步：开始初访（W05）</button><button className="wb-btn ghost" onClick={() => nav('/w11')}>样品安排（W11）</button><button className="wb-btn ghost" onClick={() => { s.setDecision('w03-card', '待确认'); s.setReason('w03-card', '') }}>撤销</button></div></div>}
      </Card>
    </aside>
  </>
}

/* ---------- W04 签约审批 ---------- */
export function W04() {
  const nav = useNavigate(); const s = useWb()
  const d = s.decisions['w04-card'] ?? '待确认'
  const delivery = s.committed['w04.delivery']
  const [rej, setRej] = useState(false)
  const reason = s.reasons['w04-card'] ?? ''
  const beginEdit = () => {
    if (s.drafts['w04.delivery'] === undefined) s.setDraft('w04.delivery', delivery)
    s.setDecision('w04-card', '编辑中'); setRej(false)
  }
  return <>
    <main className="wb-main" data-testid="page-w04">
      <h1 className="wb-title">写入前 diff / 签约审批</h1>
      <p className="wb-sub">对象：{HECHUAN.company} · {HECHUAN.opp}。此页是提交前确认，不是审批进度。</p>
      <div className="wb-chat">
        <Msg who="me">请帮我确认禾川食品（示例公司）的正式合同变更，看看写入系统前的差异，并按流程提交审批。</Msg>
        <Msg who="ai">我已整理本次合同变更的写入前差异（diff），包括阶段、合同金额和交付承诺的变化。确认提交后才会进入审批进度。</Msg>
      </div>
    </main>
    <aside className="wb-right wide plain">
      <Card><div className="wb-card-h"><h2>签约 · 正式合同变更（示例数据）</h2><Pill tone="coral">需组长审批</Pill></div>
        <p className="wb-sub">审批人：王磊（示例）· 组长</p>
        <table className="wb-table" data-testid="w04-diff"><thead><tr><th>字段</th><th>原值</th><th>新值</th></tr></thead><tbody>
          <tr><td>阶段</td><td className="old">拜访 · 复访</td><td className="new">签约 · 正式合同</td></tr>
          <tr><td>合同金额</td><td className="old">¥120 万（示例）</td><td className="new" data-testid="w04-amount">¥135 万（示例）</td></tr>
          <tr><td>交付承诺</td><td className="old">未约定</td><td className="new" data-testid="w04-delivery">{delivery}</td></tr></tbody></table>
        <p className="wb-sub">来源：禾川食品（示例公司）<br />版本：v3（示例）<br />数据更新于：10月28日（示例）</p></Card>
      <Card>
        {d === '编辑中' && <div className="wb-edit" data-testid="edit-form-w04">
          <label className="wb-field">交付承诺（示例）<input data-testid="field-w04.delivery" value={s.drafts['w04.delivery'] ?? ''} onChange={(e) => s.setDraft('w04.delivery', e.target.value)} /></label>
          <small className="wb-note">编辑中 · 未经确认不会写入。上方 diff 仍显示已确认新值。合同金额保持 ¥135 万（示例）。</small>
        </div>}
        {rej && <div className="wb-reject"><label className="wb-field">驳回原因（必填）<textarea data-testid="reason-w04-card" value={reason} onChange={(e) => s.setReason('w04-card', e.target.value)} /></label>
          <button className="wb-btn primary" data-testid="reject-submit-w04" disabled={!reason.trim()} onClick={() => { s.setDecision('w04-card', '已驳回'); setRej(false) }}>提交驳回</button></div>}
        {d === '已驳回' && <p className="wb-rej" data-testid="w04-rejected">✕ 已驳回，未提交审批：{reason}</p>}
        {d !== '已驳回' && <div className="wb-acts-row">
          <button className="wb-btn primary" data-testid="w04-commit" onClick={() => { s.confirmFields(['w04.delivery']); s.submitContract(); s.setDecision('w04-card', '已写入'); nav('/w19') }}>确认写入</button>
          <button className="wb-btn ghost" data-testid="w04-edit" onClick={beginEdit}>编辑</button>
          <button className="wb-btn danger" data-testid="w04-reject" onClick={() => setRej(true)}>驳回</button>
        </div>}
        <small className="wb-note">未经确认不会写入，也不会进入审批进度。</small>
      </Card>
    </aside>
  </>
}

/* ---------- W05 开始初访 ---------- */
export function W05() {
  const nav = useNavigate(); const target = useWb((s) => s.visitTarget); const [c, setC] = useState(0)
  const hechuan = target !== 'xianyuan'
  const items = hechuan
    ? [['flag', '初访准备', '拜访目标：了解 2027 调味料年度需求与采购流程（示例）'], ['shield', '敏感问题提示', '价格、赔付、交付保证需人工确认，不要现场承诺。'], ['doc', '离线草稿', '现场无网也可速记，联网后同步。']]
    : [['flag', '初访准备', '拜访目标：了解鲜源门店补货节奏（示例）'], ['shield', '敏感问题提示', '价格、赔付、交付保证需人工确认，不要现场承诺。'], ['doc', '离线草稿', '现场无网也可速记，联网后同步。']]
  const people = hechuan ? ['周敏（示例）· 采购经理', '刘峰（示例）· 研发总监', '马丽（示例）· 财务负责人'] : ['门店经理（示例）', '采购（示例）']
  const opp = hechuan ? OPP : '鲜源连锁 · 门店补货（示例）'
  const who = hechuan ? '禾川食品（示例公司）' : XIANYUAN.company
  return <>
    <main className="wb-main" data-testid="page-w05">
      <Ctx text={opp} pill="拜访 · 初访" />
      <Msg who="ai">已为初访准备好目标与提示。对象：{who}</Msg>
      {items.map(([n, t, dsc], i) => <Card key={t} className="wb-prep"><span className="wb-prep-ico"><Ico n={n} s={26} /></span><div><h3>{t}</h3><p>{dsc}</p></div><Acts id={`w05-${target}-${i}`} size="sm" fields={[{ key: `w05.${target}.${i}`, label: `${t}备注（示例）`, initial: dsc }]} /></Card>)}
    </main>
    <aside className="wb-right">
      <Card><h3>当前对象</h3><div className="wb-obj" data-testid="w05-object"><Ico n="building" s={20} />{who}</div></Card>
      <Card className="grow"><h3>选择联系人</h3>{people.map((p, i) => <button key={p} className={`wb-radio ${c === i ? 'on' : ''}`} data-testid={`w05-contact-${i}`} onClick={() => setC(i)}><i />{p}</button>)}
        <button className="wb-btn primary block" data-testid="start-visit" onClick={() => nav('/w06')}>开始初访</button><p className="wb-note center">进入现场速记。返回工作台后保留当前会话</p></Card>
    </aside>
  </>
}

/* ---------- W09 今日任务 ---------- */
export function W09() {
  const nav = useNavigate(); const tasks = useWb((s) => s.tasks); const setScheduleFocus = useWb((s) => s.setScheduleFocus); const setVisitTarget = useWb((s) => s.setVisitTarget)
  const acts = [['推断', '补发技术资料给刘峰（示例）', 'w09-tech'], ['事实', '跟进周敏（示例）确认采购窗口', 'w09-window'], ['待审批', '签约 · 正式合同 待王磊审批（示例）', 'w09-sign']]
  const collect = tasks.find((t) => t.id === 't-xianyuan')
  return <>
    <main className="wb-main wide" data-testid="page-w09">
      <div className="wb-cal-head"><h1 className="wb-title">今日任务 · 11月3日（示例）</h1><button className="wb-btn ghost" data-testid="open-task-center" onClick={() => nav('/w24')}>进入任务中心</button></div>
      <Card><h3>待确认行动 <span className="wb-badge">3</span></h3>{acts.map(([k, t, id]) => <div key={id} className="wb-task"><span className="wb-kind">{k}</span><button className="wb-textbtn" data-testid={`w09-open-${id}`} onClick={() => nav('/w21')}>{t}</button><Acts id={id} size="sm" fields={[{ key: `${id}.note`, label: '行动说明（示例）', initial: t }]} /></div>)}</Card>
      <Card><h3>今日拜访 <span className="wb-badge">{collect ? 3 : 2}</span></h3>
        <button className="wb-row" data-testid="visit-hechuan" onClick={() => { setScheduleFocus('hechuan'); setVisitTarget('hechuan'); nav('/w11') }}><Ico n="cal" /><b>10:00</b>禾川食品（示例公司）复访（示例）</button>
        <button className="wb-row" data-testid="visit-xianyuan" onClick={() => { setVisitTarget('xianyuan'); nav('/w05') }}><Ico n="cal" /><b>15:00</b>鲜源连锁（示例公司）初访（示例）</button>
        {collect && <button className="wb-row" data-testid="task-xianyuan-w09" onClick={() => nav('/w20')}><Ico n="cal" /><b>15:00</b>鲜源催款电话（示例）</button>}</Card>
      <Card><h3><span className="wb-reddot" />风险提醒 <span className="wb-badge">2</span></h3>
        <button className="wb-row" onClick={() => nav('/w02')}><span className="wb-red"><Ico n="warn" /></span>禾川复访已停滞 9 天（示例）</button>
        <button className="wb-row" data-testid="risk-xianyuan" onClick={() => nav('/w20')}><span className="wb-red"><Ico n="warn" /></span>鲜源回款逾期 5 天（示例）</button></Card>
    </main>
    <aside className="wb-right">
      <Card><h3><span className="wb-ai-chip">AI</span> AI 建议优先级</h3>
        {['先确认周敏（示例）采购窗口', '补发技术资料推进技术评估', '电话确认鲜源付款计划'].map((t, i) => <div key={t} className="wb-prio"><span>{i + 1}. {t}</span><span className="wb-kind">推断</span></div>)}</Card>
      <div className="wb-spacer" /><p className="wb-disclaim right">示例数据</p>
    </aside>
  </>
}

/* ---------- W10 能力中心 ---------- */
export function W10() {
  const nav = useNavigate(); const [f, setF] = useState('全部')
  const sk = [
    ['bar', '商机研判', '评估商机推进空间，给出跟进建议。', '商机', '/w01'], ['cal', '复访方案', '生成复访计划与沟通要点。', '拜访', '/w02'],
    ['doc', '会后摘要', '梳理会议要点与下一步计划。', '拜访', '/w03'], ['hand', '签约节点', '明确签约关键事项与时间安排。', '签约', '/w04'],
    ['calc', '报价测算', '基于需求快速测算报价方案。', '报价与合同', '/w16'], ['shield', '回款预警', '识别回款风险并给出跟进建议。', '履约与回款', '/w13'],
    ['bell', '样品安排', '制定样品试吃的实施安排与准备清单。', '拜访', '/w11'], ['user', '客户画像', '整合客户关键信息，形成客户画像。', '商机', '/w01'],
  ]
  const shown = sk.filter((x) => f === '全部' || x[3] === f || (f === '签约' && x[3] === '报价与合同'))
  return <>
    <main className="wb-main wide" data-testid="page-w10">
      <h1 className="wb-title">能力中心</h1><p className="wb-sub">销售场景技能 · 在对话中直接调用</p>
      <div className="wb-filters">{['全部', '商机', '拜访', '签约', '履约与回款'].map((x) => <button key={x} className={f === x ? 'on' : ''} onClick={() => setF(x)}>{x}</button>)}</div>
      <div className="wb-skill-cards">{shown.map(([n, t, dsc, st, to]) => <Card key={t} className="wb-sc"><h3><span className="wb-terra"><Ico n={n} s={20} /></span>{t}</h3><p>{dsc}</p><Pill tone="muted">{st}</Pill><button className="wb-btn primary sm" data-testid={t === '报价测算' ? 'skill-quote' : undefined} onClick={() => nav(to)}>{t === '报价测算' ? '查看详情' : '在对话中使用'}</button></Card>)}</div>
    </main>
    <aside className="wb-right plain">
      <h3 className="wb-rt">最近使用</h3>
      {[['bar', '商机研判', '/w01'], ['cal', '复访方案', '/w02'], ['calc', '报价测算', '/w16']].map(([n, t, to]) => <button key={t} className="wb-recent" onClick={() => nav(to)}><span className="wb-terra"><Ico n={n} /></span>{t}<em>›</em></button>)}
      <p className="wb-sub">技能输出均需人工确认后才写入</p>
    </aside>
  </>
}

/* ---------- W11 本周日程 + 样品安排 ---------- */
export function W11() {
  const nav = useNavigate(); const focus = useWb((s) => s.scheduleFocus); const setScheduleFocus = useWb((s) => s.setScheduleFocus); const setVisitTarget = useWb((s) => s.setVisitTarget); const setQuoteSheet = useWb((s) => s.setQuoteSheet)
  const [week, setWeek] = useState('本周')
  const days = [['11月2日', '周一'], ['11月3日', '周二'], ['11月4日', '周三'], ['11月5日', '周四'], ['11月6日', '周五'], ['11月7日', '周六'], ['11月8日', '周日']]
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
  const ev = [
    { id: 'hechuan' as const, d: 1, h: 1, len: 1.6, t: '10:00', n: '禾川食品（示例公司）复访' },
    { id: 'xianyuan' as const, d: 1, h: 6, len: 1.6, t: '15:00', n: '鲜源连锁（示例公司）初访' },
    { id: 'hualiang' as const, d: 3, h: 5, len: 1.6, t: '14:00', n: '华粮餐饮（示例公司）样品试吃' },
  ]
  return <>
    <main className="wb-main cal" data-testid="page-w11">
      <div className="wb-cal-head"><h1 className="wb-title">本周日程 <small>· 11月2日 – 11月8日（示例）</small></h1><div><button className="wb-btn ghost sm" onClick={() => setWeek('上周')}>‹</button><button className="wb-btn ghost sm" onClick={() => setWeek('本周')}>{week}</button><button className="wb-btn ghost sm" onClick={() => setWeek('下周')}>›</button></div></div>
      <div className="wb-cal">
        <div className="wb-cal-days"><span />{days.map(([a, b]) => <span key={a}>{a}<br />{b}</span>)}</div>
        <div className="wb-cal-body">
          <div className="wb-cal-hours">{hours.map((h) => <span key={h}>{h}</span>)}</div>
          <div className="wb-cal-grid">{hours.map((h) => <div key={h} className="wb-cal-line" />)}
            {ev.map((e) => <div key={e.id} data-testid={`cal-${e.id}`} className={`wb-ev ${focus === e.id ? 'hot' : ''}`} style={{ left: `calc(${e.d} * 100% / 7 + 4px)`, top: `calc(${e.h} * 100% / 10 + 2px)`, height: `calc(${e.len} * 100% / 10)` }} onClick={() => setScheduleFocus(e.id)}>
              <b>{e.t}</b><span>{e.n}</span></div>)}
          </div>
        </div>
      </div>
    </main>
    <aside className="wb-right" data-testid="w11-rail">
      {focus === 'hualiang' ? <>
        <Card><h2>样品试吃安排</h2><dl className="wb-kv lines">
          <dt>客户</dt><dd data-testid="w11-customer">{HUALIANG.company}</dd><dt>时间</dt><dd>11月5日 14:00（示例）</dd>
          <dt>样品清单</dt><dd>低钠酱油 2 箱（示例）<br />复合调味料 3 箱（示例）<br />火锅底料 2 箱（示例）</dd><dt>负责人</dt><dd>张帆（示例）</dd></dl></Card>
        <Card><h2>申请样品出库</h2><p>低钠酱油 2 箱、复合调味料 3 箱、火锅底料 2 箱（示例）</p><Acts id="w11-out" doneText="已提交样品出库申请（示例）" fields={[{ key: 'w11.sampleNote', label: '出库备注（示例）', initial: '按清单出库（示例）' }]} />
          <button className="wb-link" data-testid="w11-next-quote" onClick={() => { setQuoteSheet('hualiang'); nav('/w12') }}>下一步：华粮报价（W12）→</button></Card>
      </> : focus === 'xianyuan' ? <>
        <Card><h2>今日拜访</h2><dl className="wb-kv lines"><dt>客户</dt><dd data-testid="w11-customer">{XIANYUAN.company}</dd><dt>时间</dt><dd>11月3日 15:00（示例）</dd><dt>事项</dt><dd>初访（示例）</dd></dl></Card>
        <Card><button className="wb-btn primary" data-testid="w11-start" onClick={() => { setVisitTarget('xianyuan'); nav('/w05') }}>开始初访</button></Card>
      </> : <>
        <Card><h2>今日拜访</h2><dl className="wb-kv lines"><dt>客户</dt><dd data-testid="w11-customer">{HECHUAN.company}</dd><dt>时间</dt><dd>11月3日 10:00（示例）</dd><dt>事项</dt><dd>复访（示例）</dd><dt>商机</dt><dd>{HECHUAN.opp}</dd></dl></Card>
        <Card><p>下一步保持禾川对象，不进入华粮样品或华粮报价。</p><button className="wb-btn primary" data-testid="w11-start" onClick={() => { setVisitTarget('hechuan'); nav('/w05') }}>开始初访</button>
          <button className="wb-link" onClick={() => nav('/w02')}>查看禾川商机对话 →</button></Card>
      </>}
    </aside>
  </>
}

/* ---------- W12 报价测算 ---------- */
export function W12() {
  const sheet = useWb((s) => s.quoteSheet)
  return sheet === 'hechuan' ? <W12Hechuan /> : <W12Hualiang />
}

function W12Hualiang() {
  const s = useWb()
  const note = s.committed['w12.note']
  const rows = [['低钠酱油', '120 吨（示例）', '¥8,600/吨（示例）', '¥103.2 万（示例）'], ['复合调味料', '100 吨（示例）', '¥12,000/吨（示例）', '¥120 万（示例）'], ['火锅底料', '80 吨（示例）', '¥15,000/吨（示例）', '¥120 万（示例）']]
  return <>
    <main className="wb-main" data-testid="page-w12">
      <Ctx text={HUALIANG.opp} pill={HUALIANG.stage} />
      <div className="wb-chat">
        <Msg who="me">按年采购 300 吨（示例）帮我测算华粮报价</Msg>
        <Msg who="ai"><p>已根据华粮（示例公司）的采购需求完成报价测算，结果如下：</p>
          <table className="wb-table" data-testid="hualiang-quote"><thead><tr><th>品项</th><th>数量</th><th>单价</th><th>小计</th></tr></thead><tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
            <tfoot><tr><td colSpan={3}><b>合计</b></td><td className="new" data-testid="hualiang-total">{HUALIANG.total}</td></tr></tfoot></table>
          <p className="wb-src">报价是动作，不改变商机阶段。当前阶段仍是商机。</p>
          <p data-testid="w12-committed-note">已确认说明：{note}</p></Msg>
      </div>
      <Composer ph="请输入你的问题..." />
    </main>
    <aside className="wb-right">
      <Card><h2>毛利提醒</h2><p className="wb-risk-text"><span className="wb-risk-dot">!</span>毛利率 {HUALIANG.margin}低于审批线 22%（示例）</p><p>低于审批线需组长王磊（示例）审批。审批留在华粮对象。</p>
        <button className="wb-btn ghost" data-testid="hualiang-approve" onClick={() => s.setHualiangApproval(true)}>发起签约审批</button>
        {s.hualiangApproval && <div data-testid="hualiang-approval-panel"><p>华粮餐饮签约审批（示例）</p><p>金额 {HUALIANG.total} · 毛利 {HUALIANG.margin} · 阶段仍为商机</p><p>本页只保留华粮对象，不打开禾川正式合同。</p></div>}</Card>
      <Card><h2>生成报价单草稿</h2><Acts id="w12-quote" doneText="已生成报价单草稿（示例）" fields={[{ key: 'w12.note', label: '报价说明（示例）', initial: note }]} /></Card>
    </aside>
  </>
}

function W12Hechuan() {
  const nav = useNavigate()
  const q = HECHUAN_QUOTE
  return <>
    <main className="wb-main" data-testid="page-w12-hechuan">
      <Ctx text={HECHUAN.opp} pill={HECHUAN.stageVisit} />
      <h1 className="wb-title">禾川报价单（示例）</h1>
      <p className="wb-sub">报价是动作，不改变当前阶段。此单不是华粮 ¥343.2 万。</p>
      <table className="wb-table" data-testid="hechuan-sheet"><tbody>
        <tr><td>报价合计</td><td data-testid="hechuan-total">{q.total}（示例）</td></tr>
        <tr><td>原料成本</td><td>{q.material}（示例）</td></tr>
        <tr><td>产线 A（推荐）</td><td>{q.lineA}（示例）</td></tr>
        <tr><td>采用 A 的总成本</td><td>{q.costA}（示例）</td></tr>
        <tr><td>采用 A 的毛利</td><td>{q.profitA}，毛利率 {q.marginA}（示例）</td></tr>
        <tr><td>账期</td><td>{q.term}（示例）</td></tr>
      </tbody></table>
    </main>
    <aside className="wb-right">
      <Card><h3>当前对象</h3><p>{HECHUAN.company}</p><p data-testid="hechuan-rail-amount">预计金额 {q.total}（示例）</p>
        <button className="wb-btn primary" data-testid="hechuan-to-contract" onClick={() => nav('/w04')}>进入禾川签约 diff</button></Card>
    </aside>
  </>
}

/* ---------- W13 回款预警 ---------- */
export function W13() {
  const nav = useNavigate(); const d = useWb((s) => s.decisions['w13-task']); const [picked, setPicked] = useState('')
  const rows: [string, string, string, string, 'risk' | 'coral' | 'ok', string][] = [['鲜源连锁（示例公司）', '逾期 5 天', '¥36 万（示例）', '逾期', 'risk', 'xianyuan'], ['禾川食品（示例公司）', '7 天后到期', '¥48 万（示例）', '即将到期', 'coral', 'hechuan'], ['华粮餐饮（示例公司）', '已回款', '¥20 万（示例）', '已回款', 'ok', 'hualiang']]
  return <>
    <main className="wb-main" data-testid="page-w13">
      <h1 className="wb-title">回款预警</h1>
      <Card className="wb-sum">本月应回 ¥104 万（示例）· 已回 ¥20 万（示例）· 逾期 1 笔（示例）</Card>
      <Card className="wb-pay">{rows.map((r) => <button key={r[5]} className="wb-pay-row" data-testid={`pay-${r[5]}`} onClick={() => { if (r[5] === 'xianyuan') nav('/w20'); else setPicked(r[5]) }}><b>{r[0]}</b><span>{r[1]}</span><b>{r[2]}</b><Pill tone={r[4]}>{r[3]}</Pill></button>)}</Card>
      {picked && <p className="wb-sub" data-testid="pay-picked">{picked === 'hechuan' ? '禾川 7 天后到期 ¥48 万（示例），此行不是鲜源催收计划。' : '华粮已回款 ¥20 万（示例）。'}</p>}
    </main>
    <aside className="wb-right">
      <Card><h3><span className="wb-terra"><Ico n="spark" /></span> AI 建议</h3><h2>先电话确认鲜源（示例）付款计划</h2><p className="wb-sub">依据：合同约定 10月29日 付款（示例）</p></Card>
      <Card><h3><span className="wb-terra"><Ico n="cal" /></span> 创建催款跟进任务</h3><p className="wb-sub">责任人：张帆（示例）</p><Acts id="w13-task" doneText="已生成任务（示例）" />
        {d === '已写入' && <p className="wb-ok">任务：今天 17:00 前电话确认鲜源连锁（示例公司）付款计划（示例）</p>}</Card>
    </aside>
  </>
}
