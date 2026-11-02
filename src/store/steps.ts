import { INITIAL, type DemoFlags } from './demo'

export interface StepDef {
  n: number
  title: string
  role: '销售顾问' | '销售经理'
  page: string
  ui: string
  path: string
  trigger: string
  flags: Partial<DemoFlags>
}

/** 16 步主链路（PRD §3.2 / UI出图规划 §3.4），flags 为进入该步时的累计状态 */
const S: Omit<StepDef, 'flags'>[] = [
  { n: 1, title: '销售顾问工作台', role: '销售顾问', page: 'C-01', ui: 'UI-01', path: '/c01', trigger: '点击「今日到访：林女士」' },
  { n: 2, title: '到访签到与授权', role: '销售顾问', page: 'C-02', ui: 'UI-02~03', path: '/c02', trigger: '点击「签到并开始预测」' },
  { n: 3, title: '查看客户预测结果', role: '销售顾问', page: 'C-02', ui: 'UI-04~05', path: '/c02', trigger: '点击「生成接待准备」' },
  { n: 4, title: '接待准备（首访）', role: '销售顾问', page: 'C-03', ui: 'UI-06', path: '/c03', trigger: '点击「查看产品知识」' },
  { n: 5, title: '查信息 · 学方法 · 用金句', role: '销售顾问', page: 'C-10', ui: 'UI-07~09', path: '/c10', trigger: '切换三级内容，返回接待准备' },
  { n: 6, title: '接待中 · 标记卡点', role: '销售顾问', page: 'C-04', ui: 'UI-10~11', path: '/c04', trigger: '「标记卡点」后切换为销售经理' },
  { n: 7, title: 'AI 作战室查看客户', role: '销售经理', page: 'M-02', ui: 'UI-12', path: '/m02', trigger: '点击 B 组林女士客户卡' },
  { n: 8, title: '实时详情 · 远程指导', role: '销售经理', page: 'M-03', ui: 'UI-13~16', path: '/m03', trigger: '「发送指导」→「确认发送」' },
  { n: 9, title: '收到指导 · 结束接待', role: '销售顾问', page: 'C-04', ui: 'UI-17~19', path: '/c04', trigger: '「查看资料」→「结束接待」' },
  { n: 10, title: 'AI 名片 · AI 分身', role: '销售顾问', page: 'C-06', ui: 'UI-20~22', path: '/c06', trigger: '「与 AI 分身聊聊」→「手机号授权」' },
  { n: 11, title: '智能盘客 · 团队判断', role: '销售顾问', page: 'C-05', ui: 'UI-23~24', path: '/c05', trigger: '「采纳」→「生成纪要」→「生成跟进任务」' },
  { n: 12, title: '客户详情 · 跟进任务', role: '销售顾问', page: 'S-01', ui: 'UI-25~26', path: '/s01', trigger: '返回工作台，点击「+2 林女士」' },
  { n: 13, title: '回写反馈 · 复访准备', role: '销售顾问', page: 'S-01', ui: 'UI-27~29', path: '/s01?feedback=1', trigger: '「提交并重新计算意向」→「查看复访准备」' },
  { n: 14, title: '接待分析报告', role: '销售经理', page: 'M-04', ui: 'UI-30~31', path: '/m04', trigger: '「查看原话」→ 侧栏「团队」' },
  { n: 15, title: '销售四象限 · 辅导计划', role: '销售经理', page: 'M-05', ui: 'UI-32~33', path: '/m05', trigger: '点击张顾问 →「创建辅导计划」' },
  { n: 16, title: '销售经营驾驶舱', role: '销售经理', page: 'M-01', ui: 'UI-34~37', path: '/m01', trigger: '四盘一控 / 本周经营建议 / 意向 A' },
]

const cumulative: Partial<DemoFlags>[] = [
  {},
  {},
  { signedIn: true, predictionReady: true },
  {},
  {},
  { receptionStarted: true },
  { blockerMarked: true },
  {},
  { guidanceSent: true },
  { guidanceSeen: true, receptionEnded: true, cardShared: true },
  { phoneAuthorized: true },
  { intentAdopted: true, opinionAdded: true, minutesGenerated: true, tasksGenerated: true },
  {},
  { feedbackWritten: true, riskStatus: '已回应' },
  {},
  { coachingCreated: true },
]

export const STEPS: StepDef[] = S.map((s, i) => ({ ...s, flags: Object.assign({}, ...cumulative.slice(0, i + 1)) }))

export function flagsForStep(n: number): DemoFlags {
  const st = STEPS[n - 1]
  return { ...INITIAL, ...st.flags, role: st.role === '销售经理' ? 'manager' : 'consultant', step: n }
}

/** 根据当前路由 + 状态推断「本页面对应的步骤」，仅用于主链路推进（advance 取最大值） */
export function currentStep(path: string, f: DemoFlags): number {
  const p = path.split('?')[0]
  if (p.startsWith('/c01')) return f.tasksGenerated ? 12 : 1
  if (p.startsWith('/c02')) return f.predictionReady ? 3 : 2
  if (p.startsWith('/screen')) return 3
  if (p.startsWith('/c03')) return f.feedbackWritten ? 13 : 4
  if (p.startsWith('/c10')) return 5
  if (p === '/c04/summary') return 9
  if (p.startsWith('/c04')) return f.guidanceSent ? 9 : 6
  if (p.startsWith('/c06')) return 10
  if (p.startsWith('/c05')) return 11
  if (p.startsWith('/s01')) return f.feedbackWritten ? 13 : 12
  if (p.startsWith('/m02')) return 7
  if (p.startsWith('/m03')) return 8
  if (p.startsWith('/m04')) return 14
  if (p.startsWith('/m05')) return 15
  if (p.startsWith('/m01')) return 16
  return 1
}

/** PRD v2.1 §页面清单：路由 → 页面编号与页面名（导览标签显示当前所在页面） */
const PAGES: [string, string, string][] = [
  ['/c01', 'C-01', '销售顾问工作台'],
  ['/screen/c02', 'C-02', '到访签到与客户预测'],
  ['/c02', 'C-02', '到访签到与客户预测'],
  ['/c03', 'C-03', '接待准备'],
  ['/c04', 'C-04', 'AI 面谈辅助'],
  ['/c05', 'C-05', '盘客工作台'],
  ['/c06', 'C-06', 'AI 名片与 AI 分身'],
  ['/c10', 'C-10', '金句广场与产品知识助手'],
  ['/m01', 'M-01', '销售经营驾驶舱'],
  ['/m02', 'M-02', 'AI 作战室'],
  ['/m03', 'M-03', '实时客户详情与远程指导'],
  ['/m04', 'M-04', '接待分析报告'],
  ['/m05', 'M-05', '销售四象限'],
  ['/s01', 'S-01', '客户详情与跟进任务'],
]
export function pageOf(pathname: string): { code: string; name: string } | null {
  const hit = PAGES.find(([p]) => pathname === p || pathname.startsWith(p + '/'))
  return hit ? { code: hit[1], name: hit[2] } : null
}
