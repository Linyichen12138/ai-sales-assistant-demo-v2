/** 计划第 2 节口径。全部为示例，不接外部服务。 */

export const HECHUAN = {
  company: '禾川食品（示例公司）',
  opp: '禾川食品 · 2027 调味料供货商机（示例）',
  stageVisit: '拜访 · 复访',
  stageFirst: '拜访 · 初访',
  stageContract: '签约 · 正式合同',
  contacts: '采购经理周敏（示例）、研发总监刘峰（示例）、财务负责人马丽（示例）',
  amount: '¥135 万（示例）',
  tons: '300 吨（示例）',
  signDate: '11月30日（示例）',
} as const

export const HUALIANG = {
  company: '华粮餐饮（示例公司）',
  opp: '华粮餐饮 · 2027 年度采购商机（示例）',
  stage: '商机',
  total: '¥343.2 万（示例）',
  margin: '18%（示例）',
} as const

export const XIANYUAN = {
  company: '鲜源连锁（示例公司）',
  overdue: '逾期 5 天',
  amount: '¥36 万（示例）',
  contact: '马丽（示例）· 财务',
  say: '确认鲜源付款计划并约定回款日（示例）',
  when: '今日 15:00（示例）',
} as const

export const UNANSWERED = [
  '低钠配方稳定性检测报告',
  '批次留样与追溯流程',
  '新品试产交付周期',
] as const

/** 金额用「万元的十分位」整数运算，避免 27.3 的二进制误差，也避免把 A、B 加总。 */
const PRICE_D = 1350
const MATERIAL_D = 780
const LINE_D = { A: 273, B: 480 } as const

export function wan(d: number) {
  const n = d / 10
  return `¥${Number.isInteger(n) ? String(n) : n.toFixed(1)} 万`
}

export function quoteOf(line: 'A' | 'B') {
  const lineCost = LINE_D[line]
  const cost = MATERIAL_D + lineCost
  const profit = PRICE_D - cost
  return {
    line,
    price: PRICE_D / 10,
    material: MATERIAL_D / 10,
    lineCost: lineCost / 10,
    cost: cost / 10,
    profit: profit / 10,
    priceText: wan(PRICE_D),
    materialText: wan(MATERIAL_D),
    lineText: wan(lineCost),
    costText: wan(cost),
    profitText: wan(profit),
    margin: line === 'A' ? '22%' : '6.67%',
    term: '45 天',
  }
}

const QA = quoteOf('A')
const QB = quoteOf('B')
export const HECHUAN_QUOTE = {
  total: QA.priceText,
  material: QA.materialText,
  lineA: QA.lineText,
  costA: QA.costText,
  profitA: QA.profitText,
  marginA: QA.margin,
  lineB: QB.lineText,
  costB: QB.costText,
  profitB: QB.profitText,
  marginB: QB.margin,
  term: QA.term,
} as const

export const LEADS = [
  { id: 'hechuan', name: '禾川食品（示例公司）', source: '展会', score: 86, delta: '↑8', hint: '高意向' },
  { id: 'hualiang', name: '华粮餐饮（示例公司）', source: '转介绍', score: 72, delta: '↑3', hint: '' },
  { id: 'xianyuan', name: '鲜源连锁（示例公司）', source: '官网表单', score: 61, delta: '↓2', hint: '' },
  { id: 'beiwan', name: '北湾烘焙（示例公司）', source: '电话陌拜', score: 48, delta: '→0', hint: '' },
] as const

export const DEFAULT_COMMITTED: Record<string, string> = {
  'w03.points': '采购计划预计在 3 月启动，先进行样品试吃与技术评估。',
  'w03.next': '跟进采购窗口并确认需求数量（示例）',
  'w04.delivery': '首批 30 天内交付（示例）',
  'w12.note': '按年采购 300 吨（示例）',
}

export type TaskGroup = 'doing' | 'pending' | 'done' | 'archived'
export interface DemoTask { id: string; title: string; group: TaskGroup; source: string }

export const SEED_TASKS: DemoTask[] = [
  { id: 't-window', title: '跟进周敏确认采购窗口', group: 'doing', source: 'w09' },
  { id: 't-tech', title: '补发技术资料给刘峰（示例）', group: 'pending', source: 'w09' },
  { id: 't-sign', title: '签约·正式合同待王磊审批（示例）', group: 'pending', source: 'w09' },
  { id: 't-visit-hc', title: '10:00 禾川食品复访（示例）', group: 'doing', source: 'w09' },
  { id: 't-visit-xy', title: '15:00 鲜源连锁初访（示例）', group: 'doing', source: 'w09' },
  { id: 't-hualiang-done', title: '华粮报价测算采纳', group: 'done', source: 'seed' },
  { id: 't-minutes', title: '禾川复访纪要已写', group: 'done', source: 'seed' },
]

export function openTaskCount(tasks: DemoTask[]) {
  return tasks.filter((t) => t.group === 'doing' || t.group === 'pending').length
}
